import { Bot, type ErrorHandler, API_CONSTANTS } from "grammy";
import { run, type RunnerHandle } from "@grammyjs/runner";
import { conversations, createConversation } from "@grammyjs/conversations";
import { chatMembers } from "@grammyjs/chat-members";
import { PsqlAdapter } from "@grammyjs/storage-psql";
import type { ChatMember } from "grammy/types";
import { commands } from "./commands";
import type { BotContext } from "./types";
import { createPlayerConversation } from "./conversations";
import { getPostgresClient } from "../database/connection.js";

/**
 * Telegram Bot setup with grammY.js
 * Note: Sessions are explicitly NOT used per project requirements
 */

let bot: Bot<BotContext> | null = null;
let runner: RunnerHandle | null = null;

export function createBot(token: string): Bot<BotContext> {
  return new Bot<BotContext>(token);
}

export async function getBot(): Promise<Bot<BotContext>> {
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
    
    // Set up chat members plugin with PostgreSQL storage
    const client = getPostgresClient();
    await client.connect();
    const chatMembersAdapter = await PsqlAdapter.create({ 
      client, 
      tableName: "chat_members" 
    }) as PsqlAdapter<ChatMember>;
    privateChatBot.use(chatMembers(chatMembersAdapter));
    
    privateChatBot.use(commands);
    
    // Handle unknown commands
    privateChatBot.on("message:text", async (ctx) => {
      await ctx.reply("Unknown command. Type /help to see available commands.");
    });
  }
  return bot;
}

export async function startBot(): Promise<void> {
  const botInstance = await getBot();
  
  // Delete webhook to ensure we use polling for chat members plugin
  await botInstance.api.deleteWebhook();
  
  // Start runner with all update types including chat_member
  runner = run(botInstance, {
    runner: {
      fetch: {
        allowed_updates: API_CONSTANTS.ALL_UPDATE_TYPES,
      },
    },
  });
  console.log("🤖 Bot started successfully!");
}

export async function stopBot(): Promise<void> {
  if (runner) {
    await runner.stop();
    runner = null;
  }
  console.log("🤖 Bot stopped.");
}