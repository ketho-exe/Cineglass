import { requireUser } from "@/lib/auth/require-user";
import type { MediaType } from "@/types/media";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const mediaType = body.mediaType as MediaType;
  const tmdbId = Number(body.tmdbId);
  const seasonNumber = optionalInteger(body.seasonNumber);
  const episodeNumber = optionalInteger(body.episodeNumber);
  const progressSeconds = clampInteger(body.progressSeconds, 0, 60 * 60 * 24);
  const durationSeconds = optionalInteger(body.durationSeconds);
  const progressPercent = Math.min(100, Math.max(0, Number(body.progressPercent) || 0));
  const completed = Boolean(body.completed);

  if ((mediaType !== "movie" && mediaType !== "tv") || !Number.isInteger(tmdbId) || tmdbId <= 0) {
    return NextResponse.json({ error: "Invalid media item" }, { status: 400 });
  }
  if (mediaType === "tv" && (!seasonNumber || !episodeNumber)) {
    return NextResponse.json({ error: "TV progress requires season and episode" }, { status: 400 });
  }

  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("watch_progress").upsert(
    {
      user_id: user.id,
      tmdb_id: tmdbId,
      media_type: mediaType,
      season_number: mediaType === "tv" ? seasonNumber : null,
      episode_number: mediaType === "tv" ? episodeNumber : null,
      progress_seconds: progressSeconds,
      duration_seconds: durationSeconds,
      progress_percent: progressPercent,
      completed,
      last_watched_at: new Date().toISOString(),
    },
    { onConflict: "user_id,tmdb_id,media_type,season_number,episode_number" },
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

function optionalInteger(value: unknown) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : undefined;
}

function clampInteger(value: unknown, min: number, max: number) {
  const number = Math.floor(Number(value) || 0);
  return Math.min(max, Math.max(min, number));
}
