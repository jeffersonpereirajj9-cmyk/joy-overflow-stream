import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, CreditCard, ShoppingCart } from "lucide-react";
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
    <section className="py-24 px-4 relative">
      <div className="container max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[3rem] p-8 md:p-16 glass border-primary/30 glow-purple overflow-hidden text-center"
        >
          {/* Discount Badge */}
          <div className="absolute top-8 right-8 bg-gold text-background font-black px-4 py-2 rounded-xl rotate-12 shadow-xl animate-bounce">
            62% OFF
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4">Oferta Exclusiva de Lançamento</h2>
          <p className="text-muted-foreground mb-12 max-w-lg mx-auto">
            Aproveite o preço promocional antes que o cronômetro chegue a zero e o valor volte ao original.
          </p>

          <div className="flex flex-col items-center mb-12">
            <div className="text-muted-foreground line-through text-2xl mb-2">R$ 97,00</div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl md:text-2xl font-bold text-primary">R$</span>
              <span className="text-6xl md:text-8xl font-black text-white text-glow-purple">37</span>
              <span className="text-xl md:text-2xl font-bold text-primary">,00</span>
            </div>
            <div className="text-gold font-bold mt-2 uppercase tracking-widest text-sm">Pagamento Único • Sem Mensalidades</div>
          </div>

          <div className="bg-black/40 rounded-2xl p-6 mb-12 inline-block border border-white/5">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">A oferta expira em:</div>
            <div className="text-4xl font-mono font-bold text-primary tracking-tighter">
              {formatTime(timeLeft)}
            </div>
          </div>

          <Button size="xl" variant="hero" className="w-full max-w-md mb-8 group h-20 text-2xl">
            LIBERAR ACESSO IMEDIATO
            <ShoppingCart className="ml-3 w-6 h-6 group-hover:scale-110 transition-transform" />
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span>Garantia de 7 dias</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <span>Acesso na hora</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <span>Checkout Seguro</span>
            </div>
          </div>

          {/* Guarantee Section */}
          <div className="mt-16 pt-16 border-t border-white/10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 shrink-0 p-4 bg-gold/10 rounded-full border border-gold/20 flex items-center justify-center">
              <img src="https://cdn.gpteng.co/guarantee-seal.png" alt="7 Dias de Garantia" className="w-full h-auto opacity-80" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-xl mb-2">Risco Zero para Você!</h4>
              <p className="text-sm text-muted-foreground">
                Se em até 7 dias você achar que o sistema não é para você, basta nos enviar um único e-mail ou mensagem no Telegram que devolvemos 100% do seu dinheiro. Simples assim.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
