import { notFound } from "next/navigation";
import Link from "next/link";
import { PrintButton } from "@/components/ui/PrintButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getBill, getSiteSettings } from "@/lib/data";
import { formatDate, money } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [bill, settings] = await Promise.all([getBill(id), getSiteSettings()]);
  if (!bill) notFound();

  return (
    <main className="mx-auto max-w-4xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link className="text-sm font-bold text-wine" href="/dashboard/billing">
          Back to bills
        </Link>
        <PrintButton />
      </div>
      <article className="surface rounded-lg bg-white p-6 text-charcoal print:border-0 print:shadow-none">
        <header className="flex flex-col justify-between gap-4 border-b border-[#eadfce] pb-5 sm:flex-row">
          <div>
            <p className="font-display text-4xl font-semibold text-wine">{settings.businessName}</p>
            <p className="mt-1 text-sm text-[#70645c]">{settings.address}</p>
            <p className="text-sm text-[#70645c]">{settings.phone}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Invoice</p>
            <h1 className="mt-1 font-display text-3xl font-semibold">{bill.billNumber}</h1>
            <p className="text-sm text-[#70645c]">{formatDate(bill.billDate)}</p>
            <div className="mt-2">
              <StatusBadge tone={bill.paymentStatus === "paid" ? "success" : bill.paymentStatus === "partial" ? "warning" : "danger"}>
                {bill.paymentStatus}
              </StatusBadge>
            </div>
          </div>
        </header>
        <section className="grid gap-4 border-b border-[#eadfce] py-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#70645c]">Customer</p>
            <p className="mt-1 font-semibold">{bill.customerName || "Walk-in customer"}</p>
            <p className="text-sm text-[#70645c]">{bill.customerPhone || ""}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#70645c]">Payment mode</p>
            <p className="mt-1 font-semibold capitalize">{bill.paymentMode}</p>
          </div>
        </section>
        <table className="mt-5 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#eadfce] text-left text-xs uppercase tracking-[0.12em] text-[#70645c]">
              <th className="py-3">Item</th>
              <th className="py-3">Qty</th>
              <th className="py-3">Rate</th>
              <th className="py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((item: any, index: number) => (
              <tr key={`${item.itemNameSnapshot}-${index}`} className="border-b border-[#f0e6d8]">
                <td className="py-3">
                  <p className="font-semibold">{item.itemNameSnapshot}</p>
                  {item.isCustom ? <p className="text-xs text-[#70645c]">Custom / non-inventory item</p> : null}
                </td>
                <td className="py-3">{item.quantity} {item.unit}</td>
                <td className="py-3">{money(item.sellingPrice)}</td>
                <td className="py-3 text-right font-semibold">{money(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <section className="ml-auto mt-6 max-w-sm space-y-2 text-sm">
          <SummaryRow label="Subtotal" value={money(bill.subtotal)} />
          <SummaryRow label="Discount" value={money(bill.discount)} />
          <SummaryRow label="Grand total" value={money(bill.grandTotal)} strong />
          <SummaryRow label="Amount paid" value={money(bill.amountPaid)} />
          <SummaryRow label="Balance due" value={money(bill.balanceDue)} strong />
        </section>
        {bill.notes ? <p className="mt-6 rounded-lg bg-[#fff9f1] p-3 text-sm text-[#70645c]">{bill.notes}</p> : null}
      </article>
    </main>
  );
}

function SummaryRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 ${strong ? "font-bold text-wine" : "text-[#514841]"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
