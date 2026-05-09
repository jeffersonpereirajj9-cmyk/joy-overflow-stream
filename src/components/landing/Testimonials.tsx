import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Beatriz M.",
    role: "Membro VIP",
    content: "Eu confesso que estava com receio de ser difícil usar, mas é absurdo! Você só digita o nome e o livro aparece. Economizei horas de busca no Google.",
    avatar: "BM"
  },
  {
    name: "Juliana Costa",
    role: "Membro Premium",
    content: "O BookBot VIP é surreal! Ter a biblioteca na palma da mão 24h por dia mudou minha rotina de leitura. É muito prático mandar direto pro Kindle.",
    avatar: "JC"
  },
  {
    name: "Carla Silveira",
    role: "Estudante",
    content: "Gente, a velocidade disso é surreal. Achei livros raros que eu não encontrava em lugar nenhum. Vale cada centavo do upgrade!",
    avatar: "CS"
  }
];

export const Testimonials = () => {
  return (
    <section className="py-24 px-4 bg-black/40 overflow-hidden">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">O Que Nossos <span className="text-primary text-glow-wine">Membros VIP</span> Dizem</h2>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-gold text-gold" />
            ))}
          </div>
          <p className="text-muted-foreground italic">Milhares de leitoras já automatizaram suas bibliotecas.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-[2rem] glass border-white/5 flex flex-col h-full relative group hover:border-primary/30 transition-all duration-500"
            >
              <Quote className="absolute top-6 right-8 w-10 h-10 text-primary/10 group-hover:text-primary/20 transition-colors" />
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center font-bold text-white border border-white/10">
                  {review.avatar}
                </div>
                <div>
                  <div className="font-bold text-white group-hover:text-gold transition-colors">{review.name}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{review.role}</div>
                </div>
              </div>
              <p className="text-muted-foreground flex-1 italic leading-relaxed relative z-10">
                "{review.content}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};