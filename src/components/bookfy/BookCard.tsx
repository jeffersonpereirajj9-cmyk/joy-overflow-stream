import { memo } from "react";
import { Link } from "@tanstack/react-router";
import type { Book } from "@/data/books";
import { BookCover } from "./BookCover";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";

type Size = "sm" | "md" | "lg";

const WIDTHS: Record<Size, string> = {
  sm: "w-28",
  md: "w-36",
  lg: "w-full",
};
const HEIGHTS: Record<Size, string> = {
  sm: "h-40",
  md: "h-52",
  lg: "h-60",
};

function BookCardImpl({
  book,
  size = "md",
  priority = false,
}: {
  book: Book;
  size?: Size;
  priority?: boolean;
}) {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(book.id);

  return (
    <div className={`${WIDTHS[size]} shrink-0`}>
      <Link to="/book/$id" params={{ id: book.id }} className="block group">
        <div className="relative">
          <BookCover
            book={book}
            priority={priority}
            className={`${HEIGHTS[size]} rounded-xl soft-shadow transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_20px_40px_-12px_oklch(0.6_0.22_350/0.45)] group-active:scale-[0.97]`}
          />
          <button
            type="button"
            aria-label={fav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle(book.id);
            }}
            className="absolute right-2 bottom-2 grid h-8 w-8 place-items-center rounded-full bg-black/55 backdrop-blur-md ring-1 ring-white/10 transition-all duration-200 hover:scale-110 active:scale-90"
          >
            <Heart
              className={`h-4 w-4 transition ${
                fav ? "fill-primary text-primary" : "text-white"
              }`}
            />
          </button>
        </div>
        <div className="mt-2.5 px-0.5">
          <div className="truncate text-[13px] font-medium leading-snug text-foreground">{book.title}</div>
          <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{book.author}</div>
        </div>
      </Link>
    </div>
  );
}

export const BookCard = memo(BookCardImpl, (a, b) =>
  a.book.id === b.book.id && a.size === b.size && a.priority === b.priority,
);