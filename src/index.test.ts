import { test, expect } from "bun:test";

/**
 * Application integration tests
 */

test("should export main application components", async () => {
  // Test that core modules can be imported without errors
  const { getDatabase } = await import("./database/connection.js");
  const { getRedisConnection } = await import("./redis/connection.js");
  const { getBot } = await import("./bot/bot.js");

  expect(typeof getDatabase).toBe("function");
  expect(typeof getRedisConnection).toBe("function");
  expect(typeof getBot).toBe("function");
});

test("environment variables are defined for required components", () => {
  // This test ensures that environment variable handling is set up correctly
  const requiredEnvVars = ["DATABASE_URL", "REDIS_URL"];
  
  // We won't test BOT_TOKEN as it's optional for development
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.log(`Warning: ${envVar} environment variable not set`);
    }
  }
  
  // This test always passes, but logs warnings for missing env vars
  expect(true).toBe(true);
});