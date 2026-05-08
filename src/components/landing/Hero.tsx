import { motion } from "framer-motion";
import { BookOpen, Send, Zap, ShieldCheck, Sparkles, ShoppingCart, Download } from "lucide-react";
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

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <a 
              href="https://pay.cakto.com.br/y32stdm_878339"
              className="w-full sm:w-auto"
            >
              <Button size="xl" variant="hero" className="group bg-primary hover:bg-primary/90 text-white border-none shadow-lg shadow-primary/20 w-full text-base sm:text-lg h-14 sm:h-16 animate-pulse">
                LIBERAR MEU BOT VIP AGORA
                <Send className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </a>
          </div>

          <div className="flex items-center gap-2 mb-8">
            <div className="flex text-gold">
              {"★★★★★".split("").map((star, i) => (
                <span key={i} className="text-lg">★</span>
              ))}
            </div>
            <span className="text-sm text-muted-foreground font-medium">
              Utilizado por mais de 4.721 leitoras VIPs
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold" />
              <span>Experiência VIP</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gold" />
              <span>Netflix dos Livros (Kindle Ready)</span>
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
            <div className="h-full flex flex-col bg-[#17212b] font-sans">
              <div className="h-14 bg-[#242f3d] flex items-center px-4 gap-3 shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm border border-white/20">C</div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-[13px] font-semibold flex items-center gap-1">
                    Bot Clube das Leitoras 
                    <div className="bg-gold text-[8px] px-1 rounded text-black font-black leading-none py-0.5">VIP</div>
                  </div>
                  <div className="text-green-400 text-[9px] flex items-center gap-1">
                    <span className="w-1 h-1 bg-green-500 rounded-full animate-ping" />
                    online
                  </div>
                </div>
              </div>

              <div className="flex-1 p-3 flex flex-col gap-4 overflow-y-auto scrollbar-hide">
                <div className="self-start bg-[#242f3d] text-white p-3 rounded-2xl rounded-tl-none text-[11px] max-w-[85%] shadow-sm border border-white/5">
                  Olá Leitora VIP! Qual livro você deseja ler agora? ✨
                </div>

                {/* Busca 1 */}
                <div className="flex flex-col gap-2">
                  <div className="self-end bg-primary/90 text-white p-2.5 rounded-2xl rounded-br-none text-[11px] border border-white/10">
                    🔎 É Assim Que Acaba
                  </div>
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="self-start bg-[#242f3d] text-white p-3 rounded-2xl rounded-tl-none text-[11px] max-w-[90%] border border-primary/20 glow-wine"
                  >
                    <div className="font-bold mb-2 text-gold flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Resultado Encontrado!
                    </div>
                    <div className="flex gap-3 mb-3 bg-black/30 p-2 rounded-xl border border-white/5">
                      <img src="https://i.postimg.cc/FRy2KTPL/images-(2).jpg" alt="É Assim Que Acaba" className="w-10 h-14 object-cover rounded shadow-sm shrink-0" />
                      <div className="flex-1 text-[10px]">
                        <div className="font-bold text-white">É Assim Que Acaba</div>
                        <div className="text-white/60">Colleen Hoover</div>
                        <div className="flex gap-2 mt-1">
                          <span className="text-green-400">✅ PDF</span>
                          <span className="text-green-400">✅ EPUB</span>
                        </div>
                      </div>
                    </div>
                    <button className="w-full py-2 bg-primary rounded-lg font-bold text-[10px] shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer hover:bg-primary/90 transition-colors">
                      <Download className="w-3 h-3" /> BAIXAR AGORA
                    </button>
                  </motion.div>
                </div>

                {/* Busca 2 */}
                <div className="flex flex-col gap-2">
                  <div className="self-end bg-primary/90 text-white p-2.5 rounded-2xl rounded-br-none text-[11px] border border-white/10">
                    🔎 A Hipótese do Amor
                  </div>
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                    className="self-start bg-[#242f3d] text-white p-3 rounded-2xl rounded-tl-none text-[11px] max-w-[90%] border border-accent/20"
                  >
                    <div className="flex gap-3 mb-3 bg-black/30 p-2 rounded-xl border border-white/5">
                      <img src="https://i.postimg.cc/jjz86LyG/images-(3).jpg" alt="A Hipótese do Amor" className="w-10 h-14 object-cover rounded shadow-sm shrink-0" />
                      <div className="flex-1 text-[10px]">
                        <div className="font-bold text-white">A Hipótese do Amor</div>
                        <div className="text-white/60">Ali Hazelwood</div>
                        <div className="text-green-400 mt-1">✅ Arquivos Disponíveis</div>
                      </div>
                    </div>
                    <button className="w-full py-2 bg-accent/80 rounded-lg font-bold text-[10px] flex items-center justify-center gap-2 cursor-pointer hover:bg-accent transition-colors">
                      <Download className="w-3 h-3" /> ENVIAR ARQUIVO
                    </button>
                  </motion.div>
                </div>

                {/* Busca 3 */}
                <div className="flex flex-col gap-2">
                  <div className="self-end bg-primary/90 text-white p-2.5 rounded-2xl rounded-br-none text-[11px] border border-white/10">
                    🔎 Verity
                  </div>
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.8 }}
                    className="self-start bg-[#242f3d] text-white p-3 rounded-2xl rounded-tl-none text-[11px] max-w-[90%] border border-primary/20"
                  >
                    <div className="flex gap-3 mb-3 bg-black/30 p-2 rounded-xl border border-white/5">
                      <img src="https://i.postimg.cc/WbB69spD/9171o6Amn-CL-UF1000-1000-QL80.jpg" alt="Verity" className="w-10 h-14 object-cover rounded shadow-sm shrink-0" />
                      <div className="flex-1 text-[10px]">
                        <div className="font-bold text-white">Verity</div>
                        <div className="text-white/60">Colleen Hoover</div>
                        <div className="text-green-400 mt-1">✅ Pronto para Envio</div>
                      </div>
                    </div>
                    <button className="w-full py-2 bg-primary/80 rounded-lg font-bold text-[10px] flex items-center justify-center gap-2 cursor-pointer hover:bg-primary transition-colors">
                      <Download className="w-3 h-3" /> BAIXAR AGORA
                    </button>
                  </motion.div>
                </div>
              </div>

              <div className="h-14 bg-[#242f3d] flex items-center px-4 shrink-0">
                <div className="flex-1 bg-black/20 h-9 rounded-full px-4 flex items-center text-white/40 text-[10px] italic border border-white/5">
                  Digite o nome do livro...
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
};