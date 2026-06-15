import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/bookfy/AppShell";
import { BookCard } from "@/components/bookfy/BookCard";
import { books, categories } from "@/data/books";
import { Search, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Bookfy — Sua biblioteca de romances" },
      { name: "description", content: "Milhares de histórias para se apaixonar. Romance, dark romance, máfia, bilionários e fantasia." },
    ],
  }),
});

function Section({ title, books: list }: { title: string; books: typeof books }) {
  return (
    <section className="mt-7">
      <div className="mb-3 flex items-end justify-between px-4">
        <h2 className="font-serif text-lg text-foreground">{title}</h2>
        <span className="text-xs text-muted-foreground">Ver tudo</span>
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-2">
        {list.map((b) => <BookCard key={b.id} book={b} />)}
      </div>
    </section>
  );
}

function Home() {
  const mostRead = books.filter((b) => b.tags?.includes("top"));
  const newest = books.filter((b) => b.tags?.includes("new"));
  const trending = books.filter((b) => b.tags?.includes("trending"));
  const readerFavs = books.filter((b) => b.tags?.includes("favorites"));

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
      <section className="mt-6">
        <div className="mb-3 flex items-end justify-between px-4">
          <h2 className="font-serif text-lg text-foreground">Categorias</h2>
          <Link to="/categories" className="text-xs text-muted-foreground">Ver tudo</Link>
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className={`relative h-20 w-40 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br ${c.gradient} p-3 shadow-lg shadow-black/30`}
            >
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative font-serif text-sm leading-tight text-white">
                {c.name}
              </div>
              <div className="relative mt-1 text-[10px] text-white/70">{c.description}</div>
            </Link>
          ))}
        </div>
      </section>

      <Section title="Mais Lidos" books={mostRead} />
      <Section title="Novidades" books={newest} />
      <Section title="Em Alta" books={trending} />
      <Section title="Favoritos das Leitoras" books={readerFavs} />
    </AppShell>
  );
}
