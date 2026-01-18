"use client";

import Image from "next/image";
import { FadeInSection } from "./FadeInSection";

const technologies = [
  {
    name: "Next.js",
    description: "React framework",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  },
  {
    name: "FastAPI",
    description: "Python backend",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
  },
  {
    name: "LangGraph",
    description: "Multi-agent AI",
    icon: "🔗", // Placeholder - can be replaced with actual logo
  },
  {
    name: "Groq",
    description: "Fast LLM inference",
    icon: "⚡", // Placeholder
  },
  {
    name: "OpenAI",
    description: "GPT-4 powered",
    icon: "🤖", // Placeholder
  },
  {
    name: "ChromaDB",
    description: "Vector database",
    icon: "🔍", // Placeholder
  },
  {
    name: "MySQL",
    description: "Relational database",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  },
  {
    name: "TypeScript",
    description: "Type-safe code",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
];

export function TechStack() {
  return (
    <section className="py-20 border-t">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Powered By
          </h3>
          <p className="text-xl font-medium">
            Industry-leading technologies for reliability and performance
          </p>
        </div>

        {/* Tech Logos Grid */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-8">
          {technologies.map((tech, index) => (
            <FadeInSection key={index} delay={index * 50}>
              <div className="group flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-2">
              {/* Logo or Icon */}
              <div className="flex h-16 w-16 items-center justify-center grayscale transition-all group-hover:grayscale-0">
                {tech.logo ? (
                  <Image
                    src={tech.logo}
                    alt={tech.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 object-contain"
                  />
                ) : (
                  <span className="text-4xl">{tech.icon}</span>
                )}
              </div>

              {/* Tech Name */}
              <div className="text-center">
                <p className="text-sm font-medium">{tech.name}</p>
                <p className="text-xs text-muted-foreground">
                  {tech.description}
                </p>
              </div>
            </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}
