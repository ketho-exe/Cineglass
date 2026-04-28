"use server";

import { requireUser } from "@/lib/auth/require-user";
import { revalidatePath } from "next/cache";

const keys = ["continueWatching", "watchlist", "recommended", "trendingMovies", "trendingTv", "anime"];

export async function updateHomePreferences(formData: FormData) {
  const { supabase, user } = await requireUser();
  const homePreferences = Object.fromEntries(keys.map((key) => [key, formData.get(key) === "on"]));
  const playerProvider = formData.get("playerProvider") === "vidking" ? "vidking" : "embedmaster";
  await supabase
    .from("profiles")
    .update({ home_preferences: homePreferences, player_provider: playerProvider })
    .eq("id", user.id);

  revalidatePath("/home");
  revalidatePath("/settings");
}
