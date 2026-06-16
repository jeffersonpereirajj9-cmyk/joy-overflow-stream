import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Flame, Heart, Lock, BookHeart, Sparkles } from "lucide-react";
import appPreview from "@/assets/bookfy-app-preview.png.asset.json";
import darkRomance from "@/assets/categories/dark-romance.png.asset.json";
import mafiaRomance from "@/assets/categories/mafia-romance.png.asset.json";
import bilionarios from "@/assets/categories/bilionarios.png.asset.json";
import fantasia from "@/assets/categories/fantasia-romantica.png.asset.json";
import romance from "@/assets/categories/romance.png.asset.json";

export const Route = createFileRoute("/quiz")({
  component: QuizPage,
  head: () => ({
    meta: [
      { title: "Descubra seu romance perfeito — Bookfy" },
      { name: "description", content: "Responda 6 perguntas rápidas e descubra a biblioteca de romances ideal pra você." },
      { property: "og:title", content: "Descubra seu romance perfeito" },
      { property: "og:description", content: "Quiz rápido pra montar sua biblioteca de romances hot." },
    ],
    links: [{ rel: "canonical", href: "https://app.clubedeleitoras.online/quiz" }],
  }),
});

type Step = {
  title: string;
  subtitle?: string;
  options: { label: string; emoji?: string; image?: string }[];
};

const STEPS: Step[] = [
  {
    title: "Qual estilo de romance faz seu coração acelerar?",
    subtitle: "Pode escolher o que mais te atrai agora.",
    options: [
      { label: "Dark Romance", emoji: "🖤", image: darkRomance.url },
      { label: "Máfia & Poder", emoji: "🔥", image: mafiaRomance.url },
      { label: "Bilionários", emoji: "💎", image: bilionarios.url },
      { label: "Fantasia Romântica", emoji: "🐺", image: fantasia.url },
      { label: "Romance clássico", emoji: "💕", image: romance.url },
    ],
  },
  {
    title: "Qual nível de 'pimenta' você curte? 🌶️",
    options: [
      { label: "Suave — só tensão e química", emoji: "🌶️" },
      { label: "Médio — cenas quentes na medida", emoji: "🌶️🌶️" },
      { label: "Quente — sem censura, por favor", emoji: "🌶️🌶️🌶️" },
      { label: "Tudo! Eu varío de acordo com o humor", emoji: "🔥" },
    ],
  },
  {
    title: "Qual desses casais te conquista mais?",
    options: [
      { label: "Mocinha doce x vilão obcecado", emoji: "😈" },
      { label: "CEO frio x funcionária teimosa", emoji: "💼" },
      { label: "Alfa lobisomem x sua fada destinada", emoji: "🌙" },
      { label: "Inimigos que viram amantes", emoji: "⚔️" },
    ],
  },
  {
    title: "Quanto tempo por dia você costuma ler?",
    options: [
      { label: "Menos de 30 min", emoji: "⏱️" },
      { label: "30 min a 1 hora", emoji: "📖" },
      { label: "1 a 2 horas", emoji: "🛋️" },
      { label: "Viro a noite quando engata", emoji: "🌚" },
    ],
  },
  {
    title: "Já gastou com app de leitura por capítulo (moedas, assinatura)?",
    options: [
      { label: "Sim, e acho um absurdo 😤", emoji: "💸" },
      { label: "Sim, mas paro quando vejo o valor", emoji: "😬" },
      { label: "Nunca, justamente por isso", emoji: "🙅‍♀️" },
      { label: "Só leio pirata mesmo", emoji: "🏴‍☠️" },
    ],
  },
  {
    title: "Se eu te entregasse +1000 romances completos, sem capítulos bloqueados, você leria?",
    options: [
      { label: "AGORA! Tô precisando 😍", emoji: "🔥" },
      { label: "Com certeza, amo descobrir histórias novas", emoji: "✨" },
      { label: "Sim, principalmente os hot", emoji: "🌶️" },
    ],
  },
];

function QuizPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const total = STEPS.length;
  const progress = done ? 100 : Math.round(((step) / total) * 100);

  function pick(label: string) {
    const next = [...answers, label];
    setAnswers(next);
    if (step + 1 < total) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setDone(true);
      }, 1800);
    }
  }

  const current = STEPS[step];

  return (
    <main className="min-h-screen bg-[#1a0b2e] text-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 pb-10 pt-6">
        {/* progress */}
        <div className="mb-8 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
            style={{ width: `${Math.max(progress, 6)}%` }}
          />
        </div>

        {!done && !loading && (
          <section key={step} className="flex flex-1 flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h1 className="text-center text-2xl font-extrabold leading-tight">
              {current.title}
            </h1>
            {current.subtitle && (
              <p className="mt-2 text-center text-sm text-white/70">{current.subtitle}</p>
            )}

            <div className={`mt-8 grid gap-3 ${current.options[0].image ? "grid-cols-2" : "grid-cols-1"}`}>
              {current.options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => pick(opt.label)}
                  className="group flex items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3 text-left transition hover:scale-[1.02] hover:border-pink-400/60 hover:bg-white/10 active:scale-100"
                >
                  {opt.image ? (
                    <img
                      src={opt.image}
                      alt=""
                      loading="lazy"
                      className="h-24 w-16 flex-shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <span className="text-2xl">{opt.emoji}</span>
                  )}
                  <span className="text-sm font-semibold">{opt.label}</span>
                </button>
              ))}
            </div>

            <p className="mt-auto pt-8 text-center text-xs text-white/40">
              Pergunta {step + 1} de {total}
            </p>
          </section>
        )}

        {loading && (
          <section className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="mb-6 h-14 w-14 animate-spin rounded-full border-4 border-white/20 border-t-pink-400" />
            <h2 className="text-xl font-bold">Montando sua biblioteca ideal…</h2>
            <p className="mt-2 text-sm text-white/60">Analisando seus gostos 🔥</p>
          </section>
        )}

        {done && (
          <section className="flex flex-1 flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="mb-4 inline-flex w-fit items-center gap-2 self-center rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
              <Check className="h-3.5 w-3.5" /> Resultado pronto
            </div>
            <h2 className="text-center text-2xl font-extrabold leading-tight">
              Encontramos <span className="text-pink-400">+1000 romances</span> perfeitos pro seu perfil!
            </h2>
            <p className="mt-3 text-center text-sm text-white/70">
              Esqueça moedas, assinaturas e capítulos bloqueados. Sua biblioteca completa, sem censura, te esperando.
            </p>

            <img
              src={appPreview.url}
              alt="Prévia do app Bookfy"
              className="mx-auto mt-6 block h-auto w-[240px]"
              style={{ aspectRatio: "560 / 1213" }}
            />

            <ul className="mt-6 space-y-2 text-sm">
              {[
                "Acesso a +1000 livros completos",
                "Dark Romance, Máfia, Bilionários, Fantasia",
                "Leitura offline no celular",
                "Sem anúncios, sem censura",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                  <Check className="h-4 w-4 flex-shrink-0 text-emerald-400" /> {t}
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate({ to: "/vendas" })}
              className="mt-8 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-6 py-5 text-base font-extrabold uppercase tracking-wide text-white shadow-[0_15px_40px_-10px_rgba(16,185,129,0.7)] transition hover:scale-[1.02] active:scale-100"
            >
              Ver minha biblioteca
            </button>
            <p className="mt-3 flex items-center justify-center gap-1 text-center text-xs text-white/50">
              <Lock className="h-3 w-3" /> Pagamento 100% seguro
            </p>
          </section>
        )}
      </div>
    </main>
  );
}