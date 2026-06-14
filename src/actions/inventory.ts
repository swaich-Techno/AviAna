"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { formNumber } from "@/lib/utils";
import { inventoryItemSchema } from "@/lib/validations";
import InventoryItem from "@/models/InventoryItem";
import InventoryMovement from "@/models/InventoryMovement";

export async function saveInventoryItemAction(formData: FormData) {
  await requireSession(["SUPER_ADMIN", "OWNER"]);
  await connectToDatabase();

  const id = String(formData.get("id") || "");
  const parsed = inventoryItemSchema.parse({
    id: id || undefined,
    itemName: formData.get("itemName"),
    sku: formData.get("sku"),
    type: formData.get("type"),
    category: formData.get("category"),
    unit: formData.get("unit"),
    openingStock: formData.get("openingStock"),
    currentStock: formData.get("currentStock"),
    lowStockAlertQty: formData.get("lowStockAlertQty"),
    purchasePrice: formData.get("purchasePrice"),
    sellingPrice: formData.get("sellingPrice"),
    supplierId: formData.get("supplierId") || undefined,
    location: formData.get("location"),
    notes: formData.get("notes"),
    status: formData.get("status") || "active"
  });

  if (id) {
    await InventoryItem.findByIdAndUpdate(id, parsed);
  } else {
    await InventoryItem.create(parsed);
  }

  revalidatePath("/dashboard/inventory");
  redirect("/dashboard/inventory?saved=1");
}

export async function manualStockAdjustmentAction(formData: FormData) {
  const session = await requireSession(["SUPER_ADMIN", "OWNER"]);
  await connectToDatabase();

  const id = String(formData.get("id"));
  const reason = String(formData.get("reason") || "").trim();
  const newStock = formNumber(formData.get("newStock"));

  if (!reason) {
    redirect("/dashboard/inventory?error=reason");
  }

  const item = await InventoryItem.findById(id);
  if (!item) {
    redirect("/dashboard/inventory?error=item");
  }

  const previousStock = Number(item.currentStock || 0);
  item.currentStock = newStock;
  await item.save();

  await InventoryMovement.create({
    inventoryItemId: item._id,
    movementType: "manual_adjustment",
    quantity: newStock - previousStock,
    previousStock,
    newStock,
    referenceType: "manual",
    notes: reason,
    createdBy: session.userId
  });

  revalidatePath("/dashboard/inventory");
  redirect("/dashboard/inventory?adjusted=1");
}
