import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/bookfy/AppShell";
import { books, categories } from "@/data/books";
import { useFavorites } from "@/hooks/useFavorites";
import { BookOpen, Heart, LayoutGrid, Sparkles, LogOut, Camera, Check, Pencil, Download, Flame } from "lucide-react";
import { useReadingStats } from "@/hooks/useReadingActivity";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({
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

async function fileToCompressedDataUrl(file: File, max = 320): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = dataUrl;
  });
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.82);
}

function ProfilePage() {
  const { favorites } = useFavorites();
  const stats = useReadingStats();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const e = window.localStorage.getItem("bookfy_email");
    setEmail(e);
    if (e) {
      setName(window.localStorage.getItem(`bookfy_name:${e}`) ?? "");
      setAvatar(window.localStorage.getItem(`bookfy_avatar:${e}`));
    }
  }, []);

  const saveName = () => {
    if (!email) return;
    const v = name.trim().slice(0, 40);
    setName(v);
    if (v) window.localStorage.setItem(`bookfy_name:${email}`, v);
    else window.localStorage.removeItem(`bookfy_name:${email}`);
    setEditingName(false);
  };

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !email) return;
    try {
      const compressed = await fileToCompressedDataUrl(file);
      setAvatar(compressed);
      window.localStorage.setItem(`bookfy_avatar:${email}`, compressed);
    } catch {
      // ignore
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const signOut = () => {
    window.localStorage.removeItem("bookfy_email");
    navigate({ to: "/auth", replace: true });
  };

  const initial = (name || email || "L").trim().charAt(0).toUpperCase();

  return (
    <AppShell>
      <header className="relative overflow-hidden px-4 pt-8">
        <div className="absolute -top-10 left-1/2 -z-10 h-48 w-48 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="relative mx-auto block h-24 w-24 overflow-hidden rounded-full bg-gradient-to-br from-primary via-rose-700 to-accent text-2xl font-serif text-white shadow-lg shadow-primary/40"
          aria-label="Alterar foto"
        >
          {avatar ? (
            <img src={avatar} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="grid h-full w-full place-items-center">{initial}</span>
          )}
          <span className="absolute bottom-0 right-0 grid h-7 w-7 place-items-center rounded-full bg-background/90 text-foreground shadow ring-1 ring-border">
            <Camera className="h-3.5 w-3.5" />
          </span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={onPickFile} className="hidden" />

        {editingName ? (
          <div className="mt-4 flex items-center justify-center gap-2">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveName()}
              maxLength={40}
              placeholder="Seu nome"
              className="w-48 rounded-full border border-border bg-card px-4 py-2 text-center text-sm text-foreground focus:border-primary focus:outline-none"
            />
            <button onClick={saveName} className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditingName(true)}
            className="mt-3 mx-auto flex items-center gap-1.5 font-serif text-xl text-foreground"
          >
            {name || "Leitora Bookfy"}
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
        <p className="text-center text-xs text-muted-foreground">{email ?? "Membro desde 2026"}</p>
      </header>

      <section className="mt-8 grid grid-cols-3 gap-3 px-4">
        <Stat icon={BookOpen} label="Livros" value={books.length} />
        <Stat icon={LayoutGrid} label="Categorias" value={categories.length} />
        <Stat icon={Heart} label="Favoritos" value={favorites.length} />
      </section>

      <section className="mt-3 grid grid-cols-3 gap-3 px-4">
        <Stat icon={Download} label="Baixados" value={stats.downloads} />
        <Stat icon={BookOpen} label="Lendo" value={stats.reading} />
        <Stat icon={Flame} label="Dias seguidos" value={stats.streak} />
      </section>

      <section className="mx-4 mt-6 rounded-3xl border border-border bg-card p-5 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-accent">
              <Sparkles className="h-4 w-4" />
              <span className="text-[10px] uppercase tracking-[0.25em]">Meta semanal</span>
            </div>
            <h3 className="mt-2 font-serif text-lg text-foreground">3 livros nesta semana</h3>
            <p className="text-xs text-muted-foreground">Continue lendo para manter sua sequência.</p>
          </div>
          <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary font-serif text-lg">
            {Math.min(stats.reading, 3)}/3
          </div>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full gradient-primary transition-all"
            style={{ width: `${Math.min(100, (stats.reading / 3) * 100)}%` }}
          />
        </div>
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

      <div className="px-4 pt-6 pb-10">
        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card py-3 text-sm font-medium text-foreground transition active:scale-95"
        >
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </div>
    </AppShell>
  );
}