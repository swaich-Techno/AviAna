import { Schema, model, models } from "mongoose";

const ExpenseSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["rent", "salary", "electricity", "transport", "marketing", "repair", "packaging", "other"],
      required: true
    },
    amount: { type: Number, required: true },
    expenseDate: { type: Date, required: true },
    paymentMode: { type: String, default: "cash" },
    notes: { type: String, default: "" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default (models.Expense || model("Expense", ExpenseSchema)) as any;
