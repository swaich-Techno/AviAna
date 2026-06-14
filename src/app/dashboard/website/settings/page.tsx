import { saveSiteSettingsAction } from "@/actions/website";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Field, TextArea } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { getOrCreateSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function WebsiteSettingsPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [settings, params] = await Promise.all([getOrCreateSiteSettings(), searchParams]);

  return (
    <>
      <PageHeader
        title="Website settings"
        description="These fields power the public home, about, contact, SEO, Open Graph, LocalBusiness schema, and website live state."
      />
      {params.saved ? <Notice>Website settings saved.</Notice> : null}
      <form action={saveSiteSettingsAction} className="surface space-y-6 rounded-lg p-4 sm:p-6">
        <section>
          <h2 className="font-display text-2xl font-semibold text-charcoal">Business identity</h2>
          <div className="form-grid mt-4">
            <Field label="Business name" name="businessName" defaultValue={settings.businessName} required />
            <Field label="Tagline" name="tagline" defaultValue={settings.tagline} required />
            <Field label="Logo URL" name="logoUrl" defaultValue={settings.logoUrl} />
            <Field label="Hero image URL" name="heroImageUrl" defaultValue={settings.heroImageUrl} />
          </div>
          <TextArea label="About text" name="aboutText" defaultValue={settings.aboutText} required className="mt-4" />
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-charcoal">Contact and location</h2>
          <div className="form-grid mt-4">
            <Field label="Phone" name="phone" defaultValue={settings.phone} required />
            <Field label="WhatsApp" name="whatsapp" defaultValue={settings.whatsapp} required />
            <Field label="Email" name="email" type="email" defaultValue={settings.email} />
            <Field label="Instagram URL" name="instagramUrl" defaultValue={settings.instagramUrl} />
            <Field label="Opening hours" name="openingHours" defaultValue={settings.openingHours} />
            <Field label="Google map embed URL" name="mapEmbedUrl" defaultValue={settings.mapEmbedUrl} />
          </div>
          <TextArea label="Address" name="address" defaultValue={settings.address} required className="mt-4" />
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-charcoal">SEO and publishing</h2>
          <div className="form-grid mt-4">
            <Field label="SEO title" name="seoTitle" defaultValue={settings.seoTitle} />
            <Field label="Open Graph image URL" name="ogImageUrl" defaultValue={settings.ogImageUrl} />
          </div>
          <TextArea label="SEO description" name="seoDescription" defaultValue={settings.seoDescription} className="mt-4" />
          <label className="mt-4 flex min-h-11 items-center gap-2 rounded-md border border-[#d9c8ac] bg-white px-3 text-sm font-semibold text-charcoal">
            <input type="checkbox" name="isWebsiteLive" defaultChecked={settings.isWebsiteLive} className="h-4 w-4 accent-wine" />
            Website is live and indexable
          </label>
        </section>

        <div className="border-t border-[#eadfce] pt-4">
          <SubmitButton>Save website settings</SubmitButton>
        </div>
      </form>
    </>
  );
}
