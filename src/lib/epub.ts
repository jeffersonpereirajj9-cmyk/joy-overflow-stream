import type { Book } from "@/data/books";

function safeName(s: string) {
  return s.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
}

export async function downloadFileFromUrl(url: string, filename: string, fallbackType = "application/octet-stream") {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download falhou: HTTP ${res.status}`);
  const blob = await res.blob();
  const fileType = blob.type && blob.type !== "application/octet-stream" ? blob.type : fallbackType;
  const file = new File([blob], filename, { type: fileType });
  const obj = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = obj;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(obj), 1000);
  return file;
}

export async function downloadEpub(book: Book) {
  if (book.epubUrl) {
    return downloadFileFromUrl(book.epubUrl, `${safeName(book.title)}.epub`, "application/epub+zip");
  }
  if (book.mobiUrl) {
    return downloadFileFromUrl(book.mobiUrl, `${safeName(book.title)}.mobi`, "application/x-mobipocket-ebook");
  }

  throw new Error("Arquivo completo não encontrado para este título.");
}