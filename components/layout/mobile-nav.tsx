import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getNavigationItems } from "@/lib/navigation";
import { NavLink } from "@/components/layout/nav-link";

export async function MobileNav() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()
    : { data: null };
  const navigation = getNavigationItems(profile?.role);
  const links = [...navigation.primary.slice(0, 4), ...navigation.admin.slice(0, 1)].slice(0, 5);

  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] rounded-[1.6rem] border border-white/[0.12] bg-cine-panel/[0.82] p-2 shadow-glass backdrop-blur-2xl md:hidden">
      {links.map((link) => (
        <NavLink key={link.href} {...link} compact />
      ))}
    </nav>
  );
}
