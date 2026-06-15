const memCache = new Map<string, string | null>();
const STORAGE_PREFIX = "bookcover:v2:";
const inFlight = new Map<string, Promise<string | null>>();

// Concurrency limiter so we don't fire hundreds of requests at once.
const MAX_CONCURRENT = 4;
let active = 0;
const queue: (() => void)[] = [];
function acquire(): Promise<void> {
  if (active < MAX_CONCURRENT) {
    active++;
    return Promise.resolve();
  }
  return new Promise((res) => queue.push(() => { active++; res(); }));
}
function release() {
  active--;
  const next = queue.shift();
  if (next) next();
}

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

async function tryItunes(title: string, author: string): Promise<string | null> {
  try {
    const term = `${title} ${author}`.trim();
    const res = await fetch(
      `https://itunes.apple.com/search?media=ebook&limit=3&term=${encodeURIComponent(term)}`,
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { results?: { artworkUrl100?: string }[] };
    const art = data.results?.[0]?.artworkUrl100;
    if (!art) return null;
    // Upscale Apple thumbnails from 100x100 to 600x600
    return art.replace(/\/\d+x\d+(bb)?\.(jpg|png)/i, "/600x600bb.$2");
  } catch {
    return null;
  }
}

async function tryOpenLibraryDirect(title: string, author: string): Promise<string | null> {
  // Direct cover endpoint by title + author (no JSON fetch needed)
  if (!title) return null;
  const url = `https://covers.openlibrary.org/b/title/${encodeURIComponent(title)}-L.jpg?default=false`;
  try {
    const res = await fetch(url, { method: "HEAD" });
    if (res.ok && res.headers.get("content-length") !== "0") return url;
    return null;
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
  const existing = inFlight.get(key);
  if (existing) return existing;

  const promise = (async () => {
    await acquire();
    try {
      const cleanT = cleanTitle(title);
      const firstAuthor = author.split(/[,&]| e /i)[0].trim();
      const url =
        (await tryGoogle(`intitle:"${cleanT}"${firstAuthor ? ` inauthor:"${firstAuthor}"` : ""}`)) ||
        (await tryGoogle(`intitle:${cleanT}`)) ||
        (await tryGoogle(`${cleanT} ${firstAuthor}`.trim())) ||
        (await tryItunes(cleanT, firstAuthor)) ||
        (await tryOpenLibrary(cleanT, firstAuthor)) ||
        (await tryOpenLibraryDirect(cleanT, firstAuthor));
      memCache.set(key, url);
      writeStored(key, url);
      return url;
    } finally {
      release();
      inFlight.delete(key);
    }
  })();
  inFlight.set(key, promise);
  return promise;
}