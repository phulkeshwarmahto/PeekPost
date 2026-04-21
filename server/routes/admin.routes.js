import { Router } from "express";

import { listAds, createAd, updateAd, deleteAd } from "../controllers/admin.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyToken);

router.get("/ads", listAds);
router.post("/ads", createAd);
router.put("/ads/:id", updateAd);
router.delete("/ads/:id", deleteAd);

export default router;