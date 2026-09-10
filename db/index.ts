import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var __pg__: ReturnType<typeof postgres> | undefined;
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Neon and most managed Postgres providers require SSL.
const client =
  global.__pg__ ??
  postgres(process.env.DATABASE_URL, {
    ssl: process.env.DATABASE_URL.includes("localhost") ? false : "require",
    max: 10,
  });

if (process.env.NODE_ENV !== "production") global.__pg__ = client;

export const db = drizzle(client, { schema });
export { schema };
