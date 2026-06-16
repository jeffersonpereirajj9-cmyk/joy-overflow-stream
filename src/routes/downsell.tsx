import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Check, Clock, Heart, Sparkles } from "lucide-react";
import appPreview from "@/assets/bookfy-app-preview.png.asset.json";

export const Route = createFileRoute("/downsell")({
  component: DownsellPage,
  head: () => ({
    meta: [
      { title: "Última chance — Bookfy por R$ 37/ano" },
      { name: "description", content: "Oferta final: leve o Bookfy por apenas R$ 37 por 12 meses. Última oportunidade nesta página." },
      { property: "og:title", content: "Última chance — Bookfy por R$ 37/ano" },
      { property: "og:description", content: "Oferta final do Bookfy: R$ 37 por 12 meses de acesso." },
    ],
    scripts: [
      { src: "https://wiapy.com/sell/1.0.0/sell.min.js", async: true },
    ],
  }),
});

function WiapyDownsellButton({ containerId = "wiapy_upsell" }: { containerId?: string }) {
  useEffect(() => {
    let cancelled = false;
    const tryInit = () => {
      if (cancelled) return;
      const w = window as unknown as { initWiapyUpsell?: (opts: unknown) => void };
      const el = document.getElementById(containerId);
      if (!el) return;
      if (typeof w.initWiapyUpsell === "function") {
        el.innerHTML = "";
        w.initWiapyUpsell({
          linkUrl: "https://pay.wiapy.com/checkout/6a315a479c863d1390bc5a09",
          linkText: "SIM, QUERO APROVEITAR POR R$ 37",
          styles: {
            backgroundColor: "#00d769",
            hoverBackgroundColor: "#00b85a",
            fontSize: "17px",
            borderRadius: "10px",
          },
          refusalLinkUrl: "/obrigado",
          refusalLinkText: "Não, vou perder essa oferta",
          refusalLinkColor: "#ffffff",
        });
      } else {
        setTimeout(tryInit, 200);
      }
    };
    tryInit();
    return () => {
      cancelled = true;
    };
  }, [containerId]);
  return <div id={containerId} />;
}

function DownsellPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0a1f] via-[#0f0712] to-black text-white">
      <div className="mx-auto max-w-2xl px-5 py-10">
        <div className="mb-6 flex justify-center">
          <span className="rounded-full border border-rose-400/40 bg-rose-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-rose-300">
            Última chance • Oferta final
          </span>
        </div>

        <h1 className="text-center text-4xl font-extrabold leading-tight sm:text-5xl">
          Espera! Antes de você ir…{" "}
          <span className="bg-gradient-to-r from-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
            tenho uma última oferta pra você
          </span>
        </h1>
        <p className="mt-5 text-center text-lg text-white/80">
          Eu sei que <strong>R$ 47</strong> pode não ter sido o momento certo. Mas eu não quero que você perca a chance de ter a sua biblioteca infinita de romances.
        </p>

        <div className="mt-10 flex flex-col items-center">
          <div className="relative">
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-pink-500/30 via-fuchsia-500/20 to-transparent blur-2xl" />
            <img
              src={appPreview.url}
              alt="Tela inicial do app Bookfy"
              className="relative w-full max-w-[260px] rounded-[2rem] border border-white/10 shadow-[0_30px_80px_-20px_rgba(244,63,94,0.5)]"
              loading="lazy"
            />
          </div>
        </div>

        <section className="mt-12 rounded-3xl border border-pink-400/40 bg-gradient-to-br from-pink-600/20 via-fuchsia-600/10 to-black/30 p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-pink-300">Oferta especial só nesta página</p>
          <div className="mt-3 flex items-end justify-center gap-3">
            <span className="text-2xl font-bold text-white/50 line-through decoration-rose-500/70">R$ 47</span>
            <span className="text-6xl font-extrabold text-pink-300">R$ 37</span>
          </div>
          <p className="mt-2 text-sm text-white/70">por 12 meses inteiros de acesso ao Bookfy</p>

          <ul className="mx-auto mt-6 max-w-sm space-y-3 text-left">
            {[
              "Acesso imediato após a confirmação",
              "Biblioteca recheada de romances",
              "Dark Romance, Máfia, Bilionários e Fantasia",
              "Leitura direto do celular, sem instalar nada",
              "Novos títulos sendo adicionados",
            ].map((b) => (
              <li key={b} className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-pink-400" />
                <span className="text-sm text-white/90">{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7">
            <WiapyDownsellButton containerId="wiapy_upsell" />
          </div>
          <p className="mt-3 text-xs text-white/60">Pagamento único anual • Acesso imediato</p>
        </section>

        <section className="mt-10 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Heart, t: "Sem dor de cabeça", d: "Tudo num app só, sem buscar pela internet." },
            { icon: Sparkles, t: "Mais barato impossível", d: "Menos que um único livro físico." },
            { icon: Clock, t: "12 meses inteiros", d: "Leia no seu ritmo, sem pressa." },
          ].map((o) => (
            <div key={o.t} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
              <o.icon className="mx-auto h-6 w-6 text-pink-400" />
              <p className="mt-2 font-bold">{o.t}</p>
              <p className="mt-1 text-xs text-white/70">{o.d}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-rose-300">⚠ Atenção</p>
          <p className="mt-2 text-white/85">
            Esta é a <strong>última vez</strong> que você verá esta condição. Ao sair desta página, a oferta de <strong>R$ 37</strong> não será apresentada novamente.
          </p>
        </section>

        <div className="mt-10 mb-4 text-center">
          <a
            href="/obrigado"
            className="inline-block text-sm text-white/50 underline underline-offset-4 transition hover:text-white/80"
          >
            Não, prefiro perder esta oferta.
          </a>
        </div>
      </div>
    </div>
  );
}