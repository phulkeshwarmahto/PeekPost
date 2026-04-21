import { Conversation } from "../models/Conversation.model.js";
import { Message } from "../models/Message.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getIO } from "../socket/socket.js";

export const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id })
    .populate("participants", "username fullName avatar")
    .populate({
      path: "lastMessage",
      populate: { path: "sender", select: "username fullName avatar" },
    })
    .sort({ updatedAt: -1 });

  res.json(conversations);
});

export const createConversation = asyncHandler(async (req, res) => {
  const { participants = [], name = "" } = req.body;

  const participantIds = [...new Set([req.user._id.toString(), ...participants])];
  if (participantIds.length < 2) {
    const error = new Error("At least two participants are required");
    error.status = 400;
    throw error;
  }

  const conversation = await Conversation.create({
    participants: participantIds,
    name,
    isGroup: participantIds.length > 2,
  });

  const populated = await Conversation.findById(conversation._id).populate("participants", "username fullName avatar");
  res.status(201).json(populated);
});

export const getMessages = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);

  if (!conversation || !conversation.participants.some((id) => id.toString() === req.user._id.toString())) {
    const error = new Error("Conversation not found");
    error.status = 404;
    throw error;
  }

  const messages = await Message.find({ conversation: req.params.id })
    .populate("sender", "username fullName avatar")
    .sort({ createdAt: 1 });

  res.json(messages);
});

export const sendMessage = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);

  if (!conversation || !conversation.participants.some((id) => id.toString() === req.user._id.toString())) {
    const error = new Error("Conversation not found");
    error.status = 404;
    throw error;
  }

  const { text = "", mediaUrl = "" } = req.body;
  if (!text && !mediaUrl) {
    const error = new Error("Message text or mediaUrl is required");
    error.status = 400;
    throw error;
  }

  const message = await Message.create({
    conversation: conversation._id,
    sender: req.user._id,
    text,
    mediaUrl,
    seenBy: [req.user._id],
  });

  conversation.lastMessage = message._id;
  await conversation.save();

  const populated = await Message.findById(message._id).populate("sender", "username fullName avatar");

  const io = getIO();
  if (io) {
    for (const participantId of conversation.participants) {
      io.to(`user:${participantId.toString()}`).emit("message:new", populated);
    }
  }

  res.status(201).json(populated);
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) {
    const error = new Error("Message not found");
    error.status = 404;
    throw error;
  }

  if (message.sender.toString() !== req.user._id.toString()) {
    const error = new Error("Only sender can delete message");
    error.status = 403;
    throw error;
  }

  await Message.deleteOne({ _id: message._id });
  res.json({ message: "Message deleted" });
});