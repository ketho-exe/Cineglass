import { requireApprovedApiUser } from "@/lib/auth/require-approved-api-user";
import { buildPlaybackPreferenceUpdate } from "@/lib/providers/preference-update";
import { normalisePlaybackProvider, playbackProviders } from "@/lib/providers/preferences";
import type { PlaybackProvider } from "@/lib/providers/playback.types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const auth = await requireApprovedApiUser();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await request.json().catch(() => null) as { provider?: unknown } | null;
  if (!body || !playbackProviders.includes(body.provider as PlaybackProvider)) {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  }

  const provider = normalisePlaybackProvider(body.provider);
  const { data: profile, error: readError } = await auth.supabase
    .from("profiles")
    .select("home_preferences")
    .eq("id", auth.user.id)
    .maybeSingle();

  if (readError) {
    return NextResponse.json({ error: readError.message }, { status: 500 });
  }

  const { error } = await auth.supabase
    .from("profiles")
    .update({
      home_preferences: buildPlaybackPreferenceUpdate({
        homePreferences: profile?.home_preferences,
        provider,
      }),
    })
    .eq("id", auth.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ provider });
}
