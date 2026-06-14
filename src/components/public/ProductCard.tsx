import { MessageCircle } from "lucide-react";
import { CMSImage } from "@/components/public/CMSImage";
import { ButtonLink } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { money } from "@/lib/utils";

export function ProductCard({ listing, whatsapp }: { listing: any; whatsapp?: string }) {
  const inquiry = `https://wa.me/${String(whatsapp || "").replace(/\D/g, "")}?text=${encodeURIComponent(
    `Hi Aviana Collection, I want to inquire about ${listing.title}.`
  )}`;

  return (
    <article className="surface group overflow-hidden rounded-lg transition hover:-translate-y-0.5 hover:border-gold">
      <a href={`/collections/${listing.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#f7ead9]">
          <CMSImage src={listing.images?.[0]} alt={`${listing.title} at Aviana Collection`} />
        </div>
        <div className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-gold">{listing.category}</p>
              <h2 className="mt-1 font-display text-2xl font-semibold leading-tight text-charcoal">{listing.title}</h2>
            </div>
            <StatusBadge tone={listing.stockStatus === "sold_out" ? "danger" : listing.stockStatus === "limited" ? "warning" : "success"}>
              {String(listing.stockStatus).replaceAll("_", " ")}
            </StatusBadge>
          </div>
          <p className="line-clamp-2 text-sm leading-6 text-[#70645c]">{listing.description}</p>
          <div className="flex items-center justify-between gap-2 border-t border-[#eadfce] pt-3 text-sm">
            <span className="font-semibold text-charcoal">{listing.fabric}</span>
            <span className="font-bold text-wine">{listing.showPrice ? money(listing.price) : "Ask price"}</span>
          </div>
        </div>
      </a>
      <div className="px-4 pb-4">
        <ButtonLink href={whatsapp ? inquiry : `/collections/${listing.slug}`} variant="secondary" className="w-full">
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          WhatsApp Inquiry
        </ButtonLink>
      </div>
    </article>
  );
}
