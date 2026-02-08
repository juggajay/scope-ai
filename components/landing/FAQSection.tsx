"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ScrollReveal } from "./ScrollReveal";

const faqs = [
  {
    q: "What is a scope of works?",
    a: "A scope of works is a detailed document that lists every item a tradie needs to quote on for your renovation. It includes specifications, materials, compliance requirements, and exclusions — so you know exactly what you're paying for and can compare quotes like-for-like.",
  },
  {
    q: "How does ScopeAI generate the scopes?",
    a: "You upload photos of your space and answer guided questions about what you want. Our AI analyses the photos to understand your existing layout, fixtures, and condition, then generates trade-specific scope documents with detailed specifications, Australian Standards references, and provisional cost sums.",
  },
  {
    q: "Which trades are covered?",
    a: "Depending on your renovation, ScopeAI generates scopes for demolition, structural, plumbing, electrical, waterproofing, carpentry & joinery, tiling, stone benchtops, and painting. The trades are automatically determined based on your project type and answers.",
  },
  {
    q: "Are the scopes compliant with Australian Standards?",
    a: "Yes. Each scope includes references to relevant Australian Standards (AS/NZS 3000 for electrical, AS 3740 for waterproofing, etc.) and flags compliance requirements specific to your state. The scopes are designed to help tradies provide accurate, compliant quotes.",
  },
  {
    q: "Can I use the scopes to get real quotes from tradies?",
    a: "Absolutely — that's exactly what they're for. Download the PDFs, send them to 3+ tradies, and you'll receive quotes based on the same specification. No more comparing apples to orangutans.",
  },
  {
    q: "What renovation types are supported?",
    a: "Currently ScopeAI supports kitchen, bathroom, laundry, living area, and outdoor/deck renovations. Each project type has its own tailored question set and trade determination logic.",
  },
  {
    q: "Do I need to create an account?",
    a: "You can upload photos and answer questions without an account. A free account is only required when you're ready to generate — and you'll see a preview of your scopes before paying. No credit card required to start.",
  },
  {
    q: "What if my renovation is complex or heritage-listed?",
    a: "The Premium tier ($149) is designed for complex renovations and heritage properties. It includes heritage/asbestos flags, detailed provisional cost sums, and budget calibration notes to help you plan for the unexpected.",
  },
];

export function FAQSection() {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              FAQ
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Common questions
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <Accordion
            type="single"
            collapsible
            className="mt-10 sm:mt-14"
          >
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border-border"
              >
                <AccordionTrigger className="py-4 text-left text-sm font-medium hover:no-underline sm:text-base [&[data-state=open]]:text-foreground">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </div>
    </section>
  );
}
