"use client";

import type { MediaType, PlayerProgress } from "@/types/media";
import type { PlaybackProvider } from "@/lib/providers/playback.types";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type EmbedMasterPlayerProps = {
  mediaType: MediaType;
  tmdbId: number;
  seasonNumber?: number;
  episodeNumber?: number;
  title: string;
  startTimeSeconds?: number;
  autoplay?: boolean;
  onProgress?: (progress: PlayerProgress) => void;
  partyCode?: string;
  provider?: PlaybackProvider;
};

type EmbedMasterEvent = {
  source?: "embedmaster_player";
  event?: string;
  info?: {
    currentTime?: number;
    current_time?: number;
    duration?: number;
    seconds?: number;
    time?: number;
    position?: number;
    percent?: number;
    progress?: number;
  };
};

type PartyCommand = {
  command: string;
  position?: number;
  issuedAt: string;
};

export function EmbedMasterPlayer(props: EmbedMasterPlayerProps) {
  const provider = props.provider ?? "embedmaster";
  const [embedUrl, setEmbedUrl] = useState<string>();
  const [error, setError] = useState<string>();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lastSavedAt = useRef(0);
  const lastPartyCommandAt = useRef<string | undefined>(undefined);
  const currentPositionRef = useRef(0);

  useEffect(() => {
    const params = new URLSearchParams({
      mediaType: props.mediaType,
      tmdbId: String(props.tmdbId),
      autoplay: String(Boolean(props.autoplay)),
    });
    if (props.seasonNumber) params.set("seasonNumber", String(props.seasonNumber));
    if (props.episodeNumber) params.set("episodeNumber", String(props.episodeNumber));

    fetch(`/api/playback/${provider}?${params.toString()}`)
      .then((response) => {
        if (!response.ok) throw new Error("Unable to create player URL");
        return response.json() as Promise<{ embedUrl: string }>;
      })
      .then((data) => {
        setEmbedUrl(data.embedUrl);
        setError(undefined);
      })
      .catch((reason: Error) => setError(reason.message));
  }, [provider, props.mediaType, props.tmdbId, props.seasonNumber, props.episodeNumber, props.autoplay]);

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
      const message = parsePlayerMessage(event.data);
      if (!message) return;
      const eventName = getEventName(message);
      if (!eventName) return;

      const info = getEventInfo(message);
      const currentTime = readTime(info);
      const duration = Number(info?.duration ?? 0);
      if (!currentTime && !["play", "pause", "ended"].includes(eventName)) return;
      currentPositionRef.current = currentTime;

      const rawProgressPercent = Number(
        info?.percent ?? info?.progress ?? (duration ? (currentTime / duration) * 100 : 0),
      );
      const progressPercent = rawProgressPercent > 0 && rawProgressPercent <= 1
        ? rawProgressPercent * 100
        : rawProgressPercent;
      const progress = {
        tmdbId: props.tmdbId,
        mediaType: props.mediaType,
        seasonNumber: props.seasonNumber,
        episodeNumber: props.episodeNumber,
        progressSeconds: Math.floor(currentTime),
        durationSeconds: duration ? Math.floor(duration) : undefined,
        progressPercent,
        completed: eventName === "ended" || progressPercent >= 90,
      };
      props.onProgress?.(progress);
      if (provider === "embedmaster" && props.partyCode && ["play", "pause", "seeked"].includes(eventName)) {
        void publishPartyCommand(props.partyCode, eventName === "seeked" ? "seek" : eventName, Math.floor(currentTime));
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
      <div className="flex aspect-video items-center justify-center rounded-3xl border border-rose-300/20 bg-rose-950/30 text-rose-100">
        <AlertCircle className="mr-2 h-5 w-5" /> {error}
      </div>
    );
  }

  return (
    <div className="aspect-video overflow-hidden rounded-2xl bg-black">
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
  );
}

function postPlayerCommand(target: HTMLIFrameElement | null, provider: PlaybackProvider, command: string, value?: number) {
  const message = provider === "embedmaster"
    ? { source: "embedmaster_player_command", command, value }
    : JSON.stringify({ type: "PLAYER_COMMAND", data: { command, value } });
  target?.contentWindow?.postMessage(message, "*");
}

function parsePlayerMessage(data: unknown): (EmbedMasterEvent & { type?: string; data?: EmbedMasterEvent["info"] & { event?: string } }) | null {
  if (typeof data === "string") {
    try {
      return JSON.parse(data) as EmbedMasterEvent;
    } catch {
      return null;
    }
  }
  return data && typeof data === "object" ? data as EmbedMasterEvent : null;
}

function getEventName(message: ReturnType<typeof parsePlayerMessage>) {
  if (message?.source === "embedmaster_player") return message.event;
  if (message?.type === "PLAYER_EVENT") return message.data?.event;
  return undefined;
}

function getEventInfo(message: ReturnType<typeof parsePlayerMessage>) {
  if (message?.source === "embedmaster_player") return message.info;
  if (message?.type === "PLAYER_EVENT") return message.data;
  return undefined;
}

function readTime(info: EmbedMasterEvent["info"]) {
  return Number(
    info?.currentTime ??
    info?.current_time ??
    info?.seconds ??
    info?.time ??
    info?.position ??
    0,
  );
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
