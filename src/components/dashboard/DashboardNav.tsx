"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function DashboardNav({ items }: { items: any[] }) {
  const pathname = usePathname();

  return (
    <nav className="mt-5 space-y-1" aria-label="Dashboard">
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition",
              active ? "bg-wine text-white shadow-line" : "text-[#514841] hover:bg-[#f6e7dc] hover:text-wine"
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
