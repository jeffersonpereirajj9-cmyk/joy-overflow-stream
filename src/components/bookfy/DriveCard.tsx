import { Link } from "@tanstack/react-router";
import { BookCover } from "./BookCover";
import type { Book } from "@/data/books";
import type { DriveItem } from "@/hooks/useDriveLibrary";

const GRADIENT_BY_CATEGORY: Record<string, string> = {
  romance: "from-pink-500 via-rose-600 to-pink-800",
  "dark-romance": "from-rose-950 via-black to-pink-950",
  "mafia-romance": "from-zinc-900 via-red-950 to-black",
  bilionarios: "from-amber-700 via-yellow-600 to-rose-700",
  "fantasia-romantica": "from-purple-700 via-pink-700 to-rose-900",
};

export function driveItemToBook(item: DriveItem): Book {
  const fallback = item.name.replace(/\.(epub|mobi|azw3?|pdf)$/i, "");
  const cat = (item.category ?? "romance") as Book["category"];
  return {
    id: `drive-${item.id}`,
    title: item.title ?? fallback,
    author: item.author ?? "—",
    category: cat,
    cover: GRADIENT_BY_CATEGORY[cat] ?? GRADIENT_BY_CATEGORY.romance,
    accent: "rose",
    synopsis: item.synopsis ?? "",
    rating: 4.7,
    tags: [],
  };
}

export function DriveCard({ item, priority = false }: { item: DriveItem; priority?: boolean }) {
  const book = driveItemToBook(item);
  return (
    <div className="w-36 shrink-0">
      <Link to="/library" className="block group">
        <BookCover
          book={book}
          priority={priority}
          className="h-52 transition-transform group-active:scale-95"
        />
        <div className="mt-2 px-0.5">
          <div className="truncate text-sm font-medium text-foreground">{book.title}</div>
          <div className="truncate text-xs text-muted-foreground">{book.author}</div>
        </div>
      </Link>
    </div>
  );
}