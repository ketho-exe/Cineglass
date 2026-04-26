"use server";

import { requireUser } from "@/lib/auth/require-user";
import type { MediaType } from "@/types/media";
import { revalidatePath } from "next/cache";

export async function toggleWatchlist(formData: FormData) {
  await toggleLibraryItem("watchlist_items", formData);
}

export async function toggleFavourite(formData: FormData) {
  await toggleLibraryItem("favourite_items", formData);
}

async function toggleLibraryItem(table: "watchlist_items" | "favourite_items", formData: FormData) {
  const { supabase, user } = await requireUser();
  const mediaType = String(formData.get("mediaType")) as MediaType;
  const tmdbId = Number(formData.get("tmdbId"));
  const action = String(formData.get("action"));

  if ((mediaType !== "movie" && mediaType !== "tv") || !Number.isInteger(tmdbId)) {
    throw new Error("Invalid media item");
  }

  if (action === "remove") {
    await supabase
      .from(table)
      .delete()
      .eq("user_id", user.id)
      .eq("media_type", mediaType)
      .eq("tmdb_id", tmdbId);
  } else {
    await supabase.from(table).upsert(
      {
        user_id: user.id,
        media_type: mediaType,
        tmdb_id: tmdbId,
      },
      { onConflict: "user_id,tmdb_id,media_type" },
    );
  }

  revalidatePath("/watchlist");
  revalidatePath(`/${mediaType}/${tmdbId}`);
}
