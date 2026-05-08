import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/landing/Hero";
import { PainSection } from "@/components/landing/PainSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { BenefitGrid } from "@/components/landing/BenefitGrid";
import { WhatYouGet } from "@/components/landing/WhatYouGet";
import { Testimonials } from "@/components/landing/Testimonials";
import { OfferSection } from "@/components/landing/OfferSection";
import { FAQ } from "@/components/landing/FAQ";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    title: "Biblioteca Digital no Telegram - Acesse Milhares de Livros",
    meta: [
      { name: "description", content: "Tenha sua própria biblioteca digital ilimitada direto no Telegram. Encontre qualquer livro em segundos." },
      { property: "og:title", content: "Biblioteca Digital no Telegram" },
      { property: "og:description", content: "O hack definitivo para leitores inteligentes." },
      { property: "og:type", content: "website" },
    ],
  }),
});

function Footer() {
  return (
    <footer className="py-12 border-t border-white/5 text-center text-muted-foreground text-sm">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-6 flex justify-center gap-8">
          <a href="#" className="hover:text-primary transition-colors">Termos de Uso</a>
          <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
          <a href="#" className="hover:text-primary transition-colors">Suporte</a>
        </div>
        <p>© 2026 Biblioteca Digital no Telegram. Todos os direitos reservados.</p>
        <p className="mt-2 opacity-50">Este site não é afiliado ao Telegram.</p>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <main className="bg-background text-foreground selection:bg-primary/30">
      <Hero />
      <PainSection />
      <HowItWorks />
      <BenefitGrid />
      <WhatYouGet />
      <Testimonials />
      <OfferSection />
      <FAQ />
      <Footer />
    </main>
  );
}
