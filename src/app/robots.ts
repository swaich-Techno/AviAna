import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/collections", "/about", "/contact"],
        disallow: ["/dashboard", "/dashboard/", "/login"]
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
