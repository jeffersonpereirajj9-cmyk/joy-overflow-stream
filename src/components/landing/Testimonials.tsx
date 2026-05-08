import { motion } from "framer-motion";
import { Star, MessageCircle } from "lucide-react";

const reviews = [
  {
    name: "Ricardo Silva",
    handle: "@ricardos_livros",
    content: "Surreal! Consegui configurar em 3 minutos e já baixei 5 livros que eu tava querendo muito. Economizei no mínimo 200 reais hoje.",
    avatar: "RS"
  },
  {
    name: "Ana Beatriz",
    handle: "@anabea_leitora",
    content: "A praticidade de ter tudo no Telegram é o diferencial. Não preciso de app extra, só pesquiso e mando pro meu Kindle.",
    avatar: "AB"
  },
  {
    name: "Marcos Oliveira",
    handle: "@marcos_dev",
    content: "Sistema muito inteligente. O bot responde na hora. Pra quem gosta de estudar por PDFs técnicos, isso aqui é ouro.",
    avatar: "MO"
  }
];

export const Testimonials = () => {
  return (
    <section className="py-24 px-4 overflow-hidden">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Quem Já Usa, <span className="text-primary">Recomenda</span></h2>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-gold text-gold" />
            ))}
          </div>
          <p className="text-muted-foreground italic">"Simplesmente a melhor forma de ler hoje em dia"</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-[2rem] glass border-white/5 flex flex-col h-full"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                  {review.avatar}
                </div>
                <div>
                  <div className="font-bold">{review.name}</div>
                  <div className="text-xs text-muted-foreground">{review.handle}</div>
                </div>
                <MessageCircle className="ml-auto w-5 h-5 text-primary/40" />
              </div>
              <p className="text-muted-foreground flex-1 italic leading-relaxed">
                "{review.content}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
