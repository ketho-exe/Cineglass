import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { getTrending } from "@/lib/tmdb/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  return syncTrending(request);
}

export async function GET(request: Request) {
  return syncTrending(request);
}

async function syncTrending(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseServiceClient();
  const [movies, tv] = await Promise.all([getTrending("movie"), getTrending("tv")]);
  const rows = [...movies, ...tv].map((item) => ({
    tmdb_id: item.tmdbId,
    media_type: item.mediaType,
    title: item.title,
    original_title: item.originalTitle,
    poster_path: item.posterPath,
    backdrop_path: item.backdropPath,
    overview: item.overview,
    release_date: item.releaseDate,
    first_air_date: item.firstAirDate,
    vote_average: item.voteAverage,
    genres: item.genres ?? [],
    raw_tmdb: item,
    cached_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from("media_cache").upsert(rows, { onConflict: "tmdb_id,media_type" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ synced: rows.length });
}
