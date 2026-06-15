import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/bookfy/AppShell";
import { books, categories } from "@/data/books";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/categories")({
  component: CategoriesPage,
  head: () => ({ meta: [{ title: "Categorias — Bookfy" }] }),
});

function CategoriesPage() {
  return (
    <AppShell>
      <header className="px-4 pt-6">
        <div className="text-[10px] uppercase tracking-[0.3em] text-accent">Bookfy</div>
        <h1 className="font-serif text-2xl text-foreground">Categorias</h1>
        <p className="mt-1 text-sm text-muted-foreground">Encontre seu próximo vício literário.</p>
      </header>

      <div className="mt-6 grid grid-cols-1 gap-3 px-4">
        {categories.map((c) => {
          const count = books.filter((b) => b.category === c.slug).length;
          return (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className={`relative flex items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r ${c.gradient} p-5 shadow-lg shadow-black/30 active:scale-[0.99] transition`}
            >
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative">
                <div className="font-serif text-lg leading-tight text-white">{c.name}</div>
                <div className="text-xs text-white/70">{c.description} · {count} livros</div>
              </div>
              <ChevronRight className="relative h-5 w-5 text-white/80" />
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}