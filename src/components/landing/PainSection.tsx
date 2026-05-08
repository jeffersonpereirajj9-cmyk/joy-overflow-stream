import { motion } from "framer-motion";
import { Search, Ban, DollarSign, Clock, Layout } from "lucide-react";

const problems = [
  {
    icon: Clock,
    title: "Perda de Tempo",
    description: "Horas navegando em sites lentos e confusos atrás de um simples PDF.",
  },
  {
    icon: Ban,
    title: "Links Quebrados",
    description: "Frustração de encontrar o título e descobrir que o download não funciona.",
  },
  {
    icon: Layout,
    title: "Anúncios Excessivos",
    description: "Pop-ups invasivos e riscos de segurança em sites de procedência duvidosa.",
  },
  {
    icon: DollarSign,
    title: "Preços Abusivos",
    description: "Livros físicos custando uma fortuna enquanto o conhecimento deveria ser acessível.",
  },
];

export const PainSection = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Cansado de <span className="text-primary">Dificuldades</span> para Ler?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A maioria dos leitores perde mais tempo tentando encontrar o livro do que realmente lendo.
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
              className="p-8 rounded-3xl glass border-white/5 hover:border-primary/20 transition-colors group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <prob.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{prob.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {prob.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
