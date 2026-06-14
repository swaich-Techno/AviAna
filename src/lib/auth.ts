import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import { SESSION_COOKIE, type UserRole, verifySession } from "@/lib/session";
import User from "@/models/User";

export async function getSession() {
  const cookieStore = await cookies();
  return verifySession(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function requireSession(roles?: UserRole[]) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (roles?.length && !roles.includes(session.role)) {
    redirect("/dashboard");
  }

  return session;
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  await connectToDatabase();
  return User.findById(session.userId).lean();
}
