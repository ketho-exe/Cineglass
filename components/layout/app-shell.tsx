import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { MobileNav } from "@/components/layout/mobile-nav";
import { TopNav } from "@/components/layout/top-nav";

export async function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-24 text-slate-50 md:pb-0">
      <TopNav />
      <Breadcrumbs />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">{children}</main>
      <MobileNav />
    </div>
  );
}
