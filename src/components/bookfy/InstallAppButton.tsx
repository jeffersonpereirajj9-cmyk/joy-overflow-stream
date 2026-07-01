import { useEffect, useState } from "react";
import { Download, Smartphone, Share, Plus, X } from "lucide-react";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // @ts-expect-error iOS Safari
    window.navigator.standalone === true
  );
}

export function InstallAppButton() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if (isStandalone()) {
      setInstalled(true);
      return;
    }
    const ua = window.navigator.userAgent.toLowerCase();
    setIsIos(/iphone|ipad|ipod/.test(ua));

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;

  const handleClick = async () => {
    if (deferred) {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      if (outcome === "accepted") setInstalled(true);
      setDeferred(null);
      return;
    }
    setShowIosHelp(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-3 text-sm font-semibold text-accent shadow-sm backdrop-blur transition active:scale-[0.98]"
      >
        <Download className="h-4 w-4" />
        Baixar app no celular
      </button>

      {showIosHelp && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setShowIosHelp(false)}
        >
          <div
            className="glass-strong relative w-full max-w-sm rounded-3xl border border-border/60 p-6 text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Fechar"
              onClick={() => setShowIosHelp(false)}
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-card/80"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 text-accent">
              <Smartphone className="h-5 w-5" />
              <div className="text-[10px] uppercase tracking-[0.25em]">Instalar Bookfy</div>
            </div>
            <h2 className="mt-2 font-serif text-xl">Adicione à tela inicial</h2>
            {isIos ? (
              <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent/20 text-xs font-semibold text-accent">1</span>
                  <span>Toque no ícone <Share className="inline h-4 w-4 -mt-0.5" /> <b>Compartilhar</b> na barra do Safari.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent/20 text-xs font-semibold text-accent">2</span>
                  <span>Escolha <b>Adicionar à Tela de Início</b> <Plus className="inline h-4 w-4 -mt-0.5" />.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent/20 text-xs font-semibold text-accent">3</span>
                  <span>Toque em <b>Adicionar</b>. Pronto, o Bookfy aparece como um app.</span>
                </li>
              </ol>
            ) : (
              <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent/20 text-xs font-semibold text-accent">1</span>
                  <span>Abra o menu <b>⋮</b> do navegador (Chrome).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent/20 text-xs font-semibold text-accent">2</span>
                  <span>Toque em <b>Adicionar à tela inicial</b> ou <b>Instalar app</b>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent/20 text-xs font-semibold text-accent">3</span>
                  <span>Confirme para instalar o Bookfy no seu celular.</span>
                </li>
              </ol>
            )}
          </div>
        </div>
      )}
    </>
  );
}