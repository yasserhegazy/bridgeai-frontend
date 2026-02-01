"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import Link from "next/link";
import { FadeInSection } from "./FadeInSection";

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out BridgeAI",
    features: [
      "1 project",
      "3 team members",
      "Basic CRS generation",
      "PDF & Markdown export",
      "Email support",
      "Community access",
    ],
    cta: "Get started",
    href: "/auth/register",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Professional",
    price: "$49",
    period: "per BA/month",
    description: "For growing teams and active Business Analysts",
    features: [
      "Unlimited projects",
      "Unlimited team members",
      "Advanced AI features",
      "Priority support",
      "Custom CRS templates",
      "Analytics dashboard",
      "Version control & audit trail",
      "API access",
    ],
    cta: "Start Free Trial",
    href: "/auth/register",
    variant: "default" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For large organizations with specific needs",
    features: [
      "Everything in Professional",
      "SSO & SAML authentication",
      "Dedicated support manager",
      "Custom integrations",
      "On-premise deployment option",
      "SLA guarantee (99.9% uptime)",
      "Advanced security features",
      "Training & onboarding",
    ],
    cta: "Contact Sales",
    href: "#contact",
    variant: "outline" as const,
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground">
            Choose the plan that fits your team. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier, index) => (
            <FadeInSection key={index} delay={index * 150}>
              <Card
                className={`relative p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${tier.popular
                  ? "border-primary shadow-lg scale-102 lg:scale-105"
                  : "hover:border-primary/30"
                  }`}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] py-0 px-2">
                    Most Popular
                  </Badge>
                )}

                {/* Tier Name */}
                <h3 className="mb-1.5 text-xl font-bold">{tier.name}</h3>

                {/* Price */}
                <div className="mb-3">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  {tier.period && (
                    <span className="text-xs text-muted-foreground"> / {tier.period}</span>
                  )}
                </div>

                {/* Description */}
                <p className="mb-5 text-xs font-medium text-muted-foreground">
                  {tier.description}
                </p>

                {/* CTA Button */}
                <Link href={tier.href} className="block mb-5">
                  <Button
                    variant={tier.variant}
                    className="w-full h-9 text-sm font-bold"
                  >
                    {tier.cta}
                  </Button>
                </Link>

                {/* Features List */}
                <ul className="space-y-2.5">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2.5">
                      <div className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-[13px] font-medium text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            </FadeInSection>
          ))}
        </div>

        {/* Additional Info */}
        <p className="mt-12 text-center text-sm text-muted-foreground">
          All plans include core features like real-time chat, CRS generation, and basic analytics.
          <br />
          Need a custom solution?{" "}
          <a href="#contact" className="text-primary hover:underline">
            Contact our sales team
          </a>
        </p>
      </div>
    </section>
  );
}
