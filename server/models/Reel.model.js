import mongoose from "mongoose";

const reelSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    caption: { type: String, default: "" },
    videoUrl: { type: String, required: true },
    coverUrl: { type: String, default: "" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    shares: { type: Number, default: 0 },
    audio: {
      title: { type: String, default: "Original Audio" },
      artist: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

export const Reel = mongoose.model("Reel", reelSchema);