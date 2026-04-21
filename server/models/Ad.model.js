import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    linkUrl: { type: String, required: true },
    advertiser: { type: String, required: true },
    targetAudience: {
      ageMin: { type: Number, default: 18 },
      ageMax: { type: Number, default: 65 },
      interests: { type: [String], default: [] },
    },
    placement: { type: String, enum: ["feed", "story", "reel", "explore"], required: true },
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: null },
  },
  { timestamps: true },
);

export const Ad = mongoose.model("Ad", adSchema);