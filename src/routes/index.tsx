import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/bookfy/AppShell";
import { HorizontalScroller } from "@/components/bookfy/HorizontalScroller";
import { CategoryChip } from "@/components/bookfy/CategoryChip";
import { DriveCard } from "@/components/bookfy/DriveCard";
import { categories } from "@/data/books";
import { COLLECTIONS } from "@/data/collections";
import { useDriveLibrary } from "@/hooks/useDriveLibrary";
import { CATEGORIES } from "@/lib/drive.functions";
import { ChevronRight, Loader2, Search, Sparkles } from "lucide-react";

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
  const { items, grouped, loading, error } = useDriveLibrary("");
  const catName = (slug: string) =>
    categories.find((c) => c.slug === slug)?.name ?? slug;

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
          <button className="grid h-9 w-9 place-items-center rounded-full bg-card/80 backdrop-blur">
            <Search className="h-4 w-4 text-foreground" />
          </button>
        </div>

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

      {/* Coleções em destaque */}
      {COLLECTIONS.map((col) => (
        <section key={col.slug} className="mt-7 px-4">
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
      ))}

      {loading && items.length === 0 && (
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Carregando biblioteca…
        </div>
      )}
      {error && (
        <p className="mt-6 px-4 text-center text-sm text-destructive">{error}</p>
      )}
      {items.length > 0 && (
        <div className="mt-7 px-4 text-xs uppercase tracking-[0.25em] text-accent">
          {items.length} livros disponíveis
        </div>
      )}
      {CATEGORIES.map((slug) => {
        const list = grouped.get(slug);
        if (!list || list.length === 0) return null;
        return (
          <HorizontalScroller
            key={slug}
            title={catName(slug)}
            action={
              <Link to="/library" className="text-xs text-muted-foreground">
                Ver todos ({list.length})
              </Link>
            }
          >
            {list.map((it, i) => (
              <DriveCard key={it.id} item={it} priority={i < 3} />
            ))}
          </HorizontalScroller>
        );
      })}
      {grouped.get("_unsorted")?.length ? (
        <HorizontalScroller
          title="Classificando…"
          action={
            <span className="text-xs text-muted-foreground">
              {grouped.get("_unsorted")?.length}
            </span>
          }
        >
          {grouped.get("_unsorted")!.map((it) => (
            <DriveCard key={it.id} item={it} />
          ))}
        </HorizontalScroller>
      ) : null}
    </AppShell>
  );
}
