import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/bookfy/AppShell";
import { PageHeader } from "@/components/bookfy/PageHeader";
import { DriveBookRow } from "@/components/bookfy/DriveBookRow";
import { categories, coverFor } from "@/data/books";
import type { Book } from "@/data/books";
import { BookCard } from "@/components/bookfy/BookCard";
import { HorizontalScroller } from "@/components/bookfy/HorizontalScroller";
import { CATEGORIES, type DriveCategory } from "@/lib/drive.functions";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useDriveLibrary } from "@/hooks/useDriveLibrary";
import { Loader2, Search, Sparkles } from "lucide-react";

export const Route = createFileRoute("/library")({
  component: LibraryPage,
  head: () => ({ meta: [{ title: "Biblioteca completa — Bookfy" }] }),
});

const OFF_CAMPUS: Book[] = [
  {
    id: "off-campus-1",
    title: "O Acordo",
    author: "Elle Kennedy",
    category: "romance",
    rating: 4.7,
    synopsis:
      "Hannah Wells nunca imaginou fechar um acordo com Garrett Graham, o astro do hóquei — aulas em troca de ciúmes calculados.",
    tags: ["new"],
    cover: coverFor("9") ?? "",
  },
  {
    id: "off-campus-2",
    title: "O Erro",
    author: "Elle Kennedy",
    category: "romance",
    rating: 4.6,
    synopsis:
      "John Logan está prestes a se formar quando comete o pior erro possível: se apaixonar pela namorada do melhor amigo.",
    tags: ["new"],
    cover: coverFor("10") ?? "",
  },
  {
    id: "off-campus-3",
    title: "O Jogo",
    author: "Elle Kennedy",
    category: "romance",
    rating: 4.7,
    synopsis:
      "Allie Hayes precisa de distração depois do término — Dean Di Laurentis é o tipo errado de cara, mas o jogo já começou.",
    tags: ["trending"],
    cover: coverFor("11") ?? "",
  },
  {
    id: "off-campus-4",
    title: "A Conquista",
    author: "Elle Kennedy",
    category: "romance",
    rating: 4.8,
    synopsis:
      "Sabrina James não tem tempo para romance — até que Tucker, o tranquilão do time de hóquei, decide conquistá-la.",
    tags: ["top"],
    cover: coverFor("12") ?? "",
  },
];

function LibraryPage() {
  const [search, setSearch] = useState("");
  const query = useDebouncedValue(search, 350);
  const { items, grouped, loading, error, nextToken, loadMore } = useDriveLibrary(query);

  const catName = (slug: DriveCategory) =>
    categories.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Drive"
        title="Biblioteca completa"
        description="Milhares de títulos disponíveis sob demanda — busque e baixe em MOBI."
      />

      <HorizontalScroller
        title="Série Off-Campus — Elle Kennedy"
        action={<span className="text-xs text-muted-foreground">4 livros</span>}
        className="mt-6"
      >
        {OFF_CAMPUS.map((b, i) => (
          <BookCard key={b.id} book={b} size="md" priority={i < 2} />
        ))}
      </HorizontalScroller>

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
          return (
            <section key={slug} className="mt-6">
              <h2 className="mb-2 flex items-center gap-2 font-serif text-lg text-foreground">
                {isUnsorted ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-pulse text-accent" /> Classificando…
                  </>
                ) : (
                  catName(slug as DriveCategory)
                )}
                <span className="text-xs text-muted-foreground">({list.length})</span>
              </h2>
              <ul>
                {list.map((b) => (
                  <DriveBookRow key={b.id} book={b} />
                ))}
              </ul>
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