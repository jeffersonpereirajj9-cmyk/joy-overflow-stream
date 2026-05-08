import { motion } from "framer-motion";
import { Sparkles, Heart, Coffee, Moon, Sun } from "lucide-react";

export const WhatYouGet = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-primary/5 to-black/0 pointer-events-none" />
      
      <div className="container max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block p-3 rounded-full glass border-primary/20 mb-6"
          >
            <Sparkles className="w-6 h-6 text-gold animate-pulse" />
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Imagine Nunca Mais Perder Tempo <span className="text-primary">Procurando Livros…</span></h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            Sabe aquele momento que você quer muito ler um livro específico, mas desiste só de pensar na dor de cabeça para achá-lo? Com o Bot VIP, isso acabou.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <motion.div 
            whileHover={{ y: -10 }}
            className="p-8 rounded-[2.5rem] glass border-white/5 text-center flex flex-col items-center group"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-4">Leitura Sem Esforço</h3>
            <p className="text-muted-foreground text-sm">O bot faz a curadoria e entrega o arquivo limpo, sem vírus e sem enrolação.</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -10 }}
            className="p-8 rounded-[2.5rem] glass border-gold/10 text-center flex flex-col items-center group"
          >
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-all">
              <Coffee className="w-8 h-8 text-gold" />
            </div>
            <h3 className="text-xl font-bold mb-4">Descoberta Constante</h3>
            <p className="text-muted-foreground text-sm">Descubra novos títulos navegando pelas sugestões automáticas do bot VIP.</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -10 }}
            className="p-8 rounded-[2.5rem] glass border-accent/10 text-center flex flex-col items-center group"
          >
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-all">
              <Sun className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-4">Acesso 24/7</h3>
            <p className="text-muted-foreground text-sm">Seja de madrugada ou no meio do dia, sua biblioteca está sempre acordada para você.</p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[3rem] overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-90" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-30" />
          
          <div className="relative p-12 md:p-20 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">Você merece a melhor experiência literária possível.</h3>
              <p className="text-white/80 text-lg mb-8 italic">"Entrar no Clube das Leitoras foi o seu primeiro passo. O Bot VIP é o que torna tudo verdadeiramente mágico e prático."</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 px-4 py-2 bg-black/20 rounded-full border border-white/10 text-white text-sm">
                  <Moon className="w-4 h-4" />
                  Conforto Premium
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-black/20 rounded-full border border-white/10 text-white text-sm">
                  <Sparkles className="w-4 h-4 text-gold" />
                  Upgrade VIP
                </div>
              </div>
            </div>
            <div className="relative shrink-0 hidden lg:block">
              <div className="w-64 h-64 rounded-full border-2 border-white/20 flex items-center justify-center animate-spin-slow">
                 <div className="w-48 h-48 rounded-full border border-white/40 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center">
                       <Heart className="w-16 h-16 text-white fill-white/20" />
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};