import { motion } from "framer-motion";
import { Search, Ban, Clock, MousePointer2 } from "lucide-react";

const problems = [
  {
    icon: Clock,
    title: "Chega de Perder Tempo",
    description: "Nunca mais gaste horas navegando em sites lentos e confusos atrás de um arquivo.",
  },
  {
    icon: Search,
    title: "Busca Infinita",
    description: "Esqueça a frustração de entrar em dezenas de grupos do Telegram e não achar nada.",
  },
  {
    icon: MousePointer2,
    title: "Praticidade Zero",
    description: "Não precisa converter arquivos ou lidar com links que expiram e param de funcionar.",
  },
  {
    icon: Ban,
    title: "Anúncios Invasivos",
    description: "Livre-se de pop-ups perigosos e sites que tentam instalar vírus no seu celular.",
  },
];

export const PainSection = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden bg-black/20">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Sua Leitura Merece <span className="text-glow-wine text-primary">Praticidade</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Agora que você está no Clube, não faz sentido continuar perdendo tempo procurando livros manualmente.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((prob, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-3xl glass border-white/5 hover:border-primary/20 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                <prob.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{prob.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {prob.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-16 p-8 rounded-[2rem] glass border-gold/20 text-center relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gold italic">"A Netflix dos livros direto no seu Telegram."</h3>
          <p className="text-muted-foreground italic">Imagine ter qualquer título do mundo a um comando de distância. Conforto nível VIP.</p>
        </motion.div>
      </div>
    </section>
  );
};