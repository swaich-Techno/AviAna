import Link from "next/link";
import { Phone, Shirt, UserRound } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export function PublicNav({ settings }: { settings: any }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#eadfce] bg-[#fff9f1]/92 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label="Public">
        <Link href="/" className="flex min-h-11 items-center gap-3 font-display text-2xl font-semibold text-wine">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-wine text-sm font-bold text-white">
            AC
          </span>
          <span>{settings.businessName}</span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          <Link className="rounded-md px-3 py-2 text-sm font-semibold text-charcoal hover:bg-[#f6e7dc]" href="/collections">
            Collections
          </Link>
          <Link className="rounded-md px-3 py-2 text-sm font-semibold text-charcoal hover:bg-[#f6e7dc]" href="/about">
            About
          </Link>
          <Link className="rounded-md px-3 py-2 text-sm font-semibold text-charcoal hover:bg-[#f6e7dc]" href="/contact">
            Contact
          </Link>
          <Link className="rounded-md px-3 py-2 text-sm font-semibold text-charcoal hover:bg-[#f6e7dc]" href="/login">
            Login
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ButtonLink href="/collections" variant="secondary" className="hidden sm:inline-flex">
            <Shirt className="h-4 w-4" aria-hidden="true" />
            View Collection
          </ButtonLink>
          <ButtonLink href={settings.phone ? `tel:${settings.phone}` : "/contact"}>
            <Phone className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Call</span>
          </ButtonLink>
          <Link
            href="/login"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-[#d9c8ac] bg-white text-wine md:hidden"
            aria-label="Admin login"
          >
            <UserRound className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
