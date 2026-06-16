import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/bookfy/AppShell";
import { PageHeader } from "@/components/bookfy/PageHeader";
import { BookGrid } from "@/components/bookfy/BookGrid";
import { findCollection } from "@/data/collections";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/collection/$slug")({
  component: CollectionPage,
  loader: ({ params }) => {
    const c = findCollection(params.slug);
    if (!c) throw notFound();
    return { collection: c };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.collection.title} — Bookfy` : "Coleção — Bookfy" },
      {
        name: "description",
        content: loaderData?.collection.description ?? "Coleção de livros no Bookfy.",
      },
    ],
  }),
  notFoundComponent: () => (
    <AppShell>
      <div className="px-4 py-10 text-center text-sm text-muted-foreground">
        Coleção não encontrada.{" "}
        <Link to="/" className="text-accent underline">
          Voltar
        </Link>
      </div>
    </AppShell>
  ),
  errorComponent: ({ error }) => (
    <AppShell>
      <div className="px-4 py-10 text-center text-sm text-destructive">
        {error.message}
      </div>
    </AppShell>
  ),
});

function CollectionPage() {
  const { collection } = Route.useLoaderData();
  return (
    <AppShell>
      <div className="px-4 pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground active:scale-95"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Início
        </Link>
      </div>
      <PageHeader
        eyebrow={`Coleção · ${collection.author}`}
        title={collection.title}
        description={collection.description}
      />
      <BookGrid books={collection.books} />
    </AppShell>
  );
}