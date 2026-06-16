import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Lock, ArrowLeft, Sparkles } from "lucide-react";
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

const FONT_HEADING = '"Instrument Serif", ui-serif, Georgia, serif';
const FONT_BODY = '"Work Sans", ui-sans-serif, system-ui, sans-serif';

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

  function back() {
    if (step === 0) return;
    setAnswers(answers.slice(0, -1));
    setStep(step - 1);
  }

  const current = STEPS[step];

  return (
    <main
      className="relative min-h-screen overflow-hidden text-white antialiased"
      style={{
        fontFamily: FONT_BODY,
        backgroundColor: "#0a0a1a",
        backgroundImage:
          "radial-gradient(1200px 600px at 10% -10%, rgba(79,70,229,0.35), transparent 60%), radial-gradient(900px 500px at 110% 10%, rgba(236,72,153,0.28), transparent 60%), radial-gradient(700px 500px at 50% 110%, rgba(79,70,229,0.25), transparent 60%)",
      }}
    >
      {/* grain overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-10 pt-6">
        {/* top bar */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={back}
            disabled={step === 0 || loading || done}
            aria-label="Voltar"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10 disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.6)] transition-all duration-500 ease-out"
                style={{ width: `${Math.max(progress, 4)}%` }}
              />
            </div>
            <span className="shrink-0 text-[11px] font-semibold tabular-nums tracking-wide text-white/50">
              {done ? total : Math.min(step + 1, total)}/{total}
            </span>
          </div>
        </div>

        {!done && !loading && (
          <section
            key={step}
            className="flex flex-1 flex-col animate-in fade-in slide-in-from-bottom-3 duration-400"
          >
            <span className="mb-3 inline-flex w-fit items-center gap-1.5 self-center rounded-full border border-pink-400/30 bg-pink-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-pink-200">
              <Sparkles className="h-3 w-3" /> Pergunta {step + 1}
            </span>

            <h1
              className="text-center text-[34px] leading-[1.05] tracking-tight text-white"
              style={{ fontFamily: FONT_HEADING, fontWeight: 400 }}
            >
              {current.title}
            </h1>
            {current.subtitle && (
              <p className="mx-auto mt-3 max-w-xs text-center text-[13px] leading-relaxed text-white/60">
                {current.subtitle}
              </p>
            )}

            <div
              className={`mt-8 grid gap-3 ${
                current.options[0].image ? "grid-cols-2" : "grid-cols-1"
              }`}
            >
              {current.options.map((opt, i) => (
                <button
                  key={opt.label}
                  onClick={() => pick(opt.label)}
                  style={{ animationDelay: `${i * 50}ms` }}
                  className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-left backdrop-blur-sm transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 hover:-translate-y-0.5 hover:border-pink-400/50 hover:bg-white/[0.07] hover:shadow-[0_10px_30px_-12px_rgba(236,72,153,0.55)] active:translate-y-0 active:scale-[0.98]"
                >
                  {opt.image ? (
                    <img
                      src={opt.image}
                      alt=""
                      loading="lazy"
                      className="h-24 w-16 shrink-0 rounded-xl object-cover ring-1 ring-white/10 transition group-hover:ring-pink-400/40"
                    />
                  ) : (
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500/30 to-pink-500/30 text-xl ring-1 ring-white/10">
                      {opt.emoji}
                    </span>
                  )}
                  <span className="min-w-0 flex-1 text-[14px] font-semibold leading-snug text-white/95">
                    {opt.label}
                  </span>
                  <span
                    aria-hidden
                    className="ml-auto hidden h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 text-white/60 transition group-hover:grid group-hover:bg-pink-500/80 group-hover:text-white"
                  >
                    →
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-auto pt-10 text-center text-[11px] tracking-wide text-white/35">
              Suas respostas ajudam a montar sua biblioteca ideal
            </p>
          </section>
        )}

        {loading && (
          <section className="flex flex-1 flex-col items-center justify-center text-center animate-in fade-in duration-300">
            <div className="relative mb-8 h-16 w-16">
              <div className="absolute inset-0 animate-ping rounded-full bg-pink-500/30" />
              <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-white/10 border-t-pink-400 border-r-indigo-400" />
            </div>
            <h2
              className="text-3xl leading-tight text-white"
              style={{ fontFamily: FONT_HEADING, fontWeight: 400 }}
            >
              Montando sua <em className="text-pink-300">biblioteca ideal</em>…
            </h2>
            <p className="mt-3 text-sm text-white/60">Analisando seus gostos</p>
          </section>
        )}

        {done && (
          <section className="flex flex-1 flex-col animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="mb-5 inline-flex w-fit items-center gap-2 self-center rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              <Check className="h-3.5 w-3.5" /> Resultado pronto
            </div>
            <h2
              className="text-center text-[36px] leading-[1.05] tracking-tight text-white"
              style={{ fontFamily: FONT_HEADING, fontWeight: 400 }}
            >
              Encontramos <em className="bg-gradient-to-r from-pink-300 to-fuchsia-400 bg-clip-text not-italic text-transparent">+1000 romances</em> perfeitos pra você
            </h2>
            <p className="mx-auto mt-3 max-w-xs text-center text-[13px] leading-relaxed text-white/65">
              Esqueça moedas, assinaturas e capítulos bloqueados. Sua biblioteca completa, sem censura.
            </p>

            <div className="relative mx-auto mt-7 w-[240px]">
              <div
                aria-hidden
                className="absolute -inset-6 -z-10 rounded-full bg-pink-500/25 blur-2xl"
              />
              <img
                src={appPreview.url}
                alt="Prévia do app Bookfy"
                className="mx-auto block h-auto w-full rounded-[28px] ring-1 ring-white/10"
                style={{ aspectRatio: "560 / 1213" }}
              />
            </div>

            <ul className="mt-7 space-y-2 text-[13px]">
              {[
                "Acesso a +1000 livros completos",
                "Dark Romance, Máfia, Bilionários, Fantasia",
                "Leitura offline no celular",
                "Sem anúncios, sem censura",
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.04] px-3.5 py-2.5 backdrop-blur-sm"
                >
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/20 text-emerald-300">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-white/90">{t}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate({ to: "/vendas" })}
              className="mt-8 w-full rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500 px-6 py-[18px] text-[15px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_20px_50px_-12px_rgba(236,72,153,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_25px_60px_-12px_rgba(236,72,153,0.85)] active:translate-y-0 active:scale-[0.99]"
            >
              Ver minha biblioteca
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-white/45">
              <Lock className="h-3 w-3" /> Pagamento 100% seguro
            </p>
          </section>
        )}
      </div>
    </main>
  );
}