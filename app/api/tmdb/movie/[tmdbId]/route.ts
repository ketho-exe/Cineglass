import { getDetails } from "@/lib/tmdb/client";
import { NextResponse } from "next/server";

export async function GET(_: Request, context: { params: Promise<{ tmdbId: string }> }) {
  const { tmdbId } = await context.params;
  const media = await getDetails("movie", Number(tmdbId));
  if (!media) return NextResponse.json({ error: "Movie not found" }, { status: 404 });
  return NextResponse.json(media);
}
