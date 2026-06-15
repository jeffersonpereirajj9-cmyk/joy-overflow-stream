import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/bookfy/AppShell";
import { listDriveBooks, type DriveBook } from "@/lib/drive.functions";
import { Download, Loader2, Search, BookOpen } from "lucide-react";

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
  const [items, setItems] = useState<DriveBook[]>([]);
  const [nextToken, setNextToken] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setQuery(search), 350);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setItems([]);
    setNextToken(undefined);
    setLoading(true);
    setError(null);
    listDriveBooks({ data: { search: query } })
      .then((r) => {
        if (cancelled) return;
        setItems(r.files);
        setNextToken(r.nextPageToken);
      })
      .catch((e) => !cancelled && setError(e?.message ?? "Falha ao carregar"))
      .finally(() => !cancelled && setLoading(false));
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
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

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

      <ul className="px-4 pb-8">
        {items.map((b) => {
          const pretty = b.name.replace(/\.mobi$/i, "");
          const dl = `/api/drive/${b.id}?name=${encodeURIComponent(b.name)}`;
          return (
            <li
              key={b.id}
              className="flex items-center gap-3 border-b border-border/60 py-3"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/40 to-accent/30">
                <BookOpen className="h-5 w-5 text-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{pretty}</p>
                <p className="text-xs text-muted-foreground">{formatSize(b.size)} • MOBI</p>
              </div>
              <a
                href={dl}
                className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30 active:scale-95"
                aria-label="Baixar"
              >
                <Download className="h-4 w-4" />
              </a>
            </li>
          );
        })}
        {!loading && items.length === 0 && !error && (
          <li className="py-12 text-center text-sm text-muted-foreground">Nada encontrado.</li>
        )}
        {error && (
          <li className="py-6 text-center text-sm text-destructive">{error}</li>
        )}
        {loading && (
          <li className="flex items-center justify-center py-6 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </li>
        )}
        {nextToken && !loading && (
          <li className="pt-4">
            <button
              onClick={loadMore}
              className="w-full rounded-full border border-border bg-card py-3 text-sm font-medium text-foreground active:scale-95"
            >
              Carregar mais
            </button>
          </li>
        )}
      </ul>
    </AppShell>
  );
}