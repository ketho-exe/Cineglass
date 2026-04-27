import { AppShell } from "@/components/layout/app-shell";

export const dynamic = "force-dynamic";

export default function MainAppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
