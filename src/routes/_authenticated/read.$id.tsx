import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { books, sampleChapter } from "@/data/books";
import { COLLECTIONS } from "@/data/collections";
import {
  mostWantedCurated,
  mostReadCurated,
  newestCurated,
  trendingCurated,
  favoritesCurated,
} from "@/data/curated";
import {
  ChevronLeft,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Settings2,
  List,
  X,
  Type,
  Sun,
  Moon,
  Coffee,
} from "lucide-react";
import { EpubReader, type ReaderApi, type ReaderProgress, type ReaderTheme, type ReaderFont } from "@/components/bookfy/EpubReader";
import { getBookDownloadOption } from "@/lib/book-downloads";
import { toast } from "sonner";

const findBook = (id: string) =>
  books.find((b) => b.id === id) ??
  COLLECTIONS.flatMap((c) => c.books).find((b) => b.id === id) ??
  [
    ...mostWantedCurated,
    ...mostReadCurated,
    ...newestCurated,
    ...trendingCurated,
    ...favoritesCurated,
  ].find((b) => b.id === id);

export const Route = createFileRoute("/_authenticated/read/$id")({
  component: ReadPage,
  loader: ({ params }) => {
    const book = findBook(params.id);
    if (!book) throw notFound();
    return { book };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Lendo: ${loaderData?.book.title ?? ""} — Bookfy` }],
  }),
});

function ReadPage() {
  const { id } = Route.useParams();
  const book = findBook(id)!;

  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState<ReaderTheme>("dark");
  const [fontFamily, setFontFamily] = useState<ReaderFont>("serif");
  const [lineHeight, setLineHeight] = useState(1.7);
  const [progress, setProgress] = useState<ReaderProgress>({
    percentage: 0,
    location: "",
    chapter: null,
    pageInChapter: null,
    pagesInChapter: null,
  });
  const [bookmarks, setBookmarks] = useState<{ cfi: string; label: string; ts: number }[]>([]);
  const [chromeOpen, setChromeOpen] = useState(true);
  const [panel, setPanel] = useState<null | "settings" | "toc" | "bookmarks">(null);
  const [toc, setToc] = useState<Array<{ label: string; href: string }>>([]);
  const apiRef = useRef<ReaderApi | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wakeLockRef = useRef<any>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const download = useMemo(() => getBookDownloadOption(book), [book]);
  const epubUrl =
    download && download.formatLabel === "EPUB" ? download.primaryUrl : null;

  // Load persisted prefs + bookmarks
  useEffect(() => {
    try {
      const s = localStorage.getItem(`bookfy:reader:${id}`);
      if (s) {
        const v = JSON.parse(s);
        if (typeof v.fontSize === "number") setFontSize(v.fontSize);
        if (v.theme === "light" || v.theme === "sepia" || v.theme === "dark") setTheme(v.theme);
        else if (typeof v.dark === "boolean") setTheme(v.dark ? "dark" : "light");
        if (v.fontFamily === "serif" || v.fontFamily === "sans") setFontFamily(v.fontFamily);
        if (typeof v.lineHeight === "number") setLineHeight(v.lineHeight);
      }
      const b = localStorage.getItem(`bookfy:bookmarks:${id}`);
      if (b) {
        const arr = JSON.parse(b);
        if (Array.isArray(arr)) setBookmarks(arr);
      }
    } catch {
      /* noop */
    }
  }, [id]);

  useEffect(() => {
    localStorage.setItem(
      `bookfy:reader:${id}`,
      JSON.stringify({ fontSize, theme, fontFamily, lineHeight, updatedAt: Date.now() }),
    );
  }, [id, fontSize, theme, fontFamily, lineHeight]);

  useEffect(() => {
    localStorage.setItem(`bookfy:bookmarks:${id}`, JSON.stringify(bookmarks));
  }, [id, bookmarks]);

  // Keep screen awake while reading; re-acquire after tab returns
  useEffect(() => {
    let cancelled = false;
    const acquire = async () => {
      try {
        const wl = (navigator as any).wakeLock;
        if (!wl?.request || document.visibilityState !== "visible") return;
        const lock = await wl.request("screen");
        if (cancelled) lock.release?.();
        else wakeLockRef.current = lock;
      } catch {
        /* noop */
      }
    };
    acquire();
    const onVis = () => {
      if (document.visibilityState === "visible" && !wakeLockRef.current) acquire();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVis);
      try {
        wakeLockRef.current?.release?.();
      } catch {
        /* noop */
      }
      wakeLockRef.current = null;
    };
  }, []);

  // Chrome stays visible by default; user can still toggle manually.
  const toggleChrome = useCallback(() => {
    setChromeOpen((v) => !v);
  }, []);

  const isBookmarked = useMemo(
    () => bookmarks.some((b) => b.cfi === progress.location),
    [bookmarks, progress.location],
  );
  const toggleBookmark = useCallback(() => {
    if (!progress.location) {
      toast("Aguarde o livro carregar para marcar a página.");
      return;
    }
    setBookmarks((curr) => {
      const exists = curr.find((b) => b.cfi === progress.location);
      if (exists) {
        toast("Marcador removido.");
        return curr.filter((b) => b.cfi !== progress.location);
      }
      toast.success("Página marcada!");
      return [
        ...curr,
        { cfi: progress.location, label: progress.chapter ?? "Sem capítulo", ts: Date.now() },
      ];
    });
  }, [progress.location, progress.chapter]);

  const cycleTheme = useCallback(() => {
    setTheme((t) => (t === "light" ? "sepia" : t === "sepia" ? "dark" : "light"));
  }, []);

  // Global keyboard shortcuts (work even when EpubReader forwards keys).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // Esc: close panel; if none, hide chrome.
      if (e.key === "Escape") {
        if (panel) {
          e.preventDefault();
          setPanel(null);
        } else if (chromeOpen) {
          e.preventDefault();
          setChromeOpen(false);
        }
        return;
      }

      // Don't run other shortcuts while a panel is open.
      if (panel) return;

      switch (e.key) {
        case "t":
        case "T":
          e.preventDefault();
          setChromeOpen(true);
          setPanel("toc");
          break;
        case "m":
        case "M":
          e.preventDefault();
          setChromeOpen(true);
          setPanel("bookmarks");
          break;
        case "s":
        case "S":
          e.preventDefault();
          setChromeOpen(true);
          setPanel("settings");
          break;
        case "b":
        case "B":
          e.preventDefault();
          toggleBookmark();
          break;
        case "d":
        case "D":
          e.preventDefault();
          cycleTheme();
          break;
        case "h":
        case "H":
        case "?":
          e.preventDefault();
          setChromeOpen((v) => !v);
          break;
        case "+":
        case "=":
          e.preventDefault();
          setFontSize((s) => Math.min(28, s + 1));
          break;
        case "-":
        case "_":
          e.preventDefault();
          setFontSize((s) => Math.max(13, s - 1));
          break;
        case "Enter":
          // Enter on the reader surface toggles chrome (mirrors center tap).
          if (target === document.body) {
            e.preventDefault();
            toggleChrome();
          }
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel, chromeOpen, toggleBookmark, cycleTheme, toggleChrome]);

  // Focus management for the side panel: trap focus and restore on close.
  useEffect(() => {
    if (panel) {
      lastFocusedRef.current = (document.activeElement as HTMLElement) ?? null;
      // Defer to allow the panel to render.
      const t = setTimeout(() => {
        const first = panelRef.current?.querySelector<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])',
        );
        first?.focus();
      }, 30);
      return () => clearTimeout(t);
    }
    lastFocusedRef.current?.focus?.();
  }, [panel]);

  const onPanelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const root = panelRef.current;
    if (!root) return;
    const items = Array.from(
      root.querySelectorAll<HTMLElement>(
        'button, [href], input, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => !el.hasAttribute("disabled"));
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const PALETTE = {
    light: { bg: "#fdf6f0", fg: "#1c1116", chrome: "#ffffffd9", border: "#0000000d" },
    sepia: { bg: "#f3e7d3", fg: "#3a2a1a", chrome: "#f6ecd9d9", border: "#0000001a" },
    dark: { bg: "#0d0810", fg: "#f4e6ee", chrome: "#000000a6", border: "#ffffff14" },
  } as const;
  const p = PALETTE[theme];
  const isDark = theme === "dark";

  return (
    <div
      className="reader-root flex h-[100dvh] flex-col transition-colors [&_button:focus-visible]:outline [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-2 [&_button:focus-visible]:outline-primary [&_a:focus-visible]:outline [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-2 [&_a:focus-visible]:outline-primary"
      style={{ background: p.bg, color: p.fg }}
    >
      {/* Top chrome */}
      <header
        className={`absolute inset-x-0 top-0 z-30 flex items-center justify-between px-3 py-3 backdrop-blur transition-all duration-300 ${chromeOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}`}
        style={{ background: p.chrome, borderBottom: `1px solid ${p.border}` }}
      >
        <Link
          to="/book/$id"
          params={{ id }}
          className="flex min-w-0 items-center gap-1.5 rounded-full px-2 py-1 text-xs"
          style={{ background: isDark ? "#ffffff14" : "#00000008" }}
        >
          <ChevronLeft className="h-4 w-4 shrink-0" />
          <span className="truncate max-w-[140px]">{book.title}</span>
        </Link>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPanel("toc")}
            className="grid h-9 w-9 place-items-center rounded-full"
            style={{ background: isDark ? "#ffffff14" : "#00000008" }}
            aria-label="Sumário"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setPanel("bookmarks")}
            className="grid h-9 w-9 place-items-center rounded-full"
            style={{ background: isDark ? "#ffffff14" : "#00000008" }}
            aria-label="Marcadores"
          >
            <Bookmark className="h-4 w-4" />
          </button>
          <button
            onClick={toggleBookmark}
            className={`grid h-9 w-9 place-items-center rounded-full transition ${isBookmarked ? "bg-primary text-primary-foreground" : ""}`}
            style={!isBookmarked ? { background: isDark ? "#ffffff14" : "#00000008" } : undefined}
            aria-label={isBookmarked ? "Remover marcador" : "Marcar esta página"}
          >
            {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setPanel("settings")}
            className="grid h-9 w-9 place-items-center rounded-full"
            style={{ background: isDark ? "#ffffff14" : "#00000008" }}
            aria-label="Ajustes"
          >
            <Settings2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Reader area */}
      <main
        className="relative flex-1 overflow-hidden focus:outline-none"
        onClick={toggleChrome}
        aria-label="Área de leitura. Use as setas para virar a página."
      >
        {epubUrl ? (
          <>
            <EpubReader
              url={epubUrl}
              storageKey={`bookfy:epub-loc:${id}`}
              fontSize={fontSize}
              theme={theme}
              fontFamily={fontFamily}
              lineHeight={lineHeight}
              onReady={(api) => {
                apiRef.current = api;
              }}
              onProgress={(prog) => setProgress(prog)}
              onTapCenter={toggleChrome}
              onTocLoaded={setToc}
            />
            {/* Edge tap zones — visible only when chrome hidden */}
            <button
              aria-label="Página anterior"
              onClick={(e) => {
                e.stopPropagation();
                apiRef.current?.prev();
              }}
              className="absolute left-0 top-0 z-10 h-full w-[18%]"
            />
            <button
              aria-label="Próxima página"
              onClick={(e) => {
                e.stopPropagation();
                apiRef.current?.next();
              }}
              className="absolute right-0 top-0 z-10 h-full w-[18%]"
            />
          </>
        ) : (
          <article
            className="mx-auto h-full w-full max-w-md overflow-y-auto px-5 py-8 md:max-w-2xl sm:px-6"
            style={{ fontSize, lineHeight, fontFamily: fontFamily === "serif" ? "Fraunces, Georgia, serif" : "Inter, sans-serif" }}
          >
            <h1 className="mb-2 font-serif text-2xl">{book.title}</h1>
            <p className="mb-8 text-xs opacity-60">por {book.author}</p>
            <div className="whitespace-pre-line">{sampleChapter}</div>
            <div className="mt-12 text-center text-xs opacity-40">
              — Fim da prévia. Baixe o livro completo para ler tudo. —
            </div>
          </article>
        )}
      </main>

      {/* Bottom chrome — progress + chapter */}
      {epubUrl && (
        <footer
          className={`absolute inset-x-0 bottom-0 z-30 flex flex-col gap-1 px-4 py-2.5 backdrop-blur transition-all duration-300 ${chromeOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"}`}
          style={{ background: p.chrome, borderTop: `1px solid ${p.border}` }}
        >
          <div className="flex items-center justify-between gap-3 text-[10px] opacity-70">
            <span className="truncate">{progress.chapter ?? "—"}</span>
            <span className="tabular-nums">
              {progress.pageInChapter && progress.pagesInChapter
                ? `${progress.pageInChapter} / ${progress.pagesInChapter}`
                : ""}
            </span>
            <span className="tabular-nums">{Math.round(progress.percentage * 100)}%</span>
          </div>
          <div
            className="h-1 overflow-hidden rounded-full"
            style={{ background: isDark ? "#ffffff24" : "#00000014" }}
          >
            <div
              className="h-full rounded-full gradient-primary transition-all"
              style={{ width: `${Math.round(progress.percentage * 100)}%` }}
            />
          </div>
        </footer>
      )}

      {/* Side panel */}
      {panel && (
        <div
          className="fixed inset-0 z-40 flex"
          onClick={() => setPanel(null)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={
              panel === "settings" ? "Ajustes do leitor" : panel === "toc" ? "Sumário do livro" : "Seus marcadores"
            }
            onKeyDown={onPanelKeyDown}
            onClick={(e) => e.stopPropagation()}
            className="relative ml-auto flex h-full w-[88%] max-w-md flex-col"
            style={{ background: p.bg, color: p.fg, borderLeft: `1px solid ${p.border}` }}
          >
            <div
              className="flex items-center justify-between border-b px-4 py-3"
              style={{ borderColor: p.border }}
            >
              <h3 className="font-serif text-lg">
                {panel === "settings" ? "Ajustes" : panel === "toc" ? "Sumário" : "Marcadores"}
              </h3>
              <button
                onClick={() => setPanel(null)}
                className="grid h-9 w-9 place-items-center rounded-full"
                style={{ background: isDark ? "#ffffff14" : "#00000008" }}
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {panel === "settings" && (
                <div className="space-y-6">
                  {/* Theme */}
                  <section>
                    <div className="mb-2 text-xs uppercase tracking-wider opacity-60">Tema</div>
                    <div className="grid grid-cols-3 gap-2">
                      {([
                        { id: "light", label: "Claro", icon: Sun, bg: "#fdf6f0", fg: "#1c1116" },
                        { id: "sepia", label: "Sépia", icon: Coffee, bg: "#f3e7d3", fg: "#3a2a1a" },
                        { id: "dark", label: "Escuro", icon: Moon, bg: "#0d0810", fg: "#f4e6ee" },
                      ] as const).map((opt) => {
                        const Icon = opt.icon;
                        const active = theme === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setTheme(opt.id)}
                            className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 text-xs transition ${active ? "border-primary" : "border-transparent"}`}
                            style={{ background: opt.bg, color: opt.fg }}
                          >
                            <Icon className="h-4 w-4" />
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  {/* Font family */}
                  <section>
                    <div className="mb-2 text-xs uppercase tracking-wider opacity-60">Fonte</div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setFontFamily("serif")}
                        className={`rounded-2xl border-2 p-3 transition ${fontFamily === "serif" ? "border-primary" : "border-transparent"}`}
                        style={{ background: isDark ? "#ffffff10" : "#00000008", fontFamily: "Fraunces, Georgia, serif" }}
                      >
                        <div className="text-lg">Aa</div>
                        <div className="text-[10px] uppercase tracking-wider opacity-60">Serifa</div>
                      </button>
                      <button
                        onClick={() => setFontFamily("sans")}
                        className={`rounded-2xl border-2 p-3 transition ${fontFamily === "sans" ? "border-primary" : "border-transparent"}`}
                        style={{ background: isDark ? "#ffffff10" : "#00000008", fontFamily: "Inter, sans-serif" }}
                      >
                        <div className="text-lg">Aa</div>
                        <div className="text-[10px] uppercase tracking-wider opacity-60">Sem serifa</div>
                      </button>
                    </div>
                  </section>

                  {/* Font size */}
                  <section>
                    <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wider opacity-60">
                      <span>Tamanho</span>
                      <span className="tabular-nums">{fontSize}px</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setFontSize((s) => Math.max(13, s - 1))}
                        className="grid h-10 w-10 place-items-center rounded-full"
                        style={{ background: isDark ? "#ffffff14" : "#00000008" }}
                      >
                        <Type className="h-3.5 w-3.5" />
                      </button>
                      <input
                        type="range"
                        min={13}
                        max={28}
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="flex-1 accent-primary"
                      />
                      <button
                        onClick={() => setFontSize((s) => Math.min(28, s + 1))}
                        className="grid h-10 w-10 place-items-center rounded-full"
                        style={{ background: isDark ? "#ffffff14" : "#00000008" }}
                      >
                        <Type className="h-5 w-5" />
                      </button>
                    </div>
                  </section>

                  {/* Line height */}
                  <section>
                    <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wider opacity-60">
                      <span>Espaçamento</span>
                      <span className="tabular-nums">{lineHeight.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min={1.3}
                      max={2.2}
                      step={0.05}
                      value={lineHeight}
                      onChange={(e) => setLineHeight(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </section>
                </div>
              )}

              {panel === "toc" && (
                <ul className="space-y-1">
                  {toc.length === 0 && (
                    <li className="py-6 text-center text-sm opacity-60">Sem sumário disponível.</li>
                  )}
                  {toc.map((item, idx) => (
                    <li key={`${item.href}-${idx}`}>
                      <button
                        onClick={() => {
                          apiRef.current?.goTo(item.href);
                          setPanel(null);
                        }}
                        className="w-full rounded-xl px-3 py-2.5 text-left text-sm transition"
                        style={{ background: "transparent" }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = isDark
                            ? "#ffffff10"
                            : "#00000008";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                        }}
                      >
                        {item.label || "(sem título)"}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {panel === "bookmarks" && (
                <ul className="space-y-2">
                  {bookmarks.length === 0 && (
                    <li className="py-6 text-center text-sm opacity-60">
                      Nenhum marcador ainda. Toque no ícone de marcador no topo.
                    </li>
                  )}
                  {bookmarks
                    .slice()
                    .sort((a, b) => b.ts - a.ts)
                    .map((b) => (
                      <li
                        key={b.cfi}
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                        style={{ background: isDark ? "#ffffff0a" : "#00000005" }}
                      >
                        <button
                          onClick={() => {
                            apiRef.current?.goTo(b.cfi);
                            setPanel(null);
                          }}
                          className="flex-1 text-left text-sm"
                        >
                          <div className="truncate">{b.label}</div>
                          <div className="text-[10px] opacity-60">
                            {new Date(b.ts).toLocaleDateString("pt-BR")}
                          </div>
                        </button>
                        <button
                          onClick={() =>
                            setBookmarks((curr) => curr.filter((x) => x.cfi !== b.cfi))
                          }
                          aria-label="Remover"
                          className="grid h-8 w-8 place-items-center rounded-full"
                          style={{ background: isDark ? "#ffffff14" : "#00000008" }}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Floating bottom-right next/prev hint when chrome hidden */}
      {epubUrl && !chromeOpen && (
        <>
          <button
            aria-label="Anterior"
            onClick={(e) => {
              e.stopPropagation();
              apiRef.current?.prev();
            }}
            className="fixed bottom-4 left-4 z-20 grid h-10 w-10 place-items-center rounded-full opacity-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            aria-label="Próximo"
            onClick={(e) => {
              e.stopPropagation();
              apiRef.current?.next();
            }}
            className="fixed bottom-4 right-4 z-20 grid h-10 w-10 place-items-center rounded-full opacity-0"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}