import type { Metadata } from "next";
import { Hero } from "@/components/landing/Hero";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { SampleOutput } from "@/components/landing/SampleOutput";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { FinalCTA } from "@/components/landing/FinalCTA";

export const metadata: Metadata = {
  title: "ScopeAI — Professional Renovation Scope of Works | Australia",
  description:
    "Get professional, trade-specific scope-of-works documents for your renovation in under 10 minutes. Upload photos, answer guided questions, and get comparable quotes from tradies. Kitchen, bathroom, laundry, living, and outdoor renovations.",
  openGraph: {
    title: "ScopeAI — Get Comparable Renovation Quotes in Under 10 Minutes",
    description:
      "AI-powered renovation scope generator for Australian homeowners. Upload photos, answer guided questions, get professional trade-specific scope documents for comparable quotes.",
    type: "website",
    locale: "en_AU",
    siteName: "ScopeAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScopeAI — Get Comparable Renovation Quotes in Under 10 Minutes",
    description:
      "AI-powered renovation scope generator for Australian homeowners. Upload photos, answer guided questions, get professional trade-specific scope documents.",
  },
  keywords: [
    "scope of works",
    "renovation scope",
    "comparable quotes",
    "renovation quotes australia",
    "kitchen renovation scope",
    "bathroom renovation scope",
    "trade scope of works",
    "renovation specifications",
    "australian standards renovation",
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ScopeAI",
  url: "https://scopeai.com.au",
  description:
    "AI-powered renovation scope generator for Australian homeowners.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: [
    {
      "@type": "Offer",
      name: "Starter",
      price: "49",
      priceCurrency: "AUD",
    },
    {
      "@type": "Offer",
      name: "Professional",
      price: "99",
      priceCurrency: "AUD",
    },
    {
      "@type": "Offer",
      name: "Premium",
      price: "149",
      priceCurrency: "AUD",
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <SampleOutput />
      <PricingSection />
      <FAQSection />
      <FinalCTA />
    </>
  );
}
