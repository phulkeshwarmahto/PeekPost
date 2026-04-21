import dotenv from "dotenv";
import mongoose from "mongoose";

import { connectDB } from "../config/db.js";
import { User } from "../models/User.model.js";
import { Post } from "../models/Post.model.js";
import { Story } from "../models/Story.model.js";
import { Ad } from "../models/Ad.model.js";

dotenv.config();

const AVATAR = "https://i.pravatar.cc/200";

const seed = async () => {
  await connectDB();

  await Promise.all([User.deleteMany({}), Post.deleteMany({}), Story.deleteMany({}), Ad.deleteMany({})]);

  const users = await User.insertMany(
    Array.from({ length: 10 }).map((_, index) => ({
      username: `user${index + 1}`,
      email: `user${index + 1}@peekpost.dev`,
      password: "$2a$12$RubHJEtuG41vnERNZw2sV.DxIASxlrDeZkVaOEPwBQXz55meXYgvO",
      fullName: `User ${index + 1}`,
      avatar: `${AVATAR}?img=${index + 1}`,
      isVerified: true,
    })),
  );

  const posts = await Post.insertMany(
    Array.from({ length: 30 }).map((_, index) => {
      const author = users[index % users.length];
      return {
        author: author._id,
        media: [{ url: `https://picsum.photos/seed/${index + 1}/1080/1080`, type: "image", publicId: "" }],
        caption: `Sample post ${index + 1} #peekpost #demo`,
        hashtags: ["peekpost", "demo"],
        likes: [],
      };
    }),
  );

  for (const user of users) {
    const randomPosts = posts.slice(0, 4).map((post) => post._id);
    user.savedPosts = randomPosts;
    await user.save();
  }

  await Story.insertMany(
    users.slice(0, 5).map((user, index) => ({
      author: user._id,
      media: {
        url: `https://picsum.photos/seed/story-${index + 1}/720/1280`,
        type: "image",
      },
      text: `Story ${index + 1}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    })),
  );

  await Ad.insertMany([
    {
      title: "Upgrade your workspace",
      imageUrl: "https://picsum.photos/seed/ad1/1200/900",
      linkUrl: "https://example.com",
      advertiser: "Workly",
      placement: "feed",
    },
    {
      title: "Story ad sample",
      imageUrl: "https://picsum.photos/seed/ad2/1200/900",
      linkUrl: "https://example.com",
      advertiser: "StoryBrand",
      placement: "story",
    },
    {
      title: "Reel ad sample",
      imageUrl: "https://picsum.photos/seed/ad3/1200/900",
      linkUrl: "https://example.com",
      advertiser: "ReelX",
      placement: "reel",
    },
    {
      title: "Explore ad sample",
      imageUrl: "https://picsum.photos/seed/ad4/1200/900",
      linkUrl: "https://example.com",
      advertiser: "ExploreHub",
      placement: "explore",
    },
  ]);

  console.log("Seed complete");
  await mongoose.connection.close();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
