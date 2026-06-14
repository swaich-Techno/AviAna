import { Schema, model, models } from "mongoose";

const WebsiteListingSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    fabric: { type: String, required: true },
    price: { type: Number },
    showPrice: { type: Boolean, default: false },
    images: [{ type: String }],
    featured: { type: Boolean, default: false, index: true },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    stockStatus: {
      type: String,
      enum: ["available", "limited", "sold_out"],
      default: "available"
    },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default (models.WebsiteListing || model("WebsiteListing", WebsiteListingSchema)) as any;
