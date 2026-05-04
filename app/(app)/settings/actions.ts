"use server";

import { requireUser } from "@/lib/auth/require-user";
import { buildPlaybackPreferenceUpdate } from "@/lib/providers/preference-update";
import { normalisePlaybackProvider } from "@/lib/providers/preferences";
import { revalidatePath } from "next/cache";

const keys = ["continueWatching", "watchlist", "recommended", "trendingMovies", "trendingTv", "anime", "smartCategories"];

export async function updateHomePreferences(formData: FormData) {
  const { supabase, user } = await requireUser();
  const playerProvider = normalisePlaybackProvider(formData.get("playerProvider"));
  const playerAccentColor = stringValue(formData.get("playerAccentColor")) ?? "22d3ee";
  const homePreferences = buildPlaybackPreferenceUpdate({
    provider: playerProvider,
    homePreferences: {
      ...Object.fromEntries(keys.map((key) => [key, formData.get(key) === "on"])),
      playerAccentColor,
      autoplay: formData.get("autoplay") === "on",
      resumePlayback: formData.get("resumePlayback") === "on",
      videasy: {
        overlay: formData.get("videasyOverlay") === "on",
        episodeSelector: formData.get("videasyEpisodeSelector") === "on",
        nextEpisode: formData.get("videasyNextEpisode") === "on",
        autoplayNextEpisode: formData.get("videasyAutoplayNextEpisode") === "on",
      },
    },
  });

  const homePreferencesUpdate = await supabase
    .from("profiles")
    .update({ home_preferences: homePreferences })
    .eq("id", user.id);

  if (homePreferencesUpdate.error) {
    throw new Error(homePreferencesUpdate.error.message);
  }

  revalidatePath("/home");
  revalidatePath("/settings");
  revalidatePath("/watch", "layout");
}

function stringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" && value.trim() ? value.trim().replace(/^#/, "") : undefined;
}
