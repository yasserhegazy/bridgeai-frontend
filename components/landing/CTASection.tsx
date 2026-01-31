"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SampleCRSModal } from "./SampleCRSModal";
import { ArrowRight, Sparkles } from "lucide-react";
import { FadeInSection } from "./FadeInSection";

export function CTASection() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 hero-modern-bg opacity-50" />

      {/* Decorative Orbs */}
      <div className="orb orb-violet w-[400px] h-[400px] top-[10%] left-[5%]" style={{ opacity: 0.3 }} />
      <div className="orb orb-cyan w-[300px] h-[300px] bottom-[20%] right-[10%]" style={{ animationDelay: '-7s', opacity: 0.25 }} />

      <div className="container mx-auto max-w-5xl px-6 text-center relative z-10">
        <FadeInSection>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-violet-500" />
            <span className="text-sm font-medium text-gradient-custom">Transform Your Workflow</span>
          </div>

          <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Ready to Transform Your <br />
            <span className="text-gradient-custom">Requirements Process?</span>
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Join forward-thinking teams who are already leveraging AI to create
            professional CRS documents in minutes, not days.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/auth/login">
              <Button
                size="lg"
                className="gap-2 text-base px-10 h-14 rounded-full shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-300 hover:scale-105 bg-gradient-to-r from-violet-600 to-cyan-500 text-white border-0 font-semibold"
              >
                Start Your Free Project
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <SampleCRSModal />
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            No credit card required • 2-minute setup • Cancel anytime
          </p>
        </FadeInSection>
      </div>
    </section>
  );
}

