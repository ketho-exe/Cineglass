import { Clapperboard, Home, Library, Search, Settings, Shield } from "lucide-react";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NavLink } from "@/components/layout/nav-link";

const baseLinks = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/watchlist", label: "Library", icon: Library },
  { href: "/settings", label: "Settings", icon: Settings },
];

export async function TopNav() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()
    : { data: null };
  const links = ["owner", "admin"].includes(profile?.role ?? "")
    ? [...baseLinks, { href: "/admin", label: "Admin", icon: Shield }]
    : baseLinks;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-cine-bg/72 backdrop-blur-2xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/home" prefetch className="flex items-center gap-2 text-lg font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-cine-bg">
            <Clapperboard className="h-5 w-5" />
          </span>
          CineGlass
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => <NavLink key={link.href} {...link} />)}
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
