import type { LucideIcon } from "lucide-react";
import {
  Clapperboard,
  Compass,
  Edit3,
  Heart,
  History,
  Home,
  Library,
  ListVideo,
  Play,
  Search,
  Shield,
  Sparkles,
  Tv,
  Users,
  Wand2,
  CircleUserRound,
} from "lucide-react";

export type NavigationIcon =
  | "admin"
  | "anime"
  | "channels"
  | "collections"
  | "compass"
  | "edit"
  | "favourites"
  | "history"
  | "home"
  | "fourK"
  | "library"
  | "movies"
  | "player"
  | "rows"
  | "search"
  | "settings"
  | "tv"
  | "users"
  | "watchParty"
  | "watchlist";

export type NavigationItem = {
  href: string;
  label: string;
  icon: NavigationIcon;
  description?: string;
};

export type NavigationSection = {
  label: string;
  items: NavigationItem[];
};

export const navigationIcons: Record<NavigationIcon, LucideIcon> = {
  admin: Shield,
  anime: Sparkles,
  channels: ListVideo,
  collections: Library,
  compass: Compass,
  edit: Edit3,
  favourites: Heart,
  fourK: Sparkles,
  history: History,
  home: Home,
  library: Library,
  movies: Clapperboard,
  player: Play,
  rows: ListVideo,
  search: Search,
  settings: CircleUserRound,
  tv: Tv,
  users: Users,
  watchParty: Wand2,
  watchlist: Library,
};

export function isAdminRole(role?: string | null) {
  return role === "owner" || role === "admin";
}

export function getNavigationItems(role?: string | null) {
  const adminItems: NavigationItem[] = isAdminRole(role)
    ? [
        { href: "/admin", label: "Admin", icon: "admin", description: "Operational overview" },
        { href: "/admin/users", label: "Users", icon: "users", description: "Approve and manage access" },
        { href: "/admin/rows", label: "Content Rows", icon: "rows", description: "Curate homepage shelves" },
        { href: "/admin/manual-titles", label: "Manual Titles", icon: "edit", description: "Add specific TMDB titles" },
        { href: "/admin/player", label: "Player", icon: "player", description: "Playback provider controls" },
      ]
    : [];

  return {
    primary: [
      { href: "/browse", label: "Browse", icon: "compass", description: "Explore every shelf" },
      { href: "/search", label: "Search", icon: "search", description: "Find anything fast" },
      { href: "/profile", label: "Profile", icon: "settings", description: "Your account" },
    ] satisfies NavigationItem[],
    browseSections: [
      {
        label: "Content",
        items: [
          { href: "/genre/movie/28", label: "Movies", icon: "movies", description: "Browse film picks and genres" },
          { href: "/genre/tv/18", label: "TV Shows", icon: "tv", description: "Series and long-form stories" },
          { href: "/browse/anime", label: "Anime", icon: "anime", description: "Animated favourites and discoveries" },
        ],
      },
      {
        label: "Features",
        items: [
          { href: "/collections", label: "Channels", icon: "channels", description: "Curated channels and rows" },
          { href: "/browse/top-rated", label: "4K", icon: "fourK", description: "Crisp, high-rated showcase picks" },
          { href: "/settings", label: "Watch Party", icon: "watchParty", description: "EmbedMaster shared viewing" },
        ],
      },
      {
        label: "Personal",
        items: [
          { href: "/history", label: "History", icon: "history", description: "Recently watched" },
          { href: "/watchlist", label: "Watchlist", icon: "watchlist", description: "Saved for later" },
        ],
      },
      ...(adminItems.length ? [{ label: "Admin", items: adminItems }] : []),
    ] satisfies NavigationSection[],
    admin: adminItems,
  };
}
