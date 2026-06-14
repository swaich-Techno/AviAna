import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/forms/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  robots: {
    index: false,
    follow: false
  }
};

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh lg:grid-cols-[0.95fr_1.05fr]">
      <section className="relative hidden overflow-hidden bg-[#171412] p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <Link href="/" className="font-display text-3xl font-semibold">
            Aviana Collection
          </Link>
          <p className="mt-3 max-w-md text-sm leading-6 text-[#d8cbbb]">
            Secure owner access for website publishing, inventory, purchases, billing, suppliers, expenses, and reports.
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f2c57a]">ERP access</p>
          <h1 className="mt-4 font-display text-6xl font-semibold leading-none">Boutique control, quietly protected.</h1>
        </div>
      </section>
      <section className="flex items-center justify-center px-4 py-10">
        <div className="surface w-full max-w-md rounded-lg p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Secure login</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-charcoal">Admin and owner access</h1>
          <p className="mt-2 text-sm leading-6 text-[#70645c]">Use the seeded Super Admin account, then change the password immediately.</p>
          <div className="mt-6">
            <Suspense fallback={<div className="h-56 animate-pulse rounded-lg bg-[#eadfce]" />}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}
