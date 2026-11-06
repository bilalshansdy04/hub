import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import path from "path";

// Always resolve to root project directory local.db if TURSO_DATABASE_URL is not set
const defaultDbPath = path.resolve(process.cwd(), "local.db");
const url = process.env.TURSO_DATABASE_URL || `file:${defaultDbPath.replace(/\\/g, "/")}`;
const authToken = process.env.TURSO_AUTH_TOKEN;

export const client = createClient({
  url,
  authToken,
});

export const db = drizzle(client, { schema });
