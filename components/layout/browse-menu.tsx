"use client";

import { getNavigationItems, navigationIcons } from "@/lib/navigation";
import { Compass, X } from "lucide-react";
import Link from "next/link";

export function BrowseMenu({ role }: { role?: string | null }) {
  const navigation = getNavigationItems(role);

  return (
    <div>
      <input id="browse-menu-toggle" type="checkbox" className="peer hidden" />
      <label
        htmlFor="browse-menu-toggle"
        role="button"
        tabIndex={0}
        aria-label="Open browse menu"
        className="inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200"
      >
        <Compass className="h-4 w-4" />
        Browse
      </label>
      <div className="fixed inset-0 z-50 hidden peer-checked:block" role="dialog" aria-modal="true" aria-labelledby="browse-menu-title">
          <label htmlFor="browse-menu-toggle" aria-label="Close browse menu" className="absolute inset-0 cursor-pointer bg-black/65 backdrop-blur-md" />
          <div className="glass absolute left-1/2 top-20 w-[min(calc(100vw-2rem),42rem)] -translate-x-1/2 rounded-[2rem] p-5 shadow-glow sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">Menu</p>
                <h2 id="browse-menu-title" className="mt-1 text-2xl font-bold">Browse</h2>
              </div>
              <label htmlFor="browse-menu-toggle" role="button" tabIndex={0} aria-label="Close browse menu" className="cursor-pointer rounded-full border border-white/10 bg-white/[0.06] p-2 transition hover:bg-white/[0.12]">
                <X className="h-5 w-5" />
              </label>
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              {navigation.browseSections.map((section) => (
                <section key={section.label}>
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{section.label}</h3>
                  <div className="mt-3 grid gap-2">
                    {section.items.map((item) => {
                      const Icon = navigationIcons[item.icon];
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-3 transition hover:border-cyan-200/40 hover:bg-white/[0.1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200"
                        >
                          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-200/10 text-cyan-100">
                            <Icon className="h-5 w-5" />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-white">{item.label}</span>
                            <span className="line-clamp-1 text-xs text-slate-500">{item.description}</span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
}
