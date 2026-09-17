import "dotenv/config";
import connectToMongoDB from "./configs/connect.ts";
import app from "./index.ts";

const server = app.listen(process.env.PORT, async () => {
  try {
    await connectToMongoDB();

    console.log(
      `Server is running in ${process.env.NODE_ENV || "development"} mode on port ${process.env.PORT}`,
    );
    console.log(
      `Health check: ${process.env.BACKEND_URL}/api/v1/health`,
    );
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
});

// Graceful shutdown handling
const handleShutdown = (signal: string) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });

  // Force close after 10s timeout
  setTimeout(() => {
    console.error("Forced shutdown due to timeout.");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => handleShutdown("SIGTERM")); // for Kubernetes or other process managers
process.on("SIGINT", () => handleShutdown("SIGINT")); // for Ctrl+C in terminal

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception thrown:", error);
  process.exit(1);
});
