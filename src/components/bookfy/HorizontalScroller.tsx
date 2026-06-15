import type { ReactNode } from "react";

export function HorizontalScroller({
  title,
  action,
  children,
  className = "mt-7",
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      {(title || action) && (
        <div className="mb-3 flex items-end justify-between px-4">
          {title ? <h2 className="font-serif text-lg text-foreground">{title}</h2> : <span />}
          {action ?? <span className="text-xs text-muted-foreground">Ver tudo</span>}
        </div>
      )}
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-2">{children}</div>
    </section>
  );
}