"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Github, Linkedin, Twitter } from "lucide-react";
import { FadeInSection } from "./FadeInSection";

const statistics = [
  {
    value: "3x Faster",
    label: "Requirement Gathering",
    description: "Compared to traditional methods",
  },
  {
    value: "95%",
    label: "Reduction in Ambiguities",
    description: "Through AI clarification",
  },
  {
    value: "Minutes",
    label: "Professional CRS Ready",
    description: "Not days or weeks",
  },
];

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Workflow", href: "#workflow" },
    { name: "Pricing", href: "#pricing" },
    { name: "Demo", href: "#" },
  ],
  resources: [
    { name: "Documentation", href: "#" },
    { name: "API Docs", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Support", href: "#" },
  ],
  company: [
    { name: "About", href: "#" },
    { name: "Contact", href: "#contact" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      {/* Statistics Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-16 grid gap-8 md:grid-cols-3">
            {statistics.map((stat, index) => (
              <FadeInSection key={index} delay={index * 100}>
                <Card className="p-8 text-center hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:border-primary/30">
                  <div className="mb-2 text-4xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="mb-1 text-lg font-semibold">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.description}
                  </div>
                </Card>
              </FadeInSection>
            ))}
          </div>

          {/* Final CTA */}
          <FadeInSection>
            <div className="rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 p-12 text-center border border-primary/20 shadow-xl">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Start Your Free Project Today
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                Join teams already transforming their requirements process with
                AI-powered CRS generation.
              </p>
              <Link href="/auth/register">
                <Button size="lg" className="text-base px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Get Started for Free
                </Button>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground">
                No credit card required • Start in under 2 minutes
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Footer Links */}
      <div className="border-t">
        <div className="container mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
            {/* Logo & Description */}
            <div className="lg:col-span-2">
              <Link href="/" className="mb-4 flex items-center gap-3 group">
                <div className="relative">
                  <Image
                    src="/logo-icon-modern.png"
                    alt="BridgeAI"
                    width={40}
                    height={40}
                    className="h-10 w-auto transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: 'transparent' }}
                  />
                  <div className="absolute inset-0 -z-10 scale-150 blur-xl opacity-0 group-hover:opacity-40 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-full transition-opacity duration-300" />
                </div>
                <span className="text-xl font-bold text-foreground">BridgeAI</span>
              </Link>
              <p className="mb-4 text-sm text-muted-foreground">
                AI-powered requirements engineering platform that bridges
                clients and Business Analysts.
              </p>
              {/* Social Links */}
              <div className="flex gap-3">
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:shadow-lg"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:shadow-lg"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:shadow-lg"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="mb-4 text-sm font-semibold">Product</h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-all duration-300 hover:text-primary hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="mb-4 text-sm font-semibold">Resources</h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="mb-4 text-sm font-semibold">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} BridgeAI. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
