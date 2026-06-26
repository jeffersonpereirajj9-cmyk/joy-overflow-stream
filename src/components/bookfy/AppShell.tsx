import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function AppShell({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-5xl pb-24">{children}</div>
      {!hideNav && <BottomNav />}
    </div>
  );
}