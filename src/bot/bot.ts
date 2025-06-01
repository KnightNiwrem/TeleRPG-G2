import { Bot, type ErrorHandler } from "grammy";
import { run, type RunnerHandle } from "@grammyjs/runner";
import { conversations, createConversation } from "@grammyjs/conversations";
import { commands } from "./commands";
import type { BotContext } from "./types";
import { createPlayerConversation } from "./conversations";

/**
 * Telegram Bot setup with grammY.js
 * Note: Sessions are explicitly NOT used per project requirements
 */

let bot: Bot<BotContext> | null = null;
let runner: RunnerHandle | null = null;

export function createBot(token: string): Bot<BotContext> {
  return new Bot<BotContext>(token);
}

export function getBot(): Bot<BotContext> {
  if (!bot) {
    const token = process.env.BOT_TOKEN;
    if (!token) {
      throw new Error("BOT_TOKEN environment variable is required");
    }
    bot = createBot(token);
    
    // Install conversations plugin
    bot.use(conversations());
    
    // Register conversations
    bot.use(createConversation(createPlayerConversation));
    
    // Define error handler
    const errorHandler: ErrorHandler<BotContext> = (err) => {
      const ctx = err.ctx;
      console.error(`Error while handling update ${ctx.update.update_id}:`);
      console.error(err.error);
    };
    
    // Set up bot with error handling and private chat restriction
    const protectedBot = bot.errorBoundary(errorHandler);
    const privateChatBot = protectedBot.chatType("private");
    privateChatBot.use(commands);
    
    // Handle unknown commands
    privateChatBot.on("message:text", async (ctx) => {
      await ctx.reply("Unknown command. Type /help to see available commands.");
    });
  }
  return bot;
}

export async function startBot(): Promise<void> {
  const botInstance = getBot();
  runner = run(botInstance);
  console.log("🤖 Bot started successfully!");
}

export async function stopBot(): Promise<void> {
  if (runner) {
    runner.stop();
    runner = null;
  }
  console.log("🤖 Bot stopped.");
}