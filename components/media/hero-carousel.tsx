import { LinkButton } from "@/components/ui/button";
import { getTmdbImageUrl } from "@/lib/tmdb/client";
import type { NormalisedMedia } from "@/types/media";
import { Info, Play } from "lucide-react";

export function HeroCarousel({ items }: { items: NormalisedMedia[] }) {
  const item = items[0];
  if (!item) return null;
  const backdrop = getTmdbImageUrl(item.backdropPath, "original");
  return (
    <section className="relative min-h-[480px] overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900 shadow-glow">
      {backdrop ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={backdrop} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-cine-bg via-cine-bg/62 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-cine-bg/90 to-transparent" />
      <div className="relative flex min-h-[480px] max-w-2xl flex-col justify-end p-6 sm:p-10">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.22em] text-violet-200">Featured tonight</p>
        <h1 className="text-4xl font-black tracking-tight sm:text-6xl">{item.title}</h1>
        <p className="mt-4 line-clamp-3 max-w-xl text-base text-slate-200 sm:text-lg">{item.overview}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <LinkButton href={`/watch/${item.mediaType}/${item.tmdbId}`}><Play className="h-4 w-4 fill-current" />Watch</LinkButton>
          <LinkButton href={`/${item.mediaType}/${item.tmdbId}`} variant="glass"><Info className="h-4 w-4" />Details</LinkButton>
        </div>
      </div>
    </section>
  );
}
