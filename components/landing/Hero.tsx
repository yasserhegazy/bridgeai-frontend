"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Play } from "lucide-react";

export function Hero() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Gradient Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,oklch(0.208_0.042_265.755/0.15),transparent_50%)]" />

      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center text-center">
          {/* AI Badge */}
          <Badge
            variant="secondary"
            className="mb-6 gap-1.5 px-4 py-1.5 text-sm"
          >
            <Sparkles className="h-4 w-4" />
            Powered by Advanced AI
          </Badge>

          {/* Logo */}
          <div className="mb-6 animate-in fade-in duration-700">
            <Image
              src="/hero-transparent.png"
              alt="BridgeAI"
              width={120}
              height={120}
              className="h-28 w-auto drop-shadow-2xl md:h-32"
              priority
              style={{ backgroundColor: 'transparent' }}
            />
          </div>

          {/* Headline */}
          <h1 className="mb-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Turn Conversations into{" "}
            <span className="bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent animate-in">
              Professional Requirements
            </span>{" "}
            Documents
          </h1>

          {/* Subheadline */}
          <p className="mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            AI-powered CRS generation that bridges clients and Business
            Analysts. Get structured requirements in minutes, not days.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center gap-4 sm:flex-row animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <Link href="/auth/login">
              <Button size="lg" className="text-base px-8 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105">
                Start Your Free Project
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 text-base hover:bg-muted transition-all duration-300 hover:scale-105"
              onClick={() => setShowDemo(true)}
            >
              <Play className="h-4 w-4" />
              Watch Demo
            </Button>
          </div>

          {/* Trust Indicator */}
          <p className="mt-6 text-sm text-muted-foreground">
            No credit card required • Free forever plan available
          </p>

          {/* Screenshot Preview */}
          <div className="mt-16 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
            <div className="group overflow-hidden rounded-xl border bg-card shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-primary/10">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">
                  Chat Interface Screenshot
                </p>
                {/* Placeholder - will be replaced with actual screenshot */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Modal - Simple placeholder */}
      {showDemo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setShowDemo(false)}
        >
          <div className="relative max-w-4xl w-full mx-4">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Demo Video Placeholder</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
