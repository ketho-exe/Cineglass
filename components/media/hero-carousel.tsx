"use client";

import { LinkButton } from "@/components/ui/button";
import { getHeroItems } from "@/lib/media/hero";
import { getTmdbImageUrl } from "@/lib/tmdb/client";
import { formatRuntime, yearFromDate } from "@/lib/utils";
import type { NormalisedMedia } from "@/types/media";
import { Info, Play } from "lucide-react";
import { useEffect, useState } from "react";

export function HeroCarousel({ items }: { items: NormalisedMedia[] }) {
  const heroItems = getHeroItems(items);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const item = heroItems[activeIndex];

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const handleChange = () => setReducedMotion(query.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (heroItems.length <= 1 || paused || reducedMotion) return;
    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % heroItems.length);
    }, 7000);
    return () => window.clearInterval(interval);
  }, [heroItems.length, paused, reducedMotion]);

  useEffect(() => {
    if (activeIndex >= heroItems.length) setActiveIndex(0);
  }, [activeIndex, heroItems.length]);

  if (!item) return null;
  const backdrop = getTmdbImageUrl(item.backdropPath, "original");
  const nextItem = heroItems[(activeIndex + 1) % heroItems.length];
  const metadata = [
    yearFromDate(item.releaseDate ?? item.firstAirDate),
    item.mediaType === "tv" ? "Series" : "Movie",
    item.voteAverage ? `TMDB ${item.voteAverage.toFixed(1)}` : null,
    item.runtime ? formatRuntime(item.runtime) : item.seasons?.length ? `${item.seasons.length} seasons` : null,
  ].filter(Boolean);

  return (
    <section
      className="relative left-1/2 mb-8 min-h-[560px] w-screen -translate-x-1/2 overflow-hidden bg-cine-panel shadow-glow sm:min-h-[620px] lg:min-h-[calc(100vh-5rem)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {backdrop ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={item.tmdbId} src={backdrop} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity duration-700" />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-cine-bg/78 to-cine-bg/12" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_26%,rgba(34,211,238,0.18),transparent_28rem),radial-gradient(circle_at_72%_18%,rgba(139,92,246,0.16),transparent_26rem)]" />
      <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-cine-bg via-cine-bg/76 to-transparent" />
      <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-end px-4 pb-14 pt-20 sm:min-h-[620px] sm:px-6 lg:min-h-[calc(100vh-5rem)] lg:pb-20">
        <div>
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.22em] text-cyan-200">Popular movies</p>
        <h1 className="max-w-4xl text-4xl font-black uppercase tracking-normal sm:text-6xl lg:text-7xl">{item.title}</h1>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-200">
          {metadata.map((value) => (
            <span key={value} className="rounded-full border border-white/10 bg-black/35 px-3 py-1.5 backdrop-blur">{value}</span>
          ))}
        </div>
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
            {nextItem ? <p className="text-sm text-slate-300">Next: {nextItem.title}</p> : null}
          </div>
        ) : null}
        </div>
      </div>
    </section>
  );
}
