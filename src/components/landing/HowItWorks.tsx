import { motion } from "framer-motion";
import { MessageSquarePlus, Link2, Search } from "lucide-react";

const steps = [
  {
    icon: MessageSquarePlus,
    title: "Crie seu bot",
    description: "Siga nosso tutorial simples de 2 minutos para criar seu próprio bot privado no Telegram.",
  },
  {
    icon: Link2,
    title: "Conecte ao sistema",
    description: "Linke seu bot ao nosso banco de dados global de alta velocidade.",
  },
  {
    icon: Search,
    title: "Pesquise e Leia",
    description: "Basta digitar o nome do livro e o bot entrega o arquivo instantaneamente.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 px-4 bg-secondary/30">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Como Funciona?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Em menos de 5 minutos você terá sua biblioteca pessoal configurada.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-y-12" />
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-full bg-background border-4 border-primary/20 flex items-center justify-center mb-6 glow-purple">
                <step.icon className="w-10 h-10 text-primary" />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
