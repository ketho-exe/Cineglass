import type { NormalisedMedia } from "@/types/media";

export function getHeroItems(items: NormalisedMedia[]) {
  return items.slice(0, 5);
}
