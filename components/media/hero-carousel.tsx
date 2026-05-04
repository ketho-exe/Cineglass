"use client";

import { LinkButton } from "@/components/ui/button";
import { getHeroItems } from "@/lib/media/hero";
import { getTmdbImageUrl } from "@/lib/tmdb/client";
import type { NormalisedMedia } from "@/types/media";
import { ChevronLeft, ChevronRight, Info, Play } from "lucide-react";
import { useEffect, useState } from "react";

export function HeroCarousel({ items }: { items: NormalisedMedia[] }) {
  const heroItems = getHeroItems(items);
  const [activeIndex, setActiveIndex] = useState(0);
  const item = heroItems[activeIndex];

  useEffect(() => {
    if (heroItems.length <= 1) return;
    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % heroItems.length);
    }, 7000);
    return () => window.clearInterval(interval);
  }, [heroItems.length]);

  useEffect(() => {
    if (activeIndex >= heroItems.length) setActiveIndex(0);
  }, [activeIndex, heroItems.length]);

  if (!item) return null;
  const backdrop = getTmdbImageUrl(item.backdropPath, "original");
  const nextItem = heroItems[(activeIndex + 1) % heroItems.length];
  const previous = () => setActiveIndex((index) => (index - 1 + heroItems.length) % heroItems.length);
  const next = () => setActiveIndex((index) => (index + 1) % heroItems.length);

  return (
    <section className="relative left-1/2 mb-8 min-h-[calc(100vh-5rem)] w-screen -translate-x-1/2 overflow-hidden bg-cine-panel shadow-glow">
      {backdrop ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={item.tmdbId} src={backdrop} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity duration-700" />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-cine-bg/92 via-cine-bg/58 to-cine-bg/18" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_26%,rgba(34,211,238,0.18),transparent_28rem),radial-gradient(circle_at_72%_18%,rgba(139,92,246,0.16),transparent_26rem)]" />
      <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-cine-bg via-cine-bg/76 to-transparent" />
      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col justify-end px-4 pb-20 pt-24 sm:px-6 lg:pb-24">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.22em] text-cyan-200">Featured tonight</p>
        <h1 className="text-4xl font-black tracking-tight sm:text-6xl">{item.title}</h1>
        {item.genres?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.genres.slice(0, 3).map((genre) => (
              <LinkButton key={genre.id} href={`/genre/${item.mediaType}/${genre.id}`} variant="glass" className="px-3 py-1.5 text-xs">
                {genre.name}
              </LinkButton>
            ))}
          </div>
        ) : null}
        <p className="mt-4 line-clamp-3 max-w-xl text-base text-slate-200 sm:text-lg">{item.overview}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <LinkButton href={item.mediaType === "tv" ? `/watch/tv/${item.tmdbId}/season/1/episode/1` : `/watch/movie/${item.tmdbId}`}><Play className="h-4 w-4 fill-current" />Watch</LinkButton>
          <LinkButton href={`/${item.mediaType}/${item.tmdbId}`} variant="glass"><Info className="h-4 w-4" />Details</LinkButton>
        </div>
        {heroItems.length > 1 ? (
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
              <button type="button" aria-label="Previous featured title" onClick={previous} className="rounded-full border border-white/[0.12] bg-white/[0.08] p-2 text-white backdrop-blur transition hover:border-cine-accent/50 hover:bg-white/[0.14]">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button type="button" aria-label="Next featured title" onClick={next} className="rounded-full border border-white/[0.12] bg-white/[0.08] p-2 text-white backdrop-blur transition hover:border-cine-accent/50 hover:bg-white/[0.14]">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <div className="flex gap-2">
              {heroItems.map((heroItem, index) => (
                <button
                  key={`${heroItem.mediaType}-${heroItem.tmdbId}`}
                  type="button"
                  aria-label={`Show ${heroItem.title}`}
                  onClick={() => setActiveIndex(index)}
                  className={index === activeIndex ? "h-2 w-8 rounded-full bg-cine-accent" : "h-2 w-2 rounded-full bg-white/[0.38] transition hover:bg-white/70"}
                />
              ))}
            </div>
            {nextItem ? <p className="text-sm text-slate-300">Next: {nextItem.title}</p> : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
