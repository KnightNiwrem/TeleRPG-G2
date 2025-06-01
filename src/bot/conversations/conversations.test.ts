import { describe, it, expect } from "bun:test";
import { Bot } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import { createPlayerConversation } from "./createCharacter";
import type { BotContext } from "../types";

describe("Character Creation Conversation", () => {
  it("should be able to create bot with conversation plugin", () => {
    const bot = new Bot<BotContext>("dummy-token");
    
    // Install conversations plugin
    bot.use(conversations());
    
    // Register conversations
    bot.use(createConversation(createPlayerConversation));
    
    expect(bot).toBeDefined();
  });

  it("should export createPlayerConversation function", () => {
    expect(typeof createPlayerConversation).toBe("function");
  });
});