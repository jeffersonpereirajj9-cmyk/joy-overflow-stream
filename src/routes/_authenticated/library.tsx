import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/bookfy/AppShell";
import { PageHeader } from "@/components/bookfy/PageHeader";
import { DriveBookRow } from "@/components/bookfy/DriveBookRow";
import { categories } from "@/data/books";
import { CATEGORIES, type DriveCategory } from "@/lib/drive.functions";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useDriveLibrary } from "@/hooks/useDriveLibrary";
import { ChevronDown, Folder, Loader2, Search, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/library")({
  component: LibraryPage,
  head: () => ({ meta: [{ title: "Biblioteca completa — Bookfy" }] }),
});

function LibraryPage() {
  const [search, setSearch] = useState("");
  const query = useDebouncedValue(search, 350);
  const { items, grouped, loading, error, nextToken, loadMore } = useDriveLibrary(query);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const toggle = (k: string) => setOpen((p) => ({ ...p, [k]: !p[k] }));

  const catName = (slug: DriveCategory) =>
    categories.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Drive"
        title="Biblioteca completa"
        description="Milhares de títulos disponíveis sob demanda — busque e baixe em EPUB."
      />

      <div className="sticky top-0 z-20 mt-4 bg-background/85 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título ou autor…"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="px-4 pb-8">
        {[...CATEGORIES, "_unsorted" as const].map((slug) => {
          const list = grouped.get(slug);
          if (!list || list.length === 0) return null;
          const isUnsorted = slug === "_unsorted";
          const isOpen = open[slug] ?? false;
          return (
            <section key={slug} className="mt-6">
              <button
                type="button"
                onClick={() => toggle(slug)}
                className="flex w-full items-center gap-2 rounded-xl border border-border bg-card px-3 py-3 text-left font-serif text-base text-foreground active:scale-[0.99]"
              >
                {isUnsorted ? (
                  <Sparkles className="h-4 w-4 animate-pulse text-accent" />
                ) : (
                  <Folder className="h-4 w-4 text-accent" />
                )}
                <span className="flex-1 truncate">
                  {isUnsorted ? "Classificando…" : catName(slug as DriveCategory)}
                </span>
                <span className="text-xs text-muted-foreground">{list.length}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <ul className="mt-1 px-1">
                  {list.map((b) => (
                    <DriveBookRow key={b.id} book={b} />
                  ))}
                </ul>
              )}
            </section>
          );
        })}
        {!loading && items.length === 0 && !error && (
          <p className="py-12 text-center text-sm text-muted-foreground">Nada encontrado.</p>
        )}
        {error && <p className="py-6 text-center text-sm text-destructive">{error}</p>}
        {loading && (
          <div className="flex items-center justify-center py-6 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}
        {nextToken && !loading && (
          <button
            onClick={loadMore}
            className="mt-6 w-full rounded-full border border-border bg-card py-3 text-sm font-medium text-foreground active:scale-95"
          >
            Carregar mais
          </button>
        )}
      </div>
    </AppShell>
  );
}