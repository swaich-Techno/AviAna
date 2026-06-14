import { jwtVerify, SignJWT } from "jose";
import { getJwtSecret } from "@/lib/config";

export const SESSION_COOKIE = "aviana_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

export type UserRole = "SUPER_ADMIN" | "OWNER";

export type SessionPayload = {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
};

function secretKey() {
  return new TextEncoder().encode(getJwtSecret());
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(secretKey());
}

export async function verifySession(token?: string | null) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload as SessionPayload;
  } catch {
    return null;
  }
}
