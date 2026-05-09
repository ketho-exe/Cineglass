import { Clapperboard, Mail } from "lucide-react";
import { signInWithPassword, signUpWithPassword } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirectTo?: string }>;
}) {
  const params = await searchParams;
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(34,211,238,0.18),transparent_28rem),radial-gradient(circle_at_80%_12%,rgba(139,92,246,0.2),transparent_30rem),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
      <section className="glass relative w-full max-w-md rounded-3xl p-8">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-cine-bg">
            <Clapperboard className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold">CineGlass</h1>
            <p className="text-sm text-slate-400">Private access portal</p>
          </div>
        </div>
        {params.error ? (
          <p className="mb-4 rounded-2xl border border-rose-300/20 bg-rose-950/40 p-3 text-sm text-rose-100">
            {params.error}
          </p>
        ) : null}
        <form className="space-y-4">
          <input type="hidden" name="redirectTo" value={params.redirectTo ?? "/home"} />
          <label className="block text-sm font-medium text-slate-200">
            Email
            <input name="email" type="email" required className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-violet-300" placeholder="you@example.com" />
          </label>
          <label className="block text-sm font-medium text-slate-200">
            Password
            <input name="password" type="password" required minLength={6} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-violet-300" placeholder="••••••••" />
          </label>
          <button formAction={signInWithPassword} className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-cine-bg transition hover:bg-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200">
            <Mail className="h-4 w-4" /> Sign in
          </button>
          <button formAction={signUpWithPassword} className="flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200">
            Request access
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-400">New accounts are created as pending until an owner or admin approves them in Supabase.</p>
      </section>
    </main>
  );
}
