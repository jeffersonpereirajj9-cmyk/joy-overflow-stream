import { motion } from "framer-motion";
import { BookOpen, Send, Zap, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-32 pb-16 px-4">
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
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold mb-8"
          >
            <Sparkles className="w-3 h-3 fill-green-400" />
            <span>PARABÉNS! SUA ENTRADA NO CLUBE DAS LEITORAS FOI CONFIRMADA 🎉</span>
          </motion.div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-primary/20 text-accent text-xs font-semibold mb-6">
            <Zap className="w-3 h-3 fill-accent" />
            <span>AGORA DESBLOQUEIE O RECURSO MAIS DESEJADO PELAS LEITORAS VIP…</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 sm:mb-6 leading-[1.2] sm:leading-[1.1]">
            Tenha Seu Acesso ao <span className="text-glow-wine text-primary">Bot Inteligente</span> Privado do Clube das Leitoras 📚✨
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-xl leading-relaxed">
            Pesquise livros automaticamente em segundos direto no Telegram sem perder tempo procurando links ou arquivos manualmente.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button size="xl" variant="hero" className="group bg-primary hover:bg-primary/90 text-white border-none shadow-lg shadow-primary/20 w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16">
              LIBERAR MEU BOT VIP AGORA
              <Send className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold" />
              <span>Experiência VIP</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gold" />
              <span>Netflix dos Livros</span>
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
          <div className="relative w-full max-w-[300px] aspect-[9/19] rounded-[3rem] border-8 border-white/10 glass glow-wine overflow-hidden shadow-2xl">
            {/* Telegram App Interface Simulation */}
            <div className="h-full flex flex-col bg-[#17212b]">
              <div className="h-14 bg-[#242f3d] flex items-center px-4 gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-primary font-bold text-xs border border-primary/50">C</div>
                <div>
                  <div className="text-white text-sm font-semibold">Bot Clube das Leitoras</div>
                  <div className="text-primary text-[10px]">online (VIP)</div>
                </div>
              </div>
              <div className="flex-1 p-4 flex flex-col gap-4">
                <div className="self-start bg-[#242f3d] text-white p-3 rounded-2xl rounded-tl-none text-xs max-w-[80%]">
                  Olá Leitora VIP! Qual livro você deseja ler agora? ✨
                </div>
                <div className="self-end bg-primary text-white p-3 rounded-2xl rounded-br-none text-xs">
                  Os Sete Maridos de Evelyn Hugo
                </div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                  className="self-start bg-[#242f3d] text-white p-3 rounded-2xl rounded-tl-none text-xs max-w-[80%] border border-primary/30 glow-wine"
                >
                  <div className="font-bold mb-1 text-gold">Livro Encontrado! 💎</div>
                  <div className="flex items-center gap-2 mb-2 p-2 bg-black/20 rounded-lg">
                    <BookOpen className="w-4 h-4 text-accent" />
                    <span>Evelyn_Hugo.epub</span>
                  </div>
                  <button className="w-full py-1.5 bg-primary rounded-md font-bold text-[10px] mt-1 shadow-inner shadow-white/20">LER AGORA</button>
                </motion.div>
              </div>
              <div className="h-14 bg-[#242f3d] flex items-center px-4">
                <div className="flex-1 bg-black/20 h-9 rounded-full px-4 flex items-center text-white/40 text-xs italic">
                  O que você quer ler hoje?...
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
            <div className="text-gold font-bold text-sm">BUSCA INSTANTÂNEA ⚡</div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 -left-10 p-4 glass rounded-2xl border-primary/30 glow-wine z-20"
          >
            <div className="text-primary font-bold text-sm">CONFORTO TOTAL 💎</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};