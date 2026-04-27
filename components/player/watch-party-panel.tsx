"use client";

import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { MediaType } from "@/types/media";
import { Pause, Play, Radio } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type WatchPartyPanelProps = {
  mediaType: MediaType;
  tmdbId: number;
  seasonNumber?: number;
  episodeNumber?: number;
  roomCode?: string;
};

type Party = {
  room_code: string;
  host_id: string;
  state: { command?: string; position?: number; issuedAt?: string } | null;
};

export function WatchPartyPanel(props: WatchPartyPanelProps) {
  const [party, setParty] = useState<Party | null>(null);
  const [userId, setUserId] = useState<string>();
  const [joinCode, setJoinCode] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    void supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id));
    if (!props.roomCode) return;

    void supabase
      .from("watch_parties")
      .select("room_code, host_id, state")
      .eq("room_code", props.roomCode)
      .maybeSingle()
      .then(({ data }) => setParty(data as Party | null));

    const channel = supabase
      .channel(`watch-party-panel-${props.roomCode}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "watch_parties", filter: `room_code=eq.${props.roomCode}` }, (payload) => {
        setParty(payload.new as Party);
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [props.roomCode]);

  async function createParty() {
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const roomCode = Math.random().toString(36).slice(2, 8).toUpperCase();
    await supabase.from("watch_parties").insert({
      room_code: roomCode,
      host_id: user.id,
      tmdb_id: props.tmdbId,
      media_type: props.mediaType,
      season_number: props.mediaType === "tv" ? props.seasonNumber : null,
      episode_number: props.mediaType === "tv" ? props.episodeNumber : null,
    });
    navigateToRoom(roomCode);
  }

  function joinParty() {
    if (joinCode.trim()) navigateToRoom(joinCode.trim().toUpperCase());
  }

  function navigateToRoom(roomCode: string) {
    const params = new URLSearchParams(searchParams);
    params.set("party", roomCode);
    router.replace(`${pathname}?${params.toString()}`);
  }

  async function send(command: string) {
    if (!props.roomCode) return;
    const supabase = createSupabaseBrowserClient();
    const state = { command, issuedAt: new Date().toISOString() };
    const { data, error } = await supabase
      .from("watch_parties")
      .update({ state })
      .eq("room_code", props.roomCode)
      .eq("host_id", userId)
      .select("room_code")
      .maybeSingle();

    if (!error && data) {
      const channel = supabase.channel(`watch-party-${props.roomCode}`);
      await new Promise<void>((resolve) => {
        channel.subscribe(() => resolve());
        window.setTimeout(resolve, 500);
      });
      await channel.send({ type: "broadcast", event: "sync", payload: state });
      void supabase.removeChannel(channel);
    }
  }

  const isHost = Boolean(userId && party?.host_id === userId);

  return (
    <section className="glass rounded-3xl p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-emerald-200"><Radio className="h-4 w-4" /> Watch Party</p>
          <h2 className="mt-2 text-xl font-semibold">{props.roomCode ? `Room ${props.roomCode}` : "Watch together"}</h2>
          <p className="mt-1 text-sm text-slate-300">When the host plays, pauses, or seeks in the player, guests receive the same command.</p>
        </div>
        {props.roomCode ? (
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={() => navigator.clipboard?.writeText(window.location.href)} variant="glass">Copy Link</Button>
            <Button type="button" onClick={() => send("play")} disabled={!isHost}><Play className="h-4 w-4" />Play</Button>
            <Button type="button" onClick={() => send("pause")} disabled={!isHost} variant="glass"><Pause className="h-4 w-4" />Pause</Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="button" onClick={createParty}>Host Room</Button>
            <input value={joinCode} onChange={(event) => setJoinCode(event.target.value)} placeholder="Room code" className="rounded-full border border-white/10 bg-white/10 px-4 py-3 text-white outline-none" />
            <Button type="button" onClick={joinParty} variant="glass">Join</Button>
          </div>
        )}
      </div>
    </section>
  );
}
