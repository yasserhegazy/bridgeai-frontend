import type { Metadata } from "next";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { GoogleAuthProvider } from "@/components/providers/GoogleAuthProvider";
import "./globals.css";
import { geistSans } from "@/fonts";
import { Toaster } from "sonner";

const SITE_URL = "https://bridge-ai.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "BridgeAI - AI-Powered Requirements Engineering Platform",
    template: "%s | BridgeAI",
  },
  description:
    "Transform conversations into professional CRS documents with AI. BridgeAI bridges clients and Business Analysts through intelligent automation.",
  keywords: [
    "requirements engineering",
    "AI requirements",
    "CRS generation",
    "software requirements specification",
    "business analysis",
    "requirements management",
  ],
  authors: [{ name: "BridgeAI" }],
  creator: "BridgeAI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "BridgeAI",
    title: "BridgeAI - AI-Powered Requirements Engineering Platform",
    description:
      "Transform conversations into professional CRS documents with AI. BridgeAI bridges clients and Business Analysts through intelligent automation.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BridgeAI - AI-Powered Requirements Engineering Platform",
    description:
      "Transform conversations into professional CRS documents with AI.",
  },
  icons: {
    icon: "/logo_with_background.png",
    apple: "/logo_with_background.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`h-screen flex flex-col ${geistSans.className}`}>
        <GoogleAuthProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
          <Toaster position="top-right" richColors />
        </GoogleAuthProvider>
      </body>
    </html>
  );
}
