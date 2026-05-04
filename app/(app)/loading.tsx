export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="h-[42vh] animate-pulse rounded-3xl bg-white/[0.08]" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="aspect-[2/3] animate-pulse rounded-2xl bg-white/[0.08]" />
        ))}
      </div>
    </div>
  );
}
