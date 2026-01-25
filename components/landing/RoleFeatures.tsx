"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
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
    <section className="py-20 md:py-32">
      <div className="container mx-auto max-w-7xl px-6">
        {/* For Clients Section */}
        <FadeInSection>
          <div className="mb-32 grid gap-12 items-center lg:grid-cols-2 lg:gap-16">
            {/* Text Content */}
            <div className="order-2 lg:order-1">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              For Clients
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Transform your software ideas into professional requirements
              documents through simple conversation.
            </p>

            {/* Feature List */}
            <ul className="mb-8 space-y-4">
              {clientFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Link href="/auth/register">
              <Button size="lg" className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Start as Client
              </Button>
            </Link>
          </div>

          {/* Screenshot */}
          <div className="order-1 lg:order-2">
            <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground font-medium">
                    Chat Interface & My CRS Requests
                  </p>
                  <p className="text-sm text-muted-foreground/60 mt-2">
                    Screenshot: ChatInterface.tsx + MyCRSTable.tsx
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
        </FadeInSection>

        {/* For Business Analysts Section */}
        <FadeInSection delay={200}>
          <div className="grid gap-12 items-center lg:grid-cols-2 lg:gap-16">
          {/* Screenshot */}
          <div>
            <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground font-medium">
                    CRS Dashboard & Review Dialog
                  </p>
                  <p className="text-sm text-muted-foreground/60 mt-2">
                    Screenshot: CRSDashboard.tsx + CRSReviewDialog.tsx
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Text Content */}
          <div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              For Business Analysts
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Streamline your workflow with structured CRS review, approval, and
              collaboration tools.
            </p>

            {/* Feature List */}
            <ul className="mb-8 space-y-4">
              {baFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Link href="/auth/register">
              <Button size="lg" className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Start as Business Analyst
              </Button>
            </Link>
          </div>
        </div>
        </FadeInSection>
      </div>
    </section>
  );
}
