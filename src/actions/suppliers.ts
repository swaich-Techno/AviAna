"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { supplierSchema } from "@/lib/validations";
import Supplier from "@/models/Supplier";

export async function saveSupplierAction(formData: FormData) {
  await requireSession(["SUPER_ADMIN", "OWNER"]);
  await connectToDatabase();

  const id = String(formData.get("id") || "");
  const parsed = supplierSchema.parse({
    id: id || undefined,
    name: formData.get("name"),
    phone: formData.get("phone"),
    whatsapp: formData.get("whatsapp"),
    email: formData.get("email"),
    address: formData.get("address"),
    gstNumber: formData.get("gstNumber"),
    openingBalance: formData.get("openingBalance"),
    currentBalance: formData.get("currentBalance"),
    notes: formData.get("notes"),
    status: formData.get("status") || "active"
  });

  if (id) {
    await Supplier.findByIdAndUpdate(id, parsed);
  } else {
    await Supplier.create(parsed);
  }

  revalidatePath("/dashboard/suppliers");
  redirect("/dashboard/suppliers?saved=1");
}
