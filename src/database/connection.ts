import { Kysely, PostgresDialect } from "kysely";
import { Pool, Client } from "pg";
import type { Database } from "./types.js";

/**
 * Database connection configuration
 */

let db: Kysely<Database> | null = null;

export function createDatabase(connectionString: string): Kysely<Database> {
  const dialect = new PostgresDialect({
    pool: new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    }),
  });

  return new Kysely<Database>({
    dialect,
  });
}

export function getDatabase(): Kysely<Database> {
  if (!db) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    db = createDatabase(connectionString);
  }
  return db;
}

export function getTestDatabase(): Kysely<Database> {
  const connectionString = process.env.TEST_DATABASE_URL;
  if (!connectionString) {
    throw new Error("TEST_DATABASE_URL environment variable is required");
  }
  return createDatabase(connectionString);
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.destroy();
    db = null;
  }
}

/**
 * Creates a PostgreSQL client for use with storage adapters
 */
export function createPostgresClient(connectionString: string): Client {
  return new Client({ connectionString });
}

/**
 * Gets a PostgreSQL client using the main database connection string
 */
export function getPostgresClient(): Client {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is required");
  }
  return createPostgresClient(connectionString);
}