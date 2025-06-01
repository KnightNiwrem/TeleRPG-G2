import { Context, InlineKeyboard } from "grammy";
import type { Conversation } from "@grammyjs/conversations";
import { fmt, bold, code, italic } from "@grammyjs/parse-mode";
import type { BotContext } from "../types";
import { getDatabase } from "../../database/connection.js";
import type { NewPlayer } from "../../database/types.js";

export async function createPlayerConversation(
  conversation: Conversation<BotContext>,
  ctx: Context,
) {
  // Welcome message
  const welcomeMessage = fmt`🎭 ${bold}Player Creation${bold} 🎭

Let's create your player! I'll guide you through the process.

First, what would you like to name your player?
${italic}(Please enter a name between 2-20 characters)${italic}`;

  await ctx.reply(welcomeMessage.text, { entities: welcomeMessage.entities });

  // Get player name
  const playerName = await conversation.waitFor("message:text").and(
    (ctx) => {
      const name = ctx.message.text.trim();
      
      if (name.length < 2 || name.length > 20) {
        ctx.reply("Player name must be between 2-20 characters. Please try again:");
        return false;
      }

      if (!/^[a-zA-Z\s]+$/.test(name)) {
        ctx.reply("Player name can only contain letters and spaces. Please try again:");
        return false;
      }

      return true;
    }
  ).then(ctx => ctx.message.text.trim());

  const nameConfirmation = fmt`Great! Your player will be named ${bold}${playerName}${bold}.`;
  await ctx.reply(nameConfirmation.text, { entities: nameConfirmation.entities });

  // Choose player class
  const classSelection = fmt`⚔️ ${bold}Choose your class:${bold}

Each class has unique abilities and playstyles:`;

  const classKeyboard = new InlineKeyboard()
    .text("⚔️ Warrior", "class_warrior").text("🔮 Mage", "class_mage").row()
    .text("🗡️ Rogue", "class_rogue").text("🏹 Archer", "class_archer");

  await ctx.reply(classSelection.text, {
    entities: classSelection.entities,
    reply_markup: classKeyboard
  });

  const playerClass = await conversation.waitForCallbackQuery(["class_warrior", "class_mage", "class_rogue", "class_archer"]).then(async (ctx) => {
    const data = ctx.callbackQuery.data;
    const classMap: Record<string, string> = {
      "class_warrior": "Warrior",
      "class_mage": "Mage",
      "class_rogue": "Rogue",
      "class_archer": "Archer"
    };
    
    const selectedClass = classMap[data]!;
    return selectedClass;
  });

  const classConfirmation = fmt`Excellent choice! You've selected the ${bold}${playerClass}${bold} class.`;
  await ctx.reply(classConfirmation.text, { entities: classConfirmation.entities });

  // Choose starting stats distribution
  const statsMessage = fmt`📊 ${bold}Distribute your starting stats:${bold}

You have ${bold}10 points${bold} to distribute among these stats:
• Strength (affects physical damage)
• Intelligence (affects magic power)
• Dexterity (affects speed and accuracy)
• Constitution (affects health)

Please enter your distribution in this format:
${code}Str Int Dex Con${code} (e.g., ${code}3 2 3 2${code})

Each stat must be at least 1, and the total must equal 10.`;

  await ctx.reply(statsMessage.text, { entities: statsMessage.entities });

  const stats = await conversation.waitFor("message:text").and(
    (ctx) => {
      const input = ctx.message.text.trim().split(/\s+/);
      
      if (input.length !== 4) {
        ctx.reply("Please enter exactly 4 numbers separated by spaces: `Str Int Dex Con`");
        return false;
      }

      const numbers = input.map(n => parseInt(n, 10));
      
      if (numbers.some(n => isNaN(n) || n < 1)) {
        ctx.reply("All stats must be positive numbers (at least 1). Please try again:");
        return false;
      }

      const total = numbers.reduce((sum, n) => sum + n, 0);
      if (total !== 10) {
        ctx.reply(`Total must equal 10 (you entered ${total}). Please try again:`);
        return false;
      }

      return true;
    }
  ).then(ctx => {
    const numbers = ctx.message.text.trim().split(/\s+/).map(n => parseInt(n, 10));
    return {
      strength: numbers[0]!,
      intelligence: numbers[1]!,
      dexterity: numbers[2]!,
      constitution: numbers[3]!,
    };
  });

  // Player creation summary
  const summary = fmt`✅ ${bold}Player Created Successfully!${bold} ✅

${bold}Name:${bold} ${playerName}
${bold}Class:${bold} ${playerClass}

${bold}Starting Stats:${bold}
• Strength: ${stats.strength}
• Intelligence: ${stats.intelligence}
• Dexterity: ${stats.dexterity}
• Constitution: ${stats.constitution}

🎮 Your adventure begins now! Use /help to see available commands.`;

  await ctx.reply(summary.text, { entities: summary.entities });

  // Save player to database
  try {
    const db = getDatabase();
    
    // Map player class to job_class_id
    const classMapping: Record<string, number> = {
      "Warrior": 1,
      "Mage": 2,
      "Rogue": 3,
      "Archer": 4,
    };
    
    // Calculate base stats based on class and distribution
    const baseHp = 50 + (stats.constitution * 10);
    const baseMp = 30 + (stats.intelligence * 8);
    const baseAttack = 10 + (stats.strength * 3);
    const baseDefense = 5 + (stats.constitution * 2);
    
    const playerData: NewPlayer = {
      telegram_id: ctx.from?.id?.toString() || "",
      character_name: playerName,
      job_class_id: classMapping[playerClass] || 1,
      level: 1,
      experience: 0,
      hp: baseHp,
      max_hp: baseHp,
      mp: baseMp,
      max_mp: baseMp,
      attack: baseAttack,
      defense: baseDefense,
      current_area_id: 1, // Start in Starter Town
      status: "idle",
      destination_area_id: null,
      travel_finish_time: null,
      currency: 100, // Starting currency
      last_login: new Date(),
    };
    
    const result = await db
      .insertInto("players")
      .values(playerData)
      .returning("id")
      .executeTakeFirst();
    
    console.log("Player saved to database:", {
      playerId: result?.id,
      telegramId: ctx.from?.id,
      name: playerName,
      class: playerClass,
      stats,
    });
  } catch (error) {
    console.error("Failed to save player to database:", error);
    // Still allow the conversation to continue even if database save fails
    await ctx.reply("⚠️ Warning: There was an issue saving your character, but you can still play. Please contact an administrator if this persists.");
  }

  return {
    name: playerName,
    class: playerClass,
    stats,
  };
}