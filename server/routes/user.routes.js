import { Router } from "express";

import {
  getProfileByUsername,
  updateMe,
  toggleFollow,
  getFollowers,
  getFollowing,
  toggleBlock,
  toggleRestrict,
  getSuggestions,
  searchUsers,
  deleteMe,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyToken);

router.get("/suggestions", getSuggestions);
router.get("/search", searchUsers);
router.get("/:username", getProfileByUsername);
router.put("/me", updateMe);
router.post("/:id/follow", toggleFollow);
router.get("/:id/followers", getFollowers);
router.get("/:id/following", getFollowing);
router.post("/:id/block", toggleBlock);
router.post("/:id/restrict", toggleRestrict);
router.delete("/me", deleteMe);

export default router;