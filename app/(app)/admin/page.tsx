import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { LinkButton } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/require-admin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { supabase } = await requireAdmin();
  const [users, featuredRows, overrides, sessions] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("featured_rows").select("id", { count: "exact", head: true }),
    supabase.from("manual_title_overrides").select("id", { count: "exact", head: true }),
    supabase.from("watch_sessions").select("id", { count: "exact", head: true }),
  ]);

  return (
    <div>
      <section className="glass rounded-3xl p-7">
        <p className="text-sm uppercase tracking-[0.22em] text-emerald-200">Control room</p>
        <h1 className="mt-2 text-3xl font-bold">Admin</h1>
        <p className="mt-2 text-slate-300">Manage access, rows, player settings, and title overrides from one place.</p>
      </section>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard label="Users" value={String(users.count ?? 0)} />
        <AdminStatCard label="Featured rows" value={String(featuredRows.count ?? 0)} />
        <AdminStatCard label="Manual overrides" value={String(overrides.count ?? 0)} />
        <AdminStatCard label="Watch sessions" value={String(sessions.count ?? 0)} />
      </div>
      <div className="glass mt-6 flex flex-wrap gap-3 rounded-3xl p-5">
        <LinkButton href="/admin/users" variant="glass">Users</LinkButton>
        <LinkButton href="/admin/player" variant="glass">Player</LinkButton>
        <LinkButton href="/admin/rows" variant="glass">Rows</LinkButton>
        <LinkButton href="/admin/manual-titles" variant="glass">Manual Titles</LinkButton>
      </div>
    </div>
  );
}
