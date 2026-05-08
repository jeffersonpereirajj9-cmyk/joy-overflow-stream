import { motion } from "framer-motion";
import { Zap, Smartphone, HardDrive, Shield, UserCheck, Star, Library } from "lucide-react";

const benefits = [
  { icon: Shield, text: "Bot privado exclusivo" },
  { icon: Library, text: "Biblioteca gigantesca" },
  { icon: Zap, text: "Busca instantânea" },
  { icon: HardDrive, text: "PDFs e EPUBs inclusos" },
  { icon: Shield, text: "Funciona 24h por dia" },
  { icon: Smartphone, text: "Acesso total pelo celular" },
  { icon: Star, text: "Compatível com Kindle e E-readers" },
];

export const BenefitGrid = () => {
  return (
    <section className="py-24 px-4 bg-black/20">
      <div className="container max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
              A Liberdade de Ler <br />
              <span className="text-primary text-glow-wine">Com Conforto Absoluto.</span>
            </h2>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-2xl glass border-white/5 hover:border-primary/20 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-all">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-semibold text-base sm:text-lg">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-full bg-primary/10 absolute inset-0 blur-3xl animate-pulse" />
            <motion.div
              initial={{ opacity: 0, rotate: 5 }}
              whileInView={{ opacity: 1, rotate: 0 }}
              className="relative p-10 glass rounded-[2.5rem] border-primary/20 glow-wine overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                <div className="bg-gold text-black text-[10px] font-bold px-3 py-1 rounded-full animate-bounce">
                  OFERTA UPSELL
                </div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/30">
                  <Star className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Upgrade Essencial</h3>
                <p className="text-muted-foreground mb-8">
                  Diferente de qualquer busca manual, o Bot Inteligente faz o trabalho duro por você enquanto você relaxa.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-black/40 rounded-2xl border border-white/5 group hover:border-gold/30 transition-all">
                    <div className="text-primary font-bold text-2xl mb-1 group-hover:text-gold transition-colors">100%</div>
                    <div className="text-xs uppercase text-muted-foreground tracking-widest">Automático</div>
                  </div>
                  <div className="p-4 bg-black/40 rounded-2xl border border-white/5 group hover:border-accent/30 transition-all">
                    <div className="text-accent font-bold text-2xl mb-1 transition-colors">VIP</div>
                    <div className="text-xs uppercase text-muted-foreground tracking-widest">Acesso</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};