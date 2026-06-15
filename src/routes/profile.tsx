import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/bookfy/AppShell";
import { books, categories } from "@/data/books";
import { useFavorites } from "@/hooks/useFavorites";
import { BookOpen, Heart, LayoutGrid, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({ meta: [{ title: "Perfil — Bookfy" }] }),
});

function Stat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <Icon className="h-5 w-5 text-accent" />
      <div className="mt-3 font-serif text-2xl text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function ProfilePage() {
  const { favorites } = useFavorites();

  return (
    <AppShell>
      <header className="relative overflow-hidden px-4 pt-8">
        <div className="absolute -top-10 left-1/2 -z-10 h-48 w-48 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" />
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-primary via-rose-700 to-accent text-2xl font-serif text-white shadow-lg shadow-primary/40">
          L
        </div>
        <h1 className="mt-3 text-center font-serif text-xl text-foreground">Leitora Bookfy</h1>
        <p className="text-center text-xs text-muted-foreground">Membro desde 2026</p>
      </header>

      <section className="mt-8 grid grid-cols-3 gap-3 px-4">
        <Stat icon={BookOpen} label="Livros" value={books.length} />
        <Stat icon={LayoutGrid} label="Categorias" value={categories.length} />
        <Stat icon={Heart} label="Favoritos" value={favorites.length} />
      </section>

      <section className="mx-4 mt-6 rounded-3xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-accent">
          <Sparkles className="h-4 w-4" />
          <span className="text-[10px] uppercase tracking-[0.25em]">Sobre o app</span>
        </div>
        <h2 className="mt-2 font-serif text-lg text-foreground">Bookfy</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Uma biblioteca digital pensada para mulheres apaixonadas por romances e dark romance. Versão MVP 1.0 — sem cadastro, sem complicação, só histórias.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl bg-background/60 p-3">
            <div className="text-muted-foreground">Versão</div>
            <div className="font-medium text-foreground">1.0.0</div>
          </div>
          <div className="rounded-xl bg-background/60 p-3">
            <div className="text-muted-foreground">Tema</div>
            <div className="font-medium text-foreground">Romance Noir</div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}