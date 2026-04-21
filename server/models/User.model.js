import mongoose from "mongoose";

const notificationSettingsSchema = new mongoose.Schema(
  {
    likes: { type: Boolean, default: true },
    comments: { type: Boolean, default: true },
    follows: { type: Boolean, default: true },
    mentions: { type: Boolean, default: true },
    messages: { type: Boolean, default: true },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true, trim: true, lowercase: true },
    email: { type: String, unique: true, required: true, trim: true, lowercase: true },
    password: { type: String, default: null },
    fullName: { type: String, default: "" },
    bio: { type: String, default: "" },
    website: { type: String, default: "" },
    avatar: { type: String, default: "" },
    isPrivate: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    restrictedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    closeFriends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    followRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isPremium: { type: Boolean, default: false },
    premiumPlan: { type: String, enum: ["monthly", "yearly", null], default: null },
    premiumExpiry: { type: Date, default: null },
    premiumBadge: { type: Boolean, default: false },
    googleId: { type: String, default: "" },
    refreshToken: { type: String, default: "" },
    twoFASecret: { type: String, default: "" },
    twoFAEnabled: { type: Boolean, default: false },
    hideLikeCounts: { type: Boolean, default: false },
    notifications: { type: notificationSettingsSchema, default: () => ({}) },
    isDeactivated: { type: Boolean, default: false },
    lastSeen: { type: Date, default: null },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);