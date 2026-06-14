import { Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { PublicNav } from "@/components/public/PublicNav";
import { StickyContact } from "@/components/public/StickyContact";
import { getSiteSettings } from "@/lib/data";
import { localBusinessSchema, publicMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/public/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return publicMetadata({
    title: `Contact | ${settings.businessName}`,
    description: `Contact ${settings.businessName} for suits, fabrics, boutique collections, and WhatsApp inquiries.`,
    path: "/contact",
    image: settings.ogImageUrl || settings.heroImageUrl
  });
}

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const cleanWhatsapp = String(settings.whatsapp || "").replace(/\D/g, "");

  return (
    <>
      <PublicNav settings={settings} />
      <JsonLd data={localBusinessSchema(settings)} />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <section>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Contact</p>
            <h1 className="mt-2 font-display text-5xl font-semibold text-charcoal">Visit or inquire with Aviana Collection</h1>
            <p className="mt-4 text-base leading-7 text-[#70645c]">
              Contact details are managed from the Super Admin website CMS settings.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {settings.whatsapp ? (
                <ButtonLink href={`https://wa.me/${cleanWhatsapp}`}>
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
          </section>
          <section className="surface rounded-lg p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <ContactItem icon={Phone} label="Phone" value={settings.phone || "Not set"} />
              <ContactItem icon={MessageCircle} label="WhatsApp" value={settings.whatsapp || "Not set"} />
              <ContactItem icon={Mail} label="Email" value={settings.email || "Not set"} />
              <ContactItem icon={Instagram} label="Instagram" value={settings.instagramUrl || "Not set"} />
              <ContactItem icon={MapPin} label="Address" value={settings.address || "Not set"} wide />
              <ContactItem icon={Phone} label="Opening hours" value={settings.openingHours || "Not set"} wide />
            </div>
          </section>
        </div>
        <section className="mt-8 overflow-hidden rounded-lg border border-[#eadfce] bg-[#f4e1c9]">
          {settings.mapEmbedUrl ? (
            <iframe
              title={`${settings.businessName} map`}
              src={settings.mapEmbedUrl}
              className="h-[420px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex h-80 items-center justify-center p-6 text-center text-sm font-semibold text-wine">
              Add a Google Maps embed URL from dashboard settings to show the store location.
            </div>
          )}
        </section>
      </main>
      <StickyContact phone={settings.phone} whatsapp={settings.whatsapp} />
    </>
  );
}

function ContactItem({ icon: Icon, label, value, wide = false }: { icon: any; label: string; value: string; wide?: boolean }) {
  return (
    <div className={`rounded-lg border border-[#eadfce] bg-white p-4 ${wide ? "sm:col-span-2" : ""}`}>
      <Icon className="h-5 w-5 text-gold" aria-hidden="true" />
      <dt className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-[#70645c]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-semibold leading-6 text-charcoal">{value}</dd>
    </div>
  );
}
