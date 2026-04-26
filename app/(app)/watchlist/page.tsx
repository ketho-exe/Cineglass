import { MediaRow } from "@/components/media/media-row";
import { animePicks, fallbackMovies, fallbackTv } from "@/lib/demo-data";

export default function WatchlistPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Your Library</h1>
      <MediaRow title="Watchlist" items={[...fallbackMovies, ...fallbackTv]} />
      <MediaRow title="Favourites" items={animePicks} />
    </div>
  );
}
