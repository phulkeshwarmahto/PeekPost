import { Router } from "express";

import {
  getPlans,
  createOrder,
  webhook,
  getStatus,
  cancelPremium,
} from "../controllers/premium.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/plans", getPlans);
router.post("/webhook", webhook);
router.post("/create-order", verifyToken, createOrder);
router.get("/status", verifyToken, getStatus);
router.post("/cancel", verifyToken, cancelPremium);

export default router;