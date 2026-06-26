import { memo, useEffect, useRef, useState } from "react";
import { categories, coverFor, type Book } from "@/data/books";
import { fetchBookCover } from "@/lib/book-covers";

const CATEGORY_IMAGE: Record<string, string | undefined> = Object.fromEntries(
  categories.map((c) => [c.slug, c.image]),
);

function BookCoverImpl({
  book,
  className = "",
  priority = false,
}: {
  book: Book;
  className?: string;
  priority?: boolean;
}) {
  const isUrl = (s?: string) => !!s && /^(https?:|\/|data:)/.test(s);
  const staticImage = coverFor(book.id) ?? (isUrl(book.cover) ? book.cover : undefined);
  const [remote, setRemote] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (staticImage) return;
    const el = wrapRef.current;
    if (!el) return;
    let cancelled = false;
    const load = () => {
      fetchBookCover(book.title, book.author).then((url) => {
        if (cancelled) return;
        if (url) setRemote(url);
      });
    };
    if (priority || typeof IntersectionObserver === "undefined") {
      load();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            io.disconnect();
            load();
            break;
          }
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [staticImage, book.title, book.author, priority]);

  const image = staticImage ?? remote;
  const categoryImage = CATEGORY_IMAGE[book.category];

  if (image) {
    return (
      <div
        ref={wrapRef}
        className={`relative overflow-hidden rounded-xl shadow-lg shadow-black/40 [content-visibility:auto] [contain-intrinsic-size:160px_240px] ${className}`}
      >
        <img
          src={image}
          alt={`Capa de ${book.title}`}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          width={256}
          height={384}
          sizes="(max-width: 640px) 160px, 200px"
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute right-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-accent backdrop-blur">
          ★ {book.rating.toFixed(1)}
        </div>
      </div>
    );
  }

  if (categoryImage) {
    return (
      <div
        ref={wrapRef}
        className={`relative overflow-hidden rounded-xl shadow-lg shadow-black/40 [content-visibility:auto] [contain-intrinsic-size:160px_240px] ${className}`}
      >
        <img
          src={categoryImage}
          alt={`Capa de ${book.title}`}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          width={256}
          height={384}
          sizes="(max-width: 640px) 160px, 200px"
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent/80 via-accent/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-3">
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/70">
            {book.author.split(" ")[0]}
          </div>
          <div className="font-serif text-base leading-tight text-white drop-shadow">
            {book.title}
          </div>
        </div>
        <div className="absolute right-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-accent backdrop-blur">
          ★ {book.rating.toFixed(1)}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${book.cover} shadow-lg shadow-black/40 ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_60%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent/80 via-accent/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3">
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">
          {book.author.split(" ")[0]}
        </div>
        <div className="font-serif text-base leading-tight text-white drop-shadow">
          {book.title}
        </div>
      </div>
      <div className="absolute right-2 top-2 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-accent backdrop-blur">
        ★ {book.rating.toFixed(1)}
      </div>
    </div>
  );
}

export const BookCover = memo(BookCoverImpl, (a, b) =>
  a.book.id === b.book.id && a.className === b.className && a.priority === b.priority,
);