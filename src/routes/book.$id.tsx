import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/bookfy/AppShell";
import { BookCover } from "@/components/bookfy/BookCover";
import { books, categories } from "@/data/books";
import { useFavorites } from "@/hooks/useFavorites";
import { ChevronLeft, Heart, Download, Star, Loader2, FileType2, Share2 } from "lucide-react";
import { downloadEpub, downloadFileFromUrl } from "@/lib/epub";

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
  const [sharing, setSharing] = useState(false);
  const [downloadedFile, setDownloadedFile] = useState<File | null>(null);
  const [downloadedUrl, setDownloadedUrl] = useState<string | null>(null);
  const downloadFormat = "EPUB";
  const canConvert = !!book.mobiUrl && book.mobiUrl.startsWith("/api/drive/");
  const canShareFiles =
    typeof navigator !== "undefined" &&
    typeof navigator.canShare === "function";

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const url = book.mobiUrl?.startsWith("/api/drive/")
        ? book.mobiUrl.replace(/^\/api\/drive\/([^/?]+)/, "/api/drive/$1/epub")
        : book.epubUrl || book.mobiUrl;
      if (!url) {
        const file = await downloadEpub(book);
        setDownloadedFile(file ?? null);
        setDownloadedUrl(null);
        return;
      }
      const safeTitle = book.title.replace(/[/\\?%*:|"<>]/g, "-");
      const ext = url.includes("/epub") || book.epubUrl ? "epub" : "mobi";
      const mime = ext === "epub" ? "application/epub+zip" : "application/x-mobipocket-ebook";
      const filename = `${safeTitle}.${ext}`;
      try {
        const file = await downloadFileFromUrl(url, filename, mime);
        setDownloadedFile(file);
        setDownloadedUrl(url);
      } catch (err) {
        console.error("[download] fetch falhou, usando fallback", err);
        const file = await downloadEpub(book);
        setDownloadedFile(file ?? new File([], filename, { type: mime }));
        setDownloadedUrl(url);
      }
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

  const handleShareKindle = async () => {
    if (sharing || !downloadedFile) return;
    // Re-wrap as a guaranteed-shareable EPUB file (Chrome's allowlist accepts application/epub+zip).
    const safeName = downloadedFile.name.toLowerCase().endsWith(".epub")
      ? downloadedFile.name
      : downloadedFile.name.replace(/\.[^.]+$/, "") + ".epub";
    const shareFile = new File([downloadedFile], safeName, {
      type: "application/epub+zip",
    });
    if (shareFile.size === 0) {
      window.alert("Arquivo vazio. Baixe novamente antes de compartilhar.");
      return;
    }
    if (!navigator.canShare?.({ files: [shareFile] })) {
      window.alert("Seu navegador não permite compartilhar este arquivo. Use o botão 'Baixar de novo' e abra pelo app Kindle.");
      return;
    }
    setSharing(true);
    try {
      await navigator.share({
        files: [shareFile],
        title: book.title,
      });
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        window.alert(`Falha ao compartilhar: ${(err as Error).message}`);
      }
    } finally {
      setSharing(false);
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
                <Download className="h-4 w-4" /> Baixar {downloadFormat}
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
        {downloadedFile && (
      <div className="mt-3 rounded-2xl border border-border bg-card p-3">
        <p className="text-xs font-medium text-foreground">Arquivo pronto: {downloadedFile.name}</p>
        <button
            type="button"
            onClick={handleShareKindle}
            disabled={sharing || !canShareFiles || !navigator.canShare?.({ files: [downloadedFile] })}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/30 transition active:scale-95 disabled:opacity-70"
          >
            {sharing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Abrindo…
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" /> Compartilhar com Kindle
              </>
            )}
        </button>
        {downloadedUrl && (
          <a
            href={downloadedUrl}
            download={downloadedFile.name}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background py-3 text-sm font-semibold text-foreground transition active:scale-95"
          >
            <Download className="h-4 w-4" /> Baixar de novo
          </a>
        )}
      </div>
        )}
      </div>
    </AppShell>
  );
}