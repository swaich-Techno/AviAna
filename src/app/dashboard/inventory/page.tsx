import Link from "next/link";
import { manualStockAdjustmentAction } from "@/actions/inventory";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Notice } from "@/components/ui/Notice";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getInventoryItems, getInventoryMovements } from "@/lib/data";
import { inventoryCategories, inventoryTypes } from "@/lib/defaults";
import { formatDate, money } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function InventoryPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; category?: string; type?: string; saved?: string; adjusted?: string; error?: string }>;
}) {
  const params = await searchParams;
  const [items, movements] = await Promise.all([
    getInventoryItems({ query: params.q, category: params.category, type: params.type }),
    getInventoryMovements()
  ]);

  return (
    <>
      <PageHeader
        title="Inventory"
        description="Track cloth house stock by fabric, finished goods, accessories, packaging, units, purchase price, sale price, and stock movement."
        actionHref="/dashboard/inventory/new"
        actionLabel="Add item"
      />
      {params.saved ? <Notice>Inventory item saved.</Notice> : null}
      {params.adjusted ? <Notice>Manual stock adjustment saved with movement history.</Notice> : null}
      {params.error ? <Notice type="error">Please check item and reason before adjusting stock.</Notice> : null}

      <form className="surface mb-5 grid gap-3 rounded-lg p-3 sm:grid-cols-[1fr_180px_180px_auto]">
        <input
          name="q"
          defaultValue={params.q || ""}
          placeholder="Search item, SKU, category"
          className="min-h-11 rounded-md border border-[#d9c8ac] bg-white px-3 text-sm"
        />
        <select name="category" defaultValue={params.category || ""} className="min-h-11 rounded-md border border-[#d9c8ac] bg-white px-3 text-sm">
          <option value="">All categories</option>
          {inventoryCategories.map((category) => (
            <option key={category} value={category}>
              {category.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <select name="type" defaultValue={params.type || ""} className="min-h-11 rounded-md border border-[#d9c8ac] bg-white px-3 text-sm">
          <option value="">All types</option>
          {inventoryTypes.map((type) => (
            <option key={type} value={type}>
              {type.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <button className="min-h-11 cursor-pointer rounded-md bg-wine px-4 text-sm font-bold text-white">Filter</button>
      </form>

      {items.length ? (
        <section className="surface rounded-lg p-4">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Stock</th>
                  <th>Prices</th>
                  <th>Status</th>
                  <th>Adjustment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any) => {
                  const low = Number(item.currentStock) <= Number(item.lowStockAlertQty);
                  return (
                    <tr key={item._id}>
                      <td data-label="Item">
                        <p className="font-bold text-charcoal">{item.itemName}</p>
                        <p className="text-sm text-[#70645c]">{item.sku} · {item.category} · {item.type.replaceAll("_", " ")}</p>
                        {item.location ? <p className="text-xs text-[#70645c]">Rack: {item.location}</p> : null}
                      </td>
                      <td data-label="Stock">
                        <p className="font-bold text-charcoal">{item.currentStock} {item.unit}</p>
                        <p className="text-sm text-[#70645c]">Alert at {item.lowStockAlertQty}</p>
                      </td>
                      <td data-label="Prices">
                        <p className="text-sm">Cost: {money(item.purchasePrice)}</p>
                        <p className="text-sm">Sale: {money(item.sellingPrice)}</p>
                      </td>
                      <td data-label="Status">
                        <div className="flex flex-wrap gap-2">
                          <StatusBadge tone={item.status === "active" ? "success" : "neutral"}>{item.status}</StatusBadge>
                          {low ? <StatusBadge tone="warning">low stock</StatusBadge> : null}
                        </div>
                      </td>
                      <td data-label="Adjustment">
                        <form action={manualStockAdjustmentAction} className="grid gap-2">
                          <input type="hidden" name="id" value={item._id} />
                          <input
                            name="newStock"
                            type="number"
                            step="0.01"
                            defaultValue={item.currentStock}
                            className="min-h-11 rounded-md border border-[#d9c8ac] px-3 text-sm"
                            aria-label={`New stock for ${item.itemName}`}
                          />
                          <input
                            name="reason"
                            placeholder="Reason required"
                            className="min-h-11 rounded-md border border-[#d9c8ac] px-3 text-sm"
                            aria-label={`Adjustment reason for ${item.itemName}`}
                          />
                          <ConfirmSubmitButton message="Save manual stock adjustment?">Adjust</ConfirmSubmitButton>
                        </form>
                      </td>
                      <td data-label="Actions">
                        <Link className="inline-flex min-h-11 items-center rounded-md border border-[#d9c8ac] px-3 text-sm font-bold text-wine" href={`/dashboard/inventory/new?id=${item._id}`}>
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <EmptyState title="No inventory items" description="Add fabrics, suits, raw material, packaging, and accessories before billing or purchases." actionHref="/dashboard/inventory/new" actionLabel="Add first item" />
      )}

      <section className="surface mt-6 rounded-lg p-4">
        <h2 className="font-display text-2xl font-semibold text-charcoal">Recent stock movement</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {movements.slice(0, 8).map((movement: any) => (
            <div key={movement._id} className="rounded-lg border border-[#eadfce] bg-white p-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <StatusBadge tone={movement.quantity >= 0 ? "success" : "warning"}>{movement.movementType.replaceAll("_", " ")}</StatusBadge>
                <span className="text-[#70645c]">{formatDate(movement.createdAt)}</span>
              </div>
              <p className="mt-2 font-semibold text-charcoal">
                {movement.previousStock} → {movement.newStock}
              </p>
              {movement.notes ? <p className="mt-1 text-[#70645c]">{movement.notes}</p> : null}
            </div>
          ))}
          {!movements.length ? <p className="text-sm text-[#70645c]">Movement history will appear after purchases, bills, or manual adjustments.</p> : null}
        </div>
      </section>
    </>
  );
}
