import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/auth/login", "/auth/register", "/auth/forgot-password"],
        disallow: [
          "/teams",
          "/projects",
          "/chats",
          "/crs-dashboard",
          "/profile",
          "/notifications",
          "/pending-requests",
          "/invite",
          "/api",
          "/client-crs",
        ],
      },
    ],
    sitemap: "https://bridge-ai.dev/sitemap.xml",
  };
}
