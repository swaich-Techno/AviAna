export const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || "Aviana Collection";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production.");
  }

  return secret || "development-only-change-this-secret";
}
