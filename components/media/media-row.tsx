"use client";

import { MediaCard } from "@/components/media/media-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { NormalisedMedia } from "@/types/media";

type RowItem = NormalisedMedia & {
  progressPercent?: number;
  watchHref?: string;
};

const subtitles: Record<string, string> = {
  "Continue Watching": "Pick up where you left off",
  "Recommended for You": "Based on your saved titles",
  Watchlist: "Your saved shelf",
  "Trending Movies": "Popular right now",
  "Trending TV": "Series people are watching",
  "Top Rated": "Highly rated picks from TMDB",
  "Feel-good Picks": "Lighter watches for tonight",
  "Anime Picks": "Animated favourites and discoveries",
};

export function MediaRow({ title, items, viewAllHref }: { title: string; items: RowItem[]; viewAllHref?: string }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({ canScroll: false, atStart: true, atEnd: true });

  function updateScrollState() {
    const element = scrollerRef.current;
    if (!element) return;
    const maxScroll = element.scrollWidth - element.clientWidth;
    setScrollState({
      canScroll: maxScroll > 8,
      atStart: element.scrollLeft <= 4,
      atEnd: element.scrollLeft >= maxScroll - 4,
    });
  }

  useEffect(() => {
    updateScrollState();
    const element = scrollerRef.current;
    if (!element) return;
    element.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      element.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [items.length]);

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
        <SectionHeading title={title} subtitle={subtitles[title]} href={viewAllHref} className="flex-1" />
        {scrollState.canScroll ? (
        <div className="hidden gap-2 sm:flex">
          <button type="button" aria-label={`Scroll ${title} left`} onClick={() => scrollBy(-1)} disabled={scrollState.atStart} className="rounded-full border border-white/10 bg-white/5 p-2 transition hover:border-cine-accent/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" aria-label={`Scroll ${title} right`} onClick={() => scrollBy(1)} disabled={scrollState.atEnd} className="rounded-full border border-white/10 bg-white/5 p-2 transition hover:border-cine-accent/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        ) : null}
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-cine-bg to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-cine-bg to-transparent" />
      <div ref={scrollerRef} className="scrollbar-hide flex snap-x gap-3 overflow-x-auto scroll-smooth pb-4 sm:gap-4">
        {items.map((item) => (
          <MediaCard
            key={`${item.mediaType}-${item.tmdbId}`}
            media={item}
            href={item.watchHref}
            progressPercent={item.progressPercent}
          />
        ))}
      </div>
      </div>
    </section>
  );
}
