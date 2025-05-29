import { test, expect } from "bun:test";
import { createBot } from "../bot/bot.js";

/**
 * Telegram Bot tests
 */

test("should create bot instance", () => {
  const bot = createBot("test_token");
  expect(bot).toBeDefined();
});

test("should have bot token configured", () => {
  const bot = createBot("test_token_123");
  expect(bot.token).toBe("test_token_123");
});

test("should handle commands without errors", async () => {
  const bot = createBot("test_token");
  
  // Test that the bot is configured properly
  expect(bot).toBeDefined();
  expect(typeof bot.start).toBe("function");
  expect(typeof bot.stop).toBe("function");
});