# Recon map: ShrimpHub (Web & Mobile PWA)

Scope: All-in-one personal operating hub (Finance, Schedule/Timebox, Quick Notes, Reading Tracker, Snippet Studio, Universal Command Palette)  
For: Personal single-user productivity command center  
Date: 2026-11-06  

## Sources

| # | source | URL / Reference | notes |
| --- | --- | --- | --- |
| 1 | Personal Finance | Lunch Money / Wallet App | Zero-latency quick expense logging, burn rate, wallet breakdown |
| 2 | Timebox & Planner | Cal.com | Time-blocking visual view, routines, focus sessions |
| 3 | Quick Capture & Forms | Tally.so / Notion | Minimalist fast scratchpad, task prioritization, Markdown |
| 4 | Reading Tracker | Kenmei / AniList Manga | Reading status, one-click chapter increment, external source links |
| 5 | Snippet Studio | Ray.so / Carbon | Text/code beautifier, theme customization, PNG export |
| 6 | Navigation | Raycast / Linear | Global `Cmd+K` Command Bar, keyboard shortcuts |

## Core loop

Frictionless capture and monitoring of daily personal life (spending, schedule, ideas, and reading) with zero latency in an aesthetic, unified dashboard.

## Screens

| ID | screen | route / how to reach | purpose | key components | states seen |
| --- | --- | --- | --- | --- | --- |
| S01 | Login Screen | `/login` (Default when unauthenticated) | Proteksi data pribadi dengan Master Password/PIN | Input PIN/Password, RememberMe checkbox, Button login, Error toast | default, loading, error, success |
| S02 | Bento Dashboard Hub | `/` (or `/dashboard`) | Overview seluruh widget harian | Bento Grid layout, Saldo widget, Today's Routine, Quick Note, Comic +1, Stats | empty, loaded, filtered |
| S03 | Finance Workspace | `/finance` (or `Cmd+K` -> Finance) | Manajemen transaksi, dompet, dan analitik pengeluaran | Quick Parser input modal, Transaction table, Wallet cards, Burn-rate chart | empty, data loaded, modal open |
| S04 | Schedule & Timebox | `/calendar` (or `Cmd+K` -> Calendar) | Visualisasi blok waktu harian & mingguan | Timebox timeline, Event creator modal, Focus timer widget | day view, week view, creating |
| S05 | Quick Notes & Tasks | `/notes` (or `Cmd+K` -> Notes) | Scratchpad & to-do checklist harian | Markdown scratchpad, Task list (Today/Later), inline checkbox | idle, editing, auto-saving |
| S06 | Comic Tracker | `/comics` (or `Cmd+K` -> Comics) | Daftar bacaan manhwa/manga/buku & log chapter | Card grid, `+1 Chapter` button, external read link, status filter | empty, reading, completed |
| S07 | Snippet Studio | `/snippets` (or `Cmd+K` -> Snippets) | Pembuat kartu kode & teks estetik | Monaco/CodeMirror editor, Theme picker, Padding slider, Export button | editing, rendering, copied |
| S08 | Universal Command Bar | `Cmd+K` / `Ctrl+K` popover global | Navigasi instan & quick action tanpa pindah halaman | Search input, Action list, Keyboard navigator | closed, open, searching |

## Flows

```
F01 Login & Auth Persistence
    S01 -> S02
    happy path clicks: 2 (input PIN + enter)
    edge: Invalid PIN, expired session cookie, auto-redirect if already logged in

F02 Quick Expense Logging
    Anywhere -> Cmd+K / Button "T" -> Quick Modal -> Submit -> Instant Optimistic Update in S02 & S03
    happy path clicks: 1 (tekan 'T' -> ketik "kopi 20k #jajan" -> Enter)
    edge: Offline mode (persisted to local cache/queue), unknown category fallback

F03 Quick Chapter +1 Update
    S02 / S06 -> Click "+1 Chapter" on Comic Card
    happy path clicks: 1 (Langsung update angka chapter di UI dan sinkron ke Turso)
    edge: Rapid clicking debouncing

F04 Timebox Sesi Kerja
    S04 -> Drag time slot or Click "Add Block" -> Enter label -> Saved
    happy path clicks: 2
    edge: Overlapping time blocks

F05 Snippet Generation & Export
    S07 -> Paste Code -> Select Theme -> Click "Export PNG" / "Copy Image"
    happy path clicks: 2
```

## Components

| component | variants | states | used on |
| --- | --- | --- | --- |
| Button | default, destructive, outline, secondary, ghost, link | default, hover, active, focus, disabled, loading | all |
| Input & Textarea | default, inline-borderless, monospaced | default, focus, error, disabled | all |
| Dialog / Modal | default, command-bar, quick-drawer | closed, open, animating | all |
| BentoCard | glass, solid, elevated, compact | default, hover-lift, active | S02 |
| QuickParserInput | single-line natural language parser | idle, typing, parsed-preview | S02, S03, S08 |
| ChapterCounter | badge with increment/decrement | default, updating, maxed | S02, S06 |
| TimeblockSlot | focus, routine, meeting, break | default, dragging, resizing | S04 |

## Inferred data model

```
User          id, username, password_hash, created_at
              evidence: S01
              confidence: high

Wallet        id, name, type (cash/bank/ewallet), balance, currency, updated_at
              evidence: S03
              confidence: high

Category      id, name, type (expense/income), icon, color
              evidence: S03
              confidence: high

Transaction   id, wallet_id, category_id, amount, note, date, created_at
              evidence: S02, S03
              confidence: high

ScheduleBlock id, title, start_time, end_time, category (focus/work/rest), is_completed
              evidence: S02, S04
              confidence: high

Note          id, title, content, is_pinned, updated_at
              evidence: S02, S05
              confidence: high

Task          id, title, is_done, due_date, priority
              evidence: S02, S05
              confidence: high

Comic         id, title, cover_url, source_url, current_chapter, total_chapters, status, updated_at
              evidence: S02, S06
              confidence: high

Snippet       id, title, language, code, theme, created_at
              evidence: S07
              confidence: high
```

Relationships:
- Wallet (1-n) Transaction
- Category (1-n) Transaction
- User (1-n) All Entities

## Feature matrix

See `features.csv`. Must: 18, should: 8, could: 4, skip: 2.

## Out of scope
- Multi-user collaboration & sharing (strictly private single user).
- Direct comic image scraping on the web server (to prevent DMCA and high bandwidth cost; direct source links only).

## Size
Screens: 8, Flows: 5, Entities: 9. Hard parts: Keyboard shortcuts integration, Natural text transaction parser, Turso Edge database latency.  
Size: Medium.
