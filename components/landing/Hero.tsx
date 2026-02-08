"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, Shield, ArrowRight, Zap, CheckCircle2 } from "lucide-react";

export const Hero = () => {
  // Generate stable random positions for particles to avoid hydration errors
  const particles = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center hero-modern-bg">
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center z-10">
        
        {/* Animated Orbs Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="orb orb-violet absolute w-96 h-96 -top-48 -left-48"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="orb orb-secondary absolute w-96 h-96 -bottom-48 -right-48"
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="orb orb-violet absolute w-64 h-64 top-1/2 right-1/4 opacity-20"
            animate={{
              x: [0, -50, 0],
              y: [0, 100, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Floating Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Badge */}
        <motion.div
          className="mb-6 inline-flex items-center gap-2 glass-modern px-4 py-2 rounded-full backdrop-blur-xl border border-primary/20 shadow-lg"
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Zap className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Powered by Advanced AI
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="mb-6 max-w-5xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-foreground leading-[1.1]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Build Software <br />
          <motion.span
            className="text-gradient-custom inline-block"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Without Ambiguity.
          </motion.span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="mb-10 max-w-3xl text-lg md:text-xl lg:text-2xl text-muted-foreground/90 leading-relaxed font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          The world's first AI-native platform that clarifies, structures, and generates
          professional requirements specifications. Eliminate bugs before you even write a single line of code.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-4 mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link href="/auth/register">
            <Button
              size="lg"
              className="h-14 px-10 text-lg rounded-xl shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-primary/90 text-white border-0 font-bold group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            </Button>
          </Link>
          <Link href="#demo">
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-10 text-lg rounded-xl border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 font-semibold group"
            >
              Watch Demo
              <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {/* Free features */}
        <motion.div
          className="flex flex-wrap justify-center items-center gap-4 mb-16 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="font-semibold">Free to start</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="font-semibold">No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="font-semibold">Cancel anytime</span>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="flex flex-wrap justify-center items-center gap-8 md:gap-12 text-sm text-muted-foreground glass-modern px-8 py-6 rounded-2xl border border-primary/10 shadow-2xl backdrop-blur-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.div
            className="flex items-center gap-3 group cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-bold text-foreground">500+</div>
              <div className="text-xs text-muted-foreground">Active Teams</div>
            </div>
          </motion.div>
          <motion.div
            className="flex items-center gap-3 group cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-bold text-foreground">Enterprise</div>
              <div className="text-xs text-muted-foreground">Security</div>
            </div>
          </motion.div>
          <motion.div
            className="flex items-center gap-3 group cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-bold text-foreground">10k+</div>
              <div className="text-xs text-muted-foreground">Specs Generated</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2, repeat: Infinity, repeatType: "reverse" }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-2 bg-primary rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
