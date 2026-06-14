"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import Bill from "@/models/Bill";
import InventoryItem from "@/models/InventoryItem";
import InventoryMovement from "@/models/InventoryMovement";

export type BillInputItem = {
  inventoryItemId?: string;
  itemNameSnapshot: string;
  quantity: number;
  unit: string;
  sellingPrice: number;
};

export type BillInput = {
  billDate: string;
  customerName?: string;
  customerPhone?: string;
  items: BillInputItem[];
  discount: number;
  amountPaid: number;
  paymentMode: "cash" | "upi" | "card" | "bank" | "credit";
  notes?: string;
  allowNegativeStock?: boolean;
};

async function nextBillNumber(date: Date) {
  const prefix = `AC-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(
    date.getDate()
  ).padStart(2, "0")}`;
  const count = await Bill.countDocuments({
    billDate: {
      $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
    }
  });
  return `${prefix}-${String(count + 1).padStart(4, "0")}`;
}

export async function createBillAction(input: BillInput) {
  const session = await requireSession(["SUPER_ADMIN", "OWNER"]);
  await connectToDatabase();

  if (!input.items?.length) {
    return { ok: false, message: "Add at least one bill item." };
  }

  const billDate = new Date(input.billDate || new Date());
  const preparedItems = [];
  let subtotal = 0;
  let costSubtotal = 0;

  for (const entry of input.items) {
    const quantity = Number(entry.quantity || 0);
    const sellingPrice = Number(entry.sellingPrice || 0);
    if (quantity <= 0 || sellingPrice < 0) continue;

    let costPriceSnapshot = 0;
    let itemNameSnapshot = entry.itemNameSnapshot;
    let unit = entry.unit || "piece";
    let inventoryItemId = entry.inventoryItemId || undefined;
    let isCustom = !inventoryItemId;

    if (inventoryItemId) {
      const inventoryItem = await InventoryItem.findById(inventoryItemId);
      if (!inventoryItem) {
        return { ok: false, message: `Inventory item not found for ${entry.itemNameSnapshot}.` };
      }

      if (!input.allowNegativeStock && Number(inventoryItem.currentStock || 0) < quantity) {
        return {
          ok: false,
          message: `${inventoryItem.itemName} has only ${inventoryItem.currentStock} ${inventoryItem.unit} in stock.`
        };
      }

      costPriceSnapshot = Number(inventoryItem.purchasePrice || 0);
      itemNameSnapshot = inventoryItem.itemName;
      unit = inventoryItem.unit;
      isCustom = false;
    }

    const total = quantity * sellingPrice;
    subtotal += total;
    costSubtotal += quantity * costPriceSnapshot;
    preparedItems.push({
      inventoryItemId,
      itemNameSnapshot,
      quantity,
      unit,
      sellingPrice,
      costPriceSnapshot,
      total,
      isCustom
    });
  }

  if (!preparedItems.length) {
    return { ok: false, message: "Bill items are invalid." };
  }

  const discount = Math.max(Number(input.discount || 0), 0);
  const grandTotal = Math.max(subtotal - discount, 0);
  const amountPaid = Math.max(Number(input.amountPaid || 0), 0);
  const balanceDue = Math.max(grandTotal - amountPaid, 0);
  const profitEstimate = Math.max(subtotal - costSubtotal - discount, 0);
  const paymentStatus = balanceDue <= 0 ? "paid" : amountPaid > 0 ? "partial" : "unpaid";

  const bill = await Bill.create({
    billNumber: await nextBillNumber(billDate),
    billDate,
    customerName: input.customerName || "",
    customerPhone: input.customerPhone || "",
    items: preparedItems,
    subtotal,
    discount,
    grandTotal,
    amountPaid,
    balanceDue,
    paymentMode: input.paymentMode || "cash",
    paymentStatus,
    profitEstimate,
    notes: input.notes || "",
    createdBy: session.userId
  });

  for (const entry of preparedItems) {
    if (!entry.inventoryItemId) continue;
    const item = await InventoryItem.findById(entry.inventoryItemId);
    if (!item) continue;
    const previousStock = Number(item.currentStock || 0);
    const newStock = previousStock - Number(entry.quantity);
    item.currentStock = newStock;
    await item.save();
    await InventoryMovement.create({
      inventoryItemId: item._id,
      movementType: "sale_out",
      quantity: Number(entry.quantity),
      previousStock,
      newStock,
      referenceType: "sale",
      referenceId: bill._id,
      notes: `Bill ${bill.billNumber}`,
      createdBy: session.userId
    });
  }

  revalidatePath("/dashboard/billing");
  revalidatePath("/dashboard/inventory");
  revalidatePath("/dashboard/reports");
  revalidatePath("/dashboard");
  return { ok: true, message: "Bill created.", billId: bill._id.toString() };
}
