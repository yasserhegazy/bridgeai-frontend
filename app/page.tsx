import {
  LandingHeader,
  Hero,
  ValueProposition,
  Workflow,
  CTASection,
  RoleFeatures,
  Pricing,
  FAQ,
  TechStack,
  Footer,
} from "@/components/landing";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingHeader />
      <main>
        <Hero />
        <ValueProposition />
        <Workflow />
        <CTASection />
        <RoleFeatures />
        <Pricing />
        <FAQ />
        <TechStack />
      </main>
      <Footer />
    </div>
  );
}