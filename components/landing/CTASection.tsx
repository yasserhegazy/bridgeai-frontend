"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SampleCRSModal } from "./SampleCRSModal";
import { ArrowRight, Sparkles } from "lucide-react";
import { FadeInSection } from "./FadeInSection";

export function CTASection() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-background">
      {/* Background with subtle monochromatic gradients */}
      <div className="absolute inset-0 hero-modern-bg opacity-30" />

      {/* Decorative Orbs - Monochromatic */}

      <div className="container mx-auto max-w-5xl px-6 text-center relative z-10">
        <FadeInSection>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold tracking-widest text-primary uppercase">Transform Your Workflow</span>
          </div>

          <h2 className="mb-6 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-foreground">
            Ready to Build With <br />
            <span className="text-gradient-custom">Full Clarity?</span>
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl font-medium leading-relaxed">
            Join enterprise teams leveraging AI to create
            professional software specifications in hours, not weeks.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="gap-3 text-base px-8 h-11 rounded-lg shadow-xl shadow-primary/10 hover:shadow-primary/25 transition-all duration-300 hover:scale-105 bg-primary text-white border-0 font-bold"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <SampleCRSModal />
          </div>

          <p className="mt-10 text-sm font-bold text-muted-foreground tracking-tight uppercase">
            Free trial included • No credit card required • Instant setup
          </p>
        </FadeInSection>
      </div>
    </section>
  );
}
