import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/bookfy/AppShell";
import { BookCover } from "@/components/bookfy/BookCover";
import { books, categories } from "@/data/books";
import { useFavorites } from "@/hooks/useFavorites";
import { ChevronLeft, Heart, Download, Star, Loader2, FileType2, Share2 } from "lucide-react";
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
  const [converting, setConverting] = useState(false);
  const [sendingKindle, setSendingKindle] = useState(false);
  const fileFormat = book.mobiUrl ? "MOBI" : "EPUB";
  const canConvert = !!book.mobiUrl && book.mobiUrl.startsWith("/api/drive/");
  const canSendKindle = !!book.epubUrl || canConvert;

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadEpub(book);
    } finally {
      setDownloading(false);
    }
  };

  const handleConvert = () => {
    if (converting || !book.mobiUrl) return;
    setConverting(true);
    // Drive URL: /api/drive/<id>?name=<name> → convert endpoint: /api/drive/<id>/epub?name=<name>
    const url = book.mobiUrl.replace(/^\/api\/drive\/([^/?]+)/, "/api/drive/$1/epub");
    window.location.href = url;
    // Reset the spinner shortly after; the browser handles the download.
    setTimeout(() => setConverting(false), 4000);
  };

  const handleSendKindle = async () => {
    if (sendingKindle) return;
    setSendingKindle(true);
    try {
      let epubUrl: string;
      let filename: string;
      if (book.epubUrl) {
        epubUrl = book.epubUrl;
        filename = `${book.title}.epub`.replace(/[/\\?%*:|"<>]/g, "-");
      } else if (book.mobiUrl) {
        const m = book.mobiUrl.match(/^\/api\/drive\/([^/?]+)\?name=(.+)$/);
        if (!m) throw new Error("URL do MOBI inválida");
        epubUrl = `/api/drive/${m[1]}/epub?name=${m[2]}`;
        filename = decodeURIComponent(m[2]).replace(/\.mobi$/i, ".epub");
      } else {
        throw new Error("Livro sem arquivo disponível");
      }
      const res = await fetch(epubUrl);
      if (!res.ok) throw new Error(`Falha ao obter EPUB (${res.status})`);
      const blob = await res.blob();
      const file = new File([blob], filename, { type: "application/epub+zip" });

      const nav = window.navigator as Navigator & {
        canShare?: (data: ShareData) => boolean;
        share?: (data: ShareData) => Promise<void>;
      };
      if (nav.canShare?.({ files: [file] }) && nav.share) {
        await nav.share({ files: [file], title: book.title });
      } else {
        // Fallback: trigger a normal download so the user can open with Kindle app
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        window.alert(
          "Seu navegador não suporta compartilhamento direto. O arquivo foi baixado — abra-o com o app Kindle.",
        );
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        window.alert(`Falha ao enviar: ${(err as Error).message}`);
      }
    } finally {
      setSendingKindle(false);
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
        {canConvert && (
          <button
            type="button"
            onClick={handleConvert}
            disabled={converting}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card py-3 text-sm font-semibold text-foreground transition active:scale-95 disabled:opacity-70"
          >
            {converting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Convertendo (pode levar ~30s)…
              </>
            ) : (
              <>
                <FileType2 className="h-4 w-4" /> Converter para EPUB
              </>
            )}
          </button>
        )}
        {canSendKindle && (
          <button
            type="button"
            onClick={handleSendKindle}
            disabled={sendingKindle}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/30 transition active:scale-95 disabled:opacity-70"
          >
            {sendingKindle ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Preparando para Kindle…
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" /> Abrir no Kindle
              </>
            )}
          </button>
        )}
      </div>
    </AppShell>
  );
}