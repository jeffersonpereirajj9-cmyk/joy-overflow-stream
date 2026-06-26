import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";

type Props = {
  url: string;
  storageKey: string;
  fontSize: number;
  dark: boolean;
  onProgress?: (p: { percentage: number; location: string }) => void;
  onReady?: (api: { next: () => void; prev: () => void }) => void;
};

const lightTheme = {
  body: {
    background: "#fdf6f0",
    color: "#1c1116",
    "font-family": "Fraunces, Georgia, serif",
    "line-height": "1.7",
    padding: "0 8px",
  },
  "p, li": { "text-align": "justify", "hyphens": "auto" as const },
  a: { color: "#b8336a" },
  "img, svg": { "max-width": "100%", height: "auto" },
};

const darkTheme = {
  body: {
    background: "#0d0810",
    color: "#f4e6ee",
    "font-family": "Fraunces, Georgia, serif",
    "line-height": "1.7",
    padding: "0 8px",
  },
  "p, li": { "text-align": "justify", "hyphens": "auto" as const },
  a: { color: "#ff8fb8" },
  "img, svg": { "max-width": "100%", height: "auto" },
};

export function EpubReader({
  url,
  storageKey,
  fontSize,
  dark,
  onProgress,
  onReady,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bookRef = useRef<any>(null);
  const renditionRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowRight") renditionRef.current?.next();
    if (e.key === "ArrowLeft") renditionRef.current?.prev();
  }, []);

  useEffect(() => {
    let disposed = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const ePubMod: any = await import("epubjs");
        const ePub = ePubMod.default ?? ePubMod;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = await res.arrayBuffer();
        if (disposed) return;

        const book = ePub(buf);
        bookRef.current = book;

        const container = containerRef.current;
        if (!container) return;
        container.innerHTML = "";

        const rendition = book.renderTo(container, {
          width: "100%",
          height: "100%",
          flow: "paginated",
          spread: "none",
          manager: "default",
          allowScriptedContent: false,
        });
        renditionRef.current = rendition;

        rendition.themes.register("light", lightTheme as any);
        rendition.themes.register("dark", darkTheme as any);
        rendition.themes.select(dark ? "dark" : "light");
        rendition.themes.fontSize(`${fontSize}px`);

        const saved = localStorage.getItem(storageKey);
        await rendition.display(saved || undefined);

        await book.ready;
        try {
          await book.locations.generate(1600);
        } catch {
          /* noop */
        }

        rendition.on("relocated", (loc: any) => {
          const cfi = loc?.start?.cfi as string | undefined;
          if (cfi) {
            localStorage.setItem(storageKey, cfi);
            const pct = book.locations?.percentageFromCfi?.(cfi);
            onProgress?.({
              percentage: typeof pct === "number" ? pct : 0,
              location: cfi,
            });
          }
        });

        // Swipe gestures
        rendition.on("touchstart", (e: TouchEvent) => {
          (rendition as any)._touchX = e.changedTouches[0].clientX;
        });
        rendition.on("touchend", (e: TouchEvent) => {
          const x0 = (rendition as any)._touchX as number | undefined;
          if (x0 == null) return;
          const dx = e.changedTouches[0].clientX - x0;
          if (Math.abs(dx) > 40) (dx < 0 ? rendition.next() : rendition.prev());
        });

        onReady?.({
          next: () => rendition.next(),
          prev: () => rendition.prev(),
        });

        setLoading(false);
      } catch (err: any) {
        if (!disposed) {
          setError(err?.message ?? "Falha ao abrir o livro");
          setLoading(false);
        }
      }
    })();

    window.addEventListener("keydown", handleKey);
    return () => {
      disposed = true;
      window.removeEventListener("keydown", handleKey);
      try {
        renditionRef.current?.destroy?.();
        bookRef.current?.destroy?.();
      } catch {
        /* noop */
      }
      renditionRef.current = null;
      bookRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, storageKey]);

  // Apply font size changes
  useEffect(() => {
    renditionRef.current?.themes?.fontSize?.(`${fontSize}px`);
  }, [fontSize]);

  // Apply theme changes
  useEffect(() => {
    renditionRef.current?.themes?.select?.(dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      {loading && (
        <div className="absolute inset-0 grid place-items-center bg-background/40 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Preparando o livro…
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 grid place-items-center p-6 text-center text-sm text-muted-foreground">
          Não conseguimos abrir este EPUB ({error}). Baixe pelo botão na página do livro.
        </div>
      )}
    </div>
  );
}