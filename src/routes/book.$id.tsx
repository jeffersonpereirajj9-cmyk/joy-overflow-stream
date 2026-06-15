import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/bookfy/AppShell";
import { BookCover } from "@/components/bookfy/BookCover";
import { books, categories } from "@/data/books";
import { useFavorites } from "@/hooks/useFavorites";
import { ChevronLeft, Heart, Download, Star, Loader2 } from "lucide-react";
import { downloadEpub } from "@/lib/epub";

export const Route = createFileRoute("/book/$id")({
  component: BookPage,
  loader: ({ params }) => {
    const book = books.find((b) => b.id === params.id);
    if (!book) throw notFound();
    return { book };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.book.title ?? "Livro"} — Bookfy` }],
  }),
});

function BookPage() {
  const { id } = Route.useParams();
  const book = books.find((b) => b.id === id)!;
  const category = categories.find((c) => c.slug === book.category);
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(book.id);
  const [downloading, setDownloading] = useState(false);
  const fileFormat = book.mobiUrl ? "MOBI" : "EPUB";

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadEpub(book);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AppShell>
      <div className={`relative h-72 overflow-hidden bg-gradient-to-br ${book.cover}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-background/20 to-background" />
        <Link
          to="/"
          className="relative z-10 m-4 inline-flex items-center gap-1 rounded-full bg-black/40 px-3 py-1.5 text-xs text-white backdrop-blur"
        >
          <ChevronLeft className="h-4 w-4" /> Voltar
        </Link>
      </div>

      <div className="-mt-32 px-4">
        <div className="flex items-end gap-4">
          <BookCover book={book} className="h-48 w-32 shrink-0 shadow-2xl shadow-black/60" />
          <div className="pb-1">
            {category && (
              <Link
                to="/category/$slug"
                params={{ slug: category.slug }}
                className="inline-block rounded-full bg-primary/20 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent"
              >
                {category.name}
              </Link>
            )}
            <h1 className="mt-2 font-serif text-2xl leading-tight text-foreground">
              {book.title}
            </h1>
            <p className="text-sm text-muted-foreground">{book.author}</p>
            <div className="mt-1 flex items-center gap-1 text-xs text-accent">
              <Star className="h-3.5 w-3.5 fill-accent" /> {book.rating.toFixed(1)}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="font-serif text-base text-foreground">Sinopse</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{book.synopsis}</p>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition active:scale-95 disabled:opacity-70"
          >
            {downloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Preparando…
              </>
            ) : (
              <>
                <Download className="h-4 w-4" /> Baixar {fileFormat}
              </>
            )}
          </button>
          <button
            onClick={() => toggle(book.id)}
            aria-label={fav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            className="grid h-12 w-12 place-items-center rounded-full border border-border bg-card transition active:scale-95"
          >
            <Heart className={`h-5 w-5 transition ${fav ? "fill-primary text-primary" : "text-foreground"}`} />
          </button>
        </div>
      </div>
    </AppShell>
  );
}