"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Camera, KeyRound, LogOut, UserRound, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type ProfileMenuProps = {
  user: {
    id?: string | null;
    email?: string | null;
    createdAt?: string | null;
  };
  profile?: {
    displayName?: string | null;
    avatarUrl?: string | null;
    role?: string | null;
  } | null;
};

export function ProfileMenu({ user, profile }: ProfileMenuProps) {
  const router = useRouter();
  const [passwordState, setPasswordState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [avatarState, setAvatarState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [avatarMessage, setAvatarMessage] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatarUrl ?? "");
  const signedIn = Boolean(user.email);
  const name = profile?.displayName ?? user.email?.split("@")[0] ?? "Guest";
  const created = user.createdAt ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(user.createdAt)) : "Unknown";

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    if (password.length < 6) {
      setPasswordState("error");
      return;
    }
    setPasswordState("saving");
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password });
    setPasswordState(error ? "error" : "saved");
    if (!error) event.currentTarget.reset();
  }

  async function uploadAvatar(file: File) {
    if (!user.id) return;

    setAvatarState("saving");
    setAvatarMessage("");
    const localPreview = URL.createObjectURL(file);
    setAvatarPreview(localPreview);

    const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const filePath = `${user.id}/avatar.${extension}`;
    const supabase = createSupabaseBrowserClient();
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        contentType: file.type || "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      setAvatarState("error");
      setAvatarMessage(uploadError.message);
      URL.revokeObjectURL(localPreview);
      setAvatarPreview(profile?.avatarUrl ?? "");
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const avatarUrl = `${data.publicUrl}?v=${Date.now()}`;
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl })
      .eq("id", user.id);

    URL.revokeObjectURL(localPreview);

    if (profileError) {
      setAvatarState("error");
      setAvatarMessage(profileError.message);
      setAvatarPreview(profile?.avatarUrl ?? "");
      return;
    }

    setAvatarPreview(avatarUrl);
    setAvatarState("saved");
    setAvatarMessage("Avatar saved.");
    router.refresh();
  }

  return (
    <div>
      <input id="profile-menu-toggle" type="checkbox" className="peer hidden" />
      <label
        htmlFor="profile-menu-toggle"
        role="button"
        tabIndex={0}
        aria-label="Open profile menu"
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.08] text-slate-100 transition hover:border-cyan-200/40 hover:bg-white/[0.14] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200"
      >
        {avatarPreview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarPreview} alt="" className="h-full w-full rounded-full object-cover" />
        ) : (
          <UserRound className="h-5 w-5" />
        )}
      </label>
      <div className="fixed inset-0 z-50 hidden peer-checked:block" role="dialog" aria-modal="true" aria-labelledby="profile-menu-title">
          <label htmlFor="profile-menu-toggle" aria-label="Close profile menu" className="absolute inset-0 cursor-pointer bg-black/65 backdrop-blur-md" />
          <aside className="glass absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto rounded-none border-y-0 border-r-0 p-6 shadow-glow sm:rounded-l-[2rem]">
            <div className="flex items-center justify-between gap-4">
              <p id="profile-menu-title" className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">Profile</p>
              <label htmlFor="profile-menu-toggle" role="button" tabIndex={0} aria-label="Close profile menu" className="cursor-pointer rounded-full border border-white/10 bg-white/[0.06] p-2 transition hover:bg-white/[0.12]">
                <X className="h-5 w-5" />
              </label>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/[0.08] text-cyan-100">
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarPreview} alt="" className="h-full w-full object-cover" />
                ) : (
                  <UserRound className="h-8 w-8" />
                )}
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold">{name}</h2>
                <p className="truncate text-sm text-slate-400">{user.email}</p>
              </div>
            </div>

            <dl className="mt-6 grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">Username</dt>
                <dd className="mt-1 text-sm text-slate-100">{name}</dd>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">Created</dt>
                <dd className="mt-1 text-sm text-slate-100">{created}</dd>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">Role</dt>
                <dd className="mt-1 text-sm capitalize text-slate-100">{profile?.role ?? "member"}</dd>
              </div>
            </dl>

            {signedIn ? (
            <label className="mt-6 flex cursor-pointer items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.14]">
              <Camera className="h-4 w-4" />
              {avatarState === "saving" ? "Uploading..." : "Upload avatar"}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void uploadAvatar(file);
                  event.target.value = "";
                }}
              />
            </label>
            ) : null}
            {avatarState === "saved" ? <p className="mt-2 text-xs text-cyan-200">{avatarMessage}</p> : null}
            {avatarState === "error" ? <p className="mt-2 text-xs text-rose-200">Avatar upload failed: {avatarMessage}</p> : null}

            {signedIn ? (
            <form onSubmit={changePassword} className="mt-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
              <label className="text-sm font-medium text-slate-200">
                Change password
                <input name="password" type="password" minLength={6} className="mt-2 w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-cyan-200" placeholder="New password" />
              </label>
              <button type="submit" className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-cine-bg">
                <KeyRound className="h-4 w-4" />
                Save password
              </button>
              {passwordState === "saving" ? <p className="mt-2 text-xs text-slate-400">Saving...</p> : null}
              {passwordState === "saved" ? <p className="mt-2 text-xs text-cyan-200">Password updated.</p> : null}
              {passwordState === "error" ? <p className="mt-2 text-xs text-rose-200">Use at least six characters.</p> : null}
            </form>
            ) : null}

            {signedIn ? (
            <form action="/auth/logout" method="post" className="mt-4">
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-rose-200/20 bg-rose-400/12 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </form>
            ) : null}
          </aside>
        </div>
    </div>
  );
}
