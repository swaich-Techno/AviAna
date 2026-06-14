import type { Metadata } from "next";
import "./globals.css";
import { businessName, siteUrl } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${businessName} | Premium Suits, Fabrics & Boutique Collections`,
    template: `%s | ${businessName}`
  },
  description:
    "Aviana Collection is a premium cloth house for suits, fabrics, Punjabi suits, designer suits, and boutique collections.",
  applicationName: "Aviana Collection ERP",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: businessName
  },
  twitter: {
    card: "summary_large_image"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
