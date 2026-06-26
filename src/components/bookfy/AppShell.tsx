import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function AppShell({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  return (
    <div className="relative min-h-dvh mesh-bg text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
      <div className="relative mx-auto w-full max-w-md md:max-w-3xl lg:max-w-5xl pb-28">{children}</div>
      {!hideNav && <BottomNav />}
    </div>
  );
}