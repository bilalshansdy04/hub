# 📑 Product Requirement Document (PRD)
**Project Title:** ShrimpHub (Personal Operating System & SuperApp)  
**Target User:** Penggunaan Pribadi (Single-User Workspace & Productivity Center)  
**Hosting & Database:** Vercel (Edge/Serverless) + Turso (libSQL/SQLite) — *100% Free-Tier Friendly, Always Alive*  
**Architecture:** Next.js Monorepo (Turborepo) + Tailwind CSS + shadcn/ui + Framer Motion / GSAP

---

## 1. Executive Summary & Core Philosophy

ShrimpHub adalah aplikasi web personal serbaguna (*all-in-one personal hub*) yang menggabungkan alat produktivitas kerja harian, pencatatan jadwal, form capture, studio snippet, tracker bacaan komik, serta manajer keuangan pribadi dalam satu sistem terpadu.

### Prinsip Utama UX ("Gak Masuk Akal Nyaman")
Mengikuti panduan **UI/UX Pro Max**:
1. **Zero-Latency Feel (Optimistic UI):** Setiap interaksi tombol atau input langsung ter-update di layar secara instan ($0\text{ ms}$), sinkronisasi ke database Turso berjalan asinkron di latar belakang.
2. **Keyboard-First Experience:** Navigasi cepat global via **Universal Command Palette** (`Cmd+K` / `Ctrl+K`), shortcut cepat untuk membuat catatan baru (`N`), menambah transaksi (`T`), atau mencari konten (`/`).
3. **Frictionless Quick Capture:** Mengurangi gesekan saat memasukkan data (misal: parser teks pintar untuk keuangan `"kopi susu 22k #jajan"` otomatis mengenali nama, jumlah, dan kategori).
4. **Visual Ergonomics & Motion:** Dark mode elegan (Zinc/Slate) dengan kontras teks minimum 4.5:1 (WCAG AA), transisi layout berbasis spring animation halus, tanpa cumulative layout shift (CLS < 0.1).

---

## 2. Sistem Autentikasi & Keamanan (Login)

Karena aplikasi di-hosting di public URL (Vercel), sistem proteksi login ketat wajib diterapkan:
- **Mekanisme Autentikasi:** Session-based auth dengan cookie HTTP-only terenkripsi (Auth.js / Iron Session) disimpan di database Turso.
- **Metode Login:**
  - Email/Username + Master Password (hash Argon2id / bcrypt).
  - Opsional Passkey / WebAuthn (Touch ID / Face ID / Windows Hello) untuk login 1-detik tanpa ketik password.
- **Session Persistence:** Fitur *"Remember Me"* tahan lama (30–90 hari) sehingga tidak perlu berulang kali memasukkan password saat membuka web di perangkat pribadi.
- **Route Guard (Middleware):** Seluruh rute `/dashboard/*`, `/api/*`, dan modul sensitif diproteksi ketat. Akses tanpa token valid otomatis dilempar ke `/login`.
- **Public Surface (Opsional):** Halaman depan root `/` dapat menampilkan kartu profil/bio link publik (read-only ala Bento.me) atau langsung redirect ke form login mewah.

---

## 3. Rincian Modul & Fitur

```mermaid
flowchart TD
    Login[Layar Login Aman] -->|Auth Valid| AppShell[App Shell & Command Palette]
    AppShell --> Bento[Bento Dashboard Utama]

    subgraph "Core Modules"
        Bento --> Finance[1. Catatan Keuangan Pribadi]
        Bento --> Schedule[2. Jadwal & Timebox Planner]
        Bento --> Notes[3. Quick Notes & Dynamic Form]
        Bento --> Comic[4. Comic & Reading Tracker]
        Bento --> Snippet[5. Snippet & Card Studio]
    end

    Core Modules --> Drizzle[Drizzle ORM]
    Drizzle --> Turso[(Turso libSQL Database)]
```

