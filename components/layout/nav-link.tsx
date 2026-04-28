"use client";

import { cn } from "@/lib/utils";
import { Home, Library, Search, Settings, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const icons = {
  home: Home,
  library: Library,
  search: Search,
  settings: Settings,
  shield: Shield,
};

export type NavIcon = keyof typeof icons;

export function NavLink({
  href,
  label,
  icon,
  compact = false,
}: {
  href: string;
  label: string;
  icon: NavIcon;
  compact?: boolean;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);
  const Icon = icons[icon];

  return (
    <Link
      href={href}
      prefetch
      className={cn(
        compact
          ? "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] transition"
          : "flex items-center gap-2 rounded-full px-4 py-2 text-sm transition",
        active
          ? "bg-white text-cine-bg shadow-[0_10px_30px_rgba(255,255,255,0.12)]"
          : "text-slate-300 hover:bg-white/10 hover:text-white",
      )}
    >
      <Icon className={compact ? "h-5 w-5" : "h-4 w-4"} />
      {label}
    </Link>
  );
}
