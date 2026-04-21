import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    media: {
      url: { type: String, required: true },
      type: { type: String, enum: ["image", "video"], required: true },
      publicId: { type: String, default: "" },
    },
    text: { type: String, default: "" },
    stickers: { type: [String], default: [] },
    music: {
      title: String,
      artist: String,
      url: String,
    },
    viewers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        viewedAt: { type: Date, default: Date.now },
      },
    ],
    reactions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        emoji: { type: String, default: "??" },
      },
    ],
    audience: { type: String, enum: ["public", "closeFriends"], default: "public" },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true },
);

export const Story = mongoose.model("Story", storySchema);