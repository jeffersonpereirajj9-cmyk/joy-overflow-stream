import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, CreditCard, ShoppingCart, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const OfferSection = () => {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className="py-16 md:py-24 px-4 relative" id="oferta">
      <div className="container max-w-4xl mx-auto px-0 sm:px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-16 glass border-primary/30 glow-wine overflow-hidden text-center"
        >
          {/* VIP Badge */}
          <div className="absolute top-4 right-4 sm:top-8 sm:right-8 bg-gold text-background font-black px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl -rotate-6 shadow-xl animate-pulse z-20 text-xs sm:text-base">
            OFERTA VIP
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-8">
            <Award className="w-4 h-4" />
            <span>OFERTA EXCLUSIVA DE LANÇAMENTO DO BOOKBOT VIP</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 sm:mb-6 tracking-tighter uppercase">ÚLTIMA CHANCE</h2>
          <p className="text-muted-foreground mb-10 sm:mb-12 max-w-lg mx-auto italic font-bold text-base sm:text-lg px-2">
            O preço subirá para <span className="text-white">R$ 67,00</span> assim que o cronômetro zerar. Garanta sua vaga no BookBot VIP pelo valor promocional de lançamento.
          </p>

          <div className="flex flex-col items-center mb-12 relative">
            <div className="absolute -top-6 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter animate-bounce z-10 shadow-lg border border-white/20">
              Economia de 60% hoje
            </div>
            <div className="bg-black/40 rounded-3xl p-8 sm:p-12 border border-primary/20 backdrop-blur-xl relative overflow-hidden group w-full max-w-sm">
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors" />
              
              <div className="text-muted-foreground line-through text-xl mb-2 opacity-50 font-medium">De R$ 67,00</div>
              
              <div className="flex flex-col items-center relative z-10">
                  <div className="text-xs text-gold font-black uppercase tracking-[0.3em] mb-3 bg-gold/10 px-4 py-1 rounded-full border border-gold/20">
                    POR APENAS
                  </div>
                  <div className="flex items-start gap-1">
                      <span className="text-2xl md:text-3xl font-black text-primary mt-2">R$</span>
                      <span className="text-7xl md:text-9xl font-black text-white text-glow-wine leading-none tracking-tighter">27</span>
                      <div className="flex flex-col items-start mt-2">
                        <span className="text-2xl md:text-3xl font-black text-primary">,90</span>
                        <span className="text-[10px] text-white/40 font-bold uppercase tracking-tighter">no pix</span>
                      </div>
                  </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-2">
                <div className="text-gold font-black uppercase tracking-[0.15em] text-[10px] flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
                  Pagamento Único
                  <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
                </div>
                <div className="text-white font-black uppercase tracking-[0.15em] text-[10px]">
                  Acesso Vitalício Liberado
                </div>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-950/20 rounded-2xl p-6 mb-12 inline-block border border-red-500/20 group hover:border-red-500/40 transition-all backdrop-blur-sm"
          >
            <div className="flex items-center justify-center gap-2 text-[10px] uppercase font-black tracking-[0.2em] text-red-400 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                OFERTA EXPIRA EM:
            </div>
            <div className="text-4xl sm:text-5xl font-mono font-black text-white tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
              {formatTime(timeLeft)}
            </div>
          </motion.div>

          <div className="flex flex-col gap-8 items-center">
            <div className="w-full max-w-md relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
              <a href="https://pay.cakto.com.br/y32stdm_878339" className="relative block">
                <Button size="xl" variant="hero" className="w-full group h-16 sm:h-20 md:h-24 text-base sm:text-xl md:text-2xl bg-primary hover:bg-primary/90 border-none shadow-2xl px-2 sm:px-6 uppercase font-black tracking-tighter rounded-2xl">
                  <div className="flex flex-col items-center">
                    <span className="flex items-center gap-2">
                      QUERO O BOOKBOT VIP AGORA
                      <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="text-[10px] sm:text-xs opacity-70 font-bold tracking-widest mt-1">
                      ACESSO IMEDIATO APÓS O PAGAMENTO
                    </span>
                  </div>
                </Button>
              </a>
            </div>
            
            <button 
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
              className="text-muted-foreground hover:text-white transition-colors text-sm underline underline-offset-4 decoration-white/10"
            >
              Não, quero continuar sem o bot e perder essa oportunidade
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-muted-foreground mt-12">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold" />
              <span>Garantia de 7 dias</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-5 h-5 text-gold" />
              <span>Acesso Instantâneo</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CreditCard className="w-5 h-5 text-gold" />
              <span>Checkout 100% Seguro</span>
            </div>
          </div>

          {/* Guarantee Section */}
          <div className="mt-16 pt-16 border-t border-white/10 flex flex-col md:flex-row items-center gap-8 text-left">
            <div className="w-24 h-24 shrink-0 p-4 bg-primary/10 rounded-full border border-primary/20 flex items-center justify-center overflow-hidden">
               <ShieldCheck className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-xl mb-2">Sua Satisfação é Nossa Prioridade</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Você tem 7 dias inteiros para testar o BookBot VIP. Se não achar que ele é a ferramenta mais prática que você já usou para ler, devolvemos seu dinheiro imediatamente. Sem perguntas.
                </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};