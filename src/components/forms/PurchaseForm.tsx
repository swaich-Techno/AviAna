"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { createPurchaseAction } from "@/actions/purchases";
import { Button } from "@/components/ui/Button";
import { Field, SelectField, TextArea } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { paymentModes } from "@/lib/defaults";
import { money } from "@/lib/utils";

type PurchaseRow = {
  inventoryItemId: string;
  quantity: number;
  unitCost: number;
};

export function PurchaseForm({ suppliers, inventory }: { suppliers: any[]; inventory: any[] }) {
  const [items, setItems] = useState<PurchaseRow[]>([
    { inventoryItemId: inventory[0]?._id || "", quantity: 1, unitCost: inventory[0]?.purchasePrice || 0 }
  ]);
  const inventoryMap = useMemo(() => new Map(inventory.map((item) => [String(item._id), item])), [inventory]);
  const subtotal = items.reduce((total, item) => total + Number(item.quantity || 0) * Number(item.unitCost || 0), 0);

  function update(index: number, next: Partial<PurchaseRow>) {
    setItems((current) =>
      current.map((item, itemIndex) => {
        if (itemIndex !== index) return item;
        const merged = { ...item, ...next };
        if (next.inventoryItemId) {
          const selected = inventoryMap.get(next.inventoryItemId);
          merged.unitCost = Number(selected?.purchasePrice || merged.unitCost || 0);
        }
        return merged;
      })
    );
  }

  return (
    <form action={createPurchaseAction} className="surface space-y-5 rounded-lg p-4">
      <input type="hidden" name="items" value={JSON.stringify(items.filter((item) => item.inventoryItemId))} />
      <div className="form-grid">
        <label className="block space-y-2 text-sm font-semibold text-charcoal">
          Supplier <span className="text-[#b42318]">*</span>
          <select name="supplierId" required className="min-h-11 w-full rounded-md border border-[#d9c8ac] bg-white px-3 py-2 text-sm text-charcoal shadow-line">
            {suppliers.map((supplier) => (
              <option key={supplier._id} value={supplier._id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </label>
        <Field label="Purchase date" name="purchaseDate" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required />
        <Field label="Invoice number" name="invoiceNumber" placeholder="Supplier invoice" />
        <SelectField label="Payment mode" name="paymentMode" options={paymentModes} defaultValue="cash" required />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold text-charcoal">Purchased items</h2>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setItems((current) => [...current, { inventoryItemId: inventory[0]?._id || "", quantity: 1, unitCost: inventory[0]?.purchasePrice || 0 }])}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add row
          </Button>
        </div>
        {items.map((item, index) => {
          const selected = inventoryMap.get(item.inventoryItemId);
          return (
            <div key={index} className="grid gap-3 rounded-lg border border-[#eadfce] bg-white p-3 md:grid-cols-[1fr_120px_140px_auto]">
              <label className="space-y-2 text-sm font-semibold">
                Item
                <select
                  value={item.inventoryItemId}
                  onChange={(event) => update(index, { inventoryItemId: event.target.value })}
                  className="min-h-11 w-full rounded-md border border-[#d9c8ac] px-3"
                >
                  {inventory.map((inventoryItem) => (
                    <option key={inventoryItem._id} value={inventoryItem._id}>
                      {inventoryItem.itemName} ({inventoryItem.sku})
                    </option>
                  ))}
                </select>
                <span className="block text-xs text-[#70645c]">Unit: {selected?.unit || "-"}</span>
              </label>
              <label className="space-y-2 text-sm font-semibold">
                Qty
                <input
                  value={item.quantity}
                  min={0}
                  step="0.01"
                  type="number"
                  onChange={(event) => update(index, { quantity: Number(event.target.value) })}
                  className="min-h-11 w-full rounded-md border border-[#d9c8ac] px-3"
                />
              </label>
              <label className="space-y-2 text-sm font-semibold">
                Unit cost
                <input
                  value={item.unitCost}
                  min={0}
                  step="0.01"
                  type="number"
                  onChange={(event) => update(index, { unitCost: Number(event.target.value) })}
                  className="min-h-11 w-full rounded-md border border-[#d9c8ac] px-3"
                />
              </label>
              <button
                type="button"
                className="min-h-11 cursor-pointer rounded-md border border-[#f1b8b3] px-3 text-[#9d2118]"
                onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                aria-label="Remove purchase item"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
      <div className="form-grid">
        <Field label="Discount" name="discount" type="number" min="0" step="0.01" defaultValue={0} />
        <Field label="Transport cost" name="transportCost" type="number" min="0" step="0.01" defaultValue={0} />
        <Field label="Amount paid" name="amountPaid" type="number" min="0" step="0.01" defaultValue={0} />
      </div>
      <TextArea label="Notes" name="notes" />
      <div className="flex flex-col justify-between gap-3 border-t border-[#eadfce] pt-4 sm:flex-row sm:items-center">
        <p className="text-sm font-bold text-charcoal">Items subtotal: {money(subtotal)}</p>
        <SubmitButton>Create purchase and increase stock</SubmitButton>
      </div>
    </form>
  );
}
