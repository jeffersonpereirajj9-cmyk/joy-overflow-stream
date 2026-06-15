import { useCallback, useEffect, useMemo, useState } from "react";
import {
  listDriveBooks,
  enrichDriveBooks,
  type DriveCategory,
} from "@/lib/drive.functions";

export type DriveItem = {
  id: string;
  name: string;
  size: number;
  title?: string;
  author?: string;
  category?: DriveCategory;
  synopsis?: string;
  enriching?: boolean;
};

export type GroupKey = DriveCategory | "_unsorted";

export function useDriveLibrary(query: string) {
  const [items, setItems] = useState<DriveItem[]>([]);
  const [nextToken, setNextToken] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enrichBatch = useCallback(async (batch: DriveItem[]) => {
    if (batch.length === 0) return;
    const ids = new Set(batch.map((b) => b.id));
    setItems((prev) =>
      prev.map((it) => (ids.has(it.id) ? { ...it, enriching: true } : it)),
    );
    try {
      const r = await enrichDriveBooks({
        data: { books: batch.map((b) => ({ id: b.id, name: b.name })) },
      });
      const byId = new Map(r.books.map((b) => [b.id, b]));
      setItems((prev) =>
        prev.map((it) => {
          const e = byId.get(it.id);
          if (!e) return { ...it, enriching: false };
          return {
            ...it,
            enriching: false,
            title: e.title,
            author: e.author,
            category: e.category,
            synopsis: e.synopsis,
          };
        }),
      );
    } catch {
      setItems((prev) =>
        prev.map((it) => (ids.has(it.id) ? { ...it, enriching: false } : it)),
      );
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setItems([]);
    setNextToken(undefined);
    setLoading(true);
    setError(null);
    listDriveBooks({ data: { search: query } })
      .then(async (r) => {
        if (cancelled) return;
        setItems(r.files);
        setNextToken(r.nextPageToken);
        setLoading(false);
        await enrichBatch(r.files);
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e?.message ?? "Falha ao carregar");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [query, enrichBatch]);

  const loadMore = useCallback(async () => {
    if (!nextToken || loading) return;
    setLoading(true);
    try {
      const r = await listDriveBooks({ data: { search: query, pageToken: nextToken } });
      setItems((prev) => [...prev, ...r.files]);
      setNextToken(r.nextPageToken);
      setLoading(false);
      await enrichBatch(r.files);
    } catch (e) {
      setError((e as Error).message);
      setLoading(false);
    }
  }, [nextToken, loading, query, enrichBatch]);

  const grouped = useMemo(() => {
    const map = new Map<GroupKey, DriveItem[]>();
    for (const it of items) {
      const k = (it.category ?? "_unsorted") as GroupKey;
      const arr = map.get(k) ?? [];
      arr.push(it);
      map.set(k, arr);
    }
    return map;
  }, [items]);

  return { items, grouped, loading, error, nextToken, loadMore };
}