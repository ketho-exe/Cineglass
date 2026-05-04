"use client";

import { MediaCard } from "@/components/media/media-card";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { useRef } from "react";
import type { NormalisedMedia } from "@/types/media";
import Link from "next/link";

type RowItem = NormalisedMedia & {
  progressPercent?: number;
  watchHref?: string;
};

export function MediaRow({ title, items, viewAllHref }: { title: string; items: RowItem[]; viewAllHref?: string }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  if (!items.length) return null;
  function scrollBy(direction: number) {
    scrollerRef.current?.scrollBy({
      left: direction * Math.max(320, scrollerRef.current.clientWidth * 0.8),
      behavior: "smooth",
    });
  }
  return (
    <section className="mt-9">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {viewAllHref ? (
            <Link href={viewAllHref} className="mt-1 inline-flex items-center gap-1 text-sm text-cyan-200 transition hover:text-white">
              <LayoutGrid className="h-4 w-4" />
              View all
            </Link>
          ) : null}
        </div>
        <div className="flex gap-2">
          <button type="button" aria-label={`Scroll ${title} left`} onClick={() => scrollBy(-1)} className="rounded-full border border-white/10 bg-white/5 p-2 transition hover:border-cine-accent/40 hover:bg-white/10">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" aria-label={`Scroll ${title} right`} onClick={() => scrollBy(1)} className="rounded-full border border-white/10 bg-white/5 p-2 transition hover:border-cine-accent/40 hover:bg-white/10">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div ref={scrollerRef} className="scrollbar-hide flex snap-x gap-4 overflow-x-auto scroll-smooth pb-4">
        {items.map((item) => (
          <MediaCard
            key={`${item.mediaType}-${item.tmdbId}`}
            media={item}
            href={item.watchHref}
            progressPercent={item.progressPercent}
          />
        ))}
      </div>
    </section>
  );
}
