import { z } from "zod";

const optionalNumber = z.preprocess(
  (value) => (value === "" || value === undefined || value === null ? undefined : Number(value)),
  z.number().finite().optional()
);

const requiredNumber = z.preprocess((value) => Number(value), z.number().finite());

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const siteSettingsSchema = z.object({
  businessName: z.string().min(2),
  tagline: z.string().min(2),
  aboutText: z.string().min(10),
  phone: z.string().min(5),
  whatsapp: z.string().min(5),
  email: z.string().email().or(z.literal("")),
  address: z.string().min(5),
  mapEmbedUrl: z.string().optional(),
  openingHours: z.string().optional(),
  instagramUrl: z.string().optional(),
  logoUrl: z.string().optional(),
  heroImageUrl: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  ogImageUrl: z.string().optional(),
  isWebsiteLive: z.boolean().default(true)
});

export const websiteListingSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().min(10),
  category: z.string().min(2),
  fabric: z.string().min(2),
  price: optionalNumber,
  showPrice: z.boolean().default(false),
  images: z.array(z.string().url().or(z.literal(""))).default([]),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published"]).default("draft"),
  stockStatus: z.enum(["available", "limited", "sold_out"]).default("available"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional()
});

export const inventoryItemSchema = z.object({
  id: z.string().optional(),
  itemName: z.string().min(2),
  sku: z.string().min(1),
  type: z.enum(["raw_material", "finished_good", "accessory", "packaging", "other"]),
  category: z.enum([
    "fabric",
    "thread",
    "button",
    "lace",
    "suit",
    "dupatta",
    "lining",
    "packaging",
    "other"
  ]),
  unit: z.enum(["meter", "piece", "kg", "box", "roll", "set", "other"]),
  openingStock: requiredNumber,
  currentStock: requiredNumber,
  lowStockAlertQty: requiredNumber,
  purchasePrice: requiredNumber,
  sellingPrice: requiredNumber,
  supplierId: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active")
});

export const supplierSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email().or(z.literal("")).optional(),
  address: z.string().optional(),
  gstNumber: z.string().optional(),
  openingBalance: requiredNumber,
  currentBalance: requiredNumber,
  notes: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active")
});

export const expenseSchema = z.object({
  title: z.string().min(2),
  category: z.enum([
    "rent",
    "salary",
    "electricity",
    "transport",
    "marketing",
    "repair",
    "packaging",
    "other"
  ]),
  amount: requiredNumber,
  expenseDate: z.string().min(8),
  paymentMode: z.string().min(2),
  notes: z.string().optional()
});

export const userCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(10),
  role: z.enum(["OWNER"]).default("OWNER")
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(10)
});
