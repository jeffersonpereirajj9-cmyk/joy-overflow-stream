import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";

export type ReaderTheme = "light" | "sepia" | "dark";
export type ReaderFont = "serif" | "sans";

export type ReaderApi = {
  next: () => void;
  prev: () => void;
  goTo: (target: string) => void;
  toc: () => Array<{ label: string; href: string }>;
};

export type ReaderProgress = {
  percentage: number;
  location: string;
  chapter: string | null;
  pageInChapter: number | null;
  pagesInChapter: number | null;
};

type Props = {
  url: string;
  storageKey: string;
  fontSize: number;
  theme: ReaderTheme;
  fontFamily: ReaderFont;
  lineHeight: number;
  onProgress?: (p: ReaderProgress) => void;
  onReady?: (api: ReaderApi) => void;
  onTapCenter?: () => void;
  onTocLoaded?: (toc: Array<{ label: string; href: string }>) => void;
};

const FONT_STACKS: Record<ReaderFont, string> = {
  serif: 'Fraunces, "Source Serif Pro", Georgia, serif',
  sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const THEME_PALETTE: Record<ReaderTheme, { bg: string; fg: string; link: string }> = {
  light: { bg: "#fdf6f0", fg: "#1c1116", link: "#b8336a" },
  sepia: { bg: "#f3e7d3", fg: "#3a2a1a", link: "#9a4a2a" },
  dark: { bg: "#0d0810", fg: "#f4e6ee", link: "#ff8fb8" },
};

function buildTheme(theme: ReaderTheme, font: ReaderFont, lineHeight: number) {
  const p = THEME_PALETTE[theme];
  return {
    body: {
      background: p.bg,
      color: p.fg,
      "font-family": FONT_STACKS[font],
      "line-height": String(lineHeight),
      padding: "0 12px",
      "-webkit-font-smoothing": "antialiased",
    },
    "p, li": {
      "text-align": "justify",
      hyphens: "auto" as const,
      "-webkit-hyphens": "auto" as const,
      "margin-bottom": "0.9em",
    },
    "h1, h2, h3": {
      "font-family": FONT_STACKS.serif,
      "line-height": "1.2",
      "margin-top": "1.2em",
    },
    a: { color: p.link, "text-decoration": "none" },
    "img, svg": { "max-width": "100%", height: "auto", "border-radius": "6px" },
    "::selection": { background: theme === "dark" ? "#ff8fb866" : "#b8336a44" },
  };
}

export function EpubReader({
  url,
  storageKey,
  fontSize,
  theme,
  fontFamily,
  lineHeight,
  onProgress,
  onReady,
  onTapCenter,
  onTocLoaded,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bookRef = useRef<any>(null);
  const renditionRef = useRef<any>(null);
  const tocRef = useRef<Array<{ label: string; href: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
      e.preventDefault();
      renditionRef.current?.next();
    }
    if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      renditionRef.current?.prev();
    }
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

        rendition.themes.register("reader", buildTheme(theme, fontFamily, lineHeight) as any);
        rendition.themes.select("reader");
        rendition.themes.fontSize(`${fontSize}px`);

        const saved = localStorage.getItem(storageKey);
        await rendition.display(saved || undefined);

        await book.ready;
        try {
          const nav = await book.loaded.navigation;
          tocRef.current = (nav?.toc ?? []).map((t: any) => ({
            label: String(t.label ?? "").trim(),
            href: t.href,
          }));
          onTocLoaded?.(tocRef.current);
        } catch {
          /* noop */
        }
        // Desktop click inside the iframe → treat center as tap-to-toggle chrome
        rendition.on("click", (_e: MouseEvent, contents: any) => {
          try {
            const win = contents?.window as Window | undefined;
            const x = (_e as any).clientX as number | undefined;
            const w = win?.innerWidth ?? container.clientWidth;
            if (typeof x !== "number") return;
            if (x < w * 0.3) rendition.prev();
            else if (x > w * 0.7) rendition.next();
            else onTapCenter?.();
          } catch {
            /* noop */
          }
        });

        // Forward keyboard events fired *inside* the rendered iframe so that
        // arrow keys, Space, PageUp/PageDown work even when focus is in the
        // EPUB document (which is the default after a click).
        rendition.on("keydown", (e: KeyboardEvent) => {
          if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
            e.preventDefault();
            renditionRef.current?.next();
          } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
            e.preventDefault();
            renditionRef.current?.prev();
          } else {
            // Re-dispatch other keys to the host window so global hotkeys
            // (TOC, bookmarks, settings, font size, etc.) keep working.
            try {
              window.dispatchEvent(
                new KeyboardEvent("keydown", {
                  key: e.key,
                  code: e.code,
                  shiftKey: e.shiftKey,
                  ctrlKey: e.ctrlKey,
                  altKey: e.altKey,
                  metaKey: e.metaKey,
                }),
              );
            } catch {
              /* noop */
            }
          }
        });

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
            let chapter: string | null = null;
            try {
              const spineItem = book.spine.get(cfi);
              const navItem = spineItem && book.navigation?.get?.(spineItem.href);
              chapter = navItem?.label?.trim?.() || null;
            } catch {
              /* noop */
            }
            onProgress?.({
              percentage: typeof pct === "number" ? pct : 0,
              location: cfi,
              chapter,
              pageInChapter:
                typeof loc?.start?.displayed?.page === "number"
                  ? loc.start.displayed.page
                  : null,
              pagesInChapter:
                typeof loc?.start?.displayed?.total === "number"
                  ? loc.start.displayed.total
                  : null,
            });
          }
        });

        // Swipe + tap zones inside the rendered iframe
        rendition.on("touchstart", (e: TouchEvent) => {
          const t = e.changedTouches[0];
          (rendition as any)._touchX = t.clientX;
          (rendition as any)._touchY = t.clientY;
          (rendition as any)._touchT = Date.now();
        });
        rendition.on("touchend", (e: TouchEvent) => {
          const x0 = (rendition as any)._touchX as number | undefined;
          const y0 = (rendition as any)._touchY as number | undefined;
          const t0 = (rendition as any)._touchT as number | undefined;
          if (x0 == null || y0 == null || t0 == null) return;
          const t = e.changedTouches[0];
          const dx = t.clientX - x0;
          const dy = t.clientY - y0;
          const dt = Date.now() - t0;
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
            dx < 0 ? rendition.next() : rendition.prev();
            return;
          }
          // tap (small movement, quick)
          if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && dt < 350) {
            const w = container.clientWidth;
            const x = t.clientX;
            if (x < w * 0.3) rendition.prev();
            else if (x > w * 0.7) rendition.next();
            else onTapCenter?.();
          }
        });

        onReady?.({
          next: () => rendition.next(),
          prev: () => rendition.prev(),
          goTo: (target: string) => rendition.display(target),
          toc: () => tocRef.current,
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

  useEffect(() => {
    renditionRef.current?.themes?.fontSize?.(`${fontSize}px`);
  }, [fontSize]);

  useEffect(() => {
    const r = renditionRef.current;
    if (!r) return;
    r.themes.register("reader", buildTheme(theme, fontFamily, lineHeight) as any);
    r.themes.select("reader");
    r.themes.fontSize(`${fontSize}px`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, fontFamily, lineHeight]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      {loading && (
        <div
          className="absolute inset-0 grid place-items-center"
          style={{ background: THEME_PALETTE[theme].bg, color: THEME_PALETTE[theme].fg }}
        >
          <div className="flex flex-col items-center gap-3 text-sm opacity-80">
            <Loader2 className="h-5 w-5 animate-spin" />
            Preparando o livro…
          </div>
        </div>
      )}
      {error && (
        <div
          className="absolute inset-0 grid place-items-center p-6 text-center text-sm"
          style={{ background: THEME_PALETTE[theme].bg, color: THEME_PALETTE[theme].fg }}
        >
          Não conseguimos abrir este EPUB ({error}). Baixe pelo botão na página do livro.
        </div>
      )}
    </div>
  );
}