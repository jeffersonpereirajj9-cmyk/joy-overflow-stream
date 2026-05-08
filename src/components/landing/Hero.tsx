import { motion } from "framer-motion";
import { BookOpen, Send, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-16 px-4">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="container max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-primary/20 text-primary text-xs font-semibold mb-6">
            <Zap className="w-3 h-3 fill-primary" />
            <span>ACESSO INSTANTÂNEO VIA TELEGRAM</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            Tenha Sua Própria <span className="text-glow-purple text-primary">Biblioteca Digital</span> Ilimitada no Telegram 📚
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed">
            Crie seu próprio bot privado capaz de encontrar livros automaticamente em segundos direto no seu celular. O "hack" definitivo para leitores inteligentes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button size="xl" variant="hero" className="group">
              QUERO MEU BOT AGORA
              <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold" />
              <span>Acesso Vitalício</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gold" />
              <span>+1 Milhão de Títulos</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="relative lg:h-[600px] flex items-center justify-center"
        >
          {/* Mockup Container */}
          <div className="relative w-full max-w-[300px] aspect-[9/19] rounded-[3rem] border-8 border-white/10 glass glow-purple overflow-hidden shadow-2xl">
            {/* Telegram App Interface Simulation */}
            <div className="h-full flex flex-col bg-[#17212b]">
              <div className="h-14 bg-[#242f3d] flex items-center px-4 gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-primary font-bold text-xs">B</div>
                <div>
                  <div className="text-white text-sm font-semibold">Bot de Livros v2.0</div>
                  <div className="text-primary text-[10px]">online</div>
                </div>
              </div>
              <div className="flex-1 p-4 flex flex-col gap-4">
                <div className="self-start bg-[#242f3d] text-white p-3 rounded-2xl rounded-tl-none text-xs max-w-[80%]">
                  Olá! Qual livro você está procurando hoje? 📚
                </div>
                <div className="self-end bg-primary text-white p-3 rounded-2xl rounded-br-none text-xs">
                  A Psicologia Financeira
                </div>
                <div className="self-start bg-[#242f3d] text-white p-3 rounded-2xl rounded-tl-none text-xs max-w-[80%] glow-purple">
                  <div className="font-bold mb-1">Livro Encontrado! ✅</div>
                  <div className="flex items-center gap-2 mb-2 p-2 bg-black/20 rounded-lg">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span>Morgan_Housel.pdf</span>
                  </div>
                  <button className="w-full py-1.5 bg-primary rounded-md font-bold text-[10px] mt-1">BAIXAR AGORA</button>
                </div>
              </div>
              <div className="h-14 bg-[#242f3d] flex items-center px-4">
                <div className="flex-1 bg-black/20 h-9 rounded-full px-4 flex items-center text-white/40 text-xs">
                  Mensagem...
                </div>
              </div>
            </div>
          </div>

          {/* Floating elements */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 -right-4 md:right-0 p-4 glass rounded-2xl border-gold/30 glow-gold z-20"
          >
            <div className="text-gold font-bold text-sm">PDF + EPUB ⚡</div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 -left-10 p-4 glass rounded-2xl border-primary/30 glow-purple z-20"
          >
            <div className="text-primary font-bold text-sm">Acesso Gratuito 🔥</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
