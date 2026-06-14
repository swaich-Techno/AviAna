"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { expenseSchema } from "@/lib/validations";
import Expense from "@/models/Expense";

export async function saveExpenseAction(formData: FormData) {
  const session = await requireSession(["SUPER_ADMIN", "OWNER"]);
  await connectToDatabase();

  const parsed = expenseSchema.parse({
    title: formData.get("title"),
    category: formData.get("category"),
    amount: formData.get("amount"),
    expenseDate: formData.get("expenseDate"),
    paymentMode: formData.get("paymentMode"),
    notes: formData.get("notes")
  });

  await Expense.create({
    ...parsed,
    expenseDate: new Date(parsed.expenseDate),
    createdBy: session.userId
  });

  revalidatePath("/dashboard/expenses");
  revalidatePath("/dashboard/reports");
  redirect("/dashboard/expenses?saved=1");
}
