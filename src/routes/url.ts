import express from 'express';
import {
  handleGenerateNewShortUrl,
  handleFetchURL,
  handleGetAnalytics,
} from "../controllers/url.ts";

const router = express.Router();

router.post("/", handleGenerateNewShortUrl)

router.get("/:shortId", handleFetchURL);

router.get("/:shortId/analytics", handleGetAnalytics)

export default router;