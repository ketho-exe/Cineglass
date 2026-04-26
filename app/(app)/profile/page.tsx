export default function ProfilePage() {
  return (
    <section className="glass rounded-3xl p-7">
      <p className="text-sm uppercase tracking-[0.22em] text-violet-200">Profile</p>
      <h1 className="mt-2 text-3xl font-bold">CineGlass Member</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {["18 watched", "7 favourites", "4 notes"].map((stat) => (
          <div key={stat} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-200">{stat}</div>
        ))}
      </div>
    </section>
  );
}
