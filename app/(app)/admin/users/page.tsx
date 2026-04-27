import { approveUser, blockUser } from "@/app/(app)/admin/users/actions";
import { SubmitButton } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/require-admin";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const { supabase } = await requireAdmin();
  const { data: users } = await supabase
    .from("profiles")
    .select("id, display_name, role, access_status")
    .order("created_at", { ascending: false });

  return (
    <section className="glass rounded-3xl p-7">
      <h1 className="text-3xl font-bold">Users</h1>
      <div className="mt-6 grid gap-3">
        {users?.length ? users.map((user) => (
          <div key={user.id} className="flex flex-col gap-3 rounded-2xl bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">{user.display_name ?? "Unnamed"}</p>
              <p className="text-sm text-slate-300">{user.role} - {user.access_status}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.access_status !== "approved" ? (
                <form action={approveUser}>
                  <input type="hidden" name="userId" value={user.id} />
                  <SubmitButton className="px-4 py-2">Approve</SubmitButton>
                </form>
              ) : null}
              {user.access_status !== "blocked" ? (
                <form action={blockUser}>
                  <input type="hidden" name="userId" value={user.id} />
                  <SubmitButton variant="danger" className="px-4 py-2">Block</SubmitButton>
                </form>
              ) : null}
            </div>
          </div>
        )) : <div className="rounded-2xl bg-white/5 p-4 text-slate-300">No records yet</div>}
      </div>
    </section>
  );
}
