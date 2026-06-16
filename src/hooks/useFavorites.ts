import { useCallback, useMemo, useSyncExternalStore } from "react";

const KEY = "bookfy:favorites";

// External store so all components share one snapshot and rerender together.
let cachedSnapshot: string | null = null;
let cachedSet: Set<string> = new Set();
const listeners = new Set<() => void>();

function readRaw(): string {
  if (typeof window === "undefined") return "[]";
  return localStorage.getItem(KEY) || "[]";
}

function getSnapshot(): string {
  const raw = readRaw();
  if (raw !== cachedSnapshot) {
    cachedSnapshot = raw;
    try {
      cachedSet = new Set(JSON.parse(raw) as string[]);
    } catch {
      cachedSet = new Set();
    }
  }
  return cachedSnapshot!;
}

function getServerSnapshot(): string {
  return "[]";
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function notify() {
  listeners.forEach((l) => l());
}

export function useFavorites() {
  // Subscribe to the raw JSON string (cheap reference identity check).
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const set = cachedSet;

  const toggle = useCallback((id: string) => {
    const next = new Set(cachedSet);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    const raw = JSON.stringify(Array.from(next));
    try {
      localStorage.setItem(KEY, raw);
    } catch {
      // ignore quota
    }
    cachedSnapshot = raw;
    cachedSet = next;
    notify();
  }, []);

  const isFavorite = useCallback((id: string) => set.has(id), [set]);
  const favorites = useMemo(() => Array.from(set), [set]);

  return { favorites, toggle, isFavorite };
}