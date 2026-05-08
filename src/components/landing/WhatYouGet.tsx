import { motion } from "framer-motion";
import { BookOpen, MonitorPlay, MessageCircle, Infinity } from "lucide-react";

const inclusions = [
  {
    icon: Infinity,
    title: "Acesso Vitalício ao Sistema",
    description: "Configuração que nunca expira para você usar sempre que quiser.",
    color: "primary"
  },
  {
    icon: MonitorPlay,
    title: "Tutoriais em Vídeo HD",
    description: "Passo a passo detalhado do zero até o primeiro livro baixado.",
    color: "accent"
  },
  {
    icon: MessageCircle,
    title: "Suporte VIP via Telegram",
    description: "Nossa equipe pronta para te ajudar com qualquer dúvida.",
    color: "gold"
  },
  {
    icon: BookOpen,
    title: "Guia de Melhores Comandos",
    description: "Como filtrar por categoria, autor ou ano de publicação.",
    color: "primary"
  }
];

export const WhatYouGet = () => {
  return (
    <section className="py-24 px-4 bg-secondary/20">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">O Que Você Recebe?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tudo o que você precisa para dominar sua biblioteca digital hoje mesmo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {inclusions.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 rounded-[2rem] glass border-white/5 hover:border-primary/30 transition-all flex gap-6"
            >
              <div className={`w-16 h-16 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                <item.icon className={`w-8 h-8 text-${item.color === 'gold' ? 'gold' : item.color}`} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 p-8 md:p-12 rounded-[3rem] gradient-purple glow-purple relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl font-bold mb-4">Pronto para transformar seu Telegram?</h3>
              <p className="text-white/80 text-lg">
                Você está a um passo de nunca mais precisar comprar um livro digital na vida.
              </p>
            </div>
            <div className="p-6 bg-black/20 rounded-2xl backdrop-blur-md border border-white/10 text-center">
              <div className="text-sm uppercase tracking-widest text-white/60 mb-1">Valor Estimado</div>
              <div className="text-4xl font-bold text-white">R$ 497,00</div>
              <div className="text-xs text-primary-foreground/60 mt-2 italic">*Apenas hoje por uma fração disso</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
