import { Post } from "../models/Post.model.js";
import { Reel } from "../models/Reel.model.js";
import { Ad } from "../models/Ad.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { injectAdsInFeed } from "../utils/adInjector.js";

const getTrendingHashtags = (posts) => {
  const tagMap = new Map();
  for (const post of posts) {
    for (const tag of post.hashtags || []) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }
  }

  return [...tagMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([tag, count]) => ({ tag, count }));
};

export const getExploreFeed = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate("author", "username fullName avatar")
    .sort({ createdAt: -1 })
    .limit(30);

  let items = posts;
  if (req.showAds) {
    const ads = await Ad.find({ placement: "explore", isActive: true }).limit(6);
    items = injectAdsInFeed(posts, ads, 8);
  }

  res.json(items);
});

export const getTrending = asyncHandler(async (_req, res) => {
  const posts = await Post.find().select("hashtags").limit(300);
  res.json(getTrendingHashtags(posts));
});

export const getPostsByHashtag = asyncHandler(async (req, res) => {
  const tag = req.params.tag.toLowerCase();
  const posts = await Post.find({ hashtags: tag })
    .populate("author", "username fullName avatar")
    .sort({ createdAt: -1 });

  res.json(posts);
});

export const getPostsByLocation = asyncHandler(async (req, res) => {
  const posts = await Post.find({ "location.name": { $regex: req.params.id, $options: "i" } })
    .populate("author", "username fullName avatar")
    .sort({ createdAt: -1 });

  res.json(posts);
});

export const globalSearch = asyncHandler(async (req, res) => {
  const q = req.query.q?.trim() || "";
  if (!q) {
    res.json({ posts: [], reels: [], hashtags: [] });
    return;
  }

  const posts = await Post.find({ caption: { $regex: q, $options: "i" } })
    .populate("author", "username fullName avatar")
    .limit(20);
  const reels = await Reel.find({ caption: { $regex: q, $options: "i" } })
    .populate("author", "username fullName avatar")
    .limit(20);
  const hashtagPosts = await Post.find({ hashtags: { $regex: q.toLowerCase() } }).select("hashtags").limit(200);

  res.json({
    posts,
    reels,
    hashtags: getTrendingHashtags(hashtagPosts),
  });
});