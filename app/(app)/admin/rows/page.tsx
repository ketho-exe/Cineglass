import { requireAdmin } from "@/lib/auth/require-admin";

export const dynamic = "force-dynamic";

export default async function AdminRowsPage() {
  const { supabase } = await requireAdmin();
  const { data: rows } = await supabase
    .from("featured_rows")
    .select("title, active")
    .order("position", { ascending: true });

  return (
    <section className="glass rounded-3xl p-7">
      <h1 className="text-3xl font-bold">Featured Rows</h1>
      <div className="mt-6 grid gap-3">
        {rows?.length ? rows.map((row) => <div key={row.title} className="rounded-2xl bg-white/5 p-4">{row.title} • {row.active ? "active" : "inactive"}</div>) : <div className="rounded-2xl bg-white/5 p-4 text-slate-300">No featured rows yet</div>}
      </div>
    </section>
  );
}