### 3.1. Modul Catatan Keuangan Pribadi (Finance Tracker)
*Replikasi dari Lunch Money & Wallet App:*
- **Quick Input:** Input modal cepat dengan parser cerdas (`"makan siang 35k"` $\rightarrow$ `{ title: "makan siang", amount: 35000, type: "expense" }`).
- **Kategori & Akun:** Manajemen dompet/rekening (BCA, GoPay, Tunai) dan kategori (Kebutuhan, Jajan, Tagihan, Tabungan).
- **Dashboard Metrik:** 
  - Saldo total real-time.
  - *Daily burn rate* (rata-rata pengeluaran per hari).
  - Grafik pengeluaran bulanan (interactive bar/donut chart).
- **Recurring Expenses:** Pengingat langganan/tagihan rutin bulanan (WiFi, hosting, Spotify).

### 3.2. Modul Jadwal & Kalender (Timebox & Planner)
*Replikasi dari Cal.com:*
- **Timeblocking View:** Tampilan kalender harian & mingguan dengan blok waktu visual.
- **Fokus & Routine:** Template jadwal rutin harian (Jam kerja fokus, olahraga, istirahat).
- **Drag-to-Schedule:** Klik dan tarik pada jam kalender untuk membuat sesi kerja/event baru.

### 3.3. Modul Catatan Cepat & Form Dinamis (Quick Capture & Notes)
*Replikasi dari Tally.so & Notion:*
- **Frictionless Scratchpad:** Tempat corat-coret cepat dengan auto-save per keystroke.
- **Checklist & To-Do:** Manajemen tugas dengan drag-and-drop prioritas (Today, Tomorrow, Later).
- **Markdown Support:** Dukungan syntax markdown penuh untuk dokumentasi.

### 3.4. Modul Comic & Reading Tracker
*Replikasi dari AniList / Kenmei (Aman dari DMCA & Hemat Bandwidth):*
- **Katalog Bacaan:** Daftar manhwa, manhua, manga, dan novel yang sedang dibaca (*Reading, Plan to Read, Completed, On Hold*).
- **One-Click Chapter Update:** Tombol cepat `+1 Chapter` langsung di widget dashboard.
- **Link Cepat:** Tombol direct link ke situs baca langganan untuk tiap judul.
- **Metadata & Cover:** Integrasi cover image via URL eksternal (0 bandwidth hosting).

### 3.5. Modul Snippet & Card Studio
*Replikasi dari Ray.so & Carbon:*
- **Code & Text Beautifier:** Editor snippet dengan syntax highlighting multi-bahasa.
- **Card Customization:** Pilihan background gradient, padding, shadow, dan window title bar.
- **Export Cepat:** Export hasil ke PNG/SVG berkualitas tinggi atau copy image langsung ke clipboard.

---

## 4. Spesifikasi Arsitektur Teknis

### Tech Stack
* **Monorepo Manager:** Turborepo + pnpm
* **Framework:** Next.js 15 (App Router, Server Actions, React Compiler)
* **Database:** Turso (libSQL/SQLite) — *Serverless, low latency, free tier tidak pernah sleep*
* **ORM:** Drizzle ORM (Type-safe, zero overhead)
* **UI & Styling:** Tailwind CSS v4 / v3.4, shadcn/ui, Radix Primitives, Lucide Icons
* **Animation:** Framer Motion / Motion, GSAP (Micro-interactions)
* **Auth:** Iron-session / Auth.js dengan password hashing Argon2id
* **Deployment:** Vercel (Edge & Serverless Functions)

---

## 5. Non-Functional Requirements & Standar Kualitas
- **Lighthouse Performance Score:** $\ge 95$ di Mobile & Desktop.
- **Accessibility:** Kontras warna minimum 4.5:1 (WCAG AA compliance).
- **Cumulative Layout Shift (CLS):** $< 0.1$ dengan skeleton loading pada semua widget.
- **Offline / PWA Ready:** Manifest PWA agar bisa di-install di Desktop (Chrome/Edge) dan layar utama smartphone.
