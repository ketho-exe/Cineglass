import { MediaRow } from "@/components/media/media-row";
import { getWatchedHistory } from "@/lib/library/queries";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const history = await getWatchedHistory();

  return (
    <div>
      <h1 className="text-3xl font-bold">History</h1>
      {history.length ? (
        <MediaRow title="Recently watched" items={history} />
      ) : (
        <section className="glass mt-6 rounded-3xl p-7">
          <h2 className="text-xl font-semibold">No watch history yet</h2>
          <p className="mt-2 text-slate-300">Titles appear here after progress is saved.</p>
        </section>
      )}
    </div>
  );
}
