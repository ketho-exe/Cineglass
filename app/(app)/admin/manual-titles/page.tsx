import { requireAdmin } from "@/lib/auth/require-admin";

export const dynamic = "force-dynamic";

export default async function ManualTitlesPage() {
  await requireAdmin();
  return (
    <section className="glass rounded-3xl p-7">
      <h1 className="text-3xl font-bold">Manual Title Overrides</h1>
      <p className="mt-3 text-slate-300">Add custom posters, backdrops, titles, or player overrides for individual TMDB IDs.</p>
    </section>
  );
}
