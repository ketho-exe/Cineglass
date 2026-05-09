import { getTmdbImageUrl } from "@/lib/tmdb/client";
import { formatRuntime, yearFromDate } from "@/lib/utils";
import type { NormalisedMedia } from "@/types/media";
import Link from "next/link";

export function MediaExtras({ media }: { media: NormalisedMedia }) {
  const directors = media.crew?.filter((person) => person.job === "Director").slice(0, 3) ?? [];
  const facts = [
    ["Original title", media.originalTitle ?? media.title],
    ["Release", yearFromDate(media.releaseDate ?? media.firstAirDate)],
    ["Runtime", media.runtime ? formatRuntime(media.runtime) : media.mediaType === "tv" ? `${media.seasons?.length ?? 0} seasons` : "Unknown"],
    ["TMDB score", media.voteAverage ? `${media.voteAverage.toFixed(1)} / 10` : "Not rated yet"],
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <section className="glass rounded-3xl p-6">
        <p className="text-sm uppercase tracking-[0.22em] text-emerald-200">Cast & crew</p>
        <h2 className="mt-2 text-2xl font-bold">People behind this title</h2>
        {directors.length ? (
          <p className="mt-2 text-sm text-slate-300">Directed by {directors.map((person) => person.name).join(", ")}</p>
        ) : null}
        <div className="scrollbar-hide mt-5 flex gap-4 overflow-x-auto pb-2">
          {(media.cast ?? []).map((person) => {
            const profile = getTmdbImageUrl(person.profilePath, "w185");
            return (
              <Link key={person.id} href={`/person/${person.id}`} className="w-28 shrink-0">
                <div className="aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-white/10">
                  {profile ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-400">No photo</div>
                  )}
                </div>
                <p className="mt-2 line-clamp-1 text-sm font-semibold">{person.name}</p>
                <p className="line-clamp-1 text-xs text-slate-400">{person.character}</p>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="glass rounded-3xl p-6">
        <p className="text-sm uppercase tracking-[0.22em] text-emerald-200">Awards & facts</p>
        <h2 className="mt-2 text-2xl font-bold">Quick context</h2>
        <dl className="mt-5 grid gap-3">
          {facts.map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</dt>
              <dd className="mt-1 text-sm text-slate-100">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
