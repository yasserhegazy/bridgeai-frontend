"use client";

import { Card } from "@/components/ui/card";
import { Zap, Users, FileText } from "lucide-react";
import { FadeInSection } from "./FadeInSection";

const pillars = [
  {
    icon: Zap,
    title: "AI-Powered Intelligence",
    description:
      "Multi-agent system detects ambiguities before they become problems. Automatic clarification ensures complete, structured requirements.",
    stat: "95% Faster",
    statLabel: "Than manual documentation",
    color: "text-yellow-500",
  },
  {
    icon: Users,
    title: "Seamless Collaboration",
    description:
      "Real-time chat with instant AI feedback. Built-in review workflow with commenting system for structured BA-client collaboration.",
    stat: "Real-time",
    statLabel: "WebSocket-based updates",
    color: "text-blue-500",
  },
  {
    icon: FileText,
    title: "Professional Documentation",
    description:
      "Industry-standard CRS templates with automatic versioning. Export to PDF or Markdown with complete audit trail.",
    stat: "15+ Fields",
    statLabel: "Structured template sections",
    color: "text-green-500",
  },
];

export function ValueProposition() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Why Choose BridgeAI?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Three core pillars that transform how requirements are gathered,
            structured, and approved.
          </p>
        </div>

        {/* Three Pillars */}
        <div className="grid gap-8 md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <FadeInSection key={index} delay={index * 150}>
              <Card
                className="group relative overflow-hidden p-8 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:shadow-primary/10 border-2 hover:border-primary/20"
              >
              {/* Icon */}
              <div className={`mb-6 ${pillar.color}`}>
                <pillar.icon className="h-12 w-12" strokeWidth={1.5} />
              </div>

              {/* Content */}
              <h3 className="mb-3 text-xl font-semibold">{pillar.title}</h3>
              <p className="mb-6 text-muted-foreground leading-relaxed">
                {pillar.description}
              </p>

              {/* Stat */}
              <div className="mt-auto">
                <div className="text-2xl font-bold">{pillar.stat}</div>
                <div className="text-sm text-muted-foreground">
                  {pillar.statLabel}
                </div>
              </div>

              {/* Screenshot Placeholder */}
              <div className="mt-6 aspect-video rounded-lg border bg-muted/50 flex items-center justify-center text-xs text-muted-foreground transition-all duration-300 group-hover:bg-muted">
                UI Preview
              </div>
              </Card>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}
