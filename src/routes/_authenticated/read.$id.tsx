import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { books, sampleChapter } from "@/data/books";
import { ChevronLeft, Minus, Plus, Sun, Moon, Bookmark, BookmarkCheck } from "lucide-react";

export const Route = createFileRoute("/read/$id")({
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
      JSON.stringify({ fontSize, dark, bookmarked }),
    );
  }, [id, fontSize, dark, bookmarked]);

  const bg = dark ? "bg-[#0d0810] text-rose-50" : "bg-[#fdf6f0] text-zinc-900";

  return (
    <div className={`min-h-screen ${bg} transition-colors`}>
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

      <article className="mx-auto max-w-md px-6 py-8" style={{ fontSize, lineHeight: 1.75 }}>
        <h1 className="mb-2 font-serif text-2xl">{book.title}</h1>
        <p className={`mb-8 text-xs ${dark ? "text-white/60" : "text-black/60"}`}>por {book.author}</p>
        <div className="whitespace-pre-line font-serif">{sampleChapter}</div>
        <div className={`mt-12 text-center text-xs ${dark ? "text-white/40" : "text-black/40"}`}>
          — Fim da prévia —
        </div>
      </article>
    </div>
  );
}