import { Clapperboard } from "lucide-react";
import Link from "next/link";
import { createOptionalSupabaseServerClient } from "@/lib/supabase/server";
import { ProfileMenu } from "@/components/layout/profile-menu";
import { BrowseMenu } from "@/components/layout/browse-menu";
import { SearchMenu } from "@/components/layout/search-menu";

export async function TopNav() {
  const supabase = await createOptionalSupabaseServerClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const { data: profile } = user && supabase
    ? await supabase.from("profiles").select("display_name, avatar_url, role").eq("id", user.id).maybeSingle()
    : { data: null };

  return (
    <header className="sticky top-0 z-40 -mb-14 bg-gradient-to-b from-black via-black/86 to-transparent">
      <nav className="mx-auto flex max-w-7xl items-start justify-between gap-4 px-4 pb-9 pt-4 sm:px-6 md:items-center">
        <Link href="/home" prefetch className="flex min-w-0 items-center gap-3 text-lg font-semibold">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-cine-bg shadow-[0_12px_32px_rgba(255,255,255,0.16)]">
            <Clapperboard className="h-5 w-5" />
          </span>
          <span className="truncate">CineGlass</span>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <BrowseMenu role={profile?.role} />
          <SearchMenu />
          <ProfileMenu
            user={{ id: user?.id, email: user?.email, createdAt: user?.created_at }}
            profile={{ displayName: profile?.display_name, avatarUrl: profile?.avatar_url, role: profile?.role }}
          />
        </div>
      </nav>
    </header>
  );
}
