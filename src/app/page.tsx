import { ArrowRight, Gem, MessageCircle, Phone, Scissors, ShieldCheck, Sparkles, Store } from "lucide-react";
import { getPublishedListings, getSiteSettings } from "@/lib/data";
import { publicMetadata, localBusinessSchema } from "@/lib/seo";
import { siteUrl } from "@/lib/config";
import { ButtonLink } from "@/components/ui/Button";
import { ProductCard } from "@/components/public/ProductCard";
import { PublicNav } from "@/components/public/PublicNav";
import { StickyContact } from "@/components/public/StickyContact";
import { JsonLd } from "@/components/public/JsonLd";
import { CMSImage } from "@/components/public/CMSImage";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return publicMetadata({
    title: settings.seoTitle || `${settings.businessName} | Premium Cloth House`,
    description: settings.seoDescription,
    image: settings.ogImageUrl || settings.heroImageUrl,
    path: "/"
  });
}

const trustItems = [
  { title: "Premium Fabrics", text: "Curated materials for everyday elegance, festive wear, and boutique finishing.", icon: Gem },
  { title: "Latest Suit Collections", text: "Published collection pieces are managed directly from the super admin dashboard.", icon: Sparkles },
  { title: "Custom Boutique Support", text: "Personal guidance for fabric, suit style, color, occasion, and finishing needs.", icon: Scissors },
  { title: "Easy WhatsApp Inquiry", text: "Every public listing can start a clean WhatsApp inquiry with the product name included.", icon: MessageCircle }
];

function Offline({ settings }: { settings: any }) {
  return (
    <>
      <PublicNav settings={settings} />
      <main className="mx-auto flex min-h-[70dvh] max-w-4xl flex-col items-center justify-center px-4 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Website temporarily offline</p>
        <h1 className="mt-3 font-display text-5xl font-semibold text-wine">{settings.businessName}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[#70645c]">
          The public showcase is currently paused by the Aviana Collection admin team. You can still contact the store directly.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {settings.phone ? (
            <ButtonLink href={`tel:${settings.phone}`}>
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call Us
            </ButtonLink>
          ) : null}
          <ButtonLink href="/login" variant="secondary">
            Admin Login
          </ButtonLink>
        </div>
      </main>
    </>
  );
}

export default async function HomePage() {
  const [settings, featured] = await Promise.all([
    getSiteSettings(),
    getPublishedListings({ featured: true, limit: 6 })
  ]);

  if (!settings.isWebsiteLive) {
    return <Offline settings={settings} />;
  }

  return (
    <>
      <PublicNav settings={settings} />
      <JsonLd data={localBusinessSchema(settings)} />
      <main>
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <CMSImage src={settings.heroImageUrl} alt={`${settings.businessName} boutique collection`} priority />
            <div className="absolute inset-0 bg-gradient-to-r from-[#171412]/82 via-[#6f1d2d]/58 to-[#171412]/18" />
          </div>
          <div className="mx-auto flex min-h-[74dvh] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-3xl text-white">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f2c57a]">Premium cloth house</p>
              <h1 className="mt-5 font-display text-5xl font-semibold leading-[0.95] text-balance md:text-7xl">
                {settings.businessName}
              </h1>
              <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-[#fff8ec]">{settings.tagline}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/collections">
                  View Collection
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink href="/contact" variant="secondary">
                  Contact Us
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#eadfce] bg-[#fffdf8]">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-lg border border-[#eadfce] bg-[#fff9f1] p-4">
                  <Icon className="h-6 w-6 text-gold" aria-hidden="true" />
                  <h2 className="mt-3 font-display text-2xl font-semibold text-charcoal">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#70645c]">{item.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Featured collection</p>
              <h2 className="mt-2 font-display text-4xl font-semibold text-charcoal">Published boutique picks</h2>
            </div>
            <ButtonLink href="/collections" variant="secondary">
              Browse all
            </ButtonLink>
          </div>
          {featured.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((listing: any) => (
                <ProductCard key={listing._id} listing={listing} whatsapp={settings.whatsapp} />
              ))}
            </div>
          ) : (
            <div className="surface rounded-lg p-8 text-center">
              <Store className="mx-auto h-10 w-10 text-gold" aria-hidden="true" />
              <h2 className="mt-4 font-display text-3xl font-semibold text-charcoal">Collection coming soon</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#70645c]">
                The super admin can publish featured products from the website CMS dashboard.
              </p>
            </div>
          )}
        </section>

        <section className="bg-[#fffdf8]">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">About Aviana</p>
              <h2 className="mt-2 font-display text-4xl font-semibold text-charcoal">Soft luxury for modern Indian wardrobes</h2>
            </div>
            <div className="space-y-5 text-base leading-8 text-[#514841]">
              <p>{settings.aboutText}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-[#eadfce] bg-[#fff9f1] p-4">
                  <ShieldCheck className="h-5 w-5 text-gold" aria-hidden="true" />
                  <h3 className="mt-2 font-semibold text-charcoal">Managed by owner dashboard</h3>
                  <p className="mt-1 text-sm text-[#70645c]">Only published CMS data appears on the public website.</p>
                </div>
                <div className="rounded-lg border border-[#eadfce] bg-[#fff9f1] p-4">
                  <MessageCircle className="h-5 w-5 text-gold" aria-hidden="true" />
                  <h3 className="mt-2 font-semibold text-charcoal">Quick inquiry flow</h3>
                  <p className="mt-1 text-sm text-[#70645c]">Customers can call or ask about exact collection pieces.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="surface grid overflow-hidden rounded-lg lg:grid-cols-2">
            <div className="p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Visit or inquire</p>
              <h2 className="mt-2 font-display text-4xl font-semibold text-charcoal">Contact Aviana Collection</h2>
              <dl className="mt-6 space-y-4 text-sm leading-6 text-[#514841]">
                <div>
                  <dt className="font-bold text-charcoal">Phone</dt>
                  <dd>{settings.phone || "Update phone number from dashboard"}</dd>
                </div>
                <div>
                  <dt className="font-bold text-charcoal">Address</dt>
                  <dd>{settings.address || "Update address from dashboard"}</dd>
                </div>
                <div>
                  <dt className="font-bold text-charcoal">Opening hours</dt>
                  <dd>{settings.openingHours || "Update opening hours from dashboard"}</dd>
                </div>
              </dl>
              <div className="mt-6 flex flex-wrap gap-3">
                {settings.whatsapp ? (
                  <ButtonLink href={`https://wa.me/${String(settings.whatsapp).replace(/\D/g, "")}`}>
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    WhatsApp
                  </ButtonLink>
                ) : null}
                {settings.phone ? (
                  <ButtonLink href={`tel:${settings.phone}`} variant="secondary">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    Call
                  </ButtonLink>
                ) : null}
              </div>
            </div>
            <div className="min-h-80 bg-[#f4e1c9]">
              {settings.mapEmbedUrl ? (
                <iframe
                  title={`${settings.businessName} location map`}
                  src={settings.mapEmbedUrl}
                  className="h-full min-h-80 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="flex h-full min-h-80 items-center justify-center p-6 text-center text-sm font-semibold text-wine">
                  Location map appears here when the Super Admin adds a Google Maps embed URL.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-[#eadfce] bg-[#171412] px-4 py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <p className="font-display text-2xl font-semibold">{settings.businessName}</p>
          <p className="text-sm text-[#d8cbbb]">Premium suits, fabrics, boutique collections, and cloth house ERP.</p>
        </div>
      </footer>
      <StickyContact phone={settings.phone} whatsapp={settings.whatsapp} />
    </>
  );
}
