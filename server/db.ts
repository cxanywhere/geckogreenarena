import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 20000,
  connectionTimeoutMillis: 10000,
  allowExitOnIdle: true,
});

pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err.message);
});

export const db = drizzle(pool, { schema });

export async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      const isTransient =
        err.code === '57P01' ||
        err.code === '57P03' ||
        err.code === 'ECONNRESET' ||
        err.code === 'EPIPE' ||
        err.message?.includes('terminating connection') ||
        err.message?.includes('Connection terminated') ||
        err.message?.includes('connection unexpectedly closed');

      if (isTransient && attempt < retries) {
        console.warn(`Database transient error (attempt ${attempt + 1}/${retries + 1}), retrying...`);
        await new Promise(r => setTimeout(r, 100 * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  throw new Error('Unreachable');
}
