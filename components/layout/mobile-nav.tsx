import { createOptionalSupabaseServerClient } from "@/lib/supabase/server";
import { getNavigationItems } from "@/lib/navigation";
import { NavLink } from "@/components/layout/nav-link";

export async function MobileNav() {
  const supabase = await createOptionalSupabaseServerClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const { data: profile } = user && supabase
    ? await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()
    : { data: null };
  const navigation = getNavigationItems(profile?.role);
  const links = navigation.primary;

  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] rounded-[1.6rem] border border-white/[0.12] bg-cine-panel/[0.82] p-2 shadow-glass backdrop-blur-2xl md:hidden">
      {links.map((link) => (
        <NavLink key={link.href} {...link} compact />
      ))}
    </nav>
  );
}
