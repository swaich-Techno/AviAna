import { AlertTriangle, Boxes, IndianRupee, ReceiptText, ShoppingBag, TrendingUp, Truck, WalletCards } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getDashboardSummary } from "@/lib/data";
import { formatDate, money } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardHomePage() {
  const summary = await getDashboardSummary();

  return (
    <>
      <PageHeader
        title="Business dashboard"
        description="Daily control center for sales, profit, expenses, inventory value, low stock, supplier balances, and recent movement."
      />
      <div className="dashboard-grid">
        <StatCard label="Today sales" value={money(summary.todaySales)} icon={IndianRupee} />
        <StatCard label="Monthly sales" value={money(summary.monthlySales)} icon={ShoppingBag} />
        <StatCard label="Monthly profit" value={money(summary.monthlyProfit)} icon={TrendingUp} />
        <StatCard label="Monthly expenses" value={money(summary.monthlyExpenses)} icon={WalletCards} />
        <StatCard label="Inventory value" value={money(summary.inventoryValue)} icon={Boxes} />
        <StatCard label="Low stock items" value={String(summary.lowStockCount)} icon={AlertTriangle} />
        <StatCard label="Supplier balance" value={money(summary.supplierPendingBalance)} icon={Truck} />
        <StatCard label="Recent bills" value={String(summary.recentBills.length)} icon={ReceiptText} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="surface rounded-lg p-4">
          <h2 className="font-display text-2xl font-semibold text-charcoal">Recent bills</h2>
          <div className="mt-4 space-y-3">
            {summary.recentBills.map((bill: any) => (
              <div key={bill._id} className="rounded-lg border border-[#eadfce] bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-charcoal">{bill.billNumber}</p>
                    <p className="text-sm text-[#70645c]">{bill.customerName || "Walk-in customer"} · {formatDate(bill.billDate)}</p>
                  </div>
                  <StatusBadge tone={bill.paymentStatus === "paid" ? "success" : bill.paymentStatus === "partial" ? "warning" : "danger"}>
                    {bill.paymentStatus}
                  </StatusBadge>
                </div>
                <p className="mt-2 font-semibold text-wine">{money(bill.grandTotal)}</p>
              </div>
            ))}
            {!summary.recentBills.length ? <p className="text-sm text-[#70645c]">No bills yet.</p> : null}
          </div>
        </section>

        <section className="surface rounded-lg p-4">
          <h2 className="font-display text-2xl font-semibold text-charcoal">Low stock watch</h2>
          <div className="mt-4 space-y-3">
            {summary.lowStockItems.map((item: any) => (
              <div key={item._id} className="flex items-center justify-between gap-3 rounded-lg border border-[#eadfce] bg-white p-3">
                <div>
                  <p className="font-bold text-charcoal">{item.itemName}</p>
                  <p className="text-sm text-[#70645c]">{item.sku} · {item.category}</p>
                </div>
                <StatusBadge tone="warning">
                  {item.currentStock} {item.unit}
                </StatusBadge>
              </div>
            ))}
            {!summary.lowStockItems.length ? <p className="text-sm text-[#70645c]">No low stock alerts right now.</p> : null}
          </div>
        </section>
      </div>
    </>
  );
}
