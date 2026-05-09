"use client";

import { getNavigationItems, navigationIcons } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { ChevronLeft, Compass, Moon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function BrowsePanel({ role }: { role?: string | null }) {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const navigation = getNavigationItems(role);
  const hiddenOnWatch = pathname.startsWith("/watch/");

  if (hiddenOnWatch && !open) return null;

  return (
    <aside
      className={cn(
        "fixed left-4 top-24 z-30 hidden max-h-[calc(100vh-7rem)] transition md:block",
        hiddenOnWatch ? "pointer-events-none opacity-0" : "opacity-100",
      )}
    >
      <div className={cn("glass w-64 overflow-hidden rounded-3xl p-3 transition-all", !open && "w-14 p-2")}>
        <button
          type="button"
          aria-label={open ? "Collapse browse panel" : "Expand browse panel"}
          onClick={() => setOpen((value) => !value)}
          className="mb-2 flex w-full items-center justify-between rounded-2xl px-2 py-2 text-left text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200"
        >
          <span className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-cyan-200" />
            {open ? "Browse" : null}
          </span>
          {open ? <ChevronLeft className="h-4 w-4 text-slate-400" /> : null}
        </button>
        {open ? (
          <div className="scrollbar-hide max-h-[calc(100vh-12rem)] overflow-y-auto pr-1">
            {navigation.browseSections.map((section) => (
              <div key={section.label} className="mt-4 first:mt-2">
                <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{section.label}</p>
                <div className="mt-2 grid gap-1">
                  {section.items.map((item) => {
                    const Icon = navigationIcons[item.icon];
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200",
                          active ? "bg-white text-cine-bg" : "text-slate-300 hover:bg-white/10 hover:text-white",
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-slate-300">
              <span>Private mode</span>
              <Moon className="h-4 w-4 text-cyan-100" />
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
