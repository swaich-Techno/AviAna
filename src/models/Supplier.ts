import { Schema, model, models } from "mongoose";

const SupplierSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
    gstNumber: { type: String, default: "" },
    openingBalance: { type: Number, default: 0 },
    currentBalance: { type: Number, default: 0 },
    notes: { type: String, default: "" },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
  },
  { timestamps: true }
);

export default (models.Supplier || model("Supplier", SupplierSchema)) as any;
