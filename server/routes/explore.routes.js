import { Router } from "express";

import {
  getExploreFeed,
  getTrending,
  getPostsByHashtag,
  getPostsByLocation,
  globalSearch,
} from "../controllers/explore.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { injectAds } from "../middlewares/premium.middleware.js";

const router = Router();

router.use(verifyToken);

router.get("/", injectAds, getExploreFeed);
router.get("/trending", getTrending);
router.get("/hashtag/:tag", getPostsByHashtag);
router.get("/location/:id", getPostsByLocation);
router.get("/search", globalSearch);

export default router;