import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, access_status")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.access_status !== "approved" || !["owner", "admin"].includes(profile.role)) {
    notFound();
  }

  return { supabase, user, profile };
}
