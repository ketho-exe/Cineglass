import { requireUser } from "@/lib/auth/require-user";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const { supabase } = await requireUser();
  const { data: users } = await supabase
    .from("profiles")
    .select("display_name, role, access_status")
    .order("created_at", { ascending: false });

  return <AdminList title="Users" rows={(users ?? []).map((user) => `${user.display_name ?? "Unnamed"} • ${user.role} • ${user.access_status}`)} />;
}

function AdminList({ title, rows }: { title: string; rows: string[] }) {
  return (
    <section className="glass rounded-3xl p-7">
      <h1 className="text-3xl font-bold">{title}</h1>
      <div className="mt-6 grid gap-3">
        {rows.length ? rows.map((row) => <div key={row} className="rounded-2xl bg-white/5 p-4">{row}</div>) : <div className="rounded-2xl bg-white/5 p-4 text-slate-300">No records yet</div>}
      </div>
    </section>
  );
}
