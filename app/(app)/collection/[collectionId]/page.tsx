import { MediaRow } from "@/components/media/media-row";
import { fallbackMovies } from "@/lib/demo-data";

export default function CollectionDetailPage() {
  return (
    <div>
      <section className="glass rounded-3xl p-7">
        <p className="text-sm uppercase tracking-[0.22em] text-violet-200">Collection</p>
        <h1 className="mt-2 text-3xl font-bold">Comfort Watches</h1>
        <p className="mt-3 text-slate-300">A shared row for familiar, easy rewatch nights.</p>
      </section>
      <MediaRow title="Titles" items={fallbackMovies} />
    </div>
  );
}
