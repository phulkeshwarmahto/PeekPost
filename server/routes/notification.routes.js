import { Router } from "express";

import {
  getNotifications,
  markAllAsRead,
  updatePreferences,
} from "../controllers/notification.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyToken);

router.get("/", getNotifications);
router.post("/mark-all-read", markAllAsRead);
router.put("/preferences", updatePreferences);

export default router;