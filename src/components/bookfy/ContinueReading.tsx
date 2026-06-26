import { Link } from "@tanstack/react-router";
import { useContinueReading } from "@/hooks/useReadingActivity";
import { BookOpen } from "lucide-react";

export function ContinueReading() {
  const items = useContinueReading(8);
  if (items.length === 0) return null;
  return (
    <section className="mt-7 px-4 animate-fade-in">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-serif text-lg text-foreground">
          <BookOpen className="h-4 w-4 text-accent" /> Continue lendo
        </h2>
      </div>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">
        {items.map(({ book }) => (
          <Link
            key={book.id}
            to="/read/$id"
            params={{ id: book.id }}
            className="group w-40 shrink-0 rounded-2xl border border-border/60 bg-card/70 p-3 backdrop-blur soft-shadow hover-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            <div className="aspect-[2/3] w-full overflow-hidden rounded-xl bg-black/40">
              {book.cover ? (
                <img
                  src={book.cover}
                  alt={book.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                />
              ) : null}
            </div>
            <div className="mt-2 line-clamp-2 text-xs font-medium text-foreground">{book.title}</div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-1/3 rounded-full gradient-primary" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}