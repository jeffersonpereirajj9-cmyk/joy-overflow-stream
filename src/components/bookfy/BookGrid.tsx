import type { Book } from "@/data/books";
import { BookCard } from "./BookCard";

export function BookGrid({ books }: { books: Book[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 px-4 pt-6">
      {books.map((b) => (
        <BookCard key={b.id} book={b} size="lg" />
      ))}
    </div>
  );
}