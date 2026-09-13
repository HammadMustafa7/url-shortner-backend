import express, { type Request, type Response } from "express";
import urlRoute from "./url.ts";
const router = express.Router();

router.use("/url", urlRoute);

router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
