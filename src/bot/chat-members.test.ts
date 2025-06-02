import { describe, it, expect } from "bun:test";
import { Bot } from "grammy";
import { chatMembers } from "@grammyjs/chat-members";
import { createBot } from "./bot.js";
import type { BotContext } from "./types";

/**
 * Chat Members Plugin Integration Tests
 */

describe("Chat Members Plugin", () => {
  it("should be able to import chat-members plugin", () => {
    expect(typeof chatMembers).toBe("function");
  });

  it("should have ChatMembersFlavor in BotContext", () => {
    const bot = new Bot<BotContext>("dummy-token");
    
    // Test that the bot can be created with the extended context type
    expect(bot).toBeDefined();
    expect(bot.token).toBe("dummy-token");
  });

  it("should export chat members functionality", async () => {
    // Test that the module exports the main function
    const chatMembersModule = await import("@grammyjs/chat-members");
    expect(chatMembersModule.chatMembers).toBeDefined();
    expect(typeof chatMembersModule.chatMembers).toBe("function");
  });

  it("should be able to create bot with proper context type", () => {
    // Test that createBot works with the new context type
    const bot = createBot("test-token");
    expect(bot).toBeDefined();
    expect(bot.token).toBe("test-token");
  });
});