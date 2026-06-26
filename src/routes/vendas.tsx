import { createFileRoute } from "@tanstack/react-router";
import { Check, BookHeart, Sparkles, ShieldCheck, Clock, Flame, Star, Lock } from "lucide-react";
import appPreview from "@/assets/bookfy-app-preview.png.asset.json";
import categoriesPreview from "@/assets/bookfy-categories-preview.png.asset.json";
import collectionsPreview from "@/assets/bookfy-collections-preview.png.asset.json";
import darkRomance from "@/assets/categories/dark-romance.png.asset.json";
import mafiaRomance from "@/assets/categories/mafia-romance.png.asset.json";
import bilionarios from "@/assets/categories/bilionarios.png.asset.json";
import fantasia from "@/assets/categories/fantasia-romantica.png.asset.json";

const COUPON_CHECKOUT_URL = "https://pay.wiapy.com/4TLnkgRu2_";

export const Route = createFileRoute("/vendas")({
  component: VendasPage,
  head: () => ({
    meta: [
      { title: "Bookfy — Sua biblioteca infinita de romances por R$ 47/ano" },
      { name: "description", content: "Centenas de romances no seu celular: Dark Romance, Máfia, Bilionários e Fantasia Romântica. Acesso por 12 meses por apenas R$ 47." },
      { property: "og:title", content: "Bookfy — Sua biblioteca infinita de romances" },
      { property: "og:description", content: "Acesso anual a centenas de romances por apenas R$ 47. Leia direto do celular." },
      { property: "og:url", content: "https://app.clubedeleitoras.online/vendas" },
      { property: "og:image", content: appPreview.url },
    ],
    links: [
      { rel: "canonical", href: "https://app.clubedeleitoras.online/vendas" },
      { rel: "preload", as: "image", href: appPreview.url, fetchpriority: "high" },
    ],
  }),
});

function CTA({ label = "QUERO MEU ACESSO AGORA" }: { label?: string }) {
  return (
    <a
      href={COUPON_CHECKOUT_URL}
      className="block w-full rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-500 px-6 py-5 text-center text-base font-extrabold uppercase tracking-wide text-white shadow-[0_15px_40px_-10px_rgba(244,63,94,0.7)] transition hover:scale-[1.02] active:scale-100"
    >
      {label}
    </a>
  );
}

function VendasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0a1f] via-[#0f0712] to-black text-white">
      <div className="mx-auto max-w-2xl px-5 py-10">
        {/* HERO */}
        <div className="mb-5 flex justify-center">
          <span className="rounded-full border border-pink-400/40 bg-pink-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-pink-300">
            Bookfy • Clube das Leitoras
          </span>
        </div>

        <h1 className="text-center text-4xl font-extrabold leading-tight sm:text-5xl">
          Sua biblioteca infinita de{" "}
          <span className="bg-gradient-to-r from-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
            romances proibidos
          </span>{" "}
          no seu celular
        </h1>

        <p className="mt-5 text-center text-lg text-white/85">
          Centenas de livros pra você devorar quando quiser — Dark Romance, Máfia, Bilionários, Fantasia e muito mais. Sem precisar baixar nada na pirataria, sem propaganda, sem dor de cabeça.
        </p>

        <div className="mt-8 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-pink-500/30 via-fuchsia-500/20 to-transparent blur-2xl" />
            <img
              src={appPreview.url}
              alt="Tela inicial do app Bookfy"
              width={560}
              height={1213}
              fetchPriority="high"
              decoding="async"
              style={{ aspectRatio: "560 / 1213" }}
              className="relative block h-auto w-[280px] max-w-full rounded-[2rem] border border-white/10 shadow-[0_30px_80px_-20px_rgba(244,63,94,0.5)]"
            />
          </div>
        </div>

        {/* PRICE CARD */}
        <section className="mt-10 rounded-3xl border border-pink-400/40 bg-gradient-to-br from-pink-600/20 via-fuchsia-600/10 to-black/30 p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-pink-300">Oferta de lançamento</p>
          <div className="mt-3 flex items-end justify-center gap-3">
            <span className="text-2xl font-bold text-white/50 line-through decoration-rose-500/70">R$ 97</span>
            <span className="text-6xl font-extrabold text-pink-300">R$ 47</span>
          </div>
          <p className="mt-2 text-sm text-white/70">por 12 meses inteiros • menos de R$ 4 por mês</p>

          <ul className="mx-auto mt-6 max-w-sm space-y-3 text-left">
            {[
              "Acesso imediato a centenas de romances",
              "Dark Romance, Máfia, Bilionários e Fantasia",
              "Leitura direto do celular, sem instalar nada",
              "Novos livros adicionados toda semana",
              "Envie qualquer livro pro seu Kindle",
            ].map((b) => (
              <li key={b} className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-pink-400" />
                <span className="text-sm text-white/90">{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7">
            <CTA onClick={() => setShowCoupon(true)} />
          </div>
          <p className="mt-3 flex items-center justify-center gap-2 text-xs text-white/60">
            <Lock className="h-3 w-3" /> Pagamento 100% seguro • Acesso imediato
          </p>
        </section>

        {/* CATEGORIES */}
        <section className="mt-12">
          <h2 className="text-center text-2xl font-bold">
            Tudo que você ama em <span className="text-pink-300">um lugar só</span>
          </h2>
          <p className="mt-2 text-center text-sm text-white/70">
            Os romances mais quentes da internet, organizados em categorias.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              { src: darkRomance.url, name: "Dark Romance" },
              { src: mafiaRomance.url, name: "Máfia" },
              { src: bilionarios.url, name: "Bilionários" },
              { src: fantasia.url, name: "Fantasia Romântica" },
            ].map((c) => (
              <div key={c.name} className="relative h-32 overflow-hidden rounded-2xl border border-white/10">
                <img src={c.src} alt={c.name} loading="lazy" decoding="async" width={400} height={300} className="h-32 w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <p className="absolute bottom-2 left-3 text-sm font-bold">{c.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SCREENSHOTS */}
        <section className="mt-12 space-y-10">
          <div className="text-center">
            <h3 className="text-xl font-bold">Navegue por categorias</h3>
            <p className="mt-2 text-sm text-white/70">
              Encontre rapidinho o estilo de romance que você quer ler.
            </p>
            <div className="mt-5 flex justify-center">
              <img
                src={categoriesPreview.url}
                alt="Tela de categorias do Bookfy"
                width={560}
                height={1213}
                loading="lazy"
                decoding="async"
                style={{ aspectRatio: "560 / 1213" }}
                className="block h-auto w-[320px] max-w-full rounded-[2rem] border border-white/10 shadow-[0_20px_60px_-20px_rgba(244,63,94,0.5)]"
              />
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-bold">Coleções pra te inspirar</h3>
            <p className="mt-2 text-sm text-white/70">
              Listas prontas com os romances mais comentados do momento.
            </p>
            <div className="mt-5 flex justify-center">
              <img
                src={collectionsPreview.url}
                alt="Tela de coleções do Bookfy"
                width={560}
                height={1213}
                loading="lazy"
                decoding="async"
                style={{ aspectRatio: "560 / 1213" }}
                className="block h-auto w-[320px] max-w-full rounded-[2rem] border border-white/10 shadow-[0_20px_60px_-20px_rgba(244,63,94,0.5)]"
              />
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="mt-12 grid gap-3 sm:grid-cols-2">
          {[
            { icon: BookHeart, t: "Romances do seu jeito", d: "Do mais fofinho ao mais picante. Você escolhe." },
            { icon: Sparkles, t: "Acervo atualizado", d: "Novos títulos adicionados o tempo todo." },
            { icon: Clock, t: "Leia quando quiser", d: "Sem horário, sem aluguel, sem multa." },
            { icon: ShieldCheck, t: "100% seguro", d: "Sem vírus, sem sites suspeitos, sem propaganda." },
          ].map((o) => (
            <div key={o.t} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <o.icon className="h-6 w-6 text-pink-400" />
              <p className="mt-2 font-bold">{o.t}</p>
              <p className="mt-1 text-xs text-white/70">{o.d}</p>
            </div>
          ))}
        </section>

        {/* SOCIAL PROOF */}
        <section className="mt-12">
          <h2 className="text-center text-2xl font-bold">
            O que as leitoras estão <span className="text-pink-300">dizendo</span>
          </h2>
          <div className="mt-6 space-y-4">
            {[
              { n: "Camila R.", t: "Tô viciada! Já li 8 livros em duas semanas, melhor coisa que assinei esse ano." },
              { n: "Júlia M.", t: "Adoro Dark Romance e nunca encontrava num lugar só. Aqui tem TUDO." },
              { n: "Bea S.", t: "Pelo preço de um livro físico eu tô lendo o ano inteiro. Recomendo demais." },
            ].map((d) => (
              <div key={d.n} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex gap-0.5 text-pink-300">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-2 text-sm text-white/90">"{d.t}"</p>
                <p className="mt-1 text-xs text-white/60">— {d.n}</p>
              </div>
            ))}
          </div>
        </section>

        {/* GUARANTEE */}
        <section className="mt-12 rounded-3xl border border-emerald-400/30 bg-emerald-500/5 p-6 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-emerald-400" />
          <h3 className="mt-3 text-xl font-bold">Garantia de 7 dias</h3>
          <p className="mt-2 text-sm text-white/80">
            Experimente o Bookfy por 7 dias. Se não amar, devolvemos seu dinheiro — sem perguntas, sem burocracia.
          </p>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-center text-2xl font-bold">Perguntas frequentes</h2>
          <div className="mt-6 space-y-3">
            {[
              { q: "Como funciona o acesso?", a: "Assim que o pagamento for confirmado, você recebe o acesso por e-mail e já pode começar a ler direto do celular." },
              { q: "Preciso instalar algum app?", a: "Não. Tudo funciona pelo navegador do seu celular. Também dá pra enviar os livros pro Kindle." },
              { q: "Por quanto tempo tenho acesso?", a: "12 meses completos. Pague uma vez e leia o ano inteiro." },
              { q: "E se eu não gostar?", a: "Você tem 7 dias de garantia. Se não amar, devolvemos 100% do seu dinheiro." },
            ].map((f) => (
              <details key={f.q} className="group rounded-xl border border-white/10 bg-white/5 p-4">
                <summary className="cursor-pointer list-none font-semibold text-white/90">
                  {f.q}
                </summary>
                <p className="mt-2 text-sm text-white/75">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* URGENCY + FINAL CTA */}
        <section className="mt-12 rounded-3xl border border-pink-400/40 bg-gradient-to-br from-pink-600/20 via-fuchsia-600/10 to-black/30 p-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-rose-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-rose-300">
            <Flame className="h-3 w-3" /> Vagas limitadas
          </div>
          <h3 className="text-2xl font-extrabold">
            Comece a ler ainda hoje
          </h3>
          <p className="mt-2 text-sm text-white/80">
            12 meses de leitura por R$ 47. Acesso liberado na hora.
          </p>
          <div className="mt-6">
            <CTA label="QUERO ENTRAR NO BOOKFY" onClick={() => setShowCoupon(true)} />
          </div>
          <p className="mt-3 text-xs text-white/60">7 dias de garantia • pagamento seguro</p>
        </section>

        <p className="mt-10 text-center text-xs text-white/40">
          © Clube das Leitoras • Bookfy
        </p>
      </div>
    </div>
  );
}