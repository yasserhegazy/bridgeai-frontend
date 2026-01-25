"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/logo-full-transparent.png"
            alt="BridgeAI Logo"
            width={40}
            height={40}
            className="h-10 w-auto transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: 'transparent' }}
          />
          <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">BridgeAI</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground hover:scale-105"
          >
            Features
          </Link>
          <Link
            href="#workflow"
            className="text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground hover:scale-105"
          >
            Workflow
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground hover:scale-105"
          >
            Pricing
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground hover:scale-105"
          >
            FAQ
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm" className="transition-all duration-300 hover:scale-105">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button size="sm" className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
