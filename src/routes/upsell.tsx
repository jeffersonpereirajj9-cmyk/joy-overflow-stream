import { createFileRoute } from "@tanstack/react-router";
import { Check, Flame, Crown, Gem, Sparkles, Heart, Skull, Clock, Smartphone, BookHeart } from "lucide-react";
import appPreview from "@/assets/bookfy-app-preview.png.asset.json";
import collectionsPreview from "@/assets/bookfy-collections-preview.png.asset.json";
import categoriesPreview from "@/assets/bookfy-categories-preview.png.asset.json";

export const Route = createFileRoute("/upsell")({
  component: UpsellPage,
  head: () => ({
    meta: [
      { title: "Bookfy — Oferta exclusiva por R$ 47/ano" },
      { name: "description", content: "Desbloqueie o Bookfy: uma biblioteca infinita de romances no seu celular por apenas R$ 47 por ano. Oferta exclusiva para novas integrantes do Clube Secreto das Leituras." },
      { property: "og:title", content: "Bookfy — Nunca mais fique sem uma história para ler" },
      { property: "og:description", content: "Acesso imediato a centenas de romances: Dark Romance, Máfia, Bilionários e Fantasia Romântica. Apenas R$ 47/ano." },
    ],
  }),
});

const CTA_URL = "#checkout";

function CTAButton({ label = "SIM! QUERO DESBLOQUEAR O BOOKFY AGORA" }: { label?: string }) {
  return (
    <a
      href={CTA_URL}
      className="block w-full rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 px-6 py-5 text-center text-base font-extrabold uppercase tracking-wide text-white shadow-[0_10px_40px_-10px_rgba(244,63,94,0.7)] transition hover:scale-[1.02] active:scale-[0.99]"
    >
      {label}
    </a>
  );
}

