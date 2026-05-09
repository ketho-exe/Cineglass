import { createOptionalSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

type CollectionRow = {
  id: string;
  title: string;
  description: string | null;
  visibility: string;
};

export default async function CollectionsPage() {
  const supabase = await createOptionalSupabaseServerClient();
  if (!supabase) {
    return (
      <div>
        <h1 className="text-3xl font-bold">Collections</h1>
        <section className="glass mt-6 rounded-3xl p-7">
          <h2 className="text-xl font-semibold">No channels yet</h2>
          <p className="mt-2 text-slate-300">Channels will appear here once a collection source is connected.</p>
        </section>
      </div>
    );
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let query = supabase
    .from("collections")
    .select("id, title, description, visibility")
    .order("updated_at", { ascending: false });
  query = user ? query.or(`owner_id.eq.${user.id},visibility.eq.group`) : query.eq("visibility", "group");
  const { data: collections } = await query.returns<CollectionRow[]>();

  return (
    <div>
      <h1 className="text-3xl font-bold">Collections</h1>
      {collections?.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((collection) => (
            <Link key={collection.id} href={`/collection/${collection.id}`} className="glass rounded-3xl p-6 transition hover:-translate-y-1 hover:bg-white/[0.14]">
              <h2 className="text-xl font-semibold">{collection.title}</h2>
              <p className="mt-3 text-sm text-slate-400">{collection.description ?? collection.visibility}</p>
            </Link>
          ))}
        </div>
      ) : (
        <section className="glass mt-6 rounded-3xl p-7">
          <h2 className="text-xl font-semibold">No collections yet</h2>
          <p className="mt-2 text-slate-300">Collections will appear here once they are created.</p>
        </section>
      )}
    </div>
  );
}
