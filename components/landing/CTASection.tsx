"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SampleCRSModal } from "./SampleCRSModal";
import { ArrowRight } from "lucide-react";
import { FadeInSection } from "./FadeInSection";

export function CTASection() {
  return (
    <section className="py-20 md:py-32 bg-linear-to-br from-primary/10 via-background to-primary/5">
      <div className="container mx-auto max-w-5xl px-6 text-center">
        <FadeInSection>
          <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Ready to Transform Your Requirements Process?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Join forward-thinking teams who are already leveraging AI to create
            professional CRS documents in minutes, not days.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/auth/login">
              <Button size="lg" className="gap-2 text-base px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
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
