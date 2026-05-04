import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-cine-accent text-cine-bg shadow-[0_12px_36px_rgba(34,211,238,0.24)] hover:bg-cyan-200",
  glass: "glass text-white hover:border-cine-accent/40 hover:bg-white/[0.14]",
  danger: "bg-rose-400/18 text-rose-100 hover:bg-rose-400/28",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: keyof typeof variants;
};

export function LinkButton({ className, variant = "primary", href, ...props }: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

type SubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export function SubmitButton({ className, variant = "primary", ...props }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
