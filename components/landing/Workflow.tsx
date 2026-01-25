"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeInSection } from "./FadeInSection";
import {
  MessageSquare,
  Search,
  FileEdit,
  FileCheck,
  UserCheck,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    number: 1,
    icon: MessageSquare,
    title: "Client Chat",
    description:
      "Clients describe their software needs through natural conversation with the AI assistant.",
    tech: "WebSocket Real-time",
  },
  {
    number: 2,
    icon: Search,
    title: "AI Clarification",
    description:
      "Clarification agent detects ambiguities and asks targeted questions to ensure complete requirements.",
    tech: "LangGraph Agent",
  },
  {
    number: 3,
    icon: FileEdit,
    title: "Template Filler",
    description:
      "AI extracts structured data and fills the CRS template with functional and non-functional requirements.",
    tech: "Groq LLM (llama-3.3-70b)",
  },
  {
    number: 4,
    icon: FileCheck,
    title: "CRS Generation",
    description:
      "Professional CRS document is generated with version control and stored in the database.",
    tech: "ChromaDB + MySQL",
  },
  {
    number: 5,
    icon: UserCheck,
    title: "BA Review",
    description:
      "Business Analyst reviews the structured CRS, adds comments, and provides feedback through the dashboard.",
    tech: "Comment System",
  },
  {
    number: 6,
    icon: CheckCircle2,
    title: "Approval",
    description:
      "BA approves or rejects the CRS. Approved documents can be exported as PDF or Markdown.",
    tech: "Audit Trail",
  },
];

export function Workflow() {
  return (
    <section id="workflow" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            How BridgeAI Works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            From conversation to approved CRS in six intelligent steps.
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="relative">
          {/* Vertical Line - Desktop */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-primary/50 via-primary to-primary/50 md:block" />

          {/* Steps */}
          <div className="space-y-12">
            {steps.map((step, index) => (
              <FadeInSection key={index} delay={index * 100}>
                <div
                  className={`relative flex flex-col items-center gap-8 md:flex-row ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content Card */}
                  <Card className="w-full p-6 md:w-5/12 group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-primary/30">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {step.tech}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                  {/* Screenshot Placeholder */}
                  <div className="mt-4 aspect-video rounded-lg border bg-muted/50 flex items-center justify-center text-xs text-muted-foreground">
                    Step {step.number} Preview
                  </div>
                </Card>

                {/* Number Badge - Center */}
                <div className="absolute left-1/2 hidden h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border-4 border-background bg-primary text-lg font-bold text-primary-foreground shadow-lg md:flex">
                  {step.number}
                </div>

                {/* Mobile Number Badge */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-background bg-primary text-lg font-bold text-primary-foreground shadow-lg md:hidden">
                  {step.number}
                </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden w-5/12 md:block" />
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
