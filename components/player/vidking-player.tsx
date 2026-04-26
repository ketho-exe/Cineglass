"use client";

import type { MediaType, PlayerProgress } from "@/types/media";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

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
        props.onProgress?.({
          tmdbId: props.tmdbId,
          mediaType: props.mediaType,
          seasonNumber: message.data.season,
          episodeNumber: message.data.episode,
          progressSeconds: Math.floor(message.data.currentTime),
          durationSeconds: Math.floor(message.data.duration),
          progressPercent: message.data.progress,
          completed: message.data.event === "ended" || message.data.progress >= 90,
        });
      } catch {
        return;
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [props]);

  if (error) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-3xl border border-rose-300/20 bg-rose-950/30 text-rose-100">
        <AlertCircle className="mr-2 h-5 w-5" /> {error}
      </div>
    );
  }

  return (
    <div className="glass aspect-video overflow-hidden rounded-3xl bg-black">
      {embedUrl ? (
        <iframe
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
  );
}
