import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/bookfy/AppShell";
import { BookCover } from "@/components/bookfy/BookCover";
import { books, categories } from "@/data/books";
import type { Book } from "@/data/books";
import { ArrowLeft, Search, X, Clock, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_authenticated/search")({
  component: SearchPage,
  head: () => ({ meta: [{ title: "Buscar — Bookfy" }] }),
});

const RECENT_KEY = "bookfy_recent_searches";
const MAX_RECENT = 6;

function loadRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function SearchPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    setRecent(loadRecent());
    // Auto focus on mount
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, []);

  const results = useMemo<Book[]>(() => {
    const term = normalize(q.trim());
    if (term.length < 1) return [];
    return books
      .filter((b) => {
        const hay = normalize(`${b.title} ${b.author} ${b.category}`);
        return hay.includes(term);
      })
      .slice(0, 60);
  }, [q]);

  const saveRecent = (term: string) => {
    const t = term.trim();
    if (!t) return;
    const next = [t, ...recent.filter((r) => r.toLowerCase() !== t.toLowerCase())].slice(0, MAX_RECENT);
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const clearRecent = () => {
    setRecent([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {
      /* ignore */
    }
  };

  const popular = categories.slice(0, 8);

  return (
    <AppShell>
      <div className="sticky top-0 z-30 -mx-0 border-b border-border/40 bg-background/85 backdrop-blur-xl">
        <div className="flex items-center gap-2 px-3 py-3">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            aria-label="Voltar"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-foreground/80 active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <label className="relative flex flex-1 items-center">
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveRecent(q);
              }}
              type="search"
              inputMode="search"
              placeholder="Buscar título, autora ou categoria..."
              className="w-full rounded-full border border-border/60 bg-card/80 py-2.5 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none focus:border-primary/60"
            />
            {q && (
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  inputRef.current?.focus();
                }}
                aria-label="Limpar"
                className="absolute right-2 grid h-7 w-7 place-items-center rounded-full text-muted-foreground active:scale-90"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </label>
        </div>
      </div>

      {q.trim().length === 0 ? (
        <div className="px-4 pt-5">
          {recent.length > 0 && (
            <section>
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Clock className="h-4 w-4 text-muted-foreground" /> Buscas recentes
                </h2>
                <button
                  type="button"
                  onClick={clearRecent}
                  className="text-[11px] text-muted-foreground active:text-foreground"
                >
                  Limpar
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {recent.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setQ(r)}
                    className="rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-xs text-foreground/90 active:scale-95"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="mt-7">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <TrendingUp className="h-4 w-4 text-muted-foreground" /> Explore por categoria
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {popular.map((c) => (
                <Link
                  key={c.slug}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${c.gradient} p-4 text-left shadow-md shadow-black/30 active:scale-[0.98]`}
                >
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="relative font-serif text-base leading-tight text-white">{c.name}</div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="px-4 pt-4">
          <div className="text-xs text-muted-foreground">
            {results.length === 0
              ? "Nada encontrado. Tente outro termo."
              : `${results.length} resultado${results.length === 1 ? "" : "s"} para "${q.trim()}"`}
          </div>

          {results.length > 0 && (
            <ul className="mt-3 divide-y divide-border/40">
              {results.map((b) => (
                <li key={b.id}>
                  <Link
                    to="/book/$id"
                    params={{ id: b.id }}
                    onClick={() => saveRecent(q)}
                    className="flex items-center gap-3 py-2.5 active:bg-card/60"
                  >
                    <div className="h-16 w-12 shrink-0 overflow-hidden rounded-md bg-card">
                      <BookCover book={b} className="!h-16 !w-12" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-foreground">{b.title}</div>
                      <div className="truncate text-xs text-muted-foreground">{b.author}</div>
                      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-accent/80">
                        {b.category}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </AppShell>
  );
}