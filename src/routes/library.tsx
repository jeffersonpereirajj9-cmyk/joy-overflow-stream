import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/bookfy/AppShell";
import { categories } from "@/data/books";
import {
  listDriveBooks,
  enrichDriveBooks,
  CATEGORIES,
  type DriveCategory,
} from "@/lib/drive.functions";
import { Download, Loader2, Search, BookOpen, Sparkles } from "lucide-react";

type Item = {
  id: string;
  name: string;
  size: number;
  title?: string;
  author?: string;
  category?: DriveCategory;
  synopsis?: string;
  enriching?: boolean;
};

export const Route = createFileRoute("/library")({
  component: LibraryPage,
  head: () => ({ meta: [{ title: "Biblioteca completa — Bookfy" }] }),
});

function formatSize(bytes: number) {
  if (!bytes) return "";
  const mb = bytes / 1024 / 1024;
  return mb < 1 ? `${Math.round(bytes / 1024)} KB` : `${mb.toFixed(1)} MB`;
}

function LibraryPage() {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [nextToken, setNextToken] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setQuery(search), 350);
    return () => clearTimeout(id);
  }, [search]);

  const enrichBatch = async (batch: Item[]) => {
    if (batch.length === 0) return;
    const ids = new Set(batch.map((b) => b.id));
    setItems((prev) =>
      prev.map((it) => (ids.has(it.id) ? { ...it, enriching: true } : it)),
    );
    try {
      const r = await enrichDriveBooks({
        data: { books: batch.map((b) => ({ id: b.id, name: b.name })) },
      });
      const byId = new Map(r.books.map((b) => [b.id, b]));
      setItems((prev) =>
        prev.map((it) => {
          const e = byId.get(it.id);
          if (!e) return { ...it, enriching: false };
          return {
            ...it,
            enriching: false,
            title: e.title,
            author: e.author,
            category: e.category,
            synopsis: e.synopsis,
          };
        }),
      );
    } catch {
      setItems((prev) =>
        prev.map((it) => (ids.has(it.id) ? { ...it, enriching: false } : it)),
      );
    }
  };

  useEffect(() => {
    let cancelled = false;
    setItems([]);
    setNextToken(undefined);
    setLoading(true);
    setError(null);
    listDriveBooks({ data: { search: query } })
      .then(async (r) => {
        if (cancelled) return;
        setItems(r.files);
        setNextToken(r.nextPageToken);
        setLoading(false);
        await enrichBatch(r.files);
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e?.message ?? "Falha ao carregar");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  const loadMore = async () => {
    if (!nextToken || loading) return;
    setLoading(true);
    try {
      const r = await listDriveBooks({ data: { search: query, pageToken: nextToken } });
      setItems((prev) => [...prev, ...r.files]);
      setNextToken(r.nextPageToken);
      setLoading(false);
      await enrichBatch(r.files);
    } catch (e) {
      setError((e as Error).message);
      setLoading(false);
    }
  };

  const grouped = useMemo(() => {
    const map = new Map<DriveCategory | "_unsorted", Item[]>();
    for (const it of items) {
      const k = (it.category ?? "_unsorted") as DriveCategory | "_unsorted";
      const arr = map.get(k) ?? [];
      arr.push(it);
      map.set(k, arr);
    }
    return map;
  }, [items]);

  const catName = (slug: DriveCategory) =>
    categories.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <AppShell>
      <header className="px-4 pt-6">
        <p className="text-[10px] uppercase tracking-[0.2em] text-accent">Drive</p>
        <h1 className="mt-1 font-serif text-2xl text-foreground">Biblioteca completa</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Milhares de títulos disponíveis sob demanda — busque e baixe em MOBI.
        </p>
      </header>

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
                {list.map((b) => {
                  const fallback = b.name.replace(/\.mobi$/i, "");
                  const dl = `/api/drive/${b.id}?name=${encodeURIComponent(b.name)}`;
                  return (
                    <li key={b.id} className="flex gap-3 border-b border-border/60 py-3">
                      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/40 to-accent/30">
                        <BookOpen className="h-5 w-5 text-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {b.title ?? fallback}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {b.author ?? "—"} • {formatSize(b.size)}
                        </p>
                        {b.synopsis ? (
                          <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                            {b.synopsis}
                          </p>
                        ) : b.enriching ? (
                          <p className="mt-1 text-xs italic text-muted-foreground">
                            Gerando sinopse…
                          </p>
                        ) : null}
                      </div>
                      <a
                        href={dl}
                        className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30 active:scale-95"
                        aria-label="Baixar"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </li>
                  );
                })}
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