"use client";

import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Search,
  FileEdit,
  FileCheck,
  UserCheck,
  CheckCircle2,
} from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section id="workflow" className="py-20 md:py-32 bg-muted/30 relative">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <motion.h2
            className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How BridgeAI Works
          </motion.h2>
          <motion.p
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            From conversation to approved CRS in six intelligent steps.
          </motion.p>
        </div>

        {/* Workflow Steps */}
        <div ref={containerRef} className="relative">
          {/* Vertical Line - Desktop */}
          <div className="absolute left-1/2 top-4 bottom-4 hidden w-1 -translate-x-1/2 bg-muted-foreground/20 md:block rounded-full overflow-hidden">
            <motion.div
              className="w-full bg-gradient-to-b from-primary/50 via-primary to-primary/50"
              style={{ height: "100%", scaleY, transformOrigin: "top" }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className={`relative flex flex-col items-center gap-8 md:flex-row ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* Content Card */}
                <Card className="w-full p-6 md:w-5/12 group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 relative overflow-hidden">
                  <div className="mb-4 flex items-center gap-4 relative z-10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {step.tech}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed relative z-10">
                    {step.description}
                  </p>

                  {/* Screenshot Placeholder */}
                  <div className="mt-6 aspect-video rounded-lg border bg-muted/50 flex items-center justify-center text-xs text-muted-foreground relative z-10 group-hover:bg-muted transition-colors duration-300">
                    Step {step.number} Preview
                  </div>

                  {/* Card Glow Effect */}
                  <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/5 blur-3xl transition-all duration-500 group-hover:bg-primary/10" />
                </Card>

                {/* Number Badge - Center */}
                <motion.div
                  className="absolute left-1/2 hidden h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border-4 border-background bg-primary text-lg font-bold text-primary-foreground shadow-lg md:flex z-10"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.4 }}
                >
                  {step.number}
                </motion.div>

                {/* Mobile Number Badge */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-background bg-primary text-lg font-bold text-primary-foreground shadow-lg md:hidden">
                  {step.number}
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden w-5/12 md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
