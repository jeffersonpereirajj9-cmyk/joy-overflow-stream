import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Loader2, Mail, ArrowRight } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { checkBuyerEmail } from "@/lib/buyer-auth.functions";

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
  const checkEmail = useServerFn(checkBuyerEmail);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage.getItem("bookfy_email")) {
      navigate({ to: redirect ?? "/library" });
    }
  }, [navigate, redirect]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    const clean = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setError("Digite um email válido.");
      return;
    }
    setLoading(true);
    try {
      const result = await checkEmail({ data: { email: clean } });
      if (!result.allowed) {
        setError("Esse email não consta como comprador. Compre o acesso primeiro.");
        return;
      }
      window.localStorage.setItem("bookfy_email", clean);
      navigate({ to: redirect ?? "/library" });
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
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition active:scale-95 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Entrando…
                </>
              ) : (
                <>
                  Entrar <ArrowRight className="h-4 w-4" />
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
      </div>
    </div>
  );
}