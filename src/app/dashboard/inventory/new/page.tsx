import { saveInventoryItemAction } from "@/actions/inventory";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Field, SelectField, TextArea } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { getInventoryItem, getSuppliers } from "@/lib/data";
import { inventoryCategories, inventoryTypes, inventoryUnits } from "@/lib/defaults";

export const dynamic = "force-dynamic";

export default async function InventoryFormPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const params = await searchParams;
  const [item, suppliers] = await Promise.all([getInventoryItem(params.id), getSuppliers()]);

  return (
    <>
      <PageHeader
        title={item ? "Edit inventory item" : "Add inventory item"}
        description="Inventory supports raw material, finished goods, accessories, packaging, units, rack/location, and low stock alerts."
      />
      <form action={saveInventoryItemAction} className="surface space-y-5 rounded-lg p-4 sm:p-6">
        <input type="hidden" name="id" defaultValue={item?._id || ""} />
        <div className="form-grid">
          <Field label="Item name" name="itemName" defaultValue={item?.itemName} required />
          <Field label="SKU" name="sku" defaultValue={item?.sku} required />
          <SelectField label="Type" name="type" options={inventoryTypes} defaultValue={item?.type || "finished_good"} required />
          <SelectField label="Category" name="category" options={inventoryCategories} defaultValue={item?.category || "suit"} required />
          <SelectField label="Unit" name="unit" options={inventoryUnits} defaultValue={item?.unit || "piece"} required />
          <SelectField label="Status" name="status" options={["active", "inactive"]} defaultValue={item?.status || "active"} required />
        </div>
        <div className="form-grid">
          <Field label="Opening stock" name="openingStock" type="number" step="0.01" defaultValue={item?.openingStock ?? 0} required />
          <Field label="Current stock" name="currentStock" type="number" step="0.01" defaultValue={item?.currentStock ?? 0} required />
          <Field label="Low stock alert quantity" name="lowStockAlertQty" type="number" step="0.01" defaultValue={item?.lowStockAlertQty ?? 0} required />
          <Field label="Purchase price" name="purchasePrice" type="number" step="0.01" defaultValue={item?.purchasePrice ?? 0} required />
          <Field label="Selling price" name="sellingPrice" type="number" step="0.01" defaultValue={item?.sellingPrice ?? 0} required />
          <Field label="Location / rack" name="location" defaultValue={item?.location} />
        </div>
        <label className="block space-y-2 text-sm font-semibold text-charcoal">
          Supplier
          <select name="supplierId" defaultValue={item?.supplierId || ""} className="min-h-11 w-full rounded-md border border-[#d9c8ac] bg-white px-3">
            <option value="">No supplier linked</option>
            {suppliers.map((supplier: any) => (
              <option key={supplier._id} value={supplier._id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </label>
        <TextArea label="Notes" name="notes" defaultValue={item?.notes} />
        <SubmitButton>{item ? "Update item" : "Create item"}</SubmitButton>
      </form>
    </>
  );
}
