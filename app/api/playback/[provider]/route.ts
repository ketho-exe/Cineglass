import { buildPlaybackEmbedUrl, parsePlaybackQuery } from "@/lib/providers/playback-route";
import { normalisePlaybackProvider, playbackProviders } from "@/lib/providers/preferences";
import type { PlaybackProvider } from "@/lib/providers/playback.types";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ provider: string }> },
) {
  const { provider } = await context.params;
  if (!playbackProviders.includes(provider as PlaybackProvider)) {
    return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
  }

  try {
    const requestUrl = new URL(request.url);
    const playbackRequest = parsePlaybackQuery(requestUrl.searchParams);
    return NextResponse.json({
      provider: normalisePlaybackProvider(provider),
      embedUrl: buildPlaybackEmbedUrl(provider, playbackRequest),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to build player URL" },
      { status: 400 },
    );
  }
}
