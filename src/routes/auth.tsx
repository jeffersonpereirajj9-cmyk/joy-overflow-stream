import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Loader2, Mail, ArrowRight } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { checkBuyerEmail } from "@/lib/buyer-auth.functions";
import { lovable } from "@/integrations/lovable";
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
  const checkEmail = useServerFn(checkBuyerEmail);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage.getItem("bookfy_email")) {
      navigate({ to: redirect ?? "/" });
    }
  }, [navigate, redirect]);

  // After Google OAuth, verify buyer email
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session?.user?.email) {
        setGoogleLoading(true);
        try {
          const result = await checkEmail({ data: { email: session.user.email } });
          if (!result.allowed) {
            const blocked = session.user.email;
            await supabase.auth.signOut();
            navigate({ to: "/sem-acesso", search: { email: blocked } });
          } else {
            window.localStorage.setItem("bookfy_email", session.user.email);
            navigate({ to: redirect ?? "/" });
          }
        } catch (err) {
          setError((err as Error).message);
          await supabase.auth.signOut();
        } finally {
          setGoogleLoading(false);
        }
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [checkEmail, navigate, redirect]);

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
      navigate({ to: redirect ?? "/" });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        setError(result.error.message || "Erro ao entrar com Google.");
      }
      // If successful and not redirected, onAuthStateChange will handle the rest
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-foreground">Bookfy</h1>
          <p className="mt-2 text-sm text-muted-foreground">Entre com seu email para acessar sua biblioteca.</p>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card py-3.5 text-sm font-semibold text-foreground transition active:scale-95 disabled:opacity-60 mb-4"
        >
          {googleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          {googleLoading ? "Entrando…" : "Entrar com Google"}
        </button>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">ou</span>
          </div>
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