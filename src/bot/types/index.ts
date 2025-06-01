import { Context } from "grammy";

/**
 * Custom context type for the Telegram bot
 * Extends the base Context from grammY with custom properties
 */
export type BotContext = Context & {
  // Custom context properties will be added here in future phases
  customProperty?: string;
};