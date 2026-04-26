import { requireUser } from "@/lib/auth/require-user";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const { supabase, user } = await requireUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, role, access_status, favourite_genres")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <section className="glass rounded-3xl p-7">
      <p className="text-sm uppercase tracking-[0.22em] text-violet-200">Profile</p>
      <h1 className="mt-2 text-3xl font-bold">{profile?.display_name ?? user.email ?? "Member"}</h1>
      <p className="mt-3 text-slate-300">
        {profile?.role ?? "member"} • {profile?.access_status ?? "pending"}
      </p>
      {profile?.favourite_genres?.length ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {profile.favourite_genres.map((genre: string) => (
            <span key={genre} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200">{genre}</span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
