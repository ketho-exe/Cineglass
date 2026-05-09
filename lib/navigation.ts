import type { LucideIcon } from "lucide-react";
import {
  Clapperboard,
  Clock,
  Compass,
  Edit3,
  Heart,
  History,
  Home,
  Library,
  ListVideo,
  Play,
  Search,
  Settings,
  Shield,
  Sparkles,
  Tv,
  Users,
  Wand2,
} from "lucide-react";

export type NavigationIcon =
  | "admin"
  | "anime"
  | "collections"
  | "compass"
  | "continue"
  | "edit"
  | "favourites"
  | "history"
  | "home"
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
  collections: Library,
  compass: Compass,
  continue: Clock,
  edit: Edit3,
  favourites: Heart,
  history: History,
  home: Home,
  library: Library,
  movies: Clapperboard,
  player: Play,
  rows: ListVideo,
  search: Search,
  settings: Settings,
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
        { href: "/admin/rows", label: "Rows", icon: "rows", description: "Curate home shelves" },
        { href: "/admin/manual-titles", label: "Manual Titles", icon: "edit", description: "Add specific TMDB titles" },
        { href: "/admin/player", label: "Player", icon: "player", description: "Playback provider controls" },
      ]
    : [];

  return {
    primary: [
      { href: "/home", label: "Home", icon: "home", description: "Your cinematic dashboard" },
      { href: "/browse", label: "Browse", icon: "compass", description: "Explore every shelf" },
      { href: "/search", label: "Search", icon: "search", description: "Find anything fast" },
      { href: "/watchlist", label: "Library", icon: "library", description: "Saved titles" },
      { href: "/settings", label: "Settings", icon: "settings", description: "Tune playback and home" },
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
          { href: "/search", label: "Search", icon: "search", description: "Natural language discovery" },
          { href: "/collections", label: "Collections", icon: "collections", description: "Curated groups" },
          { href: "/settings", label: "Watch Party", icon: "watchParty", description: "EmbedMaster shared viewing" },
          { href: "/browse/continue-watching", label: "Continue Watching", icon: "continue", description: "Pick up in progress" },
        ],
      },
      {
        label: "Personal",
        items: [
          { href: "/history", label: "History", icon: "history", description: "Recently watched" },
          { href: "/watchlist", label: "Watchlist", icon: "watchlist", description: "Saved for later" },
          { href: "/browse/favourites", label: "Favourites", icon: "favourites", description: "Loved titles" },
          { href: "/settings", label: "Settings", icon: "settings", description: "Preferences" },
        ],
      },
      ...(adminItems.length ? [{ label: "Admin", items: adminItems }] : []),
    ] satisfies NavigationSection[],
    admin: adminItems,
  };
}
