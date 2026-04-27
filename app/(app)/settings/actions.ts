"use server";

import { requireUser } from "@/lib/auth/require-user";
import { revalidatePath } from "next/cache";

const keys = ["continueWatching", "watchlist", "recommended", "trendingMovies", "trendingTv", "anime"];

export async function updateHomePreferences(formData: FormData) {
  const { supabase, user } = await requireUser();
  const homePreferences = Object.fromEntries(keys.map((key) => [key, formData.get(key) === "on"]));
  await supabase
    .from("profiles")
    .update({ home_preferences: homePreferences })
    .eq("id", user.id);

  revalidatePath("/home");
  revalidatePath("/settings");
}
