import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/bookfy/AppShell";
import { BookCard } from "@/components/bookfy/BookCard";
import { HorizontalScroller } from "@/components/bookfy/HorizontalScroller";
import { CategoryChip } from "@/components/bookfy/CategoryChip";
import { categories } from "@/data/books";
import { COLLECTIONS } from "@/data/collections";
import {
  mostWantedCurated,
  mostReadCurated,
  newestCurated,
  trendingCurated,
  favoritesCurated,
} from "@/data/curated";
import type { Book } from "@/data/books";
import { ChevronRight, Search, Sparkles } from "lucide-react";
import { LazyMount } from "@/components/bookfy/LazyMount";
import { ContinueReading } from "@/components/bookfy/ContinueReading";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Bookfy — Sua biblioteca de romances" },
      { name: "description", content: "Milhares de histórias para se apaixonar. Romance, dark romance, máfia, bilionários e fantasia." },
    ],
  }),
});

function Home() {
  const rows: { title: string; books: Book[] }[] = [
    { title: "🔥 Mais Desejados", books: mostWantedCurated.slice(0, 10) },
    { title: "📖 Mais Lidos", books: mostReadCurated.slice(0, 10) },
    { title: "✨ Novidades", books: newestCurated.slice(0, 10) },
    { title: "📈 Em Alta", books: trendingCurated.slice(0, 10) },
    { title: "💖 Favoritos das Leitoras", books: favoritesCurated.slice(0, 10) },
  ];

  return (
    <AppShell>
      {/* Banner */}
      <header className="relative overflow-hidden px-4 pt-6">
        <div className="absolute inset-x-4 top-6 -z-10 h-64 rounded-3xl bg-gradient-to-br from-primary/40 via-rose-900/60 to-background blur-xl opacity-70" />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-accent">Bookfy</div>
            <div className="text-xs text-muted-foreground">Olá, leitora ✨</div>
          </div>
          <Link
            to="/profile"
            aria-label="Perfil"
            className="grid h-9 w-9 place-items-center rounded-full bg-card/80 text-foreground backdrop-blur active:scale-95"
          >
            <span className="text-xs font-semibold">EU</span>
          </Link>
        </div>

        {/* Quick search shortcut — meta: encontrar livro em <10s */}
        <Link
          to="/search"
          className="mt-4 flex items-center gap-3 rounded-full border border-border/60 bg-card/70 px-4 py-3 text-sm text-muted-foreground shadow-sm backdrop-blur active:scale-[0.99]"
        >
          <Search className="h-4 w-4 text-foreground" />
          <span>Buscar título, autora ou categoria...</span>
        </Link>

        <div className="relative mt-6 overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary via-rose-800 to-black p-5 shadow-xl shadow-primary/20">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute right-6 bottom-4 hidden sm:block">
            <Sparkles className="h-10 w-10 text-accent/70" />
          </div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-accent">Novidade</div>
          <h1 className="mt-2 font-serif text-2xl leading-tight text-white">
            Bem-vinda ao <span className="text-accent">Bookfy</span>
          </h1>
          <p className="mt-1 max-w-[15rem] text-sm text-white/80">
            Milhares de histórias para se apaixonar.
          </p>
          <Link
            to="/categories"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground shadow-lg shadow-accent/30 transition active:scale-95"
          >
            Explorar agora
          </Link>
        </div>
      </header>

      {/* Categories chips */}
      <HorizontalScroller
        className="mt-6"
        title="Categorias"
        action={<Link to="/categories" className="text-xs text-muted-foreground">Ver tudo</Link>}
      >
        {categories.map((c) => (
          <CategoryChip key={c.slug} category={c} />
        ))}
      </HorizontalScroller>

      <ContinueReading />

      {/* Coleções em destaque */}
      {COLLECTIONS.map((col, idx) => {
        const card = (
        <section className="mt-7 px-4">
          <Link
            to="/collection/$slug"
            params={{ slug: col.slug }}
            className="group block overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-rose-900 via-primary/80 to-black p-5 shadow-xl shadow-primary/20 active:scale-[0.98]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.25em] text-accent">
                  Coleção · {col.author}
                </div>
                <h2 className="mt-1 font-serif text-xl leading-tight text-white">
                  {col.title}
                </h2>
                <p className="mt-1 line-clamp-2 text-xs text-white/75">
                  {col.description}
                </p>
              </div>
              <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-white/80 transition group-active:translate-x-0.5" />
            </div>
            <div className="mt-4 flex gap-2 overflow-hidden">
              {col.books.slice(0, 4).map((b) => (
                <div
                  key={b.id}
                  className="aspect-[2/3] w-16 shrink-0 overflow-hidden rounded-md bg-black/40 shadow-lg shadow-black/40 ring-1 ring-white/10"
                >
                  {b.cover ? (
                    <img
                      src={b.cover}
                      alt={b.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
              ))}
              <div className="ml-auto self-end text-[11px] font-medium text-white/80">
                {col.books.length} livros →
              </div>
            </div>
          </Link>
        </section>
        );
        return idx === 0 ? (
          <div key={col.slug}>{card}</div>
        ) : (
          <LazyMount key={col.slug} minHeight={220}>{card}</LazyMount>
        );
      })}

      {rows.map((r, idx) => {
        const row = (
          <HorizontalScroller title={r.title}>
            {r.books.map((b, i) => (
              <BookCard key={b.id} book={b} priority={idx === 0 && i < 2} />
            ))}
          </HorizontalScroller>
        );
        return idx < 2 ? (
          <div key={r.title}>{row}</div>
        ) : (
          <LazyMount key={r.title} minHeight={260}>{row}</LazyMount>
        );
      })}
    </AppShell>
  );
}
