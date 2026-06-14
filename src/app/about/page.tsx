import { PublicNav } from "@/components/public/PublicNav";
import { StickyContact } from "@/components/public/StickyContact";
import { getSiteSettings } from "@/lib/data";
import { publicMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return publicMetadata({
    title: `About | ${settings.businessName}`,
    description: settings.seoDescription,
    path: "/about",
    image: settings.ogImageUrl || settings.heroImageUrl
  });
}

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PublicNav settings={settings} />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">About</p>
        <h1 className="mt-2 font-display text-5xl font-semibold text-charcoal">{settings.businessName}</h1>
        <div className="fashion-rule my-8 h-px" />
        <article className="surface rounded-lg p-6 text-base leading-8 text-[#514841] sm:p-8">
          <p>{settings.aboutText}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {["Premium fabrics", "Boutique support", "Published collections"].map((item) => (
              <div key={item} className="rounded-lg border border-[#eadfce] bg-white p-4">
                <h2 className="font-display text-2xl font-semibold text-wine">{item}</h2>
                <p className="mt-2 text-sm leading-6 text-[#70645c]">
                  Aviana Collection keeps the shopping experience refined, clear, and easy to inquire about.
                </p>
              </div>
            ))}
          </div>
        </article>
      </main>
      <StickyContact phone={settings.phone} whatsapp={settings.whatsapp} />
    </>
  );
}
