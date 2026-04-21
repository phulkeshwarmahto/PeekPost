import { Notification } from "../models/Notification.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .populate("actor", "username fullName avatar")
    .sort({ createdAt: -1 })
    .limit(100);

  res.json(notifications);
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id, isRead: false }, { $set: { isRead: true } });
  res.json({ message: "All notifications marked as read" });
});

export const updatePreferences = asyncHandler(async (req, res) => {
  const preferences = req.body || {};
  await Notification.updateMany({ recipient: req.user._id }, { $set: { isRead: true } });

  res.json({ message: "Preferences saved", preferences });
});