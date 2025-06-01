import { Context } from "grammy";
import type { ConversationFlavor } from "@grammyjs/conversations";

/**
 * Custom context flavor for the Telegram bot
 */
type CustomFlavor = {
  // Custom context properties will be added here in future phases
  customProperty?: string;
};

/**
 * Custom context type for the Telegram bot
 */
export type BotContext = ConversationFlavor<Context & CustomFlavor>;
