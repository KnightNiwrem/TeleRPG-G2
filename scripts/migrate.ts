#!/usr/bin/env bun
/**
 * Database migration script
 */
import { getDatabase } from "../src/database/connection.js";
import { up, down } from "../src/database/migrations.js";

const command = process.argv[2];

if (!command || !["up", "down"].includes(command)) {
  console.log("Usage: bun scripts/migrate.ts [up|down]");
  process.exit(1);
}

const main = async (): Promise<void> => {
  try {
    const db = getDatabase();
    
    if (command === "up") {
      console.log("Running migrations up...");
      await up(db);
      console.log("✅ Migrations completed successfully!");
    } else {
      console.log("Running migrations down...");
      await down(db);
      console.log("✅ Migrations rolled back successfully!");
    }
    
    await db.destroy();
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

main();