import { motion } from "framer-motion";
import { Key, Send, Search, Zap } from "lucide-react";

const steps = [
  {
    icon: Key,
    title: "Acesso Imediato",
    description: "Assim que garantir o seu upgrade, você recebe os dados de acesso instantaneamente.",
  },
  {
    icon: Send,
    title: "Abra o Telegram",
    description: "O bot já está configurado e pronto. Basta clicar no link e começar a usar.",
  },
  {
    icon: Search,
    title: "Pesquise Qualquer Livro",
    description: "Digite o título, autor ou gênero que você deseja ler naquele momento.",
  },
  {
    icon: Zap,
    title: "Receba em Segundos",
    description: "O arquivo (PDF ou EPUB) é enviado para você no mesmo instante. Simples assim.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 px-4 bg-black/40">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Tudo Automático e <span className="text-primary">Extremamente Simples</span></h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Você não precisa de conhecimentos técnicos. É como mandar uma mensagem para uma amiga.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-y-12" />
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 rounded-full bg-background border-4 border-primary/20 flex items-center justify-center mb-6 glow-wine group-hover:border-primary transition-all duration-500">
                <step.icon className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm shadow-lg">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-gold transition-colors">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};