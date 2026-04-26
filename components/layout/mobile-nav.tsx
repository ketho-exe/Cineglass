import { Home, Library, Search, Settings } from "lucide-react";
import Link from "next/link";

const links = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/watchlist", label: "Library", icon: Library },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 rounded-[1.6rem] border border-white/15 bg-zinc-950/80 p-2 shadow-glow backdrop-blur-2xl md:hidden">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] text-slate-300"
        >
          <link.icon className="h-5 w-5" />
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
