"use client";

import { getGenreName } from "@/lib/tmdb/genres";
import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Crumb = {
  label: string;
  href?: string;
};

const browseLabels: Record<string, string> = {
  "continue-watching": "Continue Watching",
  recommended: "Recommended",
  watchlist: "Watchlist",
  "trending-movies": "Trending Movies",
  "trending-tv": "Trending TV",
  anime: "Anime Picks",
};

const staticLabels: Record<string, string> = {
  "/admin": "Admin",
  "/admin/manual-titles": "Manual Titles",
  "/admin/player": "Player Settings",
  "/admin/rows": "Featured Rows",
  "/admin/users": "Users",
  "/collections": "Collections",
  "/history": "History",
  "/profile": "Profile",
  "/search": "Search",
  "/settings": "Settings",
  "/watchlist": "Library",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const crumbs = getCrumbs(pathname);
  if (!crumbs.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
      <ol className="inline-flex max-w-full flex-wrap items-center gap-x-1.5 gap-y-2 rounded-full border border-white/10 bg-black/38 px-3 py-2 text-sm text-slate-300 backdrop-blur-xl">
        <li>
          <Link href="/home" className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 transition hover:bg-white/10 hover:text-white">
            <Home className="h-4 w-4" />
            Home
          </Link>
        </li>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={`${crumb.label}-${index}`} className="inline-flex min-w-0 items-center gap-1">
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
              {crumb.href && !isLast ? (
                <Link href={crumb.href} className="max-w-[12rem] truncate rounded-full px-2.5 py-1.5 transition hover:bg-white/10 hover:text-white sm:max-w-none">
                  {crumb.label}
                </Link>
              ) : (
                <span className={cn("max-w-[12rem] truncate rounded-full px-2.5 py-1.5 sm:max-w-none", isLast ? "bg-white/12 text-white ring-1 ring-white/10" : "text-slate-200")}>
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function getCrumbs(pathname: string): Crumb[] {
  if (pathname === "/" || pathname === "/home") return [];
  if (staticLabels[pathname]) return [{ label: staticLabels[pathname] }];

  const parts = pathname.split("/").filter(Boolean);
  const [root, second, third, , fifth, , seventh] = parts;

  if (root === "admin") {
    return [{ label: "Admin", href: "/admin" }, { label: titleCase(second ?? "Overview") }];
  }

  if (root === "browse") {
    return [{ label: "Browse" }, { label: browseLabels[second] ?? titleCase(second) }];
  }

  if (root === "collection") {
    return [{ label: "Collections", href: "/collections" }, { label: "Collection Details" }];
  }

  if (root === "genre" && (second === "movie" || second === "tv")) {
    const genreId = Number(third);
    return [
      { label: "Genres" },
      { label: second === "movie" ? "Movies" : "TV" },
      { label: Number.isInteger(genreId) ? getGenreName(second, genreId) : "Category" },
    ];
  }

  if (root === "movie") {
    return [{ label: "Movies", href: "/browse/trending-movies" }, { label: "Movie Details" }];
  }

  if (root === "tv") {
    return [{ label: "TV", href: "/browse/trending-tv" }, { label: "Series Details" }];
  }

  if (root === "watch" && second === "movie") {
    return [{ label: "Watch" }, { label: "Movie Playback" }];
  }

  if (root === "watch" && second === "tv") {
    const season = fifth;
    const episode = seventh;
    return [
      { label: "Watch" },
      { label: "Series Playback" },
      { label: season && episode ? `S${season} E${episode}` : "Episode" },
    ];
  }

  return [{ label: titleCase(root) }];
}

function titleCase(value?: string) {
  if (!value) return "Page";
  return decodeURIComponent(value)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
