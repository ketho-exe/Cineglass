import { getSeason } from "@/lib/tmdb/client";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  context: { params: Promise<{ tmdbId: string; seasonNumber: string }> },
) {
  const { tmdbId, seasonNumber } = await context.params;
  const episodes = await getSeason(Number(tmdbId), Number(seasonNumber));
  return NextResponse.json({ episodes });
}
