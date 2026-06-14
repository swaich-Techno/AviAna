import { Schema, model, models } from "mongoose";

const BillItemSchema = new Schema(
  {
    inventoryItemId: { type: Schema.Types.ObjectId, ref: "InventoryItem" },
    itemNameSnapshot: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    sellingPrice: { type: Number, required: true },
    costPriceSnapshot: { type: Number, default: 0 },
    total: { type: Number, required: true },
    isCustom: { type: Boolean, default: false }
  },
  { _id: false }
);

const BillSchema = new Schema(
  {
    billNumber: { type: String, required: true, unique: true, index: true },
    billDate: { type: Date, required: true },
    customerName: { type: String, default: "" },
    customerPhone: { type: String, default: "" },
    items: [BillItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    balanceDue: { type: Number, default: 0 },
    paymentMode: { type: String, enum: ["cash", "upi", "card", "bank", "credit"], default: "cash" },
    paymentStatus: { type: String, enum: ["paid", "partial", "unpaid"], default: "unpaid" },
    profitEstimate: { type: Number, default: 0 },
    notes: { type: String, default: "" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default (models.Bill || model("Bill", BillSchema)) as any;
