import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { LinkButton } from "@/components/ui/button";

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Admin</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard label="Users" value="12" />
        <AdminStatCard label="Active this week" value="8" />
        <AdminStatCard label="Featured rows" value="5" />
        <AdminStatCard label="Player" value="VidKing" />
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <LinkButton href="/admin/users" variant="glass">Users</LinkButton>
        <LinkButton href="/admin/player" variant="glass">Player</LinkButton>
        <LinkButton href="/admin/rows" variant="glass">Rows</LinkButton>
        <LinkButton href="/admin/manual-titles" variant="glass">Manual Titles</LinkButton>
      </div>
    </div>
  );
}
