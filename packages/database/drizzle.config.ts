import { defineConfig } from "drizzle-kit";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";

// Walk up directories to find root .env or .env.production
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

const prodEnvPath = findEnvFile(".env.production");
const rootEnvPath = findEnvFile(".env");

if (process.env.APP_ENV === "production" && prodEnvPath) {
  dotenv.config({ path: prodEnvPath });
} else if (rootEnvPath) {
  dotenv.config({ path: rootEnvPath });
}

// Fallback to local.db only if TURSO_DATABASE_URL is not set
const defaultDbPath = path.resolve(process.cwd(), "local.db");
const url = process.env.TURSO_DATABASE_URL || `file:${defaultDbPath.replace(/\\/g, "/")}`;

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
