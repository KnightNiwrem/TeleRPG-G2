import { Kysely, sql } from "kysely";
import type { Database } from "./types.js";

/**
 * Database migration functions
 */

export async function up(db: Kysely<Database>): Promise<void> {
  // Create players table
  await db.schema
    .createTable("players")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("telegram_id", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("character_name", "varchar(255)", (col) => col.notNull())
    .addColumn("job_class_id", "integer", (col) => col.notNull())
    .addColumn("level", "integer", (col) => col.notNull().defaultTo(1))
    .addColumn("experience", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("hp", "integer", (col) => col.notNull())
    .addColumn("max_hp", "integer", (col) => col.notNull())
    .addColumn("mp", "integer", (col) => col.notNull())
    .addColumn("max_mp", "integer", (col) => col.notNull())
    .addColumn("attack", "integer", (col) => col.notNull())
    .addColumn("defense", "integer", (col) => col.notNull())
    .addColumn("current_area_id", "integer", (col) => col.notNull().defaultTo(1))
    .addColumn("status", "varchar(50)", (col) => col.notNull().defaultTo("idle"))
    .addColumn("destination_area_id", "integer")
    .addColumn("travel_finish_time", "timestamp")
    .addColumn("currency", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn("last_login", "timestamp", (col) => col.defaultTo(sql`now()`).notNull())
    .execute();

  // Create game_areas table
  await db.schema
    .createTable("game_areas")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("type", "varchar(100)", (col) => col.notNull())
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("explorable", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("shop_id", "integer")
    .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`now()`).notNull())
    .execute();

  // Create player_inventory table
  await db.schema
    .createTable("player_inventory")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("player_id", "integer", (col) => col.notNull().references("players.id").onDelete("cascade"))
    .addColumn("item_id", "integer", (col) => col.notNull())
    .addColumn("quantity", "integer", (col) => col.notNull().defaultTo(1))
    .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`now()`).notNull())
    .execute();

  // Create indexes
  await db.schema
    .createIndex("idx_players_telegram_id")
    .on("players")
    .column("telegram_id")
    .execute();

  await db.schema
    .createIndex("idx_player_inventory_player_id")
    .on("player_inventory")
    .column("player_id")
    .execute();

  await db.schema
    .createIndex("idx_player_inventory_unique")
    .on("player_inventory")
    .columns(["player_id", "item_id"])
    .unique()
    .execute();

  // Insert initial game area
  await db
    .insertInto("game_areas")
    .values({
      id: 1,
      name: "Starter Town",
      type: "town",
      description: "A peaceful town where new adventurers begin their journey.",
      explorable: false,
      shop_id: null,
    })
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable("player_inventory").execute();
  await db.schema.dropTable("players").execute();
  await db.schema.dropTable("game_areas").execute();
}