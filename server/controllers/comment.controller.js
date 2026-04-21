import { Comment } from "../models/Comment.model.js";
import { Post } from "../models/Post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addComment = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) {
    const error = new Error("Post not found");
    error.status = 404;
    throw error;
  }

  if (post.commentsDisabled) {
    const error = new Error("Comments are disabled for this post");
    error.status = 400;
    throw error;
  }

  const { text } = req.body;
  if (!text?.trim()) {
    const error = new Error("Comment text is required");
    error.status = 400;
    throw error;
  }

  const comment = await Comment.create({
    post: post._id,
    author: req.user._id,
    text: text.trim(),
  });

  post.comments.push(comment._id);
  await post.save();

  const populated = await Comment.findById(comment._id).populate("author", "username fullName avatar");
  res.status(201).json(populated);
});

export const getCommentsForPost = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate("author", "username fullName avatar")
    .sort({ createdAt: -1 });

  res.json(comments);
});

export const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    const error = new Error("Comment not found");
    error.status = 404;
    throw error;
  }

  if (comment.author.toString() !== req.user._id.toString()) {
    const error = new Error("Forbidden");
    error.status = 403;
    throw error;
  }

  comment.text = req.body.text || comment.text;
  await comment.save();

  res.json(comment);
});

export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    const error = new Error("Comment not found");
    error.status = 404;
    throw error;
  }

  const post = await Post.findById(comment.post);
  const isCommentOwner = comment.author.toString() === req.user._id.toString();
  const isPostOwner = post?.author?.toString() === req.user._id.toString();

  if (!isCommentOwner && !isPostOwner) {
    const error = new Error("Forbidden");
    error.status = 403;
    throw error;
  }

  await Comment.deleteOne({ _id: comment._id });
  await Post.findByIdAndUpdate(comment.post, { $pull: { comments: comment._id } });

  res.json({ message: "Comment deleted" });
});

export const toggleLikeComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    const error = new Error("Comment not found");
    error.status = 404;
    throw error;
  }

  const liked = comment.likes.some((id) => id.toString() === req.user._id.toString());
  if (liked) {
    comment.likes = comment.likes.filter((id) => id.toString() !== req.user._id.toString());
  } else {
    comment.likes.push(req.user._id);
  }

  await comment.save();
  res.json({ liked: !liked, likesCount: comment.likes.length });
});

export const replyToComment = asyncHandler(async (req, res) => {
  const parent = await Comment.findById(req.params.id);
  if (!parent) {
    const error = new Error("Comment not found");
    error.status = 404;
    throw error;
  }

  const { text } = req.body;
  const reply = await Comment.create({
    post: parent.post,
    author: req.user._id,
    text,
    parentComment: parent._id,
  });

  await Post.findByIdAndUpdate(parent.post, { $push: { comments: reply._id } });

  const populated = await Comment.findById(reply._id).populate("author", "username fullName avatar");
  res.status(201).json(populated);
});

export const pinComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    const error = new Error("Comment not found");
    error.status = 404;
    throw error;
  }

  const post = await Post.findById(comment.post);
  if (post.author.toString() !== req.user._id.toString()) {
    const error = new Error("Only post author can pin comments");
    error.status = 403;
    throw error;
  }

  await Comment.updateMany({ post: post._id }, { $set: { pinned: false } });
  comment.pinned = true;
  await comment.save();

  res.json({ pinned: true });
});