import { type ReactNode } from "react";

/**
 * SSR-safe deferred mount.
 *
 * Renders `children` on every pass (server + client first paint) to guarantee
 * hydration-stable output — no IntersectionObserver gate that could wipe
 * SSR'd content. Uses `content-visibility: auto` so the browser still skips
 * off-screen layout/paint work, preserving the performance win without any
 * hydration risk.
 */
export function LazyMount({
  children,
  minHeight = 320,
}: {
  children: ReactNode;
  minHeight?: number;
}) {
  return (
    <div
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: `${minHeight}px`,
      }}
    >
      {children}
    </div>
  );
}