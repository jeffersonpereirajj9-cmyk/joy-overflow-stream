import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const StickyCTA = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling down 600px
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToOffer = () => {
    document.getElementById('oferta')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:hidden"
        >
          <div className="glass p-2 rounded-2xl border-primary/20 glow-wine shadow-2xl">
            <a href="https://pay.cakto.com.br/y32stdm_878339">
              <Button variant="hero" size="lg" className="w-full h-14 text-base bg-primary hover:bg-primary/90 border-none font-black uppercase tracking-tighter">
                GARANTIR MEU ACESSO VIP - R$19,90
                <ShoppingCart className="ml-2 w-5 h-5" />
              </Button>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};