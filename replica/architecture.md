# Architecture: ShrimpHub (Personal Life & Work Operating System)

## Stack

| layer | choice | why |
| --- | --- | --- |
| monorepo | Turborepo + pnpm | Workspace modular (`apps/web`, `packages/database`, `packages/ui`), build caching |
| web | Next.js 15 (App Router) | Server Components, Server Actions untuk mutasi zero-overhead, Edge ready di Vercel |
| database | Turso (libSQL/SQLite) | Serverless, SQLite kecepatan lokal di Edge, free tier tidak pernah tidur/hibernate |
| orm | Drizzle ORM | Type-safe, ringan, migrasi instan tanpa heavyweight daemon |
| styling | Tailwind CSS + shadcn/ui | Komponen aksesibel Radix UI, utility-first styling, dark/light token |
| motion | Motion (Framer Motion) | Micro-interactions, spring animation, layout transitions |
| auth | Iron-session / Edge Cookie + Argon2id | Session cookie HTTP-only terenkripsi, low-friction single-user authentication |
| hosting | Vercel | Free-tier edge deployment, 0 cold start |

## Schema

Total Tables: 8. Access rules: Middleware session validation di layer data & Server Actions.

```sql
-- Users (Single-user admin profile)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  pin_code TEXT,
  created_at INTEGER NOT NULL
);

-- Wallets / Accounts
CREATE TABLE wallets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'bank', -- 'cash', 'bank', 'ewallet'
  balance INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'IDR',
  color TEXT,
  updated_at INTEGER NOT NULL
);

-- Categories
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'expense', 'income'
  icon TEXT,
  color TEXT
);

-- Transactions
CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  wallet_id TEXT NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL, -- 'expense', 'income', 'transfer'
  note TEXT,
  date INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

-- Schedule / Timebox Blocks
CREATE TABLE schedule_blocks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'focus', -- 'focus', 'routine', 'meeting', 'rest'
  start_time INTEGER NOT NULL,
  end_time INTEGER NOT NULL,
  is_completed INTEGER NOT NULL DEFAULT 0,
  color TEXT
);

-- Notes & Scratchpad
CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  title TEXT,
  content TEXT NOT NULL,
  is_pinned INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL
);

-- Tasks / Checklist
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  is_done INTEGER NOT NULL DEFAULT 0,
  due_date INTEGER,
  priority TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high'
  created_at INTEGER NOT NULL
);

-- Comics & Reading Log
CREATE TABLE comics (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  cover_url TEXT,
  source_url TEXT,
  current_chapter REAL NOT NULL DEFAULT 1,
  total_chapters REAL,
  status TEXT NOT NULL DEFAULT 'reading', -- 'reading', 'plan_to_read', 'completed', 'dropped'
  rating INTEGER,
  updated_at INTEGER NOT NULL
);

-- Snippets
CREATE TABLE snippets (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'typescript',
  code TEXT NOT NULL,
  theme TEXT NOT NULL DEFAULT 'dracula',
  created_at INTEGER NOT NULL
);
```

## API / Server Actions

| Action | Does | Who | Input | Output | Flow |
| --- | --- | --- | --- | --- | --- |
| `login(pinOrPassword)` | Verifikasi credentials & set session cookie | Public | `{ secret: string }` | `{ success: boolean }` | F01 |
| `logout()` | Hapus session cookie | User | void | `{ success: boolean }` | F01 |
| `quickLogTransaction(text)` | Parse string natural & insert transaksi | User | `{ rawText: string, walletId?: string }` | `Transaction` | F02 |
| `incrementComicChapter(comicId)` | Tambah +1 chapter komik | User | `{ id: string }` | `Comic` | F03 |
| `upsertScheduleBlock(block)` | Buat/update blok waktu | User | `NewScheduleBlock` | `ScheduleBlock` | F04 |
| `saveNote(content)` | Simpan scratchpad | User | `{ id?: string, content: string }` | `Note` | Quick note |
| `toggleTask(taskId)` | Centang status task | User | `{ id: string }` | `Task` | Checklist |

## The parts that bite

- **Time zones in Timeboxing:** Database menyimpan epoch milliseconds (UTC), client me-render sesuai lokal timezone pengguna agar tidak geser.
- **Natural Language Parsing Keuangan:** Parser mengenali pola regex: `(nama)?\s*(\d+[kKmM]?)\s*(#kategori)?` dengan fallback cerdas.
- **Offline / Optimistic Update:** UI merespons seketika via React `useOptimistic` sebelum Server Action resolve.

## Build order

1. **Vertical slice 1:** Monorepo init + Database Turso connection + Auth screen + App Shell + Universal `Cmd+K` menu.
2. **Must-haves:**
   - Bento Dashboard view (S02).
   - Finance quick logger + transaction table + wallet balances (S03).
   - Comic tracker dengan tombol `+1 Chapter` (S06).
   - Timebox planner harian (S04).
   - Quick scratchpad & task list (S05).
   - Snippet Studio (S07).
3. **Should-haves:**
   - Chart pengeluaran bulanan.
   - PWA configuration (Installable app).
4. **Polishing:** Micro-interactions, audio click toggles, keyboard shortcut drawer.
