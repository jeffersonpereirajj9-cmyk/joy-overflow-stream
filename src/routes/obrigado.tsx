import { createFileRoute } from "@tanstack/react-router";
import { Mail, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/obrigado")({
  component: ObrigadoPage,
  head: () => ({
    meta: [
      { title: "Obrigada! — Clube das Leitoras" },
      { name: "description", content: "Seu acesso ao Clube das Leitoras foi enviado para o seu e-mail." },
    ],
  }),
});

function ObrigadoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0a1f] via-[#0f0712] to-black text-white">
      <div className="mx-auto max-w-xl px-5 py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-pink-500/20 ring-1 ring-pink-400/40">
          <CheckCircle2 className="h-10 w-10 text-pink-400" />
        </div>

        <h1 className="mt-8 text-4xl font-extrabold leading-tight sm:text-5xl">
          Obrigada pela sua{" "}
          <span className="bg-gradient-to-r from-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
            compra!
          </span>
        </h1>

        <p className="mt-5 text-lg text-white/85">
          Seu acesso ao <strong>Clube das Leitoras</strong> já está garantido.
        </p>

        <div className="mt-8 rounded-3xl border border-pink-400/30 bg-gradient-to-br from-pink-600/15 via-fuchsia-600/10 to-black/30 p-6 text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-500/20">
              <Mail className="h-6 w-6 text-pink-300" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-pink-300">Confira seu e-mail</p>
              <p className="text-base text-white/90">Enviamos seu acesso agora mesmo</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/80">
            Acesse a caixa de entrada do e-mail que você usou na compra. Lá você vai encontrar o link e os dados para entrar no <strong>Clube das Leitoras</strong> e começar a ler.
          </p>
          <p className="mt-3 text-xs text-white/60">
            Não encontrou? Olhe também nas pastas <strong>Promoções</strong>, <strong>Spam</strong> ou <strong>Lixo eletrônico</strong>.
          </p>
        </div>

        <p className="mt-8 text-sm text-white/60">
          Boa leitura! 💖
        </p>
      </div>
    </div>
  );
}