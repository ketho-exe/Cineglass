"use client";

import { cn } from "@/lib/utils";
import { navigationIcons, type NavigationIcon } from "@/lib/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({
  href,
  label,
  icon,
  compact = false,
}: {
  href: string;
  label: string;
  icon: NavigationIcon;
  compact?: boolean;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);
  const Icon = navigationIcons[icon];

  return (
    <Link
      href={href}
      prefetch
      aria-current={active ? "page" : undefined}
      className={cn(
        compact
          ? "flex min-w-0 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200"
          : "flex items-center gap-2 rounded-full px-4 py-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200",
        active
          ? "bg-white text-cine-bg shadow-[0_10px_30px_rgba(255,255,255,0.12)]"
          : "text-slate-300 hover:bg-white/10 hover:text-white",
      )}
    >
      <Icon className={compact ? "h-5 w-5" : "h-4 w-4"} />
      <span className={compact ? "max-w-full truncate" : undefined}>{label}</span>
    </Link>
  );
}
