import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { BrowsePanel } from "@/components/layout/browse-panel";
import { MobileNav } from "@/components/layout/mobile-nav";
import { TopNav } from "@/components/layout/top-nav";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()
    : { data: null };

  return (
    <div className="min-h-screen pb-24 text-slate-50 md:pb-0">
      <TopNav />
      <BrowsePanel role={profile?.role} />
      <Breadcrumbs />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">{children}</main>
      <MobileNav />
    </div>
  );
}
