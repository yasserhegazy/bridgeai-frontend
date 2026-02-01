"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, Shield, ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex flex-col items-center justify-center text-center hero-modern-bg pt-32 pb-20 px-4">

      {/* Animated Orbs Background - Monochromatic violet palette */}
      <div className="orb orb-violet w-[500px] h-[500px] top-[-10%] left-[-10%]" />
      <div className="orb orb-secondary w-[400px] h-[400px] bottom-[10%] right-[-5%]" style={{ animationDelay: '-5s' }} />
      <div className="orb orb-violet w-[300px] h-[300px] top-[40%] right-[20%]" style={{ animationDelay: '-10s', opacity: 0.2 }} />

      {/* Badge */}
      <motion.div
        className="glass-modern px-5 py-2.5 rounded-full text-muted-foreground text-xs font-semibold tracking-wider mb-8 flex items-center gap-3 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-gradient-custom font-bold">V2.0</span>
        <span className="text-muted-foreground uppercase">Precision-Driven AI Requirements</span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        className="mb-8 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.1] z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        Build Software <br />
        <span className="text-gradient-custom">Without Ambiguity.</span>
      </motion.h1>

      {/* Subheadline - Larger and more prominent since image is gone */}
      <motion.p
        className="mb-12 max-w-3xl text-lg md:text-xl text-muted-foreground/90 z-10 leading-relaxed font-medium"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        The world's first AI-native platform that clarifies, structures, and generates
        professional requirements specifications. Eliminate bugs before you even write a single line of code.
      </motion.p>

      {/* CTAs - Single prominent button */}
      <motion.div
        className="flex flex-col items-center gap-6 z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <Link href="/auth/register">
          <Button
            size="lg"
            className="h-11 px-8 text-base rounded-lg shadow-xl shadow-primary/10 hover:shadow-primary/25 transition-all duration-300 hover:scale-105 bg-primary text-white border-0 font-bold group"
          >
            Get started
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        <p className="text-sm text-muted-foreground font-semibold tracking-tight uppercase">
          Free to start • No credit card required
        </p>
      </motion.div>

      {/* Trust Indicators */}
      <motion.div
        className="mt-24 flex flex-wrap justify-center items-center gap-8 md:gap-16 text-sm text-muted-foreground z-10 bg-white/40 backdrop-blur-md px-10 py-5 rounded-3xl border border-white/20 shadow-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.6 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold underline decoration-primary/20 decoration-2 underline-offset-4">500+ Active Teams</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold underline decoration-primary/20 decoration-2 underline-offset-4">Enterprise Security</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold underline decoration-primary/20 decoration-2 underline-offset-4">10k+ Specs Generated</span>
        </div>
      </motion.div>
    </section>
  );
}
