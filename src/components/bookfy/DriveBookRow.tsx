import { useState } from "react";
import { BookOpen, Download, FileType2, Loader2, Share2 } from "lucide-react";
import type { DriveItem } from "@/hooks/useDriveLibrary";
import { downloadFileFromUrl } from "@/lib/epub";

function formatSize(bytes: number) {
  if (!bytes) return "";
  const mb = bytes / 1024 / 1024;
  return mb < 1 ? `${Math.round(bytes / 1024)} KB` : `${mb.toFixed(1)} MB`;
}

export function DriveBookRow({ book }: { book: DriveItem }) {
  const [busy, setBusy] = useState<"mobi" | "epub" | "share" | null>(null);
  const [downloadedFile, setDownloadedFile] = useState<File | null>(null);
  const fallback = book.name.replace(/\.mobi$/i, "");
  const dl = `/api/drive/${book.id}?name=${encodeURIComponent(book.name)}`;
  const epubDl = `/api/drive/${book.id}/epub?name=${encodeURIComponent(book.name)}`;
  const title = book.title ?? fallback;

  const downloadAndKeep = async (url: string, filename: string, type: string, kind: "mobi" | "epub") => {
    if (busy) return;
    setBusy(kind);
    try {
      const file = await downloadFileFromUrl(url, filename, type);
      setDownloadedFile(file);
    } catch (err) {
      window.alert(`Falha ao baixar: ${(err as Error).message}`);
    } finally {
      setBusy(null);
    }
  };

  const shareToKindle = async () => {
    if (!downloadedFile || busy) return;
    if (!navigator.share || !navigator.canShare?.({ files: [downloadedFile] })) {
      window.alert("Este navegador não permite compartilhar arquivos. Abra pelo celular e escolha o app Kindle.");
      return;
    }
    setBusy("share");
    try {
      await navigator.share({ files: [downloadedFile], title });
    } catch (err) {
      if ((err as Error).name !== "AbortError") window.alert(`Falha ao compartilhar: ${(err as Error).message}`);
    } finally {
      setBusy(null);
    }
  };

  return (
    <li className="border-b border-border/60 py-3">
      <div className="flex gap-3">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/40 to-accent/30">
          <BookOpen className="h-5 w-5 text-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">
            {book.author ?? "—"} • {formatSize(book.size)}
          </p>
          {book.synopsis ? (
            <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
              {book.synopsis}
            </p>
          ) : book.enriching ? (
            <p className="mt-1 text-xs italic text-muted-foreground">Gerando sinopse…</p>
          ) : null}
        </div>
        <div className="mt-1 flex shrink-0 flex-col gap-2">
          <button
            type="button"
            onClick={() => downloadAndKeep(dl, book.name, "application/x-mobipocket-ebook", "mobi")}
            disabled={busy !== null}
            className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30 active:scale-95 disabled:opacity-70"
            aria-label="Baixar MOBI"
          >
            {busy === "mobi" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => downloadAndKeep(epubDl, `${fallback}.epub`, "application/epub+zip", "epub")}
            disabled={busy !== null}
            className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-secondary-foreground shadow-md shadow-secondary/30 active:scale-95 disabled:opacity-70"
            aria-label="Converter para EPUB"
            title="Converter para EPUB"
          >
            {busy === "epub" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileType2 className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {downloadedFile && (
        <button
          type="button"
          onClick={shareToKindle}
          disabled={busy !== null}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm font-semibold text-accent-foreground shadow-md shadow-accent/30 active:scale-95 disabled:opacity-70"
        >
          {busy === "share" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
          Compartilhar com Kindle
        </button>
      )}
    </li>
  );
}