"use server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { revalidatePath } from "next/cache";

export async function approveUser(formData: FormData) {
  await setAccessStatus(formData, "approved");
}

export async function blockUser(formData: FormData) {
  await setAccessStatus(formData, "blocked");
}

async function setAccessStatus(formData: FormData, accessStatus: "approved" | "blocked") {
  const userId = String(formData.get("userId") ?? "");
  if (!userId) throw new Error("Missing user id");

  const { supabase } = await requireAdmin();
  await supabase
    .from("profiles")
    .update({ access_status: accessStatus })
    .eq("id", userId);

  revalidatePath("/admin");
  revalidatePath("/admin/users");
}
