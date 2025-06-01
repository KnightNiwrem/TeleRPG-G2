import { Composer } from "grammy";
import type { BotContext } from "./types";

/**
 * Composer that contains all bot commands
 */
export const commands = new Composer<BotContext>();

// Start command
commands.command("start", async (ctx) => {
  const welcomeMessage = 
    "🎮 Welcome to TeleRPG! 🎮\n\n" +
    "A Telegram-based MMORPG adventure awaits you!\n\n" +
    "Available commands:\n" +
    "/start - Show this welcome message\n" +
    "/help - Get help with commands\n" +
    "/createcharacter - Create your character\n" +
    "/profile - View your character profile\n" +
    "/area - Look around your current area\n\n" +
    "Start your journey by creating a character with /createcharacter!";

  await ctx.reply(welcomeMessage, { parse_mode: "Markdown" });
});

// Help command
commands.command("help", async (ctx) => {
  const helpMessage =
    "🔧 **TeleRPG Commands** 🔧\n\n" +
    "**Character Management:**\n" +
    "/createcharacter - Create your character\n" +
    "/profile - View your character stats\n\n" +
    "**World Interaction:**\n" +
    "/area - Look around your current area\n" +
    "/travel <destination> - Travel to another area\n" +
    "/explore - Explore your current area\n\n" +
    "**Combat:**\n" +
    "/attack - Attack in battle\n" +
    "/flee - Flee from battle\n\n" +
    "**Items & Inventory:**\n" +
    "/inventory - View your items\n" +
    "/use <item> - Use an item\n\n" +
    "**Other:**\n" +
    "/help - Show this help message\n" +
    "/start - Welcome message";

  await ctx.reply(helpMessage, { parse_mode: "Markdown" });
});

// Placeholder for other commands (to be implemented in phases 2-3)
commands.command("createcharacter", async (ctx) => {
  await ctx.reply("Character creation is not yet implemented. Coming soon!");
});

commands.command("profile", async (ctx) => {
  await ctx.reply("Profile viewing is not yet implemented. Coming soon!");
});

commands.command("area", async (ctx) => {
  await ctx.reply("Area information is not yet implemented. Coming soon!");
});
