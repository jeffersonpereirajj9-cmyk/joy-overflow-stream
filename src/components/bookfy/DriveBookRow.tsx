import { useState } from "react";
import { BookOpen, Download, Loader2 } from "lucide-react";
import type { DriveItem } from "@/hooks/useDriveLibrary";
import { downloadFileFromUrl } from "@/lib/epub";

function formatSize(bytes: number) {
  if (!bytes) return "";
  const mb = bytes / 1024 / 1024;
  return mb < 1 ? `${Math.round(bytes / 1024)} KB` : `${mb.toFixed(1)} MB`;
}

export function DriveBookRow({ book }: { book: DriveItem }) {
  const [busy, setBusy] = useState(false);
  const fallback = book.name.replace(/\.mobi$/i, "");
  const mobiDl = `/api/drive/${book.id}?name=${encodeURIComponent(book.name)}`;
  const epubDl = `/api/drive/${book.id}/epub?name=${encodeURIComponent(book.name)}`;
  const title = book.title ?? fallback;

  const handleDownloadEpub = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await downloadFileFromUrl(epubDl, `${fallback}.epub`, "application/epub+zip");
    } catch (err) {
      try {
        await downloadFileFromUrl(mobiDl, `${fallback}.mobi`, "application/x-mobipocket-ebook");
      } catch {
        window.alert(`Falha ao baixar arquivo completo: ${(err as Error).message}`);
      }
    } finally {
      setBusy(false);
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
            onClick={handleDownloadEpub}
            disabled={busy}
            className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30 active:scale-95 disabled:opacity-70"
            aria-label="Baixar EPUB"
            title="Baixar EPUB"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </li>
  );
}