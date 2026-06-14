import Link from "next/link";
import {
  BarChart3,
  Boxes,
  Building2,
  FileText,
  Globe2,
  Home,
  LogOut,
  PackagePlus,
  ReceiptText,
  Settings,
  ShoppingBag,
  Truck,
  WalletCards
} from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/website", label: "Website CMS", icon: Globe2 },
  { href: "/dashboard/inventory", label: "Inventory", icon: Boxes },
  { href: "/dashboard/billing", label: "Billing", icon: ReceiptText },
  { href: "/dashboard/suppliers", label: "Suppliers", icon: Truck },
  { href: "/dashboard/purchases", label: "Purchases", icon: PackagePlus },
  { href: "/dashboard/expenses", label: "Expenses", icon: WalletCards },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings }
];

export function DashboardShell({ children, session }: { children: React.ReactNode; session: any }) {
  return (
    <div className="min-h-dvh bg-[#f8efe2]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-[#eadfce] bg-[#fff9f1] p-4 lg:block">
        <Link href="/dashboard" className="flex items-center gap-3 rounded-lg p-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-md bg-wine text-sm font-bold text-white">
            AC
          </span>
          <span>
            <span className="block font-display text-2xl font-semibold leading-none text-wine">Aviana</span>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#70645c]">Collection ERP</span>
          </span>
        </Link>
        <div className="mt-6 rounded-lg border border-[#eadfce] bg-white p-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-charcoal">
            <Building2 className="h-4 w-4 text-gold" aria-hidden="true" />
            {session.name}
          </div>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#70645c]">{session.role.replace("_", " ")}</p>
        </div>
        <DashboardNav items={navItems} />
        <form action={logoutAction} className="absolute bottom-4 left-4 right-4">
          <button className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-[#9d2118] transition hover:bg-[#fff1ef]">
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Logout
          </button>
        </form>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-[#eadfce] bg-[#fff9f1]/92 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="font-display text-2xl font-semibold text-wine">
              Aviana ERP
            </Link>
            <form action={logoutAction}>
              <button className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md border border-[#eadfce] bg-white text-wine">
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Logout</span>
              </button>
            </form>
          </div>
        </header>
        <main className="mx-auto min-h-dvh max-w-7xl px-4 py-6 pb-28 sm:px-6 lg:px-8">{children}</main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#eadfce] bg-[#fff9f1]/95 px-2 py-2 backdrop-blur lg:hidden" aria-label="Mobile dashboard">
        <div className="grid grid-cols-5 gap-1">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-[0.68rem] font-bold text-[#70645c] hover:bg-[#f6e7dc] hover:text-wine"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label.split(" ")[0]}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
