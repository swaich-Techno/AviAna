import { PackagePlus } from "lucide-react";
import { PurchaseForm } from "@/components/forms/PurchaseForm";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Notice } from "@/components/ui/Notice";
import { getInventoryItems, getPurchases, getSuppliers } from "@/lib/data";
import { formatDate, money } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PurchasesPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const [suppliers, inventory, purchases] = await Promise.all([getSuppliers(), getInventoryItems(), getPurchases()]);

  return (
    <>
      <PageHeader
        title="Purchases"
        description="Create supplier purchase entries, increase stock, create inventory movement, and update supplier pending balance."
      />
      {params.saved ? <Notice>Purchase saved, stock increased, and supplier balance updated.</Notice> : null}
      {params.error ? <Notice type="error">Select a supplier and at least one valid inventory item.</Notice> : null}

      {!suppliers.length ? (
        <EmptyState title="Add suppliers first" description="Purchases require a supplier ledger so pending balances can be tracked." actionHref="/dashboard/suppliers" actionLabel="Add supplier" />
      ) : !inventory.length ? (
        <EmptyState title="Add inventory first" description="Purchases increase stock for inventory items, so create item masters first." actionHref="/dashboard/inventory/new" actionLabel="Add inventory item" />
      ) : (
        <PurchaseForm suppliers={suppliers} inventory={inventory} />
      )}

      <section className="surface mt-6 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <PackagePlus className="h-5 w-5 text-gold" aria-hidden="true" />
          <h2 className="font-display text-2xl font-semibold text-charcoal">Purchase history</h2>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Supplier</th>
                <th>Invoice</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase: any) => (
                <tr key={purchase._id}>
                  <td data-label="Date">{formatDate(purchase.purchaseDate)}</td>
                  <td data-label="Supplier">{purchase.supplierId?.name || "Supplier"}</td>
                  <td data-label="Invoice">{purchase.invoiceNumber || "-"}</td>
                  <td data-label="Total" className="font-bold text-wine">
                    {money(purchase.grandTotal)}
                  </td>
                  <td data-label="Paid">{money(purchase.amountPaid)}</td>
                  <td data-label="Balance">{money(purchase.balanceDue)}</td>
                </tr>
              ))}
              {!purchases.length ? (
                <tr>
                  <td colSpan={6} className="text-center text-sm text-[#70645c]">
                    No purchases yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
