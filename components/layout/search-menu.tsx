"use client";

import { Search, X } from "lucide-react";

const recentSearches = ["90s action", "Korean thrillers", "Comfort shows"];

export function SearchMenu() {
  return (
    <div>
      <input id="search-menu-toggle" type="checkbox" className="peer hidden" />
      <label
        htmlFor="search-menu-toggle"
        role="button"
        tabIndex={0}
        aria-label="Open search"
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.08] text-slate-100 transition hover:border-cyan-200/40 hover:bg-white/[0.14] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200"
      >
        <Search className="h-5 w-5" />
      </label>
      <div className="fixed inset-0 z-50 hidden peer-checked:block" role="dialog" aria-modal="true" aria-labelledby="search-menu-title">
          <label htmlFor="search-menu-toggle" aria-label="Close search" className="absolute inset-0 cursor-pointer bg-black/65 backdrop-blur-md" />
          <form action="/search" className="glass absolute left-1/2 top-20 w-[min(calc(100vw-2rem),42rem)] -translate-x-1/2 rounded-[2rem] p-5 shadow-glow sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 id="search-menu-title" className="text-2xl font-bold">Search</h2>
              <div className="flex items-center gap-2">
                <select name="type" defaultValue="multi" aria-label="Category" className="rounded-full border border-white/10 bg-black/50 px-3 py-2 text-sm text-white">
                  <option value="multi">Movies & TV Shows</option>
                  <option value="movie">Movies</option>
                  <option value="tv">TV Shows</option>
                </select>
                <label htmlFor="search-menu-toggle" role="button" tabIndex={0} aria-label="Close search" className="cursor-pointer rounded-full border border-white/10 bg-white/[0.06] p-2 transition hover:bg-white/[0.12]">
                  <X className="h-5 w-5" />
                </label>
              </div>
            </div>
            <label className="relative mt-5 block">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                name="q"
                autoFocus
                placeholder="Type here to search..."
                className="w-full rounded-full border border-white/10 bg-black/45 py-4 pl-12 pr-4 text-lg text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200"
              />
            </label>
            <div className="mt-5 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Recent</p>
              <button type="button" className="text-xs text-slate-400 transition hover:text-white">Clear</button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {recentSearches.map((search) => (
                <button key={search} type="submit" name="q" value={search} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-sm text-slate-200 transition hover:bg-white/[0.12]">
                  {search}
                </button>
              ))}
            </div>
          </form>
        </div>
    </div>
  );
}
