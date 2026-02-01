"use client";

import { Card } from "@/components/ui/card";
import { Zap, Users, FileText, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Zap,
    title: "AI-Powered Intelligence",
    description:
      "Our multi-agent system proactively detects ambiguities, ensuring your requirements are crystal clear before development starts.",
    stat: "95% Faster",
    statLabel: "Than manual documentation",
    className: "col-span-1",
    imgClass: "bg-primary/5",
    iconClass: "text-primary bg-primary/10",
  },
  {
    icon: Users,
    title: "Seamless Collaboration",
    description:
      "Real-time chat with instant AI feedback + built-in review workflows.",
    stat: "Real-time",
    statLabel: "WebSocket updates",
    className: "col-span-1",
    imgClass: "bg-primary/5",
    iconClass: "text-primary bg-primary/10",
  },
  {
    icon: FileText,
    title: "Pro Documentation",
    description:
      "Industry-standard CRS templates with auto-versioning and audit trails.",
    stat: "Enterprise",
    statLabel: "Grade Exporters",
    className: "col-span-1",
    imgClass: "bg-primary/5",
    iconClass: "text-primary bg-primary/10",
  },
];

export function ValueProposition() {
  return (
    <section id="features" className="py-16 md:py-24 relative overflow-hidden bg-muted/20">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-3 text-xl font-bold tracking-tight sm:text-2xl md:text-3xl max-w-2xl text-center md:text-left">
              Why <span className="text-primary">BridgeAI</span> is the future of Requirements.
            </h2>
            <p className="max-w-lg text-sm text-muted-foreground text-center md:text-left">
              Our unique AI architecture eliminates the "blank page" problem instantly.
            </p>
          </motion.div>
        </div>

        {/* Uniform Grid - Much smaller cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={cn("group relative", feature.className)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-border/50 bg-white shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 rounded-xl overflow-hidden">
                <div className="p-4 flex flex-col h-full relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <div className={cn("p-1.5 rounded-lg w-fit", feature.iconClass)}>
                      <feature.icon className="h-4 w-4" strokeWidth={2.5} />
                    </div>
                  </div>

                  <h3 className="text-base font-bold mb-1 tracking-tight">{feature.title}</h3>
                  <p className="text-muted-foreground leading-snug mb-2 text-xs font-semibold">
                    {feature.description}
                  </p>

                  <div className="mt-auto pt-3 border-t border-gray-50 flex items-end justify-between">
                    <div>
                      <div className="text-base font-black text-primary">{feature.stat}</div>
                      <div className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">{feature.statLabel}</div>
                    </div>
                  </div>
                </div>

                {/* Decorative Background */}
                <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none", feature.imgClass)} />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

