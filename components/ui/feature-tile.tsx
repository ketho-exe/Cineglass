import { navigationIcons, type NavigationIcon } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function FeatureTile({
  href,
  icon,
  title,
  description,
  className,
}: {
  href: string;
  icon: NavigationIcon;
  title: string;
  description: string;
  className?: string;
}) {
  const Icon = navigationIcons[icon];
  return (
    <Link
      href={href}
      className={cn(
        "group rounded-3xl border border-white/10 bg-black/24 p-5 transition hover:-translate-y-0.5 hover:border-cyan-200/40 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200",
        className,
      )}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-cyan-100 shadow-[0_12px_36px_rgba(34,211,238,0.12)] transition group-hover:border-cyan-200/50">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-slate-400">{description}</p>
    </Link>
  );
}
