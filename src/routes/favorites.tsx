import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/bookfy/AppShell";
import { BookGrid } from "@/components/bookfy/BookGrid";
import { PageHeader } from "@/components/bookfy/PageHeader";
import { books } from "@/data/books";
import { useFavorites } from "@/hooks/useFavorites";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/favorites")({
  component: FavoritesPage,
  head: () => ({ meta: [{ title: "Favoritos — Bookfy" }] }),
});

function FavoritesPage() {
  const { favorites } = useFavorites();
  const list = books.filter((b) => favorites.includes(b.id));

  return (
    <AppShell>
      <PageHeader
        eyebrow="Sua estante"
        title="Favoritos"
        description="Os livros que conquistaram seu coração."
      />

      {list.length === 0 ? (
        <div className="mx-4 mt-16 rounded-3xl border border-dashed border-border p-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/15">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mt-4 font-serif text-lg text-foreground">Nenhum favorito ainda</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Toque no coração de qualquer livro para salvá-lo aqui.
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            Descobrir livros
          </Link>
        </div>
      ) : (
        <BookGrid books={list} />
      )}
    </AppShell>
  );
}