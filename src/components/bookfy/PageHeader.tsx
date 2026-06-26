import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="px-4 pt-7 pb-2">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {eyebrow && (
            <div className="mb-1 inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.32em] text-accent">
              <span className="inline-block h-1 w-1 rounded-full bg-accent" />
              {eyebrow}
            </div>
          )}
          <h1 className="font-serif text-[28px] leading-[1.1] tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}