import { defineConfig } from "drizzle-kit";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";

// Priority: If .env.production exists and PROD is passed, or standard .env
const prodEnvPath = path.resolve(process.cwd(), ".env.production");
const rootEnvPath = path.resolve(process.cwd(), ".env");

if (process.env.APP_ENV === "production" && fs.existsSync(prodEnvPath)) {
  dotenv.config({ path: prodEnvPath });
} else if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
}

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
