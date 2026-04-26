export default function AdminRowsPage() {
  return (
    <section className="glass rounded-3xl p-7">
      <h1 className="text-3xl font-bold">Featured Rows</h1>
      <div className="mt-6 grid gap-3">
        {["Trending Movies", "Anime Picks", "Comfort Films"].map((row) => <div key={row} className="rounded-2xl bg-white/5 p-4">{row}</div>)}
      </div>
    </section>
  );
}
