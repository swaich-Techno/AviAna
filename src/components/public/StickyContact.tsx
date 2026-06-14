import { MessageCircle, Phone } from "lucide-react";

export function StickyContact({ phone, whatsapp }: { phone?: string; whatsapp?: string }) {
  if (!phone && !whatsapp) return null;
  const cleanWhatsapp = String(whatsapp || "").replace(/\D/g, "");

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-2 gap-2 sm:hidden">
      {whatsapp ? (
        <a
          href={`https://wa.me/${cleanWhatsapp}`}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#1f7a4f] px-4 text-sm font-bold text-white shadow-soft"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          WhatsApp
        </a>
      ) : null}
      {phone ? (
        <a
          href={`tel:${phone}`}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-wine px-4 text-sm font-bold text-white shadow-soft"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call
        </a>
      ) : null}
    </div>
  );
}