function UpsellPage() {
  const benefits = [
    "Acesso imediato após a confirmação",
    "Biblioteca digital recheada de romances",
    "Novos títulos sendo adicionados",
    "Romances para todos os gostos",
    "Leitura prática direto do celular",
    "Leia quando e onde quiser",
    "Economia de centenas de reais em livros",
  ];

  const categories = [
    { icon: Skull, title: "Dark Romance", desc: "Histórias intensas, viciantes e cheias de tensão — daquelas que você não consegue largar.", color: "from-rose-900/40 to-black/40" },
    { icon: Crown, title: "Romance Máfia", desc: "Vilões perigosos, lealdade, paixão proibida e um amor que desafia o império.", color: "from-red-900/40 to-zinc-900/40" },
    { icon: Gem, title: "Bilionários", desc: "Homens poderosos, irresistíveis e obcecados pela mulher certa.", color: "from-amber-900/30 to-zinc-900/40" },
    { icon: Sparkles, title: "Fantasia Romântica", desc: "Mundos mágicos, criaturas sedutoras e romances épicos que tiram o fôlego.", color: "from-violet-900/40 to-fuchsia-900/30" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0a1f] via-[#0f0712] to-black text-white">
      <div className="mx-auto max-w-2xl px-5 py-10">
        {/* Tag */}
        <div className="mb-6 flex justify-center">
          <span className="rounded-full border border-pink-400/40 bg-pink-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-pink-300">
            Oferta exclusiva • Apenas nesta página
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-center text-4xl font-extrabold leading-tight sm:text-5xl">
          ESPERE! Sua experiência de leitura{" "}
          <span className="bg-gradient-to-r from-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
            ainda não está completa…
          </span>
        </h1>
        <p className="mt-5 text-center text-lg text-white/80">
          Você acabou de entrar para o <strong>Clube Secreto das Leituras</strong>. Mas existe um problema que toda leitora apaixonada conhece…
        </p>

        {/* App preview */}
        <div className="mt-10 flex justify-center">
          <div className="relative flex flex-wrap items-end justify-center gap-4">
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-pink-500/30 via-fuchsia-500/20 to-transparent blur-2xl" />
            <img
              src={appPreview.url}
              alt="Tela inicial do app Bookfy com biblioteca de romances"
              className="relative w-[45%] max-w-[240px] rounded-[1.75rem] border border-white/10 shadow-[0_30px_80px_-20px_rgba(244,63,94,0.5)]"
              loading="lazy"
            />
            <img
              src={collectionsPreview.url}
              alt="Coleções famosas do Bookfy disponíveis para baixar em EPUB"
              className="relative w-[45%] max-w-[240px] rounded-[1.75rem] border border-white/10 shadow-[0_30px_80px_-20px_rgba(217,70,239,0.5)]"
              loading="lazy"
            />
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-white/60">
          Coleções famosas prontas para baixar em EPUB direto no app.
        </p>

        {/* Problem */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <p className="text-lg italic text-pink-200">
            “Terminei o livro… e agora, o que eu leio?”
          </p>
          <ul className="mt-4 space-y-2 text-white/75">
            <li>• Você termina uma história incrível e fica perdida sem saber o próximo livro.</li>
            <li>• Gasta horas procurando indicação em grupos e listas.</li>
            <li>• Compra livros avulsos e gasta centenas de reais por mês.</li>
          </ul>
        </div>

        {/* Solution */}
        <section className="mt-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-pink-300">A solução</p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
            Seu passaporte para uma <span className="text-pink-400">biblioteca infinita</span> de romances
          </h2>
          <p className="mt-4 text-white/80">
            Imagine abrir um único aplicativo e encontrar histórias capazes de fazer você se apaixonar, prender a respiração e virar páginas até de madrugada.
          </p>
        </section>

        {/* Emotion bullets */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { icon: Heart, text: "Se apaixonar perdidamente" },
            { icon: Flame, text: "Prender a respiração" },
            { icon: BookHeart, text: "Virar páginas até de madrugada" },
            { icon: Skull, text: "Se render aos Dark Romances" },
            { icon: Crown, text: "Se apaixonar por mafiosos perigosos" },
            { icon: Gem, text: "Suspirar por bilionários irresistíveis" },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
              <b.icon className="h-5 w-5 shrink-0 text-pink-400" />
              <span className="text-sm text-white/90">{b.text}</span>
            </div>
          ))}
        </div>

        {/* Categories */}
        <section className="mt-14">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">
            O que você encontra dentro do <span className="text-pink-400">Bookfy</span>
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {categories.map((c) => (
              <div key={c.title} className={`rounded-2xl border border-white/10 bg-gradient-to-br ${c.color} p-5`}>
                <c.icon className="h-7 w-7 text-pink-300" />
                <h3 className="mt-3 text-lg font-bold">{c.title}</h3>
                <p className="mt-1 text-sm text-white/80">{c.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center">
            <div className="relative">
              <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-fuchsia-500/25 via-pink-500/20 to-transparent blur-2xl" />
              <img
                src={categoriesPreview.url}
                alt="Tela de Categorias do Bookfy com quantidade de livros por categoria"
                className="relative w-full max-w-[280px] rounded-[1.75rem] border border-white/10 shadow-[0_30px_80px_-20px_rgba(217,70,239,0.5)]"
                loading="lazy"
              />
            </div>
            <p className="mt-4 text-center text-sm text-white/60">
              Milhares de livros organizados por categoria — escolha o seu próximo vício literário.
            </p>
          </div>
        </section>

        {/* Benefits list */}
        <section className="mt-14 rounded-2xl border border-pink-400/20 bg-white/5 p-6">
          <h2 className="text-center text-2xl font-extrabold">O que você recebe hoje</h2>
          <ul className="mt-5 space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-pink-400" />
                <span className="text-white/90">{b}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Comparison */}
        <section className="mt-14">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">
            Quanto custaria comprar esses livros <span className="text-pink-400">separadamente?</span>
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm uppercase tracking-widest text-white/60">Comprando avulso</p>
              <p className="mt-3 text-3xl font-extrabold text-white/70 line-through decoration-rose-500/70">R$ 100+</p>
              <p className="mt-2 text-sm text-white/70">Apenas 3 ou 4 romances já passam fácil disso. E acabam em poucas semanas.</p>
            </div>
            <div className="rounded-2xl border border-pink-400/40 bg-gradient-to-br from-pink-500/15 to-fuchsia-500/10 p-5">
              <p className="text-sm uppercase tracking-widest text-pink-300">Bookfy</p>
              <p className="mt-3 text-3xl font-extrabold text-pink-300">R$ 47<span className="text-base font-semibold">/ano</span></p>
              <p className="mt-2 text-sm text-white/80">Acesso ilimitado por 12 meses inteiros. Menos do que um único livro físico.</p>
            </div>
          </div>
        </section>

        {/* Objections */}
        <section className="mt-14 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Smartphone, t: "Funciona no celular", d: "Leitura direto pelo navegador, sem instalar nada." },
            { icon: Check, t: "Acesso simples", d: "Login rápido logo após a confirmação." },
            { icon: Clock, t: "Leia quando quiser", d: "12 meses inteiros, no seu ritmo." },
          ].map((o) => (
            <div key={o.t} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
              <o.icon className="mx-auto h-6 w-6 text-pink-400" />
              <p className="mt-2 font-bold">{o.t}</p>
              <p className="mt-1 text-xs text-white/70">{o.d}</p>
            </div>
          ))}
        </section>

        {/* Offer */}
        <section id="checkout" className="mt-16 rounded-3xl border border-pink-400/40 bg-gradient-to-br from-pink-600/20 via-fuchsia-600/10 to-black/30 p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-pink-300">Oferta exclusiva desta página</p>
          <p className="mt-3 text-5xl font-extrabold">R$ 47</p>
          <p className="text-sm text-white/70">por 12 meses inteiros de acesso</p>

          <div className="mt-6">
            <CTAButton />
          </div>
          <p className="mt-3 text-xs text-white/60">Pagamento único anual • Acesso imediato</p>
        </section>

        {/* Urgency */}
        <section className="mt-10 rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-rose-300">⚠ Atenção</p>
          <p className="mt-2 text-white/85">
            Esta condição é exclusiva para novas integrantes do <strong>Clube Secreto das Leituras</strong>. Ao sair desta página, esta oferta poderá não ser apresentada novamente.
          </p>
        </section>

        {/* Future projection */}
        <section className="mt-12 text-center">
          <h3 className="text-2xl font-extrabold">Imagine sua rotina daqui a algumas horas…</h3>
          <p className="mx-auto mt-4 max-w-md text-white/80">
            Você terminando uma história. Abrindo o Bookfy. Escolhendo imediatamente a próxima obsessão literária. Sem procurar. Sem esperar. Sem gastar com livros avulsos. <strong className="text-pink-300">Apenas lendo.</strong>
          </p>
          <div className="mt-8">
            <CTAButton label="QUERO MEU ACESSO POR R$ 47/ANO" />
          </div>
          <p className="mt-4 text-xs text-white/50">Garantia de acesso imediato após a confirmação do pagamento.</p>
        </section>
      </div>
    </div>
  );
}