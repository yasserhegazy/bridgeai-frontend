import { ClientLayout } from "@/components/ClientLayout";
import "./globals.css";
import { geistSans } from "@/fonts";

export const metadata = {
  title: "BridgeAI",
  description: "AI-Powered Requirements Analysis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>BridgeAI - AI-Powered Requirements Engineering Platform</title>
        <meta
          name="description"
          content="Transform conversations into professional CRS documents with AI. BridgeAI bridges clients and Business Analysts through intelligent automation."
        />
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body className={`h-screen flex flex-col ${geistSans.className}`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}

