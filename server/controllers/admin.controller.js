import { Ad } from "../models/Ad.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listAds = asyncHandler(async (_req, res) => {
  const ads = await Ad.find().sort({ createdAt: -1 });
  res.json(ads);
});

export const createAd = asyncHandler(async (req, res) => {
  const ad = await Ad.create(req.body);
  res.status(201).json(ad);
});

export const updateAd = asyncHandler(async (req, res) => {
  const ad = await Ad.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
  if (!ad) {
    const error = new Error("Ad not found");
    error.status = 404;
    throw error;
  }

  res.json(ad);
});

export const deleteAd = asyncHandler(async (req, res) => {
  const ad = await Ad.findById(req.params.id);
  if (!ad) {
    const error = new Error("Ad not found");
    error.status = 404;
    throw error;
  }

  await Ad.deleteOne({ _id: ad._id });
  res.json({ message: "Ad deleted" });
});