import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Por que devo adquirir o Bot se já estou no Clube?",
    a: "O Clube dá acesso aos grupos e à comunidade. O Bot Inteligente é uma ferramenta de automação que poupa seu tempo, permitindo que você encontre qualquer livro em segundos sem precisar garimpar manualmente nos grupos."
  },
  {
    q: "O acesso é vitalício?",
    a: "Sim! Ao adquirir o upgrade hoje, você garante acesso permanente ao Bot VIP sem nenhuma mensalidade futura."
  },
  {
    q: "Como recebo o acesso?",
    a: "Imediatamente após a confirmação do upgrade, você receberá um link exclusivo no seu e-mail para ativar o seu Bot VIP no Telegram."
  },
  {
    q: "Funciona em qualquer aparelho?",
    a: "Sim, basta ter o aplicativo do Telegram instalado no seu celular (Android ou iPhone), tablet ou computador."
  },
  {
    q: "E se eu não gostar?",
    a: "Você tem 7 dias de garantia incondicional. Se não ficar satisfeita, devolvemos seu investimento integralmente."
  }
];

export const FAQ = () => {
  return (
    <section className="py-24 px-4 bg-black/20">
      <div className="container max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Dúvidas Frequentes</h2>
          <p className="text-muted-foreground italic">Tirando suas últimas dúvidas sobre o upgrade VIP.</p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="glass rounded-2xl border-white/5 px-6 group hover:border-primary/20 transition-all">
              <AccordionTrigger className="text-left font-bold text-lg hover:text-primary transition-colors py-6">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base pb-6 leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};