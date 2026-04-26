import { getDetails } from "@/lib/tmdb/client";
import { NextResponse } from "next/server";

export async function GET(_: Request, context: { params: Promise<{ tmdbId: string }> }) {
  const { tmdbId } = await context.params;
  const media = await getDetails("tv", Number(tmdbId));
  if (!media) return NextResponse.json({ error: "TV show not found" }, { status: 404 });
  return NextResponse.json(media);
}
