import { useEffect, useRef, useState } from "react";
import type { Book } from "@/data/books";
import { BookCard } from "./BookCard";

const INITIAL = 8;
const PAGE = 16;

export function BookGrid({ books }: { books: Book[] }) {
  const [count, setCount] = useState(() => Math.min(INITIAL, books.length));
  const sentinel = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCount(Math.min(INITIAL, books.length));
  }, [books]);

  useEffect(() => {
    if (count >= books.length) return;
    const el = sentinel.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setCount((c) => Math.min(c + PAGE, books.length));
        }
      },
          { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [count, books.length]);

  const visible = books.slice(0, count);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 px-4 pt-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {visible.map((b, i) => (
          <BookCard key={b.id} book={b} size="lg" priority={i < 2} />
        ))}
      </div>
      {count < books.length && (
        <div ref={sentinel} className="h-12" aria-hidden />
      )}
    </>
  );
}