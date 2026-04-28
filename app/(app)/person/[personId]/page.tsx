import { MediaCard } from "@/components/media/media-card";
import { getPerson, getPersonCredits, getTmdbImageUrl } from "@/lib/tmdb/client";
import Image from "next/image";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PersonPage({ params }: { params: Promise<{ personId: string }> }) {
  const { personId } = await params;
  const person = await getPerson(Number(personId)).catch(() => null);
  if (!person) notFound();
  const credits = await getPersonCredits(person.id).catch(() => []);
  const profile = getTmdbImageUrl(person.profilePath, "w500");

  return (
    <section className="space-y-8">
      <div className="glass grid gap-7 rounded-3xl p-7 md:grid-cols-[220px_1fr]">
        <div className="relative aspect-[2/3] overflow-hidden rounded-3xl border border-white/10 bg-white/10">
          {profile ? <Image src={profile} alt="" fill sizes="220px" className="object-cover" /> : null}
        </div>
        <div className="self-end">
          <p className="text-sm uppercase tracking-[0.22em] text-emerald-200">{person.knownForDepartment ?? "Filmography"}</p>
          <h1 className="mt-2 text-4xl font-black sm:text-6xl">{person.name}</h1>
          <p className="mt-3 text-slate-300">
            {[person.birthday, person.placeOfBirth].filter(Boolean).join(" - ")}
          </p>
          {person.biography ? <p className="mt-5 max-w-3xl text-slate-200">{person.biography}</p> : null}
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold">Known for</h2>
        <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {credits.map((item) => (
            <MediaCard key={`${item.mediaType}-${item.tmdbId}`} media={item} className="w-full sm:w-full" />
          ))}
        </div>
      </div>
    </section>
  );
}
