import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { books, sampleChapter } from "@/data/books";
import { ChevronLeft, Minus, Plus, Sun, Moon, Bookmark, BookmarkCheck, ChevronRight } from "lucide-react";
import { EpubReader } from "@/components/bookfy/EpubReader";
import { getBookDownloadOption } from "@/lib/book-downloads";

export const Route = createFileRoute("/_authenticated/read/$id")({
  component: ReadPage,
  loader: ({ params }) => {
    const book = books.find((b) => b.id === params.id);
    if (!book) throw notFound();
    return { book };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Lendo: ${loaderData?.book.title ?? ""} — Bookfy` }],
  }),
});

function ReadPage() {
  const { id } = Route.useParams();
  const book = books.find((b) => b.id === id)!;

  const [fontSize, setFontSize] = useState(17);
  const [dark, setDark] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [progress, setProgress] = useState(0);
  const apiRef = useRef<{ next: () => void; prev: () => void } | null>(null);

  const download = useMemo(() => getBookDownloadOption(book), [book]);
  const epubUrl =
    download && download.formatLabel === "EPUB" ? download.primaryUrl : null;

  useEffect(() => {
    try {
      const s = localStorage.getItem(`bookfy:reader:${id}`);
      if (s) {
        const v = JSON.parse(s);
        if (typeof v.fontSize === "number") setFontSize(v.fontSize);
        if (typeof v.dark === "boolean") setDark(v.dark);
        if (typeof v.bookmarked === "boolean") setBookmarked(v.bookmarked);
      }
    } catch {
      /* noop */
    }
  }, [id]);

  useEffect(() => {
    localStorage.setItem(
      `bookfy:reader:${id}`,
      JSON.stringify({ fontSize, dark, bookmarked, updatedAt: Date.now() }),
    );
  }, [id, fontSize, dark, bookmarked]);

  const bg = dark ? "bg-[#0d0810] text-rose-50" : "bg-[#fdf6f0] text-zinc-900";

  return (
    <div className={`flex h-[100dvh] flex-col ${bg} transition-colors`}>
      <header className={`sticky top-0 z-30 flex items-center justify-between border-b px-4 py-3 backdrop-blur ${dark ? "border-white/10 bg-black/40" : "border-black/5 bg-white/70"}`}>
        <Link to="/book/$id" params={{ id }} className="flex items-center gap-1 text-xs truncate max-w-[40%]">
          <ChevronLeft className="h-4 w-4 shrink-0" />
          <span className="truncate">{book.title}</span>
        </Link>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFontSize((s) => Math.max(13, s - 1))}
            className={`grid h-8 w-8 place-items-center rounded-full ${dark ? "bg-white/10" : "bg-black/5"}`}
            aria-label="Diminuir fonte"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setFontSize((s) => Math.min(26, s + 1))}
            className={`grid h-8 w-8 place-items-center rounded-full ${dark ? "bg-white/10" : "bg-black/5"}`}
            aria-label="Aumentar fonte"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setDark((d) => !d)}
            className={`grid h-8 w-8 place-items-center rounded-full ${dark ? "bg-white/10" : "bg-black/5"}`}
            aria-label="Alternar modo"
          >
            {dark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => setBookmarked((b) => !b)}
            className={`grid h-8 w-8 place-items-center rounded-full ${bookmarked ? "bg-primary text-primary-foreground" : dark ? "bg-white/10" : "bg-black/5"}`}
            aria-label="Marcar página"
          >
            {bookmarked ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
          </button>
        </div>
      </header>

      <main className="relative flex-1 overflow-hidden">
        {epubUrl ? (
          <>
            <EpubReader
              url={epubUrl}
              storageKey={`bookfy:epub-loc:${id}`}
              fontSize={fontSize}
              dark={dark}
              onReady={(api) => (apiRef.current = api)}
              onProgress={({ percentage }) => setProgress(percentage)}
            />
            <button
              aria-label="Página anterior"
              onClick={() => apiRef.current?.prev()}
              className={`absolute left-0 top-0 z-10 h-full w-12 opacity-0 hover:opacity-100 ${dark ? "bg-gradient-to-r from-black/30 to-transparent" : "bg-gradient-to-r from-black/10 to-transparent"} transition-opacity`}
            >
              <ChevronLeft className="mx-auto h-5 w-5" />
            </button>
            <button
              aria-label="Próxima página"
              onClick={() => apiRef.current?.next()}
              className={`absolute right-0 top-0 z-10 h-full w-12 opacity-0 hover:opacity-100 ${dark ? "bg-gradient-to-l from-black/30 to-transparent" : "bg-gradient-to-l from-black/10 to-transparent"} transition-opacity`}
            >
              <ChevronRight className="ml-auto mr-1 h-5 w-5" />
            </button>
          </>
        ) : (
          <article className="mx-auto h-full w-full max-w-md overflow-y-auto px-5 py-8 md:max-w-2xl sm:px-6" style={{ fontSize, lineHeight: 1.75 }}>
            <h1 className="mb-2 font-serif text-2xl">{book.title}</h1>
            <p className={`mb-8 text-xs ${dark ? "text-white/60" : "text-black/60"}`}>por {book.author}</p>
            <div className="whitespace-pre-line font-serif">{sampleChapter}</div>
            <div className={`mt-12 text-center text-xs ${dark ? "text-white/40" : "text-black/40"}`}>
              — Fim da prévia. Baixe o livro completo para ler tudo. —
            </div>
          </article>
        )}
      </main>

      {epubUrl && (
        <footer className={`flex items-center gap-3 border-t px-4 py-2 text-[10px] ${dark ? "border-white/10 bg-black/40 text-white/60" : "border-black/5 bg-white/70 text-black/60"}`}>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-current/20">
            <div
              className="h-full rounded-full gradient-primary transition-all"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <span className="tabular-nums">{Math.round(progress * 100)}%</span>
        </footer>
      )}
    </div>
  );
}