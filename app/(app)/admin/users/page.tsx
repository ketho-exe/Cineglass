export default function AdminUsersPage() {
  return <AdminList title="Users" rows={["Owner • approved", "Admin • approved", "Member • pending"]} />;
}

function AdminList({ title, rows }: { title: string; rows: string[] }) {
  return (
    <section className="glass rounded-3xl p-7">
      <h1 className="text-3xl font-bold">{title}</h1>
      <div className="mt-6 grid gap-3">
        {rows.map((row) => <div key={row} className="rounded-2xl bg-white/5 p-4">{row}</div>)}
      </div>
    </section>
  );
}
