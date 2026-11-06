import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Users (Single user / admin profile)
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  pinCode: text("pin_code"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Wallets / Accounts (Cash, Bank, E-Wallet)
export const wallets = sqliteTable("wallets", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull().default("bank"), // 'cash', 'bank', 'ewallet'
  balance: integer("balance").notNull().default(0), // in IDR
  currency: text("currency").notNull().default("IDR"),
  color: text("color").default("#10b981"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Categories
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'expense', 'income'
  icon: text("icon").default("tag"),
  color: text("color").default("#64748b"),
});

// Transactions
export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  walletId: text("wallet_id").notNull().references(() => wallets.id, { onDelete: "cascade" }),
  categoryId: text("category_id").references(() => categories.id, { onDelete: "set null" }),
  amount: integer("amount").notNull(),
  type: text("type").notNull(), // 'expense', 'income', 'transfer'
  note: text("note"),
  date: integer("date", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Schedule / Timeboxing blocks
export const scheduleBlocks = sqliteTable("schedule_blocks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull().default("focus"), // 'focus', 'routine', 'meeting', 'rest'
  startTime: integer("start_time", { mode: "timestamp" }).notNull(),
  endTime: integer("end_time", { mode: "timestamp" }).notNull(),
  isCompleted: integer("is_completed", { mode: "boolean" }).notNull().default(false),
  color: text("color"),
});

// Notes & Scratchpad
export const notes = sqliteTable("notes", {
  id: text("id").primaryKey(),
  title: text("title"),
  content: text("content").notNull(),
  isPinned: integer("is_pinned", { mode: "boolean" }).notNull().default(false),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Tasks / Checklist
export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  isDone: integer("is_done", { mode: "boolean" }).notNull().default(false),
  dueDate: integer("due_date", { mode: "timestamp" }),
  priority: text("priority").notNull().default("medium"), // 'low', 'medium', 'high'
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Comics & Reading Log
export const comics = sqliteTable("comics", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  coverUrl: text("cover_url"),
  sourceUrl: text("source_url"),
  currentChapter: real("current_chapter").notNull().default(1),
  totalChapters: real("total_chapters"),
  status: text("status").notNull().default("reading"), // 'reading', 'plan_to_read', 'completed', 'dropped'
  rating: integer("rating"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Snippets
export const snippets = sqliteTable("snippets", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  language: text("language").notNull().default("typescript"),
  code: text("code").notNull(),
  theme: text("theme").notNull().default("dracula"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
