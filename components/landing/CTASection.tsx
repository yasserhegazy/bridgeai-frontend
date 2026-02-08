"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SampleCRSModal } from "./SampleCRSModal";
import { ArrowRight, Sparkles, Zap, CheckCircle2 } from "lucide-react";
import { FadeInSection } from "./FadeInSection";

export function CTASection() {
  return (
    <section className="py-24 md:py-36 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
      <div className="absolute inset-0 hero-modern-bg opacity-50" />

      {/* Animated Orbs */}
      <motion.div
        className="orb orb-violet absolute w-96 h-96 top-0 left-0 -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="orb orb-secondary absolute w-96 h-96 bottom-0 right-0 translate-x-1/2 translate-y-1/2"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(52,27,171,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(52,27,171,0.05)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]" />

      <div className="container mx-auto max-w-6xl px-6 relative z-10">
        <FadeInSection>
          <div className="text-center">
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 rounded-full glass-modern border border-primary/20 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Zap className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-bold text-primary">Transform Your Workflow Today</span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Ready to Build With <br />
              <span className="text-gradient-custom">Full Clarity?</span>
            </motion.h2>

            {/* Subheading */}
            <motion.p
              className="mx-auto mb-12 max-w-3xl text-lg text-muted-foreground md:text-xl lg:text-2xl font-medium leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Join enterprise teams leveraging AI to create
              professional software specifications in hours, not weeks.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col items-center gap-5 sm:flex-row sm:justify-center mb-12"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="gap-3 text-lg px-12 h-14 rounded-xl shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-primary/90 text-white border-0 font-bold group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Start Building Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </Button>
              </Link>
              <SampleCRSModal />
            </motion.div>

            {/* Trust badges */}
            <motion.div
              className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="font-semibold">Free trial included</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="font-semibold">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="font-semibold">Setup in minutes</span>
              </div>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {[
                { number: "95%", label: "Faster Documentation" },
                { number: "500+", label: "Active Teams" },
                { number: "10k+", label: "Specs Generated" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="p-6 rounded-2xl glass-modern border border-primary/10 hover:border-primary/30 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="text-4xl font-black bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground font-semibold">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
