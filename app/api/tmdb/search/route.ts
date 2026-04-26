import { searchTmdb } from "@/lib/tmdb/client";
import type { MediaType } from "@/types/media";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();
  const type = searchParams.get("type") ?? "multi";
  const page = Number(searchParams.get("page") ?? "1");
  if (!query) return NextResponse.json({ page: 1, results: [], totalPages: 0, totalResults: 0 });
  if (!["multi", "movie", "tv"].includes(type)) {
    return NextResponse.json({ error: "Invalid search type" }, { status: 400 });
  }
  const data = await searchTmdb(query, type as "multi" | MediaType, page);
  return NextResponse.json(data);
}
