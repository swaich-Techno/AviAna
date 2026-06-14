"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { formNumber } from "@/lib/utils";
import InventoryItem from "@/models/InventoryItem";
import InventoryMovement from "@/models/InventoryMovement";
import Purchase from "@/models/Purchase";
import Supplier from "@/models/Supplier";

type PurchaseFormItem = {
  inventoryItemId: string;
  quantity: number;
  unitCost: number;
};

export async function createPurchaseAction(formData: FormData) {
  const session = await requireSession(["SUPER_ADMIN", "OWNER"]);
  await connectToDatabase();

  const supplierId = String(formData.get("supplierId") || "");
  const items = JSON.parse(String(formData.get("items") || "[]")) as PurchaseFormItem[];
  const discount = formNumber(formData.get("discount"));
  const transportCost = formNumber(formData.get("transportCost"));
  const amountPaid = formNumber(formData.get("amountPaid"));

  if (!supplierId || !items.length) {
    redirect("/dashboard/purchases?error=missing");
  }

  const purchaseItems = [];
  let subtotal = 0;

  for (const entry of items) {
    const item = await InventoryItem.findById(entry.inventoryItemId);
    if (!item || Number(entry.quantity) <= 0) continue;

    const total = Number(entry.quantity) * Number(entry.unitCost);
    subtotal += total;
    purchaseItems.push({
      inventoryItemId: item._id,
      itemNameSnapshot: item.itemName,
      quantity: Number(entry.quantity),
      unit: item.unit,
      unitCost: Number(entry.unitCost),
      total
    });
  }

  if (!purchaseItems.length) {
    redirect("/dashboard/purchases?error=items");
  }

  const grandTotal = Math.max(subtotal - discount + transportCost, 0);
  const balanceDue = Math.max(grandTotal - amountPaid, 0);
  const purchase = await Purchase.create({
    supplierId,
    purchaseDate: new Date(String(formData.get("purchaseDate") || new Date())),
    invoiceNumber: String(formData.get("invoiceNumber") || ""),
    items: purchaseItems,
    subtotal,
    discount,
    transportCost,
    grandTotal,
    amountPaid,
    balanceDue,
    paymentMode: String(formData.get("paymentMode") || "cash"),
    notes: String(formData.get("notes") || ""),
    createdBy: session.userId
  });

  for (const entry of purchaseItems) {
    const item = await InventoryItem.findById(entry.inventoryItemId);
    if (!item) continue;
    const previousStock = Number(item.currentStock || 0);
    const newStock = previousStock + Number(entry.quantity);
    item.currentStock = newStock;
    item.purchasePrice = Number(entry.unitCost);
    await item.save();
    await InventoryMovement.create({
      inventoryItemId: item._id,
      movementType: "purchase_in",
      quantity: Number(entry.quantity),
      previousStock,
      newStock,
      referenceType: "purchase",
      referenceId: purchase._id,
      notes: `Purchase ${purchase.invoiceNumber || purchase._id}`,
      createdBy: session.userId
    });
  }

  await Supplier.findByIdAndUpdate(supplierId, {
    $inc: { currentBalance: grandTotal - amountPaid }
  });

  revalidatePath("/dashboard/purchases");
  revalidatePath("/dashboard/inventory");
  revalidatePath("/dashboard");
  redirect("/dashboard/purchases?saved=1");
}
