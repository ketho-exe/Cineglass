import { saveMediaFeedback } from "@/app/(app)/media-feedback-actions";
import { SubmitButton } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/require-user";
import type { MediaType } from "@/types/media";

export async function MediaFeedback({ mediaType, tmdbId }: { mediaType: MediaType; tmdbId: number }) {
  const { supabase, user } = await requireUser();
  const [ratingResult, noteResult, publicNotesResult] = await Promise.all([
    supabase.from("ratings").select("rating").eq("user_id", user.id).eq("media_type", mediaType).eq("tmdb_id", tmdbId).maybeSingle(),
    supabase.from("media_notes").select("note, visibility").eq("user_id", user.id).eq("media_type", mediaType).eq("tmdb_id", tmdbId).maybeSingle(),
    supabase
      .from("media_notes")
      .select("note, created_at, profiles(display_name)")
      .eq("media_type", mediaType)
      .eq("tmdb_id", tmdbId)
      .eq("visibility", "group")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  return (
    <section className="glass rounded-3xl p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-emerald-200">Your take</p>
          <h2 className="mt-2 text-2xl font-bold">Rate and review</h2>
        </div>
        <p className="text-sm text-slate-400">Private by default, or share with approved members.</p>
      </div>
      <form action={saveMediaFeedback} className="mt-5 grid gap-3">
        <input type="hidden" name="mediaType" value={mediaType} />
        <input type="hidden" name="tmdbId" value={tmdbId} />
        <div className="grid gap-3 sm:grid-cols-[160px_1fr_160px]">
          <label className="grid gap-2">
            <span className="text-sm text-slate-300">Score</span>
            <input name="rating" type="number" min="1" max="10" defaultValue={ratingResult.data?.rating ?? ""} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-emerald-300" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-slate-300">Review</span>
            <input name="note" defaultValue={noteResult.data?.note ?? ""} placeholder="What stood out?" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-emerald-300" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-slate-300">Visibility</span>
            <select name="visibility" defaultValue={noteResult.data?.visibility ?? "private"} className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none">
              <option value="private">Private</option>
              <option value="group">Group</option>
            </select>
          </label>
        </div>
        <SubmitButton className="w-fit">Save feedback</SubmitButton>
      </form>
      {publicNotesResult.data?.length ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {publicNotesResult.data.map((review, index) => (
            <blockquote key={`${review.created_at}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
              <p>{review.note}</p>
              <footer className="mt-3 text-xs text-slate-400">
                {(review.profiles as { display_name?: string } | null)?.display_name ?? "CineGlass member"}
              </footer>
            </blockquote>
          ))}
        </div>
      ) : null}
    </section>
  );
}
