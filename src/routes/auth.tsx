import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Loader2, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Entrar — Bookfy" },
      { name: "description", content: "Entre com seu email para acessar sua biblioteca." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/auth" });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // Se já estiver logado, vai direto pra biblioteca
  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (mounted && data.user) {
        navigate({ to: redirect ?? "/library" });
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") navigate({ to: redirect ?? "/library" });
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate, redirect]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || cooldown > 0) return;
    setError(null);
    const clean = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setError("Digite um email válido.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: clean,
        options: {
          shouldCreateUser: true, // o trigger no banco bloqueia se não for comprador
          emailRedirectTo: window.location.origin + "/library",
        },
      });
      if (error) {
        const msg = error.message?.toLowerCase() ?? "";
        if (msg.includes("nao autorizado") || msg.includes("not authorized") || msg.includes("check_violation") || msg.includes("autorizado")) {
          setError("Esse email não consta como comprador. Compre o acesso primeiro.");
        } else {
          setError(error.message);
        }
        return;
      }
      setSent(true);
      setCooldown(60);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-foreground">Bookfy</h1>
          <p className="mt-2 text-sm text-muted-foreground">Entre com seu email para acessar sua biblioteca.</p>
        </div>

        {sent ? (
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-3 font-serif text-lg text-foreground">Link enviado!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Abra o email enviado para <span className="font-medium text-foreground">{email}</span> e toque no link mágico para entrar.
            </p>
            <button
              type="button"
              disabled={cooldown > 0}
              onClick={() => {
                setSent(false);
              }}
              className="mt-4 text-xs text-muted-foreground underline disabled:opacity-50"
            >
              {cooldown > 0 ? `Reenviar em ${cooldown}s` : "Reenviar para outro email"}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full rounded-full border border-border bg-card pl-10 pr-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading || cooldown > 0}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition active:scale-95 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Enviando…
                </>
              ) : (
                <>
                  Receber link de acesso <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
            {error && (
              <p className="text-xs text-destructive text-center pt-1">{error}</p>
            )}
            <p className="pt-4 text-center text-xs text-muted-foreground">
              Ainda não comprou?{" "}
              <Link to="/vendas" className="text-primary underline">
                Garanta seu acesso
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}