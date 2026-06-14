"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { defaultSiteSettings } from "@/lib/defaults";
import { slugify } from "@/lib/utils";
import { siteSettingsSchema, websiteListingSchema } from "@/lib/validations";
import SiteSettings from "@/models/SiteSettings";
import WebsiteListing from "@/models/WebsiteListing";

function checkbox(value: FormDataEntryValue | null) {
  return value === "on" || value === "true";
}

function imagesFrom(value: FormDataEntryValue | null) {
  return String(value || "")
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

async function uniqueSlug(title: string, id?: string, requested?: string) {
  const base = slugify(requested || title);
  let slug = base;
  let suffix = 1;

  while (await WebsiteListing.findOne({ slug, ...(id ? { _id: { $ne: id } } : {}) })) {
    suffix += 1;
    slug = `${base}-${suffix}`;
  }

  return slug;
}

export async function saveSiteSettingsAction(formData: FormData) {
  await requireSession(["SUPER_ADMIN"]);
  await connectToDatabase();

  const parsed = siteSettingsSchema.parse({
    businessName: formData.get("businessName"),
    tagline: formData.get("tagline"),
    aboutText: formData.get("aboutText"),
    phone: formData.get("phone"),
    whatsapp: formData.get("whatsapp"),
    email: formData.get("email"),
    address: formData.get("address"),
    mapEmbedUrl: formData.get("mapEmbedUrl"),
    openingHours: formData.get("openingHours"),
    instagramUrl: formData.get("instagramUrl"),
    logoUrl: formData.get("logoUrl"),
    heroImageUrl: formData.get("heroImageUrl"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    ogImageUrl: formData.get("ogImageUrl"),
    isWebsiteLive: checkbox(formData.get("isWebsiteLive"))
  });

  await SiteSettings.findOneAndUpdate({}, { $set: { ...defaultSiteSettings, ...parsed } }, { upsert: true });
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/dashboard/website/settings");
  redirect("/dashboard/website/settings?saved=1");
}

export async function saveWebsiteListingAction(formData: FormData) {
  const session = await requireSession(["SUPER_ADMIN"]);
  await connectToDatabase();

  const id = String(formData.get("id") || "");
  const parsed = websiteListingSchema.parse({
    id: id || undefined,
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    category: formData.get("category"),
    fabric: formData.get("fabric"),
    price: formData.get("price"),
    showPrice: checkbox(formData.get("showPrice")),
    images: imagesFrom(formData.get("images")),
    featured: checkbox(formData.get("featured")),
    status: formData.get("status") || "draft",
    stockStatus: formData.get("stockStatus") || "available",
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription")
  });

  const slug = await uniqueSlug(parsed.title, parsed.id, parsed.slug);
  const payload = {
    ...parsed,
    slug,
    updatedBy: session.userId,
    images: parsed.images.filter(Boolean)
  };

  if (id) {
    await WebsiteListing.findByIdAndUpdate(id, payload);
  } else {
    await WebsiteListing.create({ ...payload, createdBy: session.userId });
  }

  revalidatePath("/");
  revalidatePath("/collections");
  revalidatePath("/dashboard/website/listings");
  redirect("/dashboard/website/listings?saved=1");
}

export async function setListingStatusAction(formData: FormData) {
  const session = await requireSession(["SUPER_ADMIN"]);
  await connectToDatabase();

  const id = String(formData.get("id"));
  const status = String(formData.get("status")) === "published" ? "published" : "draft";
  await WebsiteListing.findByIdAndUpdate(id, { status, updatedBy: session.userId });

  revalidatePath("/");
  revalidatePath("/collections");
  revalidatePath("/dashboard/website/listings");
  redirect("/dashboard/website/listings?updated=1");
}

export async function deleteListingAction(formData: FormData) {
  await requireSession(["SUPER_ADMIN"]);
  await connectToDatabase();

  await WebsiteListing.findByIdAndDelete(String(formData.get("id")));
  revalidatePath("/");
  revalidatePath("/collections");
  revalidatePath("/dashboard/website/listings");
  redirect("/dashboard/website/listings?deleted=1");
}
