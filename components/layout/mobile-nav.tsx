import { NavLink } from "@/components/layout/nav-link";

const links = [
  { href: "/home", label: "Home", icon: "home" as const },
  { href: "/search", label: "Search", icon: "search" as const },
  { href: "/watchlist", label: "Library", icon: "library" as const },
  { href: "/settings", label: "Settings", icon: "settings" as const },
];

export function MobileNav() {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 rounded-[1.6rem] border border-white/[0.12] bg-cine-panel/[0.82] p-2 shadow-glass backdrop-blur-2xl md:hidden">
      {links.map((link) => (
        <NavLink key={link.href} {...link} compact />
      ))}
    </nav>
  );
}
