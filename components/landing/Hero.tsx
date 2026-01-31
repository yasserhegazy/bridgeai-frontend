"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Sparkles, Users, Shield } from "lucide-react";

export const Hero = () => {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center text-center hero-modern-bg pt-20 pb-20 px-4">

      {/* Animated Orbs Background */}
      <div className="orb orb-violet w-[500px] h-[500px] top-[-10%] left-[-10%]" />
      <div className="orb orb-cyan w-[400px] h-[400px] bottom-[10%] right-[-5%]" style={{ animationDelay: '-5s' }} />
      <div className="orb orb-violet w-[300px] h-[300px] top-[40%] right-[20%]" style={{ animationDelay: '-10s', opacity: 0.2 }} />

      {/* Badge */}
      <motion.div
        className="glass-modern px-5 py-2.5 rounded-full text-muted-foreground text-xs font-semibold tracking-wider mb-10 flex items-center gap-3 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Sparkles className="w-4 h-4 text-violet-500" />
        <span className="text-gradient-custom font-bold">NEW</span>
        <span className="text-muted-foreground">AI-Powered Requirements • V2.0</span>
      </motion.div>

      {/* Hero Logo with Glow Effect */}
      <motion.div
        className="mb-10 relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
      >
        <div className="relative">
          <Image
            src="/hero-logo-wordmark.png"
            alt="BridgeAI Wordmark Logo"
            width={500}
            height={200}
            className="w-auto h-auto max-w-[340px] md:max-w-[440px] logo-animate"
            priority
          />
          {/* Glow ring behind logo */}
          <div className="absolute inset-0 -z-10 scale-110 blur-3xl opacity-30 bg-gradient-to-br from-violet-500 via-transparent to-cyan-500 rounded-full" />
        </div>
      </motion.div>

      {/* Headline */}
      <motion.h1
        className="mb-6 max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl text-foreground leading-[1.05] z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        Build Software <br />
        <span className="text-gradient-custom">Without Ambiguity.</span>
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        className="mb-10 max-w-2xl text-lg md:text-xl text-muted-foreground/90 z-10 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        Transform vague ideas into professional requirements specifications in minutes.
        Our AI agents clarify ambiguities before they become costly bugs.
      </motion.p>

      {/* CTAs */}
      <motion.div
        className="flex flex-col items-center gap-4 sm:flex-row z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <Link href="/auth/login">
          <Button
            size="lg"
            className="h-14 px-10 text-lg rounded-full shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-300 hover:scale-105 bg-gradient-to-r from-violet-600 to-cyan-500 text-white border-0 font-semibold"
          >
            Start Your Project
          </Button>
        </Link>
        <Button
          size="lg"
          variant="outline"
          className="h-14 px-8 text-lg rounded-full gap-2 glass-modern hover:bg-primary/10 text-foreground transition-all duration-300 hover:scale-105"
          onClick={() => setShowDemo(true)}
        >
          <Play className="h-5 w-5 fill-current" />
          Watch Demo
        </Button>
      </motion.div>

      {/* Trust Indicators */}
      <motion.div
        className="mt-16 flex flex-col sm:flex-row items-center gap-6 sm:gap-10 text-sm text-muted-foreground z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.7 }}
      >
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-violet-500" />
          <span>Trusted by <strong className="text-foreground">500+</strong> Teams</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-500" />
          <span><strong className="text-foreground">99.9%</strong> Uptime SLA</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-500" />
          <span><strong className="text-foreground">10k+</strong> CRS Generated</span>
        </div>
      </motion.div>

      {/* Demo Modal */}
      {showDemo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowDemo(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative max-w-5xl w-full glass-modern rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video bg-black/50 flex items-center justify-center relative">
              <button
                onClick={() => setShowDemo(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                ✕
              </button>
              <p className="text-white/70">Demo Video Coming Soon</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}

