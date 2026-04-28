import { buildVidKingEmbedUrl } from "@/lib/providers/vidking";
import type { MediaType } from "@/types/media";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mediaType = searchParams.get("mediaType") as MediaType | null;
  const tmdbId = Number(searchParams.get("tmdbId"));
  const seasonNumber = numberParam(searchParams.get("seasonNumber"));
  const episodeNumber = numberParam(searchParams.get("episodeNumber"));
  const startTimeSeconds = numberParam(searchParams.get("startTimeSeconds"));

  if (mediaType !== "movie" && mediaType !== "tv") {
    return NextResponse.json({ error: "Invalid mediaType" }, { status: 400 });
  }

  try {
    return NextResponse.json({
      provider: "vidking",
      embedUrl: buildVidKingEmbedUrl({
        mediaType,
        tmdbId,
        seasonNumber,
        episodeNumber,
        startTimeSeconds,
        autoplay: searchParams.get("autoplay") === "true",
        nextEpisode: true,
        episodeSelector: true,
        theme: { color: process.env.VIDKING_DEFAULT_COLOR ?? "a78bfa" },
      }),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to build player URL" },
      { status: 400 },
    );
  }
}

function numberParam(value: string | null) {
  return value ? Number(value) : undefined;
}
