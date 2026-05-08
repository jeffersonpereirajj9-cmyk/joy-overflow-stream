import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Funciona no celular?",
    a: "Sim! Funciona perfeitamente em Android e iPhone através do aplicativo oficial do Telegram."
  },
  {
    q: "Precisa instalar algo?",
    a: "Não. Você só precisa ter o Telegram instalado. O sistema funciona como um bot dentro do próprio app."
  },
  {
    q: "É difícil configurar?",
    a: "De forma alguma. Nosso tutorial em vídeo mostra como configurar tudo em menos de 5 minutos, mesmo que você não tenha conhecimento técnico."
  },
  {
    q: "Recebo na hora?",
    a: "Sim. O acesso é enviado automaticamente para o seu e-mail assim que o pagamento for confirmado."
  },
  {
    q: "O pagamento é seguro?",
    a: "Totalmente. Utilizamos as plataformas de pagamento mais seguras do Brasil, com criptografia de ponta a ponta."
  }
];

export const FAQ = () => {
  return (
    <section className="py-24 px-4 bg-secondary/10">
      <div className="container max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Dúvidas Frequentes</h2>
          <p className="text-muted-foreground">Tudo o que você precisa saber antes de começar.</p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="glass rounded-2xl border-white/5 px-6">
              <AccordionTrigger className="text-left font-bold text-lg hover:text-primary transition-colors">
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
