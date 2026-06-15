const memCache = new Map<string, string | null>();
const STORAGE_PREFIX = "bookcover:v2:";

function readStored(key: string): string | null | undefined {
  if (typeof localStorage === "undefined") return undefined;
  const raw = localStorage.getItem(STORAGE_PREFIX + key);
  if (raw === null) return undefined;
  return raw === "" ? null : raw;
}

function writeStored(key: string, value: string | null) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_PREFIX + key, value ?? "");
  } catch {
    // quota: ignore
  }
}

function cleanTitle(t: string): string {
  return t
    .replace(/\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/\b(vol\.?|volume|livro|tomo|parte|n[ºo°]?)\s*\d+/gi, " ")
    .replace(/\s*[-–:]\s*.*$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

type GBooks = {
  items?: { volumeInfo?: { imageLinks?: { thumbnail?: string; smallThumbnail?: string } } }[];
};

async function tryGoogle(q: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=3&printType=books`,
    );
    if (!res.ok) return null;
    const data = (await res.json()) as GBooks;
    for (const item of data.items ?? []) {
      const links = item.volumeInfo?.imageLinks;
      const raw = links?.thumbnail ?? links?.smallThumbnail;
      if (raw) return raw.replace(/^http:/, "https:").replace(/&edge=curl/, "");
    }
    return null;
  } catch {
    return null;
  }
}

async function tryOpenLibrary(title: string, author: string): Promise<string | null> {
  try {
    const params = new URLSearchParams({ title, limit: "1" });
    if (author) params.set("author", author);
    const res = await fetch(`https://openlibrary.org/search.json?${params.toString()}`);
    if (!res.ok) return null;
    const data = (await res.json()) as { docs?: { cover_i?: number }[] };
    const cid = data.docs?.[0]?.cover_i;
    return cid ? `https://covers.openlibrary.org/b/id/${cid}-L.jpg` : null;
  } catch {
    return null;
  }
}

export async function fetchBookCover(
  title: string,
  author: string,
): Promise<string | null> {
  const key = `${title}|${author}`.toLowerCase();
  if (memCache.has(key)) return memCache.get(key)!;
  const stored = readStored(key);
  if (stored !== undefined) {
    memCache.set(key, stored);
    return stored;
  }

  const cleanT = cleanTitle(title);
  const firstAuthor = author.split(/[,&]| e /i)[0].trim();

  const url =
    (await tryGoogle(`intitle:"${cleanT}"${firstAuthor ? ` inauthor:"${firstAuthor}"` : ""}`)) ||
    (await tryGoogle(`intitle:${cleanT}`)) ||
    (await tryGoogle(`${cleanT} ${firstAuthor}`.trim())) ||
    (await tryOpenLibrary(cleanT, firstAuthor));

  memCache.set(key, url);
  writeStored(key, url);
  return url;
}