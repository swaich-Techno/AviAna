import { AlertTriangle, Boxes, IndianRupee, TrendingUp, Truck } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ReportsCharts } from "@/components/dashboard/ReportsCharts";
import { StatCard } from "@/components/dashboard/StatCard";
import { CsvExportButton } from "@/components/forms/CsvExportButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getReportsData } from "@/lib/data";
import { money } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const reports = await getReportsData();

  return (
    <>
      <PageHeader title="Reports" description="Daily-owner reporting for sales, profit, expenses, supplier payable, low stock, top items, and valuation." />
      <div className="dashboard-grid">
        <StatCard label="Inventory valuation" value={money(reports.valuation)} icon={Boxes} />
        <StatCard label="Supplier payable" value={money(reports.supplierPayable)} icon={Truck} />
        <StatCard label="Low stock items" value={String(reports.lowStock.length)} icon={AlertTriangle} />
        <StatCard label="Latest monthly sales" value={money(reports.chart.at(-1)?.sales || 0)} icon={IndianRupee} />
        <StatCard label="Latest monthly profit" value={money(reports.chart.at(-1)?.profit || 0)} icon={TrendingUp} />
      </div>
      <div className="mt-6">
        <ReportsCharts data={reports.chart} />
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="surface rounded-lg p-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <h2 className="font-display text-2xl font-semibold text-charcoal">Low stock report</h2>
            <CsvExportButton filename="aviana-low-stock.csv" rows={reports.lowStock.map((item: any) => ({
              sku: item.sku,
              itemName: item.itemName,
              category: item.category,
              currentStock: item.currentStock,
              alertQty: item.lowStockAlertQty,
              unit: item.unit
            }))} />
          </div>
          <div className="mt-4 space-y-3">
            {reports.lowStock.map((item: any) => (
              <div key={item._id} className="flex items-center justify-between gap-3 rounded-lg border border-[#eadfce] bg-white p-3">
                <div>
                  <p className="font-bold text-charcoal">{item.itemName}</p>
                  <p className="text-sm text-[#70645c]">{item.sku} · alert at {item.lowStockAlertQty}</p>
                </div>
                <StatusBadge tone="warning">{item.currentStock} {item.unit}</StatusBadge>
              </div>
            ))}
            {!reports.lowStock.length ? <p className="text-sm text-[#70645c]">No low stock items.</p> : null}
          </div>
        </section>
        <section className="surface rounded-lg p-4">
          <h2 className="font-display text-2xl font-semibold text-charcoal">Top selling items</h2>
          <div className="mt-4 space-y-3">
            {reports.topSelling.map((item: any) => (
              <div key={item.name} className="flex items-center justify-between gap-3 rounded-lg border border-[#eadfce] bg-white p-3">
                <p className="font-bold text-charcoal">{item.name}</p>
                <StatusBadge tone="success">{item.quantity}</StatusBadge>
              </div>
            ))}
            {!reports.topSelling.length ? <p className="text-sm text-[#70645c]">Top selling items appear after bills are created.</p> : null}
          </div>
        </section>
      </div>
    </>
  );
}
