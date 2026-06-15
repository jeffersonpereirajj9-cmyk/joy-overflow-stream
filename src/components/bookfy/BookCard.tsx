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

export function BookCard({ book, size = "md" }: { book: Book; size?: Size }) {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(book.id);

  return (
    <div className={`${WIDTHS[size]} shrink-0`}>
      <Link to="/book/$id" params={{ id: book.id }} className="block group">
        <div className="relative">
          <BookCover book={book} className={`${HEIGHTS[size]} transition-transform group-active:scale-95`} />
          <button
            type="button"
            aria-label={fav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle(book.id);
            }}
            className="absolute right-1.5 bottom-1.5 grid h-8 w-8 place-items-center rounded-full bg-black/50 backdrop-blur transition active:scale-90"
          >
            <Heart
              className={`h-4 w-4 transition ${
                fav ? "fill-primary text-primary" : "text-white"
              }`}
            />
          </button>
        </div>
        <div className="mt-2 px-0.5">
          <div className="truncate text-sm font-medium text-foreground">{book.title}</div>
          <div className="truncate text-xs text-muted-foreground">{book.author}</div>
        </div>
      </Link>
    </div>
  );
}