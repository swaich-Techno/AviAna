"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { passwordChangeSchema, userCreateSchema } from "@/lib/validations";
import User from "@/models/User";

export async function createOwnerAction(formData: FormData) {
  await requireSession(["SUPER_ADMIN"]);
  await connectToDatabase();

  const parsed = userCreateSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: "OWNER"
  });

  const existing = await User.findOne({ email: parsed.email.toLowerCase() });
  if (existing) {
    redirect("/dashboard/settings?error=user-exists");
  }

  await User.create({
    name: parsed.name,
    email: parsed.email.toLowerCase(),
    passwordHash: await bcrypt.hash(parsed.password, 12),
    role: parsed.role,
    status: "active"
  });

  revalidatePath("/dashboard/settings");
  redirect("/dashboard/settings?owner=created");
}

export async function changePasswordAction(formData: FormData) {
  const session = await requireSession(["SUPER_ADMIN", "OWNER"]);
  await connectToDatabase();

  const parsed = passwordChangeSchema.parse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword")
  });

  const user = await User.findById(session.userId);
  if (!user || !(await bcrypt.compare(parsed.currentPassword, user.passwordHash))) {
    redirect("/dashboard/settings?error=password");
  }

  user.passwordHash = await bcrypt.hash(parsed.newPassword, 12);
  await user.save();

  redirect("/dashboard/settings?password=changed");
}
