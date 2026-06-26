import { useEffect, useState } from "react";
import { books, type Book } from "@/data/books";

const READER_KEY_PREFIX = "bookfy:reader:";
const DOWNLOADS_KEY = "bookfy:downloads";
const STREAK_KEY = "bookfy:streak";

export type ContinueReadingItem = {
  book: Book;
  updatedAt: number;
};

function readAll(): ContinueReadingItem[] {
  if (typeof window === "undefined") return [];
  const out: ContinueReadingItem[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (!key || !key.startsWith(READER_KEY_PREFIX)) continue;
    const id = key.slice(READER_KEY_PREFIX.length);
    const book = books.find((b) => b.id === id);
    if (!book) continue;
    let updatedAt = 0;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) updatedAt = JSON.parse(raw).updatedAt ?? 0;
    } catch {
      /* noop */
    }
    out.push({ book, updatedAt });
  }
  return out.sort((a, b) => b.updatedAt - a.updatedAt);
}

export function useContinueReading(limit = 8) {
  const [items, setItems] = useState<ContinueReadingItem[]>([]);
  useEffect(() => {
    setItems(readAll().slice(0, limit));
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key.startsWith(READER_KEY_PREFIX)) {
        setItems(readAll().slice(0, limit));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [limit]);
  return items;
}

export function trackDownload(bookId: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(DOWNLOADS_KEY);
    const set = new Set<string>(raw ? JSON.parse(raw) : []);
    set.add(bookId);
    window.localStorage.setItem(DOWNLOADS_KEY, JSON.stringify([...set]));
    bumpStreak();
  } catch {
    /* noop */
  }
}

function bumpStreak() {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const raw = window.localStorage.getItem(STREAK_KEY);
    const state = raw ? JSON.parse(raw) : { last: "", days: 0 };
    if (state.last === today) return;
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
    state.days = state.last === yesterday ? state.days + 1 : 1;
    state.last = today;
    window.localStorage.setItem(STREAK_KEY, JSON.stringify(state));
  } catch {
    /* noop */
  }
}

export function useReadingStats() {
  const [stats, setStats] = useState({ downloads: 0, streak: 0, reading: 0 });
  useEffect(() => {
    try {
      const dl = window.localStorage.getItem(DOWNLOADS_KEY);
      const downloads = dl ? (JSON.parse(dl) as string[]).length : 0;
      const st = window.localStorage.getItem(STREAK_KEY);
      const streak = st ? JSON.parse(st).days ?? 0 : 0;
      const reading = readAll().length;
      setStats({ downloads, streak, reading });
    } catch {
      /* noop */
    }
  }, []);
  return stats;
}