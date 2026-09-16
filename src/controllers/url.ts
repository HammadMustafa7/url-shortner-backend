import { type Request, type Response } from "express";
import { nanoid } from "nanoid";
import URL from "../models/url.ts";
import { urlSchema } from "../schemas/url.ts";

async function handleGenerateNewShortUrl(req: Request, res: Response) {
  try {
    const result = urlSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        status: "error",
        message: result.error.issues[0]?.message ?? "Invalid request",
      });
    }

    const { url } = result.data;

    const shortId = nanoid(8);

    await URL.create({
      shortId: shortId,
      redirectUrl: url,
    });

    res.status(201).json({
      shortId: shortId,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
}

async function handleFetchURL(req: Request, res: Response) {
  try {
    const id = req.params.shortId;

    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "Id not provided.",
      });
    }

    const entry = await URL.findOneAndUpdate(
      {
        shortId: id,
      },
      {
        $push: {
          visitHistory: { timeStamp: new Date() },
        },
      },
    );

    if (!entry) {
      return res.status(404).json({
        status: "error",
        message: "URL Not Found",
      });
    }

    res.status(301).redirect(entry?.redirectUrl);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
}

async function handleGetAnalytics(req: Request, res: Response) {
  try {
    const id = req.params.shortId;

    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "Id not provided.",
      });
    }

    const result = await URL.findOne(
      {
        shortId: id,
      },
    );

    if (!result) {
      return res.status(404).json({
        status: "error",
        message: "URL Not Found",
      });
    }

    res.status(201).json({
      status: "success",
      totalClicks: result.visitHistory.length,
      // analytics: result.visitHistory,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
}

export { handleGenerateNewShortUrl, handleFetchURL, handleGetAnalytics };
