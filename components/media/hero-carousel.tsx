import { LinkButton } from "@/components/ui/button";
import { getTmdbImageUrl } from "@/lib/tmdb/client";
import type { NormalisedMedia } from "@/types/media";
import { Info, Play } from "lucide-react";

export function HeroCarousel({ items }: { items: NormalisedMedia[] }) {
  const item = items[0];
  if (!item) return null;
  const backdrop = getTmdbImageUrl(item.backdropPath, "original");
  return (
    <section className="relative left-1/2 mb-8 min-h-[calc(100vh-5rem)] w-screen -translate-x-1/2 overflow-hidden bg-zinc-900 shadow-glow">
      {backdrop ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={backdrop} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-black/86 via-black/52 to-black/12" />
      <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-cine-bg via-cine-bg/76 to-transparent" />
      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col justify-end px-4 pb-20 pt-24 sm:px-6 lg:pb-24">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.22em] text-emerald-200">Featured tonight</p>
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
      </div>
    </section>
  );
}
