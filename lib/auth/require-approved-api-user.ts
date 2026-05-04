import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireApprovedApiUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false as const, status: 401, error: "Authentication required" };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("access_status")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return { ok: false as const, status: 500, error: error.message };
  }
  if (profile?.access_status !== "approved") {
    return { ok: false as const, status: 403, error: "Approved access required" };
  }

  return { ok: true as const, supabase, user };
}
