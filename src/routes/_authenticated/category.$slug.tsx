import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/bookfy/AppShell";
import { BookGrid } from "@/components/bookfy/BookGrid";
import { books, categories } from "@/data/books";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/_authenticated/category/$slug")({
  component: CategoryPage,
  loader: ({ params }) => {
    const category = categories.find((c) => c.slug === params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.category.name ?? "Categoria"} — Bookfy` }],
  }),
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const category = categories.find((c) => c.slug === slug)!;
  const list = books.filter((b) => b.category === slug);

  return (
    <AppShell>
      <header className={`relative overflow-hidden bg-gradient-to-br ${category.gradient} px-4 pb-8 pt-6`}>
        <div className="absolute inset-0 bg-black/40" />
        <Link to="/categories" className="relative inline-flex items-center gap-1 text-xs text-white/80">
          <ChevronLeft className="h-4 w-4" /> Voltar
        </Link>
        <h1 className="relative mt-4 font-serif text-3xl text-white">{category.name}</h1>
        <p className="relative mt-1 text-sm text-white/80">{category.description}</p>
      </header>

      <BookGrid books={list} />
    </AppShell>
  );
}