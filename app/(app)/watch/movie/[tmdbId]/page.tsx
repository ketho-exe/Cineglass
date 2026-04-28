import { EmbedMasterPlayer } from "@/components/player/embedmaster-player";
import { WatchPartyPanel } from "@/components/player/watch-party-panel";
import { requireUser } from "@/lib/auth/require-user";
import { getDetails } from "@/lib/tmdb/client";
import type { PlaybackProvider } from "@/lib/providers/playback.types";

export default async function WatchMoviePage({
  params,
  searchParams,
}: {
  params: Promise<{ tmdbId: string }>;
  searchParams: Promise<{ party?: string }>;
}) {
  const { tmdbId } = await params;
  const { party } = await searchParams;
  const { supabase, user } = await requireUser();
  const [{ data: profile }, media] = await Promise.all([
    supabase.from("profiles").select("player_provider").eq("id", user.id).maybeSingle(),
    getDetails("movie", Number(tmdbId)).catch(() => null),
  ]);
  const provider = normaliseProvider(profile?.player_provider);
  return (
    <div className="space-y-5">
      <EmbedMasterPlayer mediaType="movie" tmdbId={Number(tmdbId)} title={media?.title ?? `Movie ${tmdbId}`} autoplay partyCode={provider === "embedmaster" ? party : undefined} provider={provider} />
      {provider === "embedmaster" ? <WatchPartyPanel mediaType="movie" tmdbId={Number(tmdbId)} roomCode={party} /> : null}
      <section className="glass rounded-3xl p-6">
        <h1 className="text-2xl font-bold">{media?.title ?? `Movie ${tmdbId}`}</h1>
        {media?.overview ? <p className="mt-2 text-slate-300">{media.overview}</p> : null}
      </section>
    </div>
  );
}

function normaliseProvider(value: unknown): PlaybackProvider {
  return value === "vidking" ? "vidking" : "embedmaster";
}
