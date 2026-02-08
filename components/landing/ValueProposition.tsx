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
    <section id="features" className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2" />

      {/* Animated Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(52,27,171,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(52,27,171,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] -z-10" />

      <div className="container mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-sm font-bold text-primary">Why Choose BridgeAI</span>
            </motion.div>
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl max-w-3xl mx-auto">
              The Future of <span className="text-gradient-custom">Requirements Engineering</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Our unique AI architecture eliminates ambiguity and accelerates development from day one.
            </p>
          </motion.div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={cn("group relative", feature.className)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8 }}
            >
              <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:border-primary/40 transition-all duration-500 rounded-2xl overflow-hidden relative">
                {/* Animated gradient border on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/20 via-transparent to-primary/20 -z-10" />
                
                <div className="p-8 flex flex-col h-full relative z-10">
                  {/* Icon with animated background */}
                  <motion.div
                    className={cn("p-3 rounded-xl w-fit mb-6", feature.iconClass, "relative overflow-hidden")}
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="h-6 w-6 relative z-10" strokeWidth={2.5} />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1.5, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 tracking-tight group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed mb-6 text-sm flex-grow">
                    {feature.description}
                  </p>

                  {/* Stats Section */}
                  <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-black bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        {feature.stat}
                      </div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                        {feature.statLabel}
                      </div>
                    </div>
                    <motion.div
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      <ArrowRight className="w-5 h-5 text-primary" />
                    </motion.div>
                  </div>
                </div>

                {/* Decorative Background Overlay */}
                <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none", feature.imgClass)} />
                
                {/* Shine effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"
                  initial={{ x: "-100%" }}
                />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

