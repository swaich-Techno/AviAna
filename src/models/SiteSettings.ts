import { Schema, model, models } from "mongoose";

const SiteSettingsSchema = new Schema(
  {
    businessName: { type: String, default: "Aviana Collection" },
    tagline: { type: String, default: "Premium Suits, Fabrics & Boutique Collections" },
    aboutText: {
      type: String,
      default:
        "Aviana Collection curates premium suits, fabrics, Punjabi suits, and boutique collections with personal guidance for every occasion."
    },
    phone: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
    mapEmbedUrl: { type: String, default: "" },
    openingHours: { type: String, default: "" },
    instagramUrl: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
    heroImageUrl: { type: String, default: "" },
    seoTitle: { type: String, default: "Aviana Collection | Premium Cloth House" },
    seoDescription: {
      type: String,
      default:
        "Shop premium suits, fabrics, ladies suits, Punjabi suits, designer suits, and boutique collections at Aviana Collection."
    },
    ogImageUrl: { type: String, default: "" },
    isWebsiteLive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default (models.SiteSettings || model("SiteSettings", SiteSettingsSchema)) as any;
