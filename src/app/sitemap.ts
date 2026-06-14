import type { MetadataRoute } from "next";
import { getPublishedListings } from "@/lib/data";
import { siteUrl } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await getPublishedListings();
  const staticRoutes = ["", "/collections", "/about", "/contact"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8
  }));

  return [
    ...staticRoutes,
    ...listings.map((listing: any) => ({
      url: `${siteUrl}/collections/${listing.slug}`,
      lastModified: listing.updatedAt ? new Date(listing.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7
    }))
  ];
}
