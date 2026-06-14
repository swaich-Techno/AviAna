import type { Metadata } from "next";
import { siteUrl } from "@/lib/config";

export function publicMetadata({
  title,
  description,
  path = "/",
  image
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}): Metadata {
  const url = `${siteUrl}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : undefined
    },
    twitter: {
      title,
      description,
      images: image ? [image] : undefined
    }
  };
}

export function localBusinessSchema(settings: any) {
  return {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: settings.businessName,
    description: settings.seoDescription || settings.tagline,
    telephone: settings.phone,
    email: settings.email,
    address: settings.address,
    image: settings.ogImageUrl || settings.heroImageUrl || settings.logoUrl,
    url: siteUrl,
    openingHours: settings.openingHours,
    sameAs: settings.instagramUrl ? [settings.instagramUrl] : []
  };
}

export function productSchema(listing: any, settings: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    description: listing.description,
    image: listing.images || [],
    brand: {
      "@type": "Brand",
      name: settings.businessName
    },
    category: listing.category,
    material: listing.fabric,
    offers: listing.showPrice
      ? {
          "@type": "Offer",
          priceCurrency: "INR",
          price: listing.price,
          availability:
            listing.stockStatus === "sold_out" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
          url: `${siteUrl}/collections/${listing.slug}`
        }
      : undefined
  };
}
