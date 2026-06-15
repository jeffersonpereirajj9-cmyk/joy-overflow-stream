import type { Book } from "@/data/books";
import driveCatalogJson from "@/data/drive-catalog.json";

type DriveCatalogEntry = {
  i: string;
  n: string;
  t: string;
  a: string;
};

export type BookDownloadOption = {
  primaryUrl: string;
  primaryFilename: string;
  primaryMime: string;
  fallbackUrl?: string;
  fallbackFilename?: string;
  fallbackMime?: string;
  formatLabel: "EPUB" | "MOBI";
};

const DRIVE_PREFIX = "/api/drive/";

export function safeBookFilename(value: string) {
  return value.replace(/[/\\?%*:|"<>]/g, "-").replace(/\s+/g, " ").trim() || "livro";
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\((?:im)\)/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function driveEpubUrl(mobiUrl: string) {
  return mobiUrl.replace(/^\/api\/drive\/([^/?]+)/, "/api/drive/$1/epub");
}

function findDriveCatalogMatch(book: Book): DriveCatalogEntry | undefined {
  const title = normalize(book.title);
  const author = normalize(book.author);
  if (!title || !author) return undefined;

  return (driveCatalogJson as DriveCatalogEntry[]).find((entry) => {
    const fileText = normalize(`${entry.n} ${entry.t} ${entry.a}`);
    const exactTitle = normalize(entry.t) === title;
    return (exactTitle || fileText.includes(title)) && fileText.includes(author);
  });
}

export function getBookDownloadOption(book: Book): BookDownloadOption | null {
  const base = safeBookFilename(book.title);

  if (book.epubUrl) {
    return {
      primaryUrl: book.epubUrl,
      primaryFilename: `${base}.epub`,
      primaryMime: "application/epub+zip",
      formatLabel: "EPUB",
    };
  }

  const matchedDrive = book.mobiUrl
    ? undefined
    : findDriveCatalogMatch(book);
  const mobiUrl = book.mobiUrl ?? (matchedDrive ? `${DRIVE_PREFIX}${matchedDrive.i}?name=${encodeURIComponent(matchedDrive.n)}` : undefined);

  if (!mobiUrl) return null;

  if (mobiUrl.startsWith(DRIVE_PREFIX)) {
    return {
      primaryUrl: driveEpubUrl(mobiUrl),
      primaryFilename: `${base}.epub`,
      primaryMime: "application/epub+zip",
      fallbackUrl: mobiUrl,
      fallbackFilename: `${base}.mobi`,
      fallbackMime: "application/x-mobipocket-ebook",
      formatLabel: "EPUB",
    };
  }

  return {
    primaryUrl: mobiUrl,
    primaryFilename: `${base}.mobi`,
    primaryMime: "application/x-mobipocket-ebook",
    formatLabel: "MOBI",
  };
}