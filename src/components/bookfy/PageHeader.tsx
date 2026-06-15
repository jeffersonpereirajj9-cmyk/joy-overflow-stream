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
    <header className="px-4 pt-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          {eyebrow && (
            <div className="text-[10px] uppercase tracking-[0.3em] text-accent">{eyebrow}</div>
          )}
          <h1 className="font-serif text-2xl text-foreground">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action}
      </div>
    </header>
  );
}