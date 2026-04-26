export function AdminStatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-3xl p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}
