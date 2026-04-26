import { Clapperboard, Home, Library, Search, Settings, Shield } from "lucide-react";
import Link from "next/link";

const links = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/watchlist", label: "Library", icon: Library },
  { href: "/admin", label: "Admin", icon: Shield },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-cine-bg/72 backdrop-blur-2xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/home" className="flex items-center gap-2 text-lg font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-cine-bg">
            <Clapperboard className="h-5 w-5" />
          </span>
          CineGlass
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
          <form action="/auth/logout" method="post">
            <button className="rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white">
              Sign out
            </button>
          </form>
        </div>
      </nav>
    </header>
  );
}
