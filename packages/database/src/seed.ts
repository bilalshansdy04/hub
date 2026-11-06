import { db, wallets, categories, notes, tasks, comics } from "./index";

async function seed() {
  console.log("Seeding initial data...");

  // 1. Wallets
  const existingWallets = await db.select().from(wallets);
  if (existingWallets.length === 0) {
    await db.insert(wallets).values([
      {
        id: "w-main",
        name: "Rekening Utama (BCA)",
        type: "bank",
        balance: 5500000,
        currency: "IDR",
        color: "#10b981",
        updatedAt: new Date(),
      },
      {
        id: "w-cash",
        name: "Dompet Tunai",
        type: "cash",
        balance: 350000,
        currency: "IDR",
        color: "#f59e0b",
        updatedAt: new Date(),
      },
      {
        id: "w-ewallet",
        name: "GoPay / OVO",
        type: "ewallet",
        balance: 150000,
        currency: "IDR",
        color: "#38bdf8",
        updatedAt: new Date(),
      },
    ]);
  }

  // 2. Categories
  const existingCats = await db.select().from(categories);
  if (existingCats.length === 0) {
    await db.insert(categories).values([
      { id: "c-food", name: "Makanan & Minuman", type: "expense", icon: "utensils", color: "#f43f5e" },
      { id: "c-bills", name: "Tagihan & WiFi", type: "expense", icon: "receipt", color: "#8b5cf6" },
      { id: "c-transit", name: "Transportasi / Bensin", type: "expense", icon: "car", color: "#f59e0b" },
      { id: "c-salary", name: "Gaji & Pendapatan", type: "income", icon: "coins", color: "#10b981" },
    ]);
  }

  // 3. Welcome Note & Tasks
  const existingNotes = await db.select().from(notes);
  if (existingNotes.length === 0) {
    await db.insert(notes).values({
      id: "note-welcome",
      title: "Selamat Datang di ShrimpHub 🦐",
      content: "Workspace personal serbaguna. Gunakan **Cmd+K** untuk aksi cepat, tombol **T** untuk catat uang, dan tombol **N** untuk scratchpad.",
      isPinned: true,
      updatedAt: new Date(),
    });

    await db.insert(tasks).values([
      {
        id: "t-1",
        title: "Setup ShrimpHub di laptop / HP",
        isDone: true,
        priority: "high",
        createdAt: new Date(),
      },
      {
        id: "t-2",
        title: "Coba input pengeluaran: tekan 'T' lalu ketik 'kopi 25k #makanan'",
        isDone: false,
        priority: "medium",
        createdAt: new Date(),
      },
      {
        id: "t-3",
        title: "Update chapter komik favorit",
        isDone: false,
        priority: "low",
        createdAt: new Date(),
      },
    ]);
  }

  // 4. Sample Comics
  const existingComics = await db.select().from(comics);
  if (existingComics.length === 0) {
    await db.insert(comics).values([
      {
        id: "c-solo",
        title: "Solo Leveling: Ragnarok",
        coverUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&q=80",
        sourceUrl: "https://komikindo.ch/",
        currentChapter: 42,
        status: "reading",
        updatedAt: new Date(),
      },
      {
        id: "c-omniscient",
        title: "Omniscient Reader's Viewpoint",
        coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80",
        sourceUrl: "https://komikindo.ch/",
        currentChapter: 215,
        status: "reading",
        updatedAt: new Date(),
      },
    ]);
  }

  console.log("Seed completed successfully!");
}

seed().catch(console.error);
