import type { Book } from "@/data/books";

export function BookCover({ book, className = "" }: { book: Book; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${book.cover} shadow-lg shadow-black/40 ${className}`}
    >
      {/* texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_60%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      {/* gold spine */}
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent/80 via-accent/30 to-transparent" />
      {/* title */}
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