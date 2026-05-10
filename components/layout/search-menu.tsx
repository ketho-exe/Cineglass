"use client";

import { ChevronDown, Search, X } from "lucide-react";
import { useState } from "react";

const recentSearches = ["90s action", "Korean thrillers", "Comfort shows"];
const searchTypes = [
  { value: "multi", label: "Movies & TV Shows" },
  { value: "movie", label: "Movies" },
  { value: "tv", label: "TV Shows" },
];

export function SearchMenu() {
  const [type, setType] = useState(searchTypes[0]);
  const [open, setOpen] = useState(false);

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
          <form action="/search" className="absolute left-1/2 top-1/2 w-[min(calc(100vw-2rem),44rem)] -translate-x-1/2 -translate-y-1/2">
            <input type="hidden" name="type" value={type.value} />
            <div className="flex items-center justify-between gap-3">
              <h2 id="search-menu-title" className="text-3xl font-bold tracking-tight">Search</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    type="button"
                    aria-label="Search category"
                    aria-expanded={open}
                    onClick={() => setOpen((value) => !value)}
                    className="inline-flex min-w-40 items-center justify-between gap-3 rounded-full border border-white/10 bg-black/58 px-4 py-2.5 text-sm text-slate-100 outline-none transition hover:border-cyan-200/35 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200"
                  >
                    {type.label}
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </button>
                  {open ? (
                    <div className="absolute right-0 top-12 z-10 w-52 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                      {searchTypes.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setType(option);
                            setOpen(false);
                          }}
                          className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200 ${option.value === type.value ? "bg-cyan-200/12 text-cyan-100" : "text-slate-200"}`}
                          aria-pressed={option.value === type.value}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
                <label htmlFor="search-menu-toggle" role="button" tabIndex={0} aria-label="Close search" className="cursor-pointer rounded-full border border-white/10 bg-white/[0.06] p-2.5 transition hover:bg-white/[0.12]">
                  <X className="h-5 w-5" />
                </label>
              </div>
            </div>
            <label className="relative mt-6 block">
              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                name="q"
                autoFocus
                placeholder="Type here to search..."
                className="w-full rounded-full border border-white/12 bg-white/92 py-5 pl-14 pr-5 text-xl text-slate-950 caret-cyan-500 shadow-[0_20px_70px_rgba(0,0,0,0.28)] outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/35"
              />
            </label>
            <div className="mt-5 flex items-center justify-between px-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Recent</p>
              <button type="button" className="text-xs text-slate-400 transition hover:text-white">Clear</button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 px-1">
              {recentSearches.map((search) => (
                <button key={search} type="submit" name="q" value={search} className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-sm text-slate-200 transition hover:bg-white/[0.12]">
                  {search}
                </button>
              ))}
            </div>
          </form>
        </div>
    </div>
  );
}
