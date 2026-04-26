import { MediaCard } from "@/components/media/media-card";
import type { NormalisedMedia } from "@/types/media";

export function MediaRow({ title, items }: { title: string; items: NormalisedMedia[] }) {
  if (!items.length) return null;
  return (
    <section className="mt-9">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-4">
        {items.map((item) => (
          <MediaCard key={`${item.mediaType}-${item.tmdbId}`} media={item} />
        ))}
      </div>
    </section>
  );
}
