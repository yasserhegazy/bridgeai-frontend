"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FadeInSection } from "./FadeInSection";

const faqs = [
  {
    question: "How is this different from manual documentation?",
    answer:
      "BridgeAI uses AI-powered clarification agents to detect ambiguities before document generation, ensuring complete and structured requirements. Traditional manual documentation often misses critical details and takes days to complete. BridgeAI delivers professional CRS documents in minutes with 95% less time investment, while maintaining industry-standard quality through automated template filling and validation.",
  },
  {
    question: "What's included in the CRS document?",
    answer:
      "Every CRS includes 15+ structured sections: Project Title & Description, Functional Requirements (with ID, priority, and descriptions), Non-Functional Requirements (performance, security, scalability), Stakeholders, Target Users, Technical Specifications & Integrations, Constraints (budget, timeline, technical), Success Metrics, Objectives, and more. All documents include automatic versioning and complete audit trails.",
  },
  {
    question: "Can I customize the CRS template?",
    answer:
      "Yes! Professional and Enterprise plans allow custom CRS templates tailored to your organization's standards. You can define custom sections, modify field requirements, add industry-specific terminology, and create reusable templates for different project types. The Free plan uses our standard industry-compliant template.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. BridgeAI employs enterprise-grade security including encrypted data transmission (TLS 1.3), bcrypt password hashing, JWT-based authentication, and secure database storage. We never share your project data with third parties. Enterprise plans include additional security features like SSO, SAML authentication, and on-premise deployment options.",
  },
  {
    question: "How does the BA approval workflow work?",
    answer:
      "After a client generates a CRS through conversation, it enters 'draft' status. The client can review and submit for approval, changing the status to 'under_review'. Business Analysts receive notifications and can access the CRS Dashboard to review structured requirements. BAs can add comments, request changes, and either approve or reject the CRS with detailed reasoning. All actions are tracked in the audit trail with timestamps and version history.",
  },
  {
    question: "What AI models power BridgeAI?",
    answer:
      "BridgeAI uses a multi-agent architecture powered by LangGraph orchestration. We leverage Groq's llama-3.3-70b-versatile model for fast CRS extraction and template filling, OpenAI GPT-4 for creative suggestions, and ChromaDB with SentenceTransformer embeddings for semantic memory and context retention. This combination ensures both speed and quality in requirement generation.",
  },
  {
    question: "Can I export my CRS documents?",
    answer:
      "Yes! All plans include export capabilities. You can download your CRS as professional PDF documents or Markdown files. PDFs include proper formatting, headers, footers, and styling suitable for client presentation. Markdown exports are perfect for version control integration and documentation systems. You can also export conversation transcripts to review the full requirement gathering process.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 md:py-32">
      <div className="container mx-auto max-w-4xl px-6">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about BridgeAI
          </p>
        </div>

        {/* FAQ Accordion */}
        <FadeInSection>
          <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        </FadeInSection>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Still have questions?{" "}
            <a href="#contact" className="text-primary hover:underline font-medium">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
