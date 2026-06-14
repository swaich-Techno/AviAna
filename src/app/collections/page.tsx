import { Search } from "lucide-react";
import { PublicNav } from "@/components/public/PublicNav";
import { ProductCard } from "@/components/public/ProductCard";
import { StickyContact } from "@/components/public/StickyContact";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPublishedListings, getSiteSettings } from "@/lib/data";
import { listingCategories } from "@/lib/defaults";
import { publicMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return publicMetadata({
    title: `Collections | ${settings.businessName}`,
    description: "Browse published suits, fabrics, designer suits, Punjabi suits, and boutique collection pieces.",
    path: "/collections",
    image: settings.ogImageUrl || settings.heroImageUrl
  });
}

export default async function CollectionsPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const [settings, listings] = await Promise.all([
    getSiteSettings(),
    getPublishedListings({ category: params.category, query: params.q })
  ]);

  return (
    <>
      <PublicNav settings={settings} />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Public collection</p>
            <h1 className="mt-2 font-display text-5xl font-semibold text-charcoal">Published boutique pieces</h1>
            <p className="mt-3 text-sm leading-6 text-[#70645c]">Only products marked published by the Super Admin appear here.</p>
          </div>
          <form className="surface grid gap-3 rounded-lg p-3 sm:grid-cols-[1fr_180px_auto]">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#70645c]" aria-hidden="true" />
              <input
                name="q"
                defaultValue={params.q || ""}
                placeholder="Search name, category, fabric"
                className="min-h-11 w-full rounded-md border border-[#d9c8ac] bg-white pl-9 pr-3 text-sm focus:border-wine focus:outline-none focus:ring-2 focus:ring-wine/20"
              />
            </label>
            <select
              name="category"
              defaultValue={params.category || ""}
              className="min-h-11 rounded-md border border-[#d9c8ac] bg-white px-3 text-sm focus:border-wine focus:outline-none focus:ring-2 focus:ring-wine/20"
            >
              <option value="">All categories</option>
              {listingCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <button className="min-h-11 cursor-pointer rounded-md bg-wine px-4 text-sm font-bold text-white">Filter</button>
          </form>
        </div>
        {listings.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing: any) => (
              <ProductCard key={listing._id} listing={listing} whatsapp={settings.whatsapp} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No published products found"
            description="Try a different category or search term. Draft and unpublished CMS products are intentionally hidden from the public site."
            actionHref="/contact"
            actionLabel="Contact Aviana"
          />
        )}
      </main>
      <StickyContact phone={settings.phone} whatsapp={settings.whatsapp} />
    </>
  );
}
