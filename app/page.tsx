import type { Metadata } from "next";
import {
  LandingHeader,
  Hero,
  ValueProposition,
  Workflow,
  CTASection,
  RoleFeatures,
  Pricing,
  FAQ,
  TechStack,
  Footer,
} from "@/components/landing";

export const metadata: Metadata = {
  title: {
    absolute: "BridgeAI - AI-Powered Requirements Engineering Platform",
  },
  description:
    "Transform conversations into professional CRS documents with AI. BridgeAI bridges clients and Business Analysts through intelligent requirements engineering automation.",
  openGraph: {
    title: "BridgeAI - AI-Powered Requirements Engineering Platform",
    description:
      "Transform conversations into professional CRS documents with AI. BridgeAI bridges clients and Business Analysts through intelligent automation.",
    url: "https://bridge-ai.dev",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "BridgeAI",
      url: "https://bridge-ai.dev",
      logo: "https://bridge-ai.dev/logo_with_background.png",
      description:
        "AI-powered requirements engineering platform that bridges clients and Business Analysts.",
    },
    {
      "@type": "SoftwareApplication",
      name: "BridgeAI",
      url: "https://bridge-ai.dev",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "AI-powered platform that transforms conversations into professional Customer Requirements Specification (CRS) documents.",
      offers: [
        {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          name: "Free",
          description: "Perfect for trying out BridgeAI",
        },
        {
          "@type": "Offer",
          price: "49",
          priceCurrency: "USD",
          name: "Professional",
          description: "For growing teams and active Business Analysts",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How is this different from manual documentation?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "BridgeAI uses AI-powered clarification agents to detect ambiguities before document generation, ensuring complete and structured requirements. Traditional manual documentation often misses critical details and takes days to complete. BridgeAI delivers professional CRS documents in minutes with 95% less time investment, while maintaining industry-standard quality through automated template filling and validation.",
          },
        },
        {
          "@type": "Question",
          name: "What's included in the CRS document?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Every CRS includes 15+ structured sections: Project Title & Description, Functional Requirements (with ID, priority, and descriptions), Non-Functional Requirements (performance, security, scalability), Stakeholders, Target Users, Technical Specifications & Integrations, Constraints (budget, timeline, technical), Success Metrics, Objectives, and more. All documents include automatic versioning and complete audit trails.",
          },
        },
        {
          "@type": "Question",
          name: "Can I customize the CRS template?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes! Professional and Enterprise plans allow custom CRS templates tailored to your organization's standards. You can define custom sections, modify field requirements, add industry-specific terminology, and create reusable templates for different project types. The Free plan uses our standard industry-compliant template.",
          },
        },
        {
          "@type": "Question",
          name: "How does the BA approval workflow work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "After a client generates a CRS through conversation, it enters 'draft' status. The client can review and submit for approval, changing the status to 'under_review'. Business Analysts receive notifications and can access the CRS Dashboard to review structured requirements. BAs can add comments, request changes, and either approve or reject the CRS with detailed reasoning. All actions are tracked in the audit trail with timestamps and version history.",
          },
        },
        {
          "@type": "Question",
          name: "Can I export my CRS documents?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes! All plans include export capabilities. You can download your CRS as professional PDF documents or Markdown files. PDFs include proper formatting, headers, footers, and styling suitable for client presentation. Markdown exports are perfect for version control integration and documentation systems. You can also export conversation transcripts to review the full requirement gathering process.",
          },
        },
      ],
    },
  ],
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingHeader />
      <main>
        <Hero />
        <ValueProposition />
        <Workflow />
        <CTASection />
        <RoleFeatures />
        <Pricing />
        <FAQ />
        <TechStack />
      </main>
      <Footer />
    </div>
  );
}
