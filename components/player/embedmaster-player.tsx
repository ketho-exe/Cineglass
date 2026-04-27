"use client";

import type { MediaType, PlayerProgress } from "@/types/media";
import { AlertCircle, Gauge, Maximize2 } from "lucide-react";
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
};

type EmbedMasterEvent = {
  source?: "embedmaster_player";
  event?: string;
  info?: {
    currentTime?: number;
    duration?: number;
    percent?: number;
    progress?: number;
  };
};

export function EmbedMasterPlayer(props: EmbedMasterPlayerProps) {
  const [embedUrl, setEmbedUrl] = useState<string>();
  const [error, setError] = useState<string>();
  const [playbackRate, setPlaybackRate] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lastSavedAt = useRef(0);

  useEffect(() => {
    const params = new URLSearchParams({
      mediaType: props.mediaType,
      tmdbId: String(props.tmdbId),
      autoplay: String(Boolean(props.autoplay)),
    });
    if (props.seasonNumber) params.set("seasonNumber", String(props.seasonNumber));
    if (props.episodeNumber) params.set("episodeNumber", String(props.episodeNumber));

    fetch(`/api/playback/embedmaster?${params.toString()}`)
      .then((response) => {
        if (!response.ok) throw new Error("Unable to create player URL");
        return response.json() as Promise<{ embedUrl: string }>;
      })
      .then((data) => {
        setEmbedUrl(data.embedUrl);
        setError(undefined);
      })
      .catch((reason: Error) => setError(reason.message));
  }, [props.mediaType, props.tmdbId, props.seasonNumber, props.episodeNumber, props.autoplay]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const message = event.data as EmbedMasterEvent;
      if (!message || message.source !== "embedmaster_player") return;

      const currentTime = Number(message.info?.currentTime ?? 0);
      const duration = Number(message.info?.duration ?? 0);
      if (!currentTime && message.event !== "ended") return;

      const progressPercent = Number(
        message.info?.percent ?? message.info?.progress ?? (duration ? (currentTime / duration) * 100 : 0),
      );
      const progress = {
        tmdbId: props.tmdbId,
        mediaType: props.mediaType,
        seasonNumber: props.seasonNumber,
        episodeNumber: props.episodeNumber,
        progressSeconds: Math.floor(currentTime),
        durationSeconds: duration ? Math.floor(duration) : undefined,
        progressPercent,
        completed: message.event === "ended" || progressPercent >= 90,
      };
      props.onProgress?.(progress);

      const now = Date.now();
      if (now - lastSavedAt.current > 15000 || progress.completed) {
        lastSavedAt.current = now;
        void fetch("/api/watch-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(progress),
        });
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [props]);

  function sendCommand(command: string, value?: number) {
    iframeRef.current?.contentWindow?.postMessage(
      {
        source: "embedmaster_player_command",
        command,
        value,
      },
      "*",
    );
  }

  function changePlaybackRate(rate: number) {
    setPlaybackRate(rate);
    sendCommand("speed", rate);
  }

  if (error) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-3xl border border-rose-300/20 bg-rose-950/30 text-rose-100">
        <AlertCircle className="mr-2 h-5 w-5" /> {error}
      </div>
    );
  }

  return (
    <div className="glass overflow-hidden rounded-3xl bg-black">
      <div className="flex items-center justify-between border-b border-white/10 bg-zinc-950/92 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{props.title}</p>
          <p className="text-xs text-slate-400">{props.mediaType === "tv" ? `S${props.seasonNumber} E${props.episodeNumber}` : "Movie"}</p>
        </div>
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-slate-400" />
          <select
            aria-label="Playback speed"
            value={playbackRate}
            onChange={(event) => changePlaybackRate(Number(event.target.value))}
            className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white outline-none"
          >
            {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
              <option key={rate} value={rate} className="bg-zinc-950">{rate}x</option>
            ))}
          </select>
          <button type="button" aria-label="Fullscreen" onClick={() => sendCommand("fullscreen")}>
            <Maximize2 className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </div>
      <div className="aspect-video">
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
