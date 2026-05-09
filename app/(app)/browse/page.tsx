import { FeatureTile } from "@/components/ui/feature-tile";
import { LinkButton } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireUser } from "@/lib/auth/require-user";
import { getNavigationItems } from "@/lib/navigation";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BrowsePage() {
  const { supabase, user } = await requireUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  const navigation = getNavigationItems(profile?.role);
  const sections = [
    {
      label: "Content",
      items: [
        ...navigation.browseSections[0].items,
        { href: "/browse/top-rated", label: "Top Rated", icon: "favourites" as const, description: "Highly rated picks from TMDB" },
        { href: "/browse/trending-movies", label: "Trending", icon: "rows" as const, description: "Popular movies and series right now" },
      ],
    },
    navigation.browseSections[1],
    { label: "Your Library", items: navigation.browseSections[2].items },
    ...navigation.browseSections.slice(3),
  ];

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
          <LinkButton href="/search" variant="glass" className="w-fit">
            <Search className="h-4 w-4" />
            Search CineGlass
          </LinkButton>
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
