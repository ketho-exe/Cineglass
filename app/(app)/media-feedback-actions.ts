"use server";

import { requireUser } from "@/lib/auth/require-user";
import type { MediaType } from "@/types/media";
import { revalidatePath } from "next/cache";

export async function saveMediaFeedback(formData: FormData) {
  const { supabase, user } = await requireUser();
  const mediaType = String(formData.get("mediaType")) as MediaType;
  const tmdbId = Number(formData.get("tmdbId"));
  const rating = Number(formData.get("rating"));
  const note = String(formData.get("note") ?? "").trim();
  const visibility = formData.get("visibility") === "group" ? "group" : "private";

  if ((mediaType !== "movie" && mediaType !== "tv") || !Number.isInteger(tmdbId)) {
    throw new Error("Invalid media item");
  }
  if (Number.isInteger(rating) && rating >= 1 && rating <= 10) {
    await supabase.from("ratings").upsert(
      { user_id: user.id, tmdb_id: tmdbId, media_type: mediaType, rating },
      { onConflict: "user_id,tmdb_id,media_type" },
    );
  }
  if (note.length) {
    await supabase.from("media_notes").upsert(
      { user_id: user.id, tmdb_id: tmdbId, media_type: mediaType, note, visibility },
      { onConflict: "user_id,tmdb_id,media_type" },
    );
  }

  revalidatePath(`/${mediaType}/${tmdbId}`);
  revalidatePath("/profile");
}
