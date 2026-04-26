import { Clapperboard, Mail } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <section className="glass w-full max-w-md rounded-3xl p-8">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-cine-bg">
            <Clapperboard className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold">CineGlass</h1>
            <p className="text-sm text-slate-400">Private access portal</p>
          </div>
        </div>
        <form className="space-y-4">
          <label className="block text-sm font-medium text-slate-200">
            Email
            <input className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-violet-300" placeholder="you@example.com" />
          </label>
          <label className="block text-sm font-medium text-slate-200">
            Password
            <input type="password" className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-violet-300" placeholder="••••••••" />
          </label>
          <button className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-cine-bg">
            <Mail className="h-4 w-4" /> Continue
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-400">Wire this form to Supabase Auth once your project URL and anon key are set.</p>
      </section>
    </main>
  );
}
