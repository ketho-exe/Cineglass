import { MediaRow } from "@/components/media/media-row";
import { requireUser } from "@/lib/auth/require-user";
import { normaliseLibraryRows, compactMedia } from "@/lib/library/items";
import { getDetails } from "@/lib/tmdb/client";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type CollectionItemRow = {
  media_type: string;
  tmdb_id: number;
};

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) {
  const { collectionId } = await params;
  return <CollectionDetail collectionId={collectionId} />;
}

async function CollectionDetail({ collectionId }: { collectionId: string }) {
  const { supabase } = await requireUser();
  const { data: collection } = await supabase
    .from("collections")
    .select("id, title, description, visibility")
    .eq("id", collectionId)
    .maybeSingle();

  if (!collection) notFound();

  const { data: rows } = await supabase
    .from("collection_items")
    .select("media_type, tmdb_id")
    .eq("collection_id", collection.id)
    .order("position", { ascending: true })
    .returns<CollectionItemRow[]>();
  const refs = normaliseLibraryRows(rows ?? []);
  const items = compactMedia(await Promise.all(refs.map((item) => getDetails(item.mediaType, item.tmdbId).catch(() => null))));

  return (
    <div>
      <section className="glass rounded-3xl p-7">
        <p className="text-sm uppercase tracking-[0.22em] text-violet-200">Collection</p>
        <h1 className="mt-2 text-3xl font-bold">{collection.title}</h1>
        {collection.description ? <p className="mt-3 text-slate-300">{collection.description}</p> : null}
      </section>
      {items.length ? <MediaRow title="Titles" items={items} /> : <section className="glass mt-6 rounded-3xl p-7">
        <h2 className="text-xl font-semibold">No titles in this collection yet</h2>
      </section>}
    </div>
  );
}
