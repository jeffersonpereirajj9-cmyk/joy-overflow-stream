import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Lock, ArrowLeft, Star, Heart } from "lucide-react";
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
      { label: "Máfia & Poder", emoji: "🕴️", image: mafiaRomance.url },
      { label: "Bilionários", emoji: "💎", image: bilionarios.url },
      { label: "Fantasia Romântica", emoji: "🧚‍♀️", image: fantasia.url },
      { label: "Romance clássico", emoji: "🌹", image: romance.url },
    ],
  },
  {
    title: "Qual nível de 'pimenta' você curte? 🌶️",
    options: [
      { label: "Suave — só tensão e química", emoji: "💗" },
      { label: "Médio — cenas quentes na medida", emoji: "💋" },
      { label: "Quente — sem censura, por favor", emoji: "🔥" },
      { label: "Tudo! Eu varío de acordo com o humor", emoji: "🌈" },
    ],
  },
  {
    title: "Qual desses casais te conquista mais?",
    options: [
      { label: "Mocinha doce x vilão obcecado", emoji: "😈" },
      { label: "CEO frio x funcionária teimosa", emoji: "🕶️" },
      { label: "Alfa lobisomem x sua fada destinada", emoji: "🐺" },
      { label: "Inimigos que viram amantes", emoji: "⚔️" },
    ],
  },
  {
    title: "Quanto tempo por dia você costuma ler?",
    options: [
      { label: "Menos de 30 min", emoji: "⏳" },
      { label: "30 min a 1 hora", emoji: "📖" },
      { label: "1 a 2 horas", emoji: "☕" },
      { label: "Viro a noite quando engata", emoji: "🌙" },
    ],
  },
  {
    title: "Já gastou com app de leitura por capítulo (moedas, assinatura)?",
    options: [
      { label: "Sim, e acho um absurdo", emoji: "💸" },
      { label: "Sim, mas paro quando vejo o valor", emoji: "😬" },
      { label: "Nunca, justamente por isso", emoji: "🙅‍♀️" },
      { label: "Só leio pirata mesmo", emoji: "🏴‍☠️" },
    ],
  },
  {
    title: "Se eu te entregasse +1000 romances completos, sem capítulos bloqueados, você leria?",
    options: [
      { label: "AGORA! Tô precisando", emoji: "😍" },
      { label: "Com certeza, amo descobrir histórias novas", emoji: "✨" },
      { label: "Sim, principalmente os hot", emoji: "🔥" },
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
        <div className="mb-7 flex items-center gap-3">
          <button
            onClick={back}
            disabled={step === 0 || loading || done}
            aria-label="Voltar"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 backdrop-blur transition hover:scale-105 hover:border-white/25 hover:bg-white/10 disabled:opacity-30 disabled:hover:scale-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            {Array.from({ length: total }).map((_, i) => {
              const filled = done || i < step;
              const active = !done && i === step;
              return (
                <span
                  key={i}
                  className={`h-1.5 flex-1 overflow-hidden rounded-full transition-all duration-500 ${
                    filled
                      ? "bg-gradient-to-r from-indigo-400 to-pink-500"
                      : "bg-white/10"
                  }`}
                >
                  {active && (
                    <span className="block h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-indigo-400 to-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.6)]" />
                  )}
                </span>
              );
            })}
          </div>
        </div>

        {!done && !loading && (
          <section
            key={step}
            className="flex flex-1 flex-col animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.32em] text-pink-300/80">
              {String(step + 1).padStart(2, "0")} <span className="text-white/30">/</span> {String(total).padStart(2, "0")}
            </p>

            <h1
              className="text-balance text-center text-[36px] leading-[1.02] tracking-tight text-white"
              style={{ fontFamily: FONT_HEADING, fontWeight: 400 }}
            >
              {current.title}
            </h1>
            {current.subtitle && (
              <p
                className="mx-auto mt-3 max-w-[22ch] text-center text-[13px] italic leading-relaxed text-white/55"
                style={{ fontFamily: FONT_HEADING }}
              >
                {current.subtitle}
              </p>
            )}

            <div
              className={`mt-8 grid gap-3 ${
                current.options[0].image ? "grid-cols-2" : "grid-cols-1"
              }`}
            >
              {current.options.map((opt, i) =>
                opt.image ? (
                  <button
                    key={opt.label}
                    onClick={() => pick(opt.label)}
                    style={{ animationDelay: `${i * 60}ms`, aspectRatio: "3 / 4" }}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 text-left transition-all duration-300 animate-in fade-in zoom-in-95 hover:-translate-y-1 hover:border-pink-400/60 hover:shadow-[0_25px_60px_-20px_rgba(236,72,153,0.7)] active:translate-y-0 active:scale-[0.98]"
                  >
                    <img
                      src={opt.image}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"
                    />
                    <span className="absolute inset-x-0 bottom-0 p-3">
                      <span className="block text-[13px] font-bold leading-tight text-white drop-shadow">
                        {opt.label}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full bg-white/15 text-xs text-white/0 backdrop-blur-md transition group-hover:bg-pink-500 group-hover:text-white"
                    >
                      →
                    </span>
                  </button>
                ) : (
                  <button
                    key={opt.label}
                    onClick={() => pick(opt.label)}
                    style={{ animationDelay: `${i * 60}ms` }}
                    className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-3.5 text-left backdrop-blur-sm transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 hover:-translate-y-0.5 hover:border-pink-400/50 hover:from-pink-500/[0.10] hover:to-indigo-500/[0.06] hover:shadow-[0_12px_30px_-12px_rgba(236,72,153,0.55)] active:translate-y-0 active:scale-[0.98]"
                  >
                    <span
                      className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500/30 to-pink-500/30 text-2xl leading-none ring-1 ring-white/10 transition group-hover:scale-110 group-hover:rotate-[-4deg]"
                      style={{ fontFamily: '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif' }}
                    >
                      {opt.emoji}
                    </span>
                    <span className="min-w-0 flex-1 text-[14px] font-semibold leading-snug text-white/95">
                      {opt.label}
                    </span>
                    <span
                      aria-hidden
                      className="ml-auto grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/5 text-sm text-white/40 transition group-hover:bg-pink-500 group-hover:text-white"
                    >
                      →
                    </span>
                  </button>
                )
              )}
            </div>

            <div className="mt-auto flex flex-col items-center gap-2 pt-10">
              <div className="flex items-center gap-1 text-amber-300">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-3 w-3 fill-current" />
                ))}
                <span className="ml-1.5 text-[11px] font-semibold text-white/60">
                  +12.000 leitoras
                </span>
              </div>
              <p className="text-center text-[11px] tracking-wide text-white/35">
                Suas respostas montam sua biblioteca ideal
              </p>
            </div>
          </section>
        )}

        {loading && (
          <section className="flex flex-1 flex-col items-center justify-center text-center animate-in fade-in duration-300">
            <div className="relative mb-10 h-24 w-24">
              <div className="absolute inset-0 animate-ping rounded-full bg-pink-500/20" />
              <div className="absolute inset-2 animate-ping rounded-full bg-indigo-500/20 [animation-delay:300ms]" />
              <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-white/5 border-t-pink-400 border-r-indigo-400" />
              <div className="absolute inset-0 grid place-items-center">
                <Heart className="h-6 w-6 fill-pink-400 text-pink-400" />
              </div>
            </div>
            <h2
              className="text-balance text-[34px] leading-[1.05] text-white"
              style={{ fontFamily: FONT_HEADING, fontWeight: 400 }}
            >
              Montando sua <em className="text-pink-300">biblioteca ideal</em>…
            </h2>
            <p className="mt-3 text-[13px] text-white/55">Analisando seus gostos</p>
          </section>
        )}

        {done && (
          <section className="flex flex-1 flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-5 inline-flex w-fit items-center gap-2 self-center rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
              <Check className="h-3.5 w-3.5" /> Resultado pronto
            </div>
            <h2
              className="text-balance text-center text-[38px] leading-[1.02] tracking-tight text-white"
              style={{ fontFamily: FONT_HEADING, fontWeight: 400 }}
            >
              Encontramos{" "}
              <em className="bg-gradient-to-r from-pink-300 via-fuchsia-300 to-indigo-300 bg-clip-text not-italic text-transparent">
                +1000 romances
              </em>{" "}
              perfeitos pra você
            </h2>
            <p className="mx-auto mt-3 max-w-xs text-center text-[13px] leading-relaxed text-white/65">
              Esqueça moedas, assinaturas e capítulos bloqueados. Sua biblioteca completa, sem censura.
            </p>

            <div className="relative mx-auto mt-8 w-[230px]">
              <div
                aria-hidden
                className="absolute -inset-8 -z-10 animate-pulse rounded-full bg-gradient-to-tr from-pink-500/30 to-indigo-500/30 blur-3xl"
              />
              <img
                src={appPreview.url}
                alt="Prévia do app Bookfy"
                className="mx-auto block h-auto w-full rounded-[28px] shadow-[0_30px_80px_-20px_rgba(236,72,153,0.5)] ring-1 ring-white/10"
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
              className="group relative mt-8 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500 px-6 py-[18px] text-[14px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_20px_50px_-12px_rgba(236,72,153,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_25px_60px_-12px_rgba(236,72,153,0.9)] active:translate-y-0 active:scale-[0.99]"
            >
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
              <span className="relative">Ver minha biblioteca →</span>
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