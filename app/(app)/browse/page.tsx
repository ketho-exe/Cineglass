import { FeatureTile } from "@/components/ui/feature-tile";
import { SectionHeading } from "@/components/ui/section-heading";
import { getNavigationItems } from "@/lib/navigation";
import { createOptionalSupabaseServerClient } from "@/lib/supabase/server";
import { Home, Search, UserRound } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BrowsePage() {
  const supabase = await createOptionalSupabaseServerClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const { data: profile } = user && supabase
    ? await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()
    : { data: null };
  const navigation = getNavigationItems(profile?.role);
  const sections = navigation.browseSections;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 p-6 shadow-glow sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(34,211,238,0.18),transparent_24rem),radial-gradient(circle_at_86%_14%,rgba(139,92,246,0.16),transparent_24rem)]" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">Browse</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Browse CineGlass</h1>
            <p className="mt-3 max-w-2xl text-slate-300">Find movies, shows, anime, collections, and saved shelves.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/search" aria-label="Search" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] text-white transition hover:border-cyan-200/40 hover:bg-white/[0.14]">
              <Search className="h-5 w-5" />
            </Link>
            <Link href="/home" aria-label="Home" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] text-white transition hover:border-cyan-200/40 hover:bg-white/[0.14]">
              <Home className="h-5 w-5" />
            </Link>
            <Link href="/profile" aria-label="Profile" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] text-white transition hover:border-cyan-200/40 hover:bg-white/[0.14]">
              <UserRound className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {sections.map((section) => (
        <section key={section.label}>
          <SectionHeading title={section.label} />
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {section.items.map((item) => (
              <FeatureTile
                key={`${section.label}-${item.href}-${item.label}`}
                href={item.href}
                icon={item.icon}
                title={item.label}
                description={item.description ?? "Open this CineGlass area"}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
