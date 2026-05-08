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
    <section className="py-24 px-4 relative" id="oferta">
      <div className="container max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[3rem] p-8 md:p-16 glass border-primary/30 glow-wine overflow-hidden text-center"
        >
          {/* VIP Badge */}
          <div className="absolute top-8 right-8 bg-gold text-background font-black px-6 py-2 rounded-xl -rotate-6 shadow-xl animate-pulse">
            OFERTA VIP
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-8">
            <Award className="w-4 h-4" />
            <span>OFERTA EXCLUSIVA PARA NOVAS MEMBROS DO CLUBE DAS LEITORAS</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6">A Complete sua Experiência VIP Hoje</h2>
          <p className="text-muted-foreground mb-12 max-w-lg mx-auto italic">
            Esta oferta é única e não será exibida novamente. Aproveite o desconto especial de membro enquanto o cronômetro está ativo.
          </p>

          <div className="flex flex-col items-center mb-12">
            <div className="text-muted-foreground line-through text-2xl mb-2 opacity-50">De R$ 67,00</div>
            <div className="flex flex-col items-center">
                <div className="text-sm text-gold font-bold uppercase tracking-widest mb-1">Por apenas</div>
                <div className="flex items-baseline gap-2">
                    <span className="text-xl md:text-2xl font-bold text-primary">R$</span>
                    <span className="text-6xl md:text-8xl font-black text-white text-glow-wine">37</span>
                    <span className="text-xl md:text-2xl font-bold text-primary">,00</span>
                </div>
            </div>
            <div className="text-gold font-bold mt-4 uppercase tracking-[0.2em] text-xs">Pagamento Único • Acesso Vitalício</div>
          </div>

          <div className="bg-black/40 rounded-2xl p-6 mb-12 inline-block border border-white/10 group hover:border-primary/30 transition-all">
            <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-2">
                <Clock className="w-4 h-4 text-primary" />
                Esta oferta expira em:
            </div>
            <div className="text-4xl font-mono font-bold text-primary tracking-tighter">
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="flex flex-col gap-6 items-center">
            <Button size="xl" variant="hero" className="w-full max-w-md group h-20 text-xl md:text-2xl bg-primary hover:bg-primary/90 border-none shadow-lg shadow-primary/20">
              LIBERAR MEU BOT VIP AGORA
              <ShoppingCart className="ml-3 w-6 h-6 group-hover:scale-110 transition-transform" />
            </Button>
            
            <button className="text-muted-foreground hover:text-white transition-colors text-sm underline underline-offset-4 decoration-white/10">
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
                Você tem 7 dias inteiros para testar o Bot Inteligente. Se não achar que ele é a ferramenta mais prática que você já usou para ler, devolvemos seu dinheiro imediatamente. Sem perguntas.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};