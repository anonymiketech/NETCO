import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

const dbUrl = process.env.POSTGRES_URL ?? process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error(
    "POSTGRES_URL (or SUPABASE_DATABASE_URL or DATABASE_URL) must be set.",
  );
}

console.log("[v0] Initializing database connection with Drizzle ORM...");

export const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false },
});

// Log connection events for debugging
pool.on("connect", () => console.log("[v0] Database pool connected"));
pool.on("error", (err) => console.error("[v0] Database pool error:", err));

export const db = drizzle(pool, { schema });

console.log("[v0] Database client initialized successfully");

export * from "./schema";
