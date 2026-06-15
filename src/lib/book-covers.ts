const memCache = new Map<string, string | null>();
const STORAGE_PREFIX = "bookcover:v1:";

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

  const q = encodeURIComponent(
    `intitle:${title}${author ? `+inauthor:${author}` : ""}`,
  );
  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=1&printType=books&langRestrict=pt`,
    );
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as {
      items?: { volumeInfo?: { imageLinks?: { thumbnail?: string; smallThumbnail?: string } } }[];
    };
    const links = data.items?.[0]?.volumeInfo?.imageLinks;
    const raw = links?.thumbnail ?? links?.smallThumbnail ?? null;
    const url = raw ? raw.replace(/^http:/, "https:").replace(/&edge=curl/, "") : null;
    memCache.set(key, url);
    writeStored(key, url);
    return url;
  } catch {
    memCache.set(key, null);
    return null;
  }
}