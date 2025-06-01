import { test, expect, beforeAll, afterAll } from "bun:test";
import { createDatabase } from "../database/connection.js";
import { up, down } from "../database/migrations.js";
import type { Kysely } from "kysely";
import type { Database } from "../database/types.js";

/**
 * Database connection and migration tests
 */

let testDb: Kysely<Database>;

beforeAll(async () => {
  // Use a test database URL or create a test database
  const testDbUrl = process.env.DATABASE_URL || "postgres://postgres:password@localhost:5432/telerpg_dev";
  testDb = createDatabase(testDbUrl);
});

afterAll(async () => {
  await testDb.destroy();
});

test("should create database connection", () => {
  expect(testDb).toBeDefined();
});

test("should run migrations up and down", async () => {
  await up(testDb);
  
  // Test basic database operations instead of querying information_schema
  // Try to insert and select from game_areas to verify tables exist
  const areas = await testDb
    .selectFrom("game_areas")
    .selectAll()
    .execute();
  
  expect(areas.length).toBe(1);
  expect(areas[0]?.name).toBe("Starter Town");

  // Clean up
  await down(testDb);
});