export default function AccessPendingPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_8%,rgba(34,211,238,0.18),transparent_28rem),radial-gradient(circle_at_78%_10%,rgba(139,92,246,0.18),transparent_30rem)]" />
      <section className="glass relative max-w-lg rounded-3xl p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">Private access</p>
        <h1 className="mt-2 text-3xl font-bold">Access pending</h1>
        <p className="mt-3 text-slate-300">Your account has been created and is waiting for an owner or admin to approve it.</p>
        <form action="/auth/logout" method="post" className="mt-6">
          <button className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200">
            Sign out
          </button>
        </form>
      </section>
    </main>
  );
}
