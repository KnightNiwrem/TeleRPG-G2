import { Composer } from "grammy";
import { fmt, bold } from "@grammyjs/parse-mode";
import type { BotContext } from "./types";

/**
 * Composer that contains all bot commands
 */
export const commands = new Composer<BotContext>();

// Start command
commands.command("start", async (ctx) => {
  const welcomeMessage = fmt`🎮 Welcome to TeleRPG! 🎮

A Telegram-based MMORPG adventure awaits you!

Available commands:
/start - Show this welcome message
/help - Get help with commands
/createcharacter - Create your character
/profile - View your character profile
/area - Look around your current area

Start your journey by creating a character with /createcharacter!`;

  await ctx.reply(welcomeMessage.text, { entities: welcomeMessage.entities });
});

// Help command
commands.command("help", async (ctx) => {
  const helpMessage = fmt`🔧 ${bold}TeleRPG Commands${bold} 🔧

${bold}Character Management:${bold}
/createcharacter - Create your character
/profile - View your character stats

${bold}World Interaction:${bold}
/area - Look around your current area
/travel <destination> - Travel to another area
/explore - Explore your current area

${bold}Combat:${bold}
/attack - Attack in battle
/flee - Flee from battle

${bold}Items & Inventory:${bold}
/inventory - View your items
/use <item> - Use an item

${bold}Other:${bold}
/help - Show this help message
/start - Welcome message`;

  await ctx.reply(helpMessage.text, { entities: helpMessage.entities });
});

// Character creation command - starts the conversation
commands.command("createcharacter", async (ctx) => {
  await ctx.conversation.enter("createCharacterConversation");
});

commands.command("profile", async (ctx) => {
  await ctx.reply("Profile viewing is not yet implemented. Coming soon!");
});

commands.command("area", async (ctx) => {
  await ctx.reply("Area information is not yet implemented. Coming soon!");
});
