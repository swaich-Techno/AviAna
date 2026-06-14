import { FilePenLine, GalleryVerticalEnd, Globe2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ButtonLink } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

const cards = [
  {
    href: "/dashboard/website/settings",
    title: "Business and SEO settings",
    text: "Edit public business details, contact information, hero image, SEO metadata, and website live status.",
    icon: FilePenLine
  },
  {
    href: "/dashboard/website/listings",
    title: "Collection listings",
    text: "Add, edit, publish, unpublish, feature, and remove public collection products.",
    icon: GalleryVerticalEnd
  },
  {
    href: "/",
    title: "Preview website",
    text: "Open the public website and confirm that only published CMS data appears.",
    icon: Globe2
  }
];

export default function WebsiteDashboardPage() {
  return (
    <>
      <PageHeader title="Website CMS" description="Super Admin controls every public website detail from here." />
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.href} className="surface rounded-lg p-5">
              <Icon className="h-7 w-7 text-gold" aria-hidden="true" />
              <h2 className="mt-4 font-display text-3xl font-semibold text-charcoal">{card.title}</h2>
              <p className="mt-2 min-h-16 text-sm leading-6 text-[#70645c]">{card.text}</p>
              <ButtonLink href={card.href} variant="secondary" className="mt-5">
                Open
              </ButtonLink>
            </article>
          );
        })}
      </div>
    </>
  );
}
