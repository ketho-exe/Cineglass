import { SearchX } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="glass rounded-3xl p-8 text-center">
      <SearchX className="mx-auto h-10 w-10 text-cyan-200" />
      <h2 className="mt-4 text-xl font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">{description}</p>
    </div>
  );
}
