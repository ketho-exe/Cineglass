"use client";

import type { MediaType, PlayerProgress } from "@/types/media";
import type { PlaybackProvider } from "@/lib/providers/playback.types";
import { parseProviderProgressMessage } from "@/components/player/player-events";
import { playbackProviders, providerLabels } from "@/lib/providers/preferences";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ProviderPlayerProps = {
  mediaType: MediaType;
  tmdbId: number;
  seasonNumber?: number;
  episodeNumber?: number;
  title: string;
  startTimeSeconds?: number;
  autoplay?: boolean;
  accentColor?: string;
  nextEpisode?: boolean;
  episodeSelector?: boolean;
  autoplayNextEpisode?: boolean;
  overlay?: boolean;
  onProgress?: (progress: PlayerProgress) => void;
  partyCode?: string;
  provider?: PlaybackProvider;
};

type PartyCommand = {
  command: string;
  position?: number;
  issuedAt: string;
};

export function ProviderPlayer(props: ProviderPlayerProps) {
  const [provider, setProvider] = useState<PlaybackProvider>(props.provider ?? "embedmaster");
  const [embedUrl, setEmbedUrl] = useState<string>();
  const [error, setError] = useState<string>();
  const [retryKey, setRetryKey] = useState(0);
  const [preferenceState, setPreferenceState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lastSavedAt = useRef(0);
  const lastPartyCommandAt = useRef<string | undefined>(undefined);
  const currentPositionRef = useRef(0);

  useEffect(() => {
    setProvider(props.provider ?? "embedmaster");
  }, [props.provider]);

  async function chooseProvider(nextProvider: PlaybackProvider) {
    setProvider(nextProvider);
    setPreferenceState("saving");
    try {
      const response = await fetch("/api/playback-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: nextProvider }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(data?.error ?? "Could not save provider preference");
      }
      setPreferenceState("saved");
      window.setTimeout(() => setPreferenceState("idle"), 1800);
    } catch {
      setPreferenceState("error");
    }
  }

  useEffect(() => {
    const params = new URLSearchParams({
      mediaType: props.mediaType,
      tmdbId: String(props.tmdbId),
      autoplay: String(Boolean(props.autoplay)),
    });
    if (props.seasonNumber) params.set("seasonNumber", String(props.seasonNumber));
    if (props.episodeNumber) params.set("episodeNumber", String(props.episodeNumber));
    if (props.startTimeSeconds) params.set("progress", String(props.startTimeSeconds));
    if (props.accentColor) params.set(provider === "spenembed" ? "theme" : "color", props.accentColor);
    if (props.nextEpisode !== undefined) params.set("nextEpisode", String(props.nextEpisode));
    if (props.episodeSelector !== undefined) params.set("episodeSelector", String(props.episodeSelector));
    if (props.autoplayNextEpisode !== undefined) params.set("autoplayNextEpisode", String(props.autoplayNextEpisode));
    if (props.overlay !== undefined) params.set("overlay", String(props.overlay));

    setError(undefined);
    setEmbedUrl(undefined);
    fetch(`/api/playback/${provider}?${params.toString()}`)
      .then((response) => {
        return response.json().then((data) => {
          if (!response.ok) throw new Error(data?.error ?? "Unable to create player URL");
          return data as { embedUrl: string };
        });
      })
      .then((data) => {
        setEmbedUrl(data.embedUrl);
        setError(undefined);
      })
      .catch((reason: Error) => setError(reason.message));
  }, [provider, retryKey, props.mediaType, props.tmdbId, props.seasonNumber, props.episodeNumber, props.autoplay, props.startTimeSeconds, props.accentColor, props.nextEpisode, props.episodeSelector, props.autoplayNextEpisode, props.overlay]);

  useEffect(() => {
    if (!embedUrl) return;
    const timeout = window.setTimeout(() => {
      const fallbackProgress = {
        tmdbId: props.tmdbId,
        mediaType: props.mediaType,
        seasonNumber: props.seasonNumber,
        episodeNumber: props.episodeNumber,
        progressSeconds: Math.max(1, Math.floor(currentPositionRef.current)),
        durationSeconds: undefined,
        progressPercent: 1,
        completed: false,
      };
      props.onProgress?.(fallbackProgress);
      void saveProgress(fallbackProgress);
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [embedUrl, props]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const message = parseProviderProgressMessage(event.data);
      if (!message) return;
      const currentTime = message.progressSeconds;
      currentPositionRef.current = currentTime;

      const progress = {
        tmdbId: props.tmdbId,
        mediaType: props.mediaType,
        seasonNumber: message.seasonNumber ?? props.seasonNumber,
        episodeNumber: message.episodeNumber ?? props.episodeNumber,
        progressSeconds: Math.floor(currentTime),
        durationSeconds: message.durationSeconds,
        progressPercent: message.progressPercent,
        completed: message.event === "ended" || message.progressPercent >= 90,
      };
      props.onProgress?.(progress);
      if (provider === "embedmaster" && props.partyCode && ["play", "pause", "seeked"].includes(message.event)) {
        void publishPartyCommand(props.partyCode, message.event === "seeked" ? "seek" : message.event, Math.floor(currentTime));
      }

      const now = Date.now();
      if (now - lastSavedAt.current > 15000 || progress.completed) {
        lastSavedAt.current = now;
        void saveProgress(progress);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [provider, props]);

  useEffect(() => {
    if (provider !== "embedmaster" || !props.partyCode) return;
    const supabase = createSupabaseBrowserClient();
    function applyPartyCommand(state: PartyCommand | null) {
      if (!state?.command || state.issuedAt === lastPartyCommandAt.current) return;
      lastPartyCommandAt.current = state.issuedAt;
      if (typeof state.position === "number" && state.command !== "seek") {
        postPlayerCommand(iframeRef.current, provider, "seek", state.position);
      }
      postPlayerCommand(iframeRef.current, provider, state.command, state.command === "seek" ? state.position : undefined);
    }

    const channel = supabase
      .channel(`watch-party-${props.partyCode}`)
      .on("broadcast", { event: "sync" }, ({ payload }) => {
        applyPartyCommand(payload as PartyCommand);
      })
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "watch_parties",
          filter: `room_code=eq.${props.partyCode}`,
        },
        (payload) => {
          const state = payload.new.state as { command?: string; position?: number; issuedAt?: string } | null;
          applyPartyCommand(state as PartyCommand | null);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [provider, props.partyCode]);

  if (error) {
    return (
      <div className="flex aspect-video flex-col items-center justify-center gap-4 rounded-3xl border border-rose-300/20 bg-rose-950/30 p-6 text-center text-rose-100">
        <div className="flex items-center text-lg font-semibold">
          <AlertCircle className="mr-2 h-5 w-5" /> Could not load {providerLabels[provider]}.
        </div>
        <p className="max-w-xl text-sm text-rose-100/80">{error}</p>
        <div className="flex flex-wrap justify-center gap-2">
          <button type="button" onClick={() => setRetryKey((value) => value + 1)} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/10">Retry</button>
          {playbackProviders.filter((candidate) => candidate !== provider).map((candidate) => (
            <button key={candidate} type="button" onClick={() => void chooseProvider(candidate)} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/10">
              Switch to {providerLabels[candidate]}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-black">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-cine-panel/95 px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">Playback provider</p>
          <p className="text-sm text-slate-300">{providerLabels[provider]}</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={provider}
            onChange={(event) => void chooseProvider(event.target.value as PlaybackProvider)}
            className="rounded-full border border-white/10 bg-black px-4 py-2 text-sm text-white outline-none transition hover:border-cine-accent/50 focus:border-cine-accent"
            aria-label="Playback provider"
          >
            {playbackProviders.map((candidate) => (
              <option key={candidate} value={candidate}>{providerLabels[candidate]}</option>
            ))}
          </select>
          {preferenceState === "saving" ? <span className="text-xs text-slate-400">Saving...</span> : null}
          {preferenceState === "saved" ? <span className="text-xs text-cyan-200">Saved</span> : null}
          {preferenceState === "error" ? <span className="text-xs text-rose-200">Not saved</span> : null}
        </div>
      </div>
      <div className="aspect-video bg-black">
        {embedUrl ? (
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title={props.title}
            allow="autoplay *; fullscreen *; picture-in-picture *; encrypted-media *"
            allowFullScreen
            className="h-full w-full border-0 bg-black"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300">Loading player...</div>
        )}
      </div>
    </div>
  );
}

function postPlayerCommand(target: HTMLIFrameElement | null, provider: PlaybackProvider, command: string, value?: number) {
  const message = provider === "embedmaster"
    ? { source: "embedmaster_player_command", command, value }
    : JSON.stringify({ type: "PLAYER_COMMAND", data: { command, value } });
  target?.contentWindow?.postMessage(message, "*");
}

async function saveProgress(progress: PlayerProgress) {
  await fetch("/api/watch-progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(progress),
  });
}

async function publishPartyCommand(roomCode: string, command: string, position: number) {
  const supabase = createSupabaseBrowserClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const state = {
    command,
    position,
    issuedAt: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("watch_parties")
    .update({ state })
    .eq("room_code", roomCode)
    .eq("host_id", user.id)
    .select("room_code")
    .maybeSingle();

  if (!error && data) {
    await broadcastPartyCommand(roomCode, state);
  }
}

async function broadcastPartyCommand(roomCode: string, state: PartyCommand) {
  const supabase = createSupabaseBrowserClient();
  const channel = supabase.channel(`watch-party-${roomCode}`);
  await new Promise<void>((resolve) => {
    channel.subscribe(() => resolve());
    window.setTimeout(resolve, 500);
  });
  await channel.send({
    type: "broadcast",
    event: "sync",
    payload: state,
  });
  void supabase.removeChannel(channel);
}
