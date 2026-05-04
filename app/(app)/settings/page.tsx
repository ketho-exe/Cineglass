import { updateHomePreferences } from "@/app/(app)/settings/actions";
import { SubmitButton } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/require-user";
import { getPlaybackProvider, playbackProviders, providerLabels } from "@/lib/providers/preferences";

export const dynamic = "force-dynamic";

const settings = [
  ["continueWatching", "Continue Watching"],
  ["watchlist", "Watchlist"],
  ["recommended", "Recommended for You"],
  ["trendingMovies", "Trending Movies"],
  ["trendingTv", "Trending TV"],
  ["anime", "Anime Picks"],
  ["smartCategories", "Smart categories and moods"],
] as const;

const defaults = {
  continueWatching: true,
  watchlist: true,
  recommended: true,
  trendingMovies: true,
  trendingTv: true,
  anime: true,
  smartCategories: true,
  playerAccentColor: "22d3ee",
  autoplay: true,
  resumePlayback: true,
  videasy: {
    overlay: true,
    episodeSelector: true,
    nextEpisode: true,
    autoplayNextEpisode: false,
  },
};

export default async function SettingsPage() {
  const { supabase, user } = await requireUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("home_preferences, player_provider")
    .eq("id", user.id)
    .maybeSingle();
  const savedPreferences = profile?.home_preferences as Partial<typeof defaults> | null;
  const preferences = {
    ...defaults,
    ...savedPreferences,
    videasy: { ...defaults.videasy, ...(savedPreferences?.videasy ?? {}) },
  };
  const playerProvider = getPlaybackProvider(profile);

  return (
    <section className="glass rounded-3xl p-7">
      <h1 className="text-3xl font-bold">Settings</h1>
      <form action={updateHomePreferences} className="mt-6 grid gap-3">
        <h2 className="text-lg font-semibold">Playback provider</h2>
        <label className="grid gap-2 rounded-2xl border border-white/10 bg-white/5 p-4">
          <span>Preferred player</span>
          <select name="playerProvider" defaultValue={playerProvider} className="rounded-full border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none">
            {playbackProviders.map((provider) => (
              <option key={provider} value={provider}>{providerLabels[provider]}</option>
            ))}
          </select>
          <span className="text-sm text-slate-400">Watch parties are available with EmbedMaster only.</span>
        </label>
        <h2 className="text-lg font-semibold">Player customisation</h2>
        <label className="grid gap-2 rounded-2xl border border-white/10 bg-white/5 p-4">
          <span>Accent colour</span>
          <input name="playerAccentColor" defaultValue={preferences.playerAccentColor} className="rounded-full border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none" />
        </label>
        <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
          <span>Autoplay</span>
          <input name="autoplay" type="checkbox" defaultChecked={preferences.autoplay} className="h-5 w-5 accent-emerald-300" />
        </label>
        <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
          <span>Resume from last position</span>
          <input name="resumePlayback" type="checkbox" defaultChecked={preferences.resumePlayback} className="h-5 w-5 accent-emerald-300" />
        </label>
        <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
          <span>Show next episode button</span>
          <input name="videasyNextEpisode" type="checkbox" defaultChecked={preferences.videasy.nextEpisode} className="h-5 w-5 accent-emerald-300" />
        </label>
        <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
          <span>Autoplay next episode</span>
          <input name="videasyAutoplayNextEpisode" type="checkbox" defaultChecked={preferences.videasy.autoplayNextEpisode} className="h-5 w-5 accent-emerald-300" />
        </label>
        <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
          <span>Show episode selector</span>
          <input name="videasyEpisodeSelector" type="checkbox" defaultChecked={preferences.videasy.episodeSelector} className="h-5 w-5 accent-emerald-300" />
        </label>
        <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
          <span>Netflix-style pause overlay</span>
          <input name="videasyOverlay" type="checkbox" defaultChecked={preferences.videasy.overlay} className="h-5 w-5 accent-emerald-300" />
        </label>
        <h2 className="text-lg font-semibold">Home page sections</h2>
        {settings.map(([key, label]) => (
          <label key={key} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
            <span>{label}</span>
            <input name={key} type="checkbox" defaultChecked={preferences[key]} className="h-5 w-5 accent-emerald-300" />
          </label>
        ))}
        <SubmitButton className="mt-2 w-fit">Save Preferences</SubmitButton>
      </form>
    </section>
  );
}
