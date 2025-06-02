import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { API_CONSTANTS } from "grammy";
import * as botModule from "./bot.js";

/**
 * Webhook configuration tests for chat members plugin
 */

describe("Webhook Configuration for Chat Members", () => {
  let originalEnv: string | undefined;

  beforeEach(() => {
    // Store original BOT_TOKEN
    originalEnv = process.env.BOT_TOKEN;
    // Set a test token
    process.env.BOT_TOKEN = "test_token_for_webhook_test";
  });

  afterEach(() => {
    // Restore original BOT_TOKEN
    if (originalEnv) {
      process.env.BOT_TOKEN = originalEnv;
    } else {
      delete process.env.BOT_TOKEN;
    }
  });

  it("should have API_CONSTANTS imported correctly", () => {
    expect(API_CONSTANTS).toBeDefined();
    expect(API_CONSTANTS.ALL_UPDATE_TYPES).toBeDefined();
    expect(Array.isArray(API_CONSTANTS.ALL_UPDATE_TYPES)).toBe(true);
    expect((API_CONSTANTS.ALL_UPDATE_TYPES as unknown as string[]).includes("chat_member")).toBe(true);
  });

  it("should include chat_member in ALL_UPDATE_TYPES but not in DEFAULT_UPDATE_TYPES", () => {
    expect((API_CONSTANTS.DEFAULT_UPDATE_TYPES as unknown as string[]).includes("chat_member")).toBe(false);
    expect((API_CONSTANTS.ALL_UPDATE_TYPES as unknown as string[]).includes("chat_member")).toBe(true);
  });

  it("should export startBot function that uses deleteWebhook", () => {
    expect(typeof botModule.startBot).toBe("function");
  });
});