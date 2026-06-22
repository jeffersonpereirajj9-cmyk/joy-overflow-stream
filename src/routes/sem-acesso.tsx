import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { Lock, ShoppingBag, ArrowLeft } from "lucide-react";

const searchSchema = z.object({
  email: z.string().optional(),
});

export const Route = createFileRoute("/sem-acesso")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sem acesso — Bookfy" },
      { name: "description", content: "Este email ainda não tem acesso ao Bookfy." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NoAccessPage,
});

function NoAccessPage() {
  const { email } = useSearch({ from: "/sem-acesso" });

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <Lock className="h-7 w-7 text-destructive" />
        </div>
        <h1 className="font-serif text-2xl text-foreground">Email sem acesso</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {email ? (
            <>O email <span className="font-semibold text-foreground">{email}</span> ainda não consta como comprador.</>
          ) : (
            <>Este email ainda não consta como comprador.</>
          )}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Garanta seu acesso para entrar na biblioteca.
        </p>

        <Link
          to="/vendas"
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition active:scale-95"
        >
          <ShoppingBag className="h-4 w-4" />
          Adquirir acesso
        </Link>

        <Link
          to="/auth"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card py-3.5 text-sm font-semibold text-foreground transition active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          Tentar com outro email
        </Link>

        <p className="mt-6 text-xs text-muted-foreground">
          Já comprou e ainda assim aparece esta mensagem? Verifique se está usando o mesmo email da compra.
        </p>
      </div>
    </div>
  );
}