import { MediaRow } from "@/components/media/media-row";
import { fallbackMovies, fallbackTv } from "@/lib/demo-data";

export default function HistoryPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">History</h1>
      <MediaRow title="Recently watched" items={[...fallbackTv, ...fallbackMovies]} />
    </div>
  );
}
