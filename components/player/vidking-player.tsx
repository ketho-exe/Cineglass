"use client";

import type { MediaType, PlayerProgress } from "@/types/media";
import { AlertCircle, Gauge, Maximize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type VidKingPlayerProps = {
  mediaType: MediaType;
  tmdbId: number;
  seasonNumber?: number;
  episodeNumber?: number;
  title: string;
  startTimeSeconds?: number;
  autoplay?: boolean;
  onProgress?: (progress: PlayerProgress) => void;
};

type PlayerEvent = {
  type?: "PLAYER_EVENT";
  data?: {
    event: string;
    currentTime: number;
    duration: number;
    progress: number;
    mediaType: MediaType;
    season?: number;
    episode?: number;
  };
};

export function VidKingPlayer(props: VidKingPlayerProps) {
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
    if (props.startTimeSeconds) params.set("startTimeSeconds", String(props.startTimeSeconds));

    fetch(`/api/playback/vidking?${params.toString()}`)
      .then((response) => {
        if (!response.ok) throw new Error("Unable to create player URL");
        return response.json() as Promise<{ embedUrl: string }>;
      })
      .then((data) => setEmbedUrl(data.embedUrl))
      .catch((reason: Error) => setError(reason.message));
  }, [props.mediaType, props.tmdbId, props.seasonNumber, props.episodeNumber, props.startTimeSeconds, props.autoplay]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (typeof event.data !== "string") return;
      try {
        const message = JSON.parse(event.data) as PlayerEvent;
        if (message.type !== "PLAYER_EVENT" || !message.data) return;
        const progress = {
          tmdbId: props.tmdbId,
          mediaType: props.mediaType,
          seasonNumber: message.data.season ?? props.seasonNumber,
          episodeNumber: message.data.episode ?? props.episodeNumber,
          progressSeconds: Math.floor(message.data.currentTime),
          durationSeconds: Math.floor(message.data.duration),
          progressPercent: message.data.progress,
          completed: message.data.event === "ended" || message.data.progress >= 90,
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
      } catch {
        return;
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [props]);

  function changePlaybackRate(rate: number) {
    setPlaybackRate(rate);
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ type: "PLAYER_COMMAND", data: { command: "setPlaybackRate", playbackRate: rate } }),
      "*",
    );
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
          <Maximize2 className="h-4 w-4 text-slate-400" />
        </div>
      </div>
      <div className="aspect-video">
      {embedUrl ? (
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={props.title}
          allow="autoplay; fullscreen; picture-in-picture"
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
