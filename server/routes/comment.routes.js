import { Router } from "express";

import {
  addComment,
  getCommentsForPost,
  updateComment,
  deleteComment,
  toggleLikeComment,
  replyToComment,
  pinComment,
} from "../controllers/comment.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyToken);

router.post("/post/:postId", addComment);
router.get("/post/:postId", getCommentsForPost);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);
router.post("/:id/like", toggleLikeComment);
router.post("/:id/reply", replyToComment);
router.post("/:id/pin", pinComment);

export default router;