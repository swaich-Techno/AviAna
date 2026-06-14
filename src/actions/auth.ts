"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { loginSchema } from "@/lib/validations";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS, signSession } from "@/lib/session";
import User from "@/models/User";

export async function loginAction(values: unknown) {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: "Enter a valid email and password." };
  }

  await connectToDatabase();
  const user = await User.findOne({ email: parsed.data.email.toLowerCase(), status: "active" });

  if (!user) {
    return { ok: false, message: "Invalid email or password." };
  }

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) {
    return { ok: false, message: "Invalid email or password." };
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = await signSession({
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS
  });

  return { ok: true, message: "Logged in." };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
