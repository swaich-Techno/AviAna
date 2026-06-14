import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["SUPER_ADMIN", "OWNER"], required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    lastLoginAt: { type: Date }
  },
  { timestamps: true }
);

export default (models.User || model("User", UserSchema)) as any;
