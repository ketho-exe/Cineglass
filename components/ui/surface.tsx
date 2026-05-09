import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Surface({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("glass rounded-3xl p-5 sm:p-6", className)} {...props} />;
}
