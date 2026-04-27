"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const labels: Record<string, string> = {
  admin: "Admin",
  collection: "Collection",
  collections: "Collections",
  history: "History",
  home: "Home",
  movie: "Movie",
  profile: "Profile",
  search: "Search",
  season: "Season",
  settings: "Settings",
  tv: "TV",
  watch: "Watch",
  watchlist: "Library",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  if (!parts.length || parts[0] === "home") return null;

  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 pt-5 text-sm text-slate-400 sm:px-6">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/home" className="inline-flex items-center gap-1 transition hover:text-white">
            <Home className="h-4 w-4" />
            Home
          </Link>
        </li>
        {parts.map((part, index) => {
          const href = `/${parts.slice(0, index + 1).join("/")}`;
          const isLast = index === parts.length - 1;
          return (
            <li key={href} className="inline-flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-slate-600" />
              {isLast ? (
                <span className="text-slate-200">{formatLabel(part)}</span>
              ) : (
                <Link href={href} className="transition hover:text-white">{formatLabel(part)}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function formatLabel(part: string) {
  return labels[part] ?? decodeURIComponent(part).replace(/-/g, " ");
}
