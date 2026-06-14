import { Schema, model, models } from "mongoose";

const PurchaseItemSchema = new Schema(
  {
    inventoryItemId: { type: Schema.Types.ObjectId, ref: "InventoryItem", required: true },
    itemNameSnapshot: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    unitCost: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  { _id: false }
);

const PurchaseSchema = new Schema(
  {
    supplierId: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
    purchaseDate: { type: Date, required: true },
    invoiceNumber: { type: String, default: "" },
    items: [PurchaseItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    transportCost: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    balanceDue: { type: Number, default: 0 },
    paymentMode: { type: String, default: "cash" },
    notes: { type: String, default: "" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default (models.Purchase || model("Purchase", PurchaseSchema)) as any;
