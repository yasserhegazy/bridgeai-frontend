"use client";

import { useRef } from "react";
import { Card } from "@/components/ui/card";
import {
  MessageSquare,
  Search,
  FileEdit,
  FileCheck,
  UserCheck,
  CheckCircle2,
} from "lucide-react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const steps = [
  {
    number: 1,
    icon: MessageSquare,
    title: "Project Initiation",
    description:
      "Clients describe their software vision through natural conversation with the Neural Extraction Engine.",
    tech: "WS_INIT_SESSION",
  },
  {
    number: 2,
    icon: Search,
    title: "Semantic Analysis",
    description:
      "Agentic Framework detects ambiguities and executes deep-reasoning loops to verify intent.",
    tech: "AGENT_RESOLVE",
  },
  {
    number: 3,
    icon: FileEdit,
    title: "Structural Extraction",
    description:
      "Requirement models map conversation data into 15+ specialized CRS functional modules.",
    tech: "DATA_MAPPING",
  },
  {
    number: 4,
    icon: FileCheck,
    title: "Auto-Templating",
    description:
      "System populates industry-standard templates with prioritized requirements and technical constraints.",
    tech: "SPEC_GENERATION",
  },
  {
    number: 5,
    icon: UserCheck,
    title: "Analyst Audit",
    description:
      "Human-in-the-loop verification where Business Analysts fine-tune and finalize generated specs.",
    tech: "HITL_VALIDATION",
  },
  {
    number: 6,
    icon: CheckCircle2,
    title: "Final Execution",
    description:
      "Approved CRS is committed to the immutable audit trail and exported as high-fidelity documents.",
    tech: "AUDIT_COMMIT",
  },
];

export function Workflow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scrollLine = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section id="workflow" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary border border-primary/10 font-mono font-black text-[10px] tracking-[0.2em] uppercase mb-6"
          >
            Procedural Methodology
          </motion.div>
          <motion.h2
            className="mb-8 text-3xl font-black tracking-tight sm:text-5xl md:text-6xl text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            The Automated <br />
            <span className="text-primary italic">Transformation Line.</span>
          </motion.h2>
          <motion.p
            className="mx-auto max-w-2xl text-lg text-muted-foreground font-medium leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            A high-precision sequence designed to eliminate technical debt
            at the source. Intent matched to specification with zero friction.
          </motion.p>
        </div>

        {/* Global Timeline Layer */}
        <div ref={containerRef} className="relative mt-20">

          {/* Central 1px Thread Line */}
          <div className="absolute left-[30px] md:left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 bg-gray-100 z-0">
            <motion.div
              className="absolute top-0 left-0 right-0 bg-primary origin-top h-full"
              style={{ scaleY: scrollLine }}
            />
          </div>

          {/* Cards Container */}
          <div className="relative z-10 space-y-12 md:space-y-14">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className={`flex flex-col md:flex-row items-center relative ${index % 2 === 0 ? "md:justify-end" : "md:justify-start"
                  }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
              >
                {/* Content Card - Instrument Grade */}
                <Card className="w-full md:w-[42%] p-8 md:p-10 group hover:shadow-2xl transition-all duration-500 hover:border-primary/30 bg-white border-gray-100/80 rounded-3xl relative overflow-hidden">
                  {/* Phase ID Marker */}
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="px-2.5 py-1 rounded-md bg-primary text-white font-mono font-black text-[10px] tracking-tighter">
                        PHASE 0{step.number}
                      </div>
                      <span className="text-[10px] font-mono text-gray-400 font-bold uppercase tracking-widest">{step.tech}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500">
                      <step.icon className="h-6 w-6" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-3 group-hover:text-primary transition-colors">{step.title}</h3>
                      <p className="text-muted-foreground text-base leading-relaxed font-medium">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Aesthetic Detail */}
                  <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-[0.03] transition-opacity">
                    <step.icon className="h-32 w-32 rotate-12" />
                  </div>
                </Card>

                {/* Central Step Marker Node */}
                <div className="absolute left-[30px] md:left-1/2 -translate-x-1/2 flex items-center justify-center">
                  <div className="relative">
                    <motion.div
                      className="h-10 w-10 rounded-full bg-white border border-gray-100 shadow-xl flex items-center justify-center font-mono font-black text-xs text-primary z-20"
                      whileInView={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 4 }}
                    >
                      {step.number}
                    </motion.div>

                    {/* Horizontal Branch Connector (Desktop Only) */}
                    <motion.div
                      className={`hidden md:block absolute top-1/2 h-[1px] bg-primary/20 ${index % 2 === 0 ? 'left-full w-24' : 'right-full w-24'
                        }`}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                      style={{ transformOrigin: index % 2 === 0 ? 'left' : 'right' }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Background Style */}
      <div className="absolute inset-0 bg-white -z-20" />
      <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-10 pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #f3f4f6 1px, transparent 0)`, backgroundSize: '32px 32px' }}
      />
    </section>
  );
}
