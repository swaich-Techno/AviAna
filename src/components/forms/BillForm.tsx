"use client";

import { useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, ReceiptText, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { createBillAction, type BillInput } from "@/actions/billing";
import { Button } from "@/components/ui/Button";
import { Field, TextArea } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { paymentModes } from "@/lib/defaults";
import { money } from "@/lib/utils";

export function BillForm({ inventory }: { inventory: any[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors }
  } = useForm<BillInput>({
    defaultValues: {
      billDate: new Date().toISOString().slice(0, 10),
      customerName: "",
      customerPhone: "",
      discount: 0,
      amountPaid: 0,
      paymentMode: "cash",
      notes: "",
      allowNegativeStock: false,
      items: [
        {
          inventoryItemId: inventory[0]?._id || "",
          itemNameSnapshot: inventory[0]?.itemName || "",
          quantity: 1,
          unit: inventory[0]?.unit || "piece",
          sellingPrice: inventory[0]?.sellingPrice || 0
        }
      ]
    }
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const values = watch();
  const inventoryMap = useMemo(() => new Map(inventory.map((item) => [String(item._id), item])), [inventory]);
  const subtotal = values.items?.reduce((total, item) => total + Number(item.quantity || 0) * Number(item.sellingPrice || 0), 0) || 0;
  const grandTotal = Math.max(subtotal - Number(values.discount || 0), 0);

  function chooseInventory(index: number, id: string) {
    const item = inventoryMap.get(id);
    setValue(`items.${index}.inventoryItemId`, id);
    setValue(`items.${index}.itemNameSnapshot`, item?.itemName || "");
    setValue(`items.${index}.unit`, item?.unit || "piece");
    setValue(`items.${index}.sellingPrice`, Number(item?.sellingPrice || 0));
  }

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const result = await createBillAction(data);
      if (!result.ok) {
        setError("root", { message: result.message });
        return;
      }
      router.push(`/dashboard/billing/${result.billId}`);
      router.refresh();
    });
  });

  return (
    <form onSubmit={onSubmit} className="surface space-y-5 rounded-lg p-4">
      {errors.root?.message ? <Notice type="error">{errors.root.message}</Notice> : null}
      <div className="form-grid">
        <Field label="Bill date" name="billDate" type="date" required {...register("billDate")} />
        <Field label="Customer name" name="customerName" placeholder="Optional" {...register("customerName")} />
        <Field label="Customer phone" name="customerPhone" placeholder="Optional" {...register("customerPhone")} />
        <label className="block space-y-2 text-sm font-semibold text-charcoal">
          Payment mode
          <select
            className="min-h-11 w-full rounded-md border border-[#d9c8ac] bg-white px-3 py-2 shadow-line focus:border-wine focus:outline-none focus:ring-2 focus:ring-wine/20"
            {...register("paymentMode")}
          >
            {paymentModes.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold text-charcoal">Bill items</h2>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              append({
                inventoryItemId: "",
                itemNameSnapshot: "",
                quantity: 1,
                unit: "piece",
                sellingPrice: 0
              })
            }
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add item
          </Button>
        </div>
        {fields.map((field, index) => {
          const selectedId = values.items?.[index]?.inventoryItemId;
          const selected = selectedId ? inventoryMap.get(selectedId) : null;
          return (
            <div key={field.id} className="grid gap-3 rounded-lg border border-[#eadfce] bg-white p-3 md:grid-cols-[1.2fr_1fr_110px_120px_auto]">
              <label className="space-y-2 text-sm font-semibold">
                Inventory item
                <select
                  value={selectedId || ""}
                  onChange={(event) => chooseInventory(index, event.target.value)}
                  className="min-h-11 w-full rounded-md border border-[#d9c8ac] px-3"
                >
                  <option value="">Custom item</option>
                  {inventory.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.itemName} - {item.currentStock} {item.unit}
                    </option>
                  ))}
                </select>
                <span className="block text-xs text-[#70645c]">Stock: {selected ? `${selected.currentStock} ${selected.unit}` : "Custom sale"}</span>
              </label>
              <label className="space-y-2 text-sm font-semibold">
                Item name
                <input
                  className="min-h-11 w-full rounded-md border border-[#d9c8ac] px-3"
                  placeholder="Custom item name"
                  {...register(`items.${index}.itemNameSnapshot`, { required: true })}
                />
              </label>
              <label className="space-y-2 text-sm font-semibold">
                Qty
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  className="min-h-11 w-full rounded-md border border-[#d9c8ac] px-3"
                  {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                />
              </label>
              <label className="space-y-2 text-sm font-semibold">
                Price
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="min-h-11 w-full rounded-md border border-[#d9c8ac] px-3"
                  {...register(`items.${index}.sellingPrice`, { valueAsNumber: true })}
                />
              </label>
              <button
                type="button"
                className="min-h-11 cursor-pointer rounded-md border border-[#f1b8b3] px-3 text-[#9d2118]"
                onClick={() => remove(index)}
                aria-label="Remove bill item"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
              <input type="hidden" {...register(`items.${index}.unit`)} />
            </div>
          );
        })}
      </div>
      <div className="form-grid">
        <Field label="Discount" name="discount" type="number" min="0" step="0.01" {...register("discount", { valueAsNumber: true })} />
        <Field label="Amount paid" name="amountPaid" type="number" min="0" step="0.01" {...register("amountPaid", { valueAsNumber: true })} />
        <label className="flex min-h-11 items-center gap-2 rounded-md border border-[#d9c8ac] bg-white px-3 text-sm font-semibold text-charcoal">
          <input type="checkbox" className="h-4 w-4 accent-wine" {...register("allowNegativeStock")} />
          Allow negative stock for this bill
        </label>
      </div>
      <TextArea label="Notes" name="notes" {...register("notes")} />
      <div className="flex flex-col justify-between gap-3 border-t border-[#eadfce] pt-4 sm:flex-row sm:items-center">
        <div className="text-sm font-bold text-charcoal">
          <p>Subtotal: {money(subtotal)}</p>
          <p className="text-wine">Grand total: {money(grandTotal)}</p>
        </div>
        <Button type="submit" disabled={pending}>
          <ReceiptText className="h-4 w-4" aria-hidden="true" />
          {pending ? "Creating bill..." : "Create bill and reduce stock"}
        </Button>
      </div>
    </form>
  );
}
