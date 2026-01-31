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
    className: "md:col-span-2 md:row-span-2",
    imgClass: "bg-gradient-to-br from-violet-500/20 to-purple-500/5",
    iconClass: "text-violet-500 bg-violet-500/10",
  },
  {
    icon: Users,
    title: "Seamless Collaboration",
    description:
      "Real-time chat with instant AI feedback + built-in review workflows.",
    stat: "Real-time",
    statLabel: "WebSocket updates",
    className: "md:col-span-1 md:row-span-1",
    imgClass: "bg-gradient-to-br from-cyan-500/20 to-blue-500/5",
    iconClass: "text-cyan-500 bg-cyan-500/10",
  },
  {
    icon: FileText,
    title: "Pro Documentation",
    description:
      "Industry-standard CRS templates with auto-versioning and audit trails.",
    stat: "Enterprise",
    statLabel: "Grade Exporters",
    className: "md:col-span-1 md:row-span-1",
    imgClass: "bg-gradient-to-br from-pink-500/20 to-rose-500/5",
    iconClass: "text-pink-500 bg-pink-500/10",
  },
];

export function ValueProposition() {
  return (
    <section id="features" className="py-24 md:py-32 relative overflow-hidden bg-muted/20">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl max-w-3xl">
              Why <span className="text-primary">BridgeAI</span> is the future of Requirements.
            </h2>
            <p className="max-w-xl text-xl text-muted-foreground">
              Stop wasting time on back-and-forth emails. unique AI architecture solves the "blank page" problem instantly.
            </p>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={cn("group relative", feature.className)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-border/50 bg-card/50 backdrop-blur-xl overflow-hidden hover:border-primary/50 transition-all duration-500 card-glow">
                <div className="p-8 flex flex-col h-full relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className={cn("p-3 rounded-2xl w-fit", feature.iconClass)}>
                      <feature.icon className="h-8 w-8" strokeWidth={2} />
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-4 group-hover:translate-x-0">
                      <ArrowRight className="text-muted-foreground" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-semibold mb-3 tracking-tight">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                    {feature.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-border/50 flex items-end justify-between">
                    <div>
                      <div className="text-2xl font-bold text-foreground">{feature.stat}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{feature.statLabel}</div>
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

