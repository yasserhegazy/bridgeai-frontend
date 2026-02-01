"use client";

import { Check, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FadeInSection } from "./FadeInSection";

const clientFeatures = [
  "Chat naturally with AI to describe your software needs",
  "Track CRS status in real-time from draft to approval",
  "Export professional documents as PDF or Markdown",
  "Collaborate with Business Analysts through comments",
  "Receive notifications on approval status changes",
  "Access complete conversation history and version control",
];

const baFeatures = [
  "Review structured CRS documents in centralized dashboard",
  "Add detailed comments and feedback on requirements",
  "Approve or reject CRS with one click and reasoning",
  "Filter and sort by status, team, and project",
  "Manage multiple projects across different teams",
  "Track audit trail with complete version history",
];

export function RoleFeatures() {
  return (
    <section id="features" className="py-24 md:py-40 bg-white/50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-secondary/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto max-w-5xl px-6 relative z-10">
        {/* For Clients Section */}
        <FadeInSection>
          <div className="mb-24">
            <div className="flex flex-col md:flex-row items-start gap-12">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-bold text-xs tracking-wide uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  For Product Owners
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 leading-[1.2]">
                  From Vague Ideas to <br />
                  <span className="text-primary">Rigorous Specifications.</span>
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed font-semibold max-w-xl">
                  Simply describe your vision and watch as AI structures it into industry-standard documents.
                </p>
                <Link href="/auth/register" className="inline-block pt-2">
                  <Button size="sm" className="rounded-lg h-10 px-6 font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                    Start as Client
                  </Button>
                </Link>
              </div>

              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {clientFeatures.map((feature, index) => (
                    <div key={index} className="flex flex-col gap-2 p-3.5 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-gray-700 leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* For Business Analysts Section */}
        <FadeInSection delay={200}>
          <div>
            <div className="flex flex-col md:flex-row-reverse items-start gap-12">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-bold text-xs tracking-wide uppercase">
                  <Target className="w-3.5 h-3.5" />
                  For Analysts
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 leading-[1.2]">
                  Review and Approve <br />
                  <span className="text-primary">With Unmatched Speed.</span>
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed font-semibold max-w-xl">
                  Centralize your workflow. Review drafts and manage approvals from a single dashboard.
                </p>
                <Link href="/auth/register" className="inline-block pt-2">
                  <Button size="sm" className="rounded-lg h-10 px-6 font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                    Start as Analyst
                  </Button>
                </Link>
              </div>

              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {baFeatures.map((feature, index) => (
                    <div key={index} className="flex flex-col gap-2 p-3.5 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-gray-700 leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
