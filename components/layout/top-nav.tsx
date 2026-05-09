import { Clapperboard } from "lucide-react";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NavLink } from "@/components/layout/nav-link";
import { getNavigationItems } from "@/lib/navigation";

export async function TopNav() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()
    : { data: null };
  const navigation = getNavigationItems(profile?.role);
  const links = [...navigation.primary, ...navigation.admin.slice(0, 1)];

  return (
    <header className="glass-nav sticky top-0 z-40">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/home" prefetch className="flex items-center gap-2 text-lg font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cine-accent text-cine-bg shadow-[0_12px_32px_rgba(34,211,238,0.25)]">
            <Clapperboard className="h-5 w-5" />
          </span>
          CineGlass
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => <NavLink key={link.href} {...link} />)}
          <form action="/auth/logout" method="post">
            <button className="rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200">
              Sign out
            </button>
          </form>
        </div>
      </nav>
    </header>
  );
}
