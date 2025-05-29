import { Bot, Context } from "grammy";

/**
 * Telegram Bot setup with grammY.js
 * Note: Sessions are explicitly NOT used per project requirements
 */

export interface BotContext extends Context {
  // Custom context properties will be added here in future phases
  customProperty?: string;
}

let bot: Bot<BotContext> | null = null;

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
    setupCommands(bot);
  }
  return bot;
}

function setupCommands(bot: Bot<BotContext>): void {
  // Start command
  bot.command("start", async (ctx) => {
    const welcomeMessage = 
      "🎮 Welcome to TeleRPG! 🎮\\n\\n" +
      "A Telegram-based MMORPG adventure awaits you!\\n\\n" +
      "Available commands:\\n" +
      "/start - Show this welcome message\\n" +
      "/help - Get help with commands\\n" +
      "/createcharacter - Create your character\\n" +
      "/profile - View your character profile\\n" +
      "/area - Look around your current area\\n\\n" +
      "Start your journey by creating a character with /createcharacter!";

    await ctx.reply(welcomeMessage, { parse_mode: "Markdown" });
  });

  // Help command
  bot.command("help", async (ctx) => {
    const helpMessage =
      "🔧 **TeleRPG Commands** 🔧\\n\\n" +
      "**Character Management:**\\n" +
      "/createcharacter - Create your character\\n" +
      "/profile - View your character stats\\n\\n" +
      "**World Interaction:**\\n" +
      "/area - Look around your current area\\n" +
      "/travel <destination> - Travel to another area\\n" +
      "/explore - Explore your current area\\n\\n" +
      "**Combat:**\\n" +
      "/attack - Attack in battle\\n" +
      "/flee - Flee from battle\\n\\n" +
      "**Items & Inventory:**\\n" +
      "/inventory - View your items\\n" +
      "/use <item> - Use an item\\n\\n" +
      "**Other:**\\n" +
      "/help - Show this help message\\n" +
      "/start - Welcome message";

    await ctx.reply(helpMessage, { parse_mode: "Markdown" });
  });

  // Placeholder for other commands (to be implemented in phases 2-3)
  bot.command("createcharacter", async (ctx) => {
    await ctx.reply("Character creation is not yet implemented. Coming soon!");
  });

  bot.command("profile", async (ctx) => {
    await ctx.reply("Profile viewing is not yet implemented. Coming soon!");
  });

  bot.command("area", async (ctx) => {
    await ctx.reply("Area information is not yet implemented. Coming soon!");
  });

  // Handle unknown commands
  bot.on("message:text", async (ctx) => {
    if (ctx.message.text.startsWith("/")) {
      await ctx.reply("Unknown command. Type /help to see available commands.");
    }
  });

  // Error handling
  bot.catch((err) => {
    console.error("Bot error:", err);
  });
}

export async function startBot(): Promise<void> {
  const botInstance = getBot();
  await botInstance.start();
  console.log("🤖 Bot started successfully!");
}

export async function stopBot(): Promise<void> {
  if (bot) {
    await bot.stop();
    bot = null;
    console.log("🤖 Bot stopped.");
  }
}