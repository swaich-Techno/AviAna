import { Schema, model, models } from "mongoose";

const InventoryMovementSchema = new Schema(
  {
    inventoryItemId: { type: Schema.Types.ObjectId, ref: "InventoryItem", required: true, index: true },
    movementType: {
      type: String,
      enum: ["purchase_in", "sale_out", "manual_adjustment", "return_in", "damage_out"],
      required: true
    },
    quantity: { type: Number, required: true },
    previousStock: { type: Number, required: true },
    newStock: { type: Number, required: true },
    referenceType: {
      type: String,
      enum: ["purchase", "sale", "manual", "return", "damage"],
      required: true
    },
    referenceId: { type: Schema.Types.ObjectId },
    notes: { type: String, default: "" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default (models.InventoryMovement || model("InventoryMovement", InventoryMovementSchema)) as any;
