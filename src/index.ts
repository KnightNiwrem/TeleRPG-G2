/**
 * Main entry point for the TeleRPG application
 */
import { getDatabase } from "./database/connection.js";
import { getRedisConnection } from "./redis/connection.js";
import { startBot } from "./bot/bot.js";

const main = async (): Promise<void> => {
  try {
    console.log("🚀 Starting TeleRPG application...");

    // Test database connection
    getDatabase();
    console.log("📊 Database connection established");

    // Test Redis connection
    const redis = getRedisConnection();
    await redis.ping();
    console.log("📡 Redis connection established");

    // Start the Telegram bot
    if (process.env.BOT_TOKEN) {
      await startBot();
    } else {
      console.log("⚠️ BOT_TOKEN not provided, skipping bot startup");
    }

    console.log("✅ TeleRPG application started successfully!");
  } catch (error) {
    console.error("❌ Failed to start application:", error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down TeleRPG application...");
  process.exit(0);
});

main();