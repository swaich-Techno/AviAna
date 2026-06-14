import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { CMSImage } from "@/components/public/CMSImage";
import { JsonLd } from "@/components/public/JsonLd";
import { PublicNav } from "@/components/public/PublicNav";
import { StickyContact } from "@/components/public/StickyContact";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getListingBySlug, getSiteSettings } from "@/lib/data";
import { money } from "@/lib/utils";
import { productSchema, publicMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [settings, listing] = await Promise.all([getSiteSettings(), getListingBySlug(slug)]);
  if (!listing) return {};
  return publicMetadata({
    title: listing.seoTitle || listing.title,
    description: listing.seoDescription || listing.description,
    path: `/collections/${listing.slug}`,
    image: listing.images?.[0] || settings.ogImageUrl || settings.heroImageUrl
  });
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [settings, listing] = await Promise.all([getSiteSettings(), getListingBySlug(slug)]);
  if (!listing) notFound();

  const inquiryUrl = settings.whatsapp
    ? `https://wa.me/${String(settings.whatsapp).replace(/\D/g, "")}?text=${encodeURIComponent(
        `Hi Aviana Collection, I want to inquire about ${listing.title}.`
      )}`
    : "/contact";

  return (
    <>
      <PublicNav settings={settings} />
      <JsonLd data={productSchema(listing, settings)} />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ButtonLink href="/collections" variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to collection
        </ButtonLink>
        <article className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-[#eadfce] bg-[#f7ead9] sm:col-span-2">
              <CMSImage src={listing.images?.[0]} alt={`${listing.title} product image`} priority />
            </div>
            {(listing.images || []).slice(1, 5).map((image: string, index: number) => (
              <div key={image} className="relative aspect-[4/5] overflow-hidden rounded-lg border border-[#eadfce] bg-[#f7ead9]">
                <CMSImage src={image} alt={`${listing.title} detail image ${index + 2}`} />
              </div>
            ))}
          </div>
          <div className="surface h-fit rounded-lg p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">{listing.category}</p>
            <h1 className="mt-2 font-display text-5xl font-semibold leading-none text-charcoal">{listing.title}</h1>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge tone={listing.stockStatus === "sold_out" ? "danger" : listing.stockStatus === "limited" ? "warning" : "success"}>
                {String(listing.stockStatus).replaceAll("_", " ")}
              </StatusBadge>
              <StatusBadge tone="wine">{listing.fabric}</StatusBadge>
            </div>
            <p className="mt-6 text-base leading-8 text-[#514841]">{listing.description}</p>
            <dl className="mt-6 grid gap-3 rounded-lg border border-[#eadfce] bg-white p-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-bold text-charcoal">Fabric / Material</dt>
                <dd className="mt-1 text-[#70645c]">{listing.fabric}</dd>
              </div>
              <div>
                <dt className="font-bold text-charcoal">Price</dt>
                <dd className="mt-1 text-[#70645c]">{listing.showPrice ? money(listing.price) : "Available on inquiry"}</dd>
              </div>
              <div>
                <dt className="font-bold text-charcoal">Availability</dt>
                <dd className="mt-1 capitalize text-[#70645c]">{String(listing.stockStatus).replaceAll("_", " ")}</dd>
              </div>
              <div>
                <dt className="font-bold text-charcoal">Inquiry</dt>
                <dd className="mt-1 text-[#70645c]">Ask on WhatsApp or call the store.</dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={inquiryUrl}>
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                WhatsApp Inquiry
              </ButtonLink>
              {settings.phone ? (
                <ButtonLink href={`tel:${settings.phone}`} variant="secondary">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call Store
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </article>
      </main>
      <StickyContact phone={settings.phone} whatsapp={settings.whatsapp} />
    </>
  );
}
