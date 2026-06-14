import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getBills } from "@/lib/data";
import { formatDate, money } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BillingPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const bills = await getBills({ query: params.q });

  return (
    <>
      <PageHeader
        title="Billing"
        description="Create printable bills, reduce inventory stock, track payment status, and estimate profit from cost snapshots."
        actionHref="/dashboard/billing/new"
        actionLabel="Create bill"
      />
      <form className="surface mb-5 grid gap-3 rounded-lg p-3 sm:grid-cols-[1fr_auto]">
        <input
          name="q"
          defaultValue={params.q || ""}
          placeholder="Search bill number, customer, phone"
          className="min-h-11 rounded-md border border-[#d9c8ac] bg-white px-3 text-sm"
        />
        <button className="min-h-11 cursor-pointer rounded-md bg-wine px-4 text-sm font-bold text-white">Search</button>
      </form>
      {bills.length ? (
        <section className="surface rounded-lg p-4">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Bill</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Profit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill: any) => (
                  <tr key={bill._id}>
                    <td data-label="Bill">
                      <p className="font-bold text-charcoal">{bill.billNumber}</p>
                      <p className="text-sm text-[#70645c]">{formatDate(bill.billDate)}</p>
                    </td>
                    <td data-label="Customer">{bill.customerName || "Walk-in customer"}</td>
                    <td data-label="Total" className="font-bold text-wine">
                      {money(bill.grandTotal)}
                    </td>
                    <td data-label="Payment">
                      <StatusBadge tone={bill.paymentStatus === "paid" ? "success" : bill.paymentStatus === "partial" ? "warning" : "danger"}>
                        {bill.paymentStatus}
                      </StatusBadge>
                    </td>
                    <td data-label="Profit">{money(bill.profitEstimate)}</td>
                    <td data-label="Actions">
                      <Link className="inline-flex min-h-11 items-center rounded-md border border-[#d9c8ac] px-3 text-sm font-bold text-wine" href={`/dashboard/billing/${bill._id}`}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <EmptyState title="No bills found" description="Create the first bill to start tracking sales, payment status, profit, and stock movement." actionHref="/dashboard/billing/new" actionLabel="Create bill" />
      )}
    </>
  );
}
