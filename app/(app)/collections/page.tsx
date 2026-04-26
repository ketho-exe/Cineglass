const collections = ["Comfort Watches", "Horror Night", "Anime Queue", "Rewatch Later"];

export default function CollectionsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Collections</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {collections.map((title) => (
          <a key={title} href="/collection/demo" className="glass rounded-3xl p-6 transition hover:bg-white/14">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="mt-3 text-sm text-slate-400">Private group collection</p>
          </a>
        ))}
      </div>
    </div>
  );
}
