import { MediaRow } from "@/components/media/media-row";
import { getUserMediaList } from "@/lib/library/queries";

export const dynamic = "force-dynamic";

export default async function WatchlistPage() {
  const [watchlist, favourites] = await Promise.all([
    getUserMediaList("watchlist_items"),
    getUserMediaList("favourite_items"),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold">Your Library</h1>
      {watchlist.length || favourites.length ? (
        <>
          <MediaRow title="Watchlist" items={watchlist} />
          <MediaRow title="Favourites" items={favourites} />
        </>
      ) : (
        <section className="glass mt-6 rounded-3xl p-7">
          <h2 className="text-xl font-semibold">No saved titles yet</h2>
          <p className="mt-2 text-slate-300">Add movies and shows from their detail pages.</p>
        </section>
      )}
    </div>
  );
}
