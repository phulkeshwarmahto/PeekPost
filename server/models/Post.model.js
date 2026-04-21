import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    type: { type: String, enum: ["image", "video"], required: true },
    publicId: { type: String, default: "" },
  },
  { _id: false },
);

const taggedSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    x: Number,
    y: Number,
  },
  { _id: false },
);

const locationSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    lat: Number,
    lng: Number,
  },
  { _id: false },
);

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    media: { type: [mediaSchema], default: [] },
    caption: { type: String, default: "" },
    hashtags: { type: [String], default: [] },
    mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tagged: { type: [taggedSchema], default: [] },
    location: { type: locationSchema, default: () => ({}) },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    views: { type: Number, default: 0 },
    commentsDisabled: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Post = mongoose.model("Post", postSchema);