import { getWatchedHistory } from "@/lib/library/queries";
import { createOptionalSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createOptionalSupabaseServerClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user || !supabase) {
    return (
      <section className="glass rounded-3xl p-7">
        <p className="text-sm uppercase tracking-[0.22em] text-cyan-200">Guest profile</p>
        <h1 className="mt-2 text-3xl font-bold">Browsing as guest</h1>
        <p className="mt-3 text-slate-300">CineGlass browsing and playback are available without signing in.</p>
      </section>
    );
  }
  const [{ data: profile }, progress, watchlist, favourites, ratings, reviews, history] = await Promise.all([
    supabase
    .from("profiles")
    .select("display_name, role, access_status, favourite_genres")
    .eq("id", user.id)
      .maybeSingle(),
    supabase.from("watch_progress").select("id, completed, progress_seconds").eq("user_id", user.id),
    supabase.from("watchlist_items").select("id").eq("user_id", user.id),
    supabase.from("favourite_items").select("id").eq("user_id", user.id),
    supabase.from("ratings").select("rating").eq("user_id", user.id),
    supabase.from("media_notes").select("id").eq("user_id", user.id),
    getWatchedHistory().catch(() => []),
  ]);
  const watchedMinutes = (progress.data ?? []).reduce((sum, row) => sum + Number(row.progress_seconds ?? 0), 0) / 60;
  const averageRating = ratings.data?.length
    ? ratings.data.reduce((sum, row) => sum + Number(row.rating), 0) / ratings.data.length
    : 0;
  const favoriteGenres = new Map<string, number>();
  history.forEach((item) => item.genres?.forEach((genre) => favoriteGenres.set(genre.name, (favoriteGenres.get(genre.name) ?? 0) + 1)));
  const topGenres = [...favoriteGenres.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <section className="space-y-8">
      <div className="glass rounded-3xl p-7">
        <p className="text-sm uppercase tracking-[0.22em] text-emerald-200">Dashboard</p>
        <h1 className="mt-2 text-3xl font-bold">{profile?.display_name ?? user.email ?? "Member"}</h1>
        <p className="mt-3 text-slate-300">
          {profile?.role ?? "member"} - {profile?.access_status ?? "pending"}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ["Watched", `${Math.round(watchedMinutes)} min`],
          ["Completed", String(progress.data?.filter((row) => row.completed).length ?? 0)],
          ["Watchlist", String(watchlist.data?.length ?? 0)],
          ["Favourites", String(favourites.data?.length ?? 0)],
          ["Avg rating", averageRating ? averageRating.toFixed(1) : "-"],
        ].map(([label, value]) => (
          <div key={label} className="glass-card rounded-3xl p-5">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-black">{value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-3xl p-6">
          <h2 className="text-xl font-bold">Favorite genres</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {(topGenres.length ? topGenres.map(([genre]) => genre) : profile?.favourite_genres ?? []).map((genre: string) => (
              <span key={genre} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200">{genre}</span>
            ))}
          </div>
        </div>
        <div className="glass rounded-3xl p-6">
          <h2 className="text-xl font-bold">Community activity</h2>
          <p className="mt-3 text-slate-300">{ratings.data?.length ?? 0} ratings and {reviews.data?.length ?? 0} written reviews saved.</p>
        </div>
      </div>
    </section>
  );
}
