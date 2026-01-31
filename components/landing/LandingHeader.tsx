"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-modern border-b border-border/50">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Image
              src="/logo-icon-modern.png"
              alt="BridgeAI Logo"
              width={40}
              height={40}
              className="h-10 w-auto transition-all duration-300 group-hover:scale-110"
              style={{ backgroundColor: 'transparent' }}
            />
            {/* Subtle glow on hover */}
            <div className="absolute inset-0 -z-10 scale-150 blur-xl opacity-0 group-hover:opacity-40 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-full transition-opacity duration-300" />
          </div>
          <span className="text-xl font-bold text-foreground">BridgeAI</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground animated-underline"
          >
            Features
          </Link>
          <Link
            href="#workflow"
            className="text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground animated-underline"
          >
            Workflow
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground animated-underline"
          >
            Pricing
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground animated-underline"
          >
            FAQ
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm" className="transition-all duration-300 hover:scale-105 text-muted-foreground hover:text-foreground">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button size="sm" className="shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-300 hover:scale-105 bg-gradient-to-r from-violet-600 to-cyan-500 text-white border-0">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

