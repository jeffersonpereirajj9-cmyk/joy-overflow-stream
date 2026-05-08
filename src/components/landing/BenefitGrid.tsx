import { motion } from "framer-motion";
import { CheckCircle2, Zap, Smartphone, Globe, Shield, UserCheck, HardDrive } from "lucide-react";

const benefits = [
  { icon: Globe, text: "Biblioteca praticamente ilimitada" },
  { icon: Zap, text: "Busca instantânea em segundos" },
  { icon: Smartphone, text: "Funciona em qualquer celular" },
  { icon: HardDrive, text: "Arquivos em PDF e EPUB" },
  { icon: Shield, text: "Seu bot privado disponível 24h" },
  { icon: UserCheck, text: "Configuração simples e rápida" },
  { icon: CheckCircle2, text: "Sem mensalidades, acesso vitalício" },
];

export const BenefitGrid = () => {
  return (
    <section className="py-24 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
              A Liberdade de Ler <br />
              <span className="text-primary text-glow-purple">O Que Quiser, Onde Estiver.</span>
            </h2>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-2xl glass border-white/5"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-semibold text-lg">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-full bg-primary/10 absolute inset-0 blur-3xl animate-pulse" />
            <motion.div
              initial={{ opacity: 0, rotate: -5 }}
              whileInView={{ opacity: 1, rotate: 0 }}
              className="relative p-8 glass rounded-[2.5rem] border-primary/20 glow-purple"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Smartphone className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Totalmente Mobile</h3>
                <p className="text-muted-foreground mb-8">
                  Diferente de sites complexos, sua biblioteca vive dentro do Telegram. Leve, rápido e nativo.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-black/30 rounded-2xl border border-white/5">
                    <div className="text-primary font-bold text-2xl mb-1">100%</div>
                    <div className="text-xs uppercase text-muted-foreground">Privado</div>
                  </div>
                  <div className="p-4 bg-black/30 rounded-2xl border border-white/5">
                    <div className="text-accent font-bold text-2xl mb-1">24/7</div>
                    <div className="text-xs uppercase text-muted-foreground">Online</div>
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
