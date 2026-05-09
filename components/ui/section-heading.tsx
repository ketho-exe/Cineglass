import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function SectionHeading({
  title,
  subtitle,
  href,
  className,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div>
        <h2 className="text-xl font-semibold text-white sm:text-2xl">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-sm text-cyan-100 transition hover:border-cyan-200/50 hover:bg-cyan-200/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
