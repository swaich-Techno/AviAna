import { Schema, model, models } from "mongoose";

const InventoryItemSchema = new Schema(
  {
    itemName: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    type: {
      type: String,
      enum: ["raw_material", "finished_good", "accessory", "packaging", "other"],
      required: true
    },
    category: {
      type: String,
      enum: ["fabric", "thread", "button", "lace", "suit", "dupatta", "lining", "packaging", "other"],
      required: true
    },
    unit: {
      type: String,
      enum: ["meter", "piece", "kg", "box", "roll", "set", "other"],
      required: true
    },
    openingStock: { type: Number, default: 0 },
    currentStock: { type: Number, default: 0, index: true },
    lowStockAlertQty: { type: Number, default: 0 },
    purchasePrice: { type: Number, default: 0 },
    sellingPrice: { type: Number, default: 0 },
    supplierId: { type: Schema.Types.ObjectId, ref: "Supplier" },
    location: { type: String, default: "" },
    notes: { type: String, default: "" },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
  },
  { timestamps: true }
);

export default (models.InventoryItem || model("InventoryItem", InventoryItemSchema)) as any;
