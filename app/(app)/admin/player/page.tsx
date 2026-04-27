import { requireAdmin } from "@/lib/auth/require-admin";

export const dynamic = "force-dynamic";

export default async function AdminPlayerPage() {
  await requireAdmin();
  return (
    <section className="glass rounded-3xl p-7">
      <h1 className="text-3xl font-bold">Player Settings</h1>
      <div className="mt-6 grid gap-4">
        <input defaultValue="https://embedmaster.link" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3" />
        <input defaultValue="k8i9pm5nsn3nrj0d" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3" />
      </div>
    </section>
  );
}
