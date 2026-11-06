import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";

function findEnvFile(filename: string): string | null {
  let dir = process.cwd();
  for (let i = 0; i < 4; i++) {
    const candidate = path.join(dir, filename);
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

const envPath = findEnvFile(".env");
if (envPath) {
  dotenv.config({ path: envPath });
}

const defaultDbPath = path.resolve(process.cwd(), "local.db");
const url = process.env.TURSO_DATABASE_URL || `file:${defaultDbPath.replace(/\\/g, "/")}`;
const authToken = process.env.TURSO_AUTH_TOKEN;

export const client = createClient({
  url,
  authToken,
});

export const db = drizzle(client, { schema });
