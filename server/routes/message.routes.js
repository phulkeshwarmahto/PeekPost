import { Router } from "express";

import {
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
  deleteMessage,
} from "../controllers/message.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyToken);

router.get("/conversations", getConversations);
router.post("/conversations", createConversation);
router.get("/conversations/:id", getMessages);
router.post("/conversations/:id", sendMessage);
router.delete("/messages/:id", deleteMessage);

export default router;