"use client";

import { useState, useTransition } from "react";
import { AppShell } from "./app-shell";
import { addQuickTransactionAction } from "@/actions/finance-actions";
import { incrementChapterAction } from "@/actions/comic-actions";
import { toggleTaskAction, addTaskAction } from "@/actions/task-actions";
import { saveNoteAction } from "@/actions/note-actions";
import { parseQuickTransaction, formatIDR } from "@shrimphub/core-logic";
import Link from "next/link";
import {
  Wallet,
  BookOpen,
  CheckCircle2,
  Circle,
  FileText,
  Plus,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  ExternalLink,
  Calendar,
  Save,
} from "lucide-react";
import { toast } from "sonner";

interface DashboardClientProps {
  user: { username: string };
  finance: {
    totalBalance: number;
    wallets: Array<{ id: string; name: string; balance: number; color: string | null }>;
    recentTransactions: Array<{ id: string; note: string | null; amount: number; type: string; date: Date }>;
  };
  comicsList: Array<{ id: string; title: string; currentChapter: number; coverUrl: string | null; sourceUrl: string | null }>;
  tasksList: Array<{ id: string; title: string; isDone: boolean; priority: string }>;
  pinnedNote: { id: string; content: string } | null;
}

export function DashboardClient({
  user,
  finance,
  comicsList,
  tasksList,
  pinnedNote,
}: DashboardClientProps) {
  const [isPending, startTransition] = useTransition();

  // Quick expense input & live parser preview
  const [expenseInput, setExpenseInput] = useState("");
  const parsedPreview = parseQuickTransaction(expenseInput);

  // Scratchpad note state
  const [noteContent, setNoteContent] = useState(pinnedNote?.content || "");
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Task input state
  const [newTaskInput, setNewTaskInput] = useState("");

  // Submit quick expense
  const handleQuickExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseInput.trim() || parsedPreview.amount <= 0) {
      toast.error("Format nominal belum valid. Contoh: 'kopi 25rb' atau 'gaji 5jt'");
      return;
    }

    startTransition(async () => {
      const res = await addQuickTransactionAction(expenseInput);
      if (res.success) {
        toast.success(`Tercatat: ${formatIDR(res.parsed?.amount || 0)} (${res.parsed?.note})`);
        setExpenseInput("");
      } else {
        toast.error(res.error || "Gagal menyimpan transaksi");
      }
    });
  };

  // Increment comic chapter
  const handleIncrementChapter = (comicId: string, title: string) => {
    startTransition(async () => {
      const res = await incrementChapterAction(comicId);
      if (res.success) {
        toast.success(`${title} -> Ch. ${res.newChapter}`);
      } else {
        toast.error("Gagal update chapter");
      }
    });
  };

  // Toggle task
  const handleToggleTask = (taskId: string) => {
    startTransition(async () => {
      await toggleTaskAction(taskId);
    });
  };

  // Add task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;

    startTransition(async () => {
      const res = await addTaskAction(newTaskInput);
      if (res.success) {
        setNewTaskInput("");
        toast.success("Tugas ditambahkan");
      }
    });
  };

  // Save note
  const handleSaveNote = async () => {
    setIsSavingNote(true);
    try {
      const res = await saveNoteAction(noteContent, pinnedNote?.id);
      if (res.success) {
        toast.success("Catatan berhasil disimpan");
      } else {
        toast.error("Gagal menyimpan");
      }
    } finally {
      setIsSavingNote(false);
    }
  };

  const completedTasks = tasksList.filter((t) => t.isDone).length;
  const pendingTasks = tasksList.filter((t) => !t.isDone);

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        {/* KPI Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Net Worth */}
          <div className="bg-white dark:bg-[#0e121b]/80 rounded-2xl p-5 border border-zinc-200 dark:border-white/[0.08] shadow-sm">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-2">
              <span className="flex items-center gap-1.5 font-medium">
                <Wallet className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                Total Kekayaan
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                Active
              </span>
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-zinc-900 dark:text-white">
              {formatIDR(finance.totalBalance)}
            </div>
            <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 mt-2 pt-2 border-t border-zinc-100 dark:border-white/[0.06]">
              <span>{finance.wallets.length} Akun Dompet</span>
              <Link
                href="/finance"
                className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5 text-[10px] font-semibold"
              >
                Detail <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Card 2: Tugas Hari Ini */}
          <div className="bg-white dark:bg-[#0e121b]/80 rounded-2xl p-5 border border-zinc-200 dark:border-white/[0.08] shadow-sm">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-2">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                Progres Tugas
              </span>
              <span className="text-[10px] font-mono font-bold text-sky-600 dark:text-sky-400">
                {tasksList.length > 0
                  ? `${Math.round((completedTasks / tasksList.length) * 100)}%`
                  : "0%"}
              </span>
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-zinc-900 dark:text-white">
              {completedTasks} / {tasksList.length}
            </div>
            <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 mt-2 pt-2 border-t border-zinc-100 dark:border-white/[0.06]">
              <span>{pendingTasks.length} Belum Selesai</span>
              <Link
                href="/notes"
                className="text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-0.5 text-[10px] font-semibold"
              >
                Buka Tasks <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Card 3: Reading Tracker */}
          <div className="bg-white dark:bg-[#0e121b]/80 rounded-2xl p-5 border border-zinc-200 dark:border-white/[0.08] shadow-sm">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-2">
              <span className="flex items-center gap-1.5 font-medium">
                <BookOpen className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                Reading Catalog
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20">
                Kenmei
              </span>
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-zinc-900 dark:text-white">
              {comicsList.length} Judul
            </div>
            <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 mt-2 pt-2 border-t border-zinc-100 dark:border-white/[0.06]">
              <span>One-Click +1 Ch</span>
              <Link
                href="/comics"
                className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-0.5 text-[10px] font-semibold"
              >
                Katalog <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Card 4: Timeboxing */}
          <div className="bg-white dark:bg-[#0e121b]/80 rounded-2xl p-5 border border-zinc-200 dark:border-white/[0.08] shadow-sm">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-2">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-violet-500 dark:text-violet-400" />
                Jadwal & Timebox
              </span>
              <span className="text-[10px] font-mono text-violet-600 dark:text-violet-400 font-semibold">
                Cal.com
              </span>
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-zinc-900 dark:text-white">
              Focus Blocks
            </div>
            <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 mt-2 pt-2 border-t border-zinc-100 dark:border-white/[0.06]">
              <span>Slot Waktu Terjadwal</span>
              <Link
                href="/calendar"
                className="text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-0.5 text-[10px] font-semibold"
              >
                Timeline <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Natural Language Transaction Command Bar */}
        <div className="bg-white dark:bg-[#0e121b]/80 rounded-2xl p-4 sm:p-5 border border-zinc-200 dark:border-white/[0.08] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              Quick Natural Language Transaction
            </span>
            {parsedPreview.amount > 0 && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-pink-50 dark:bg-pink-500/15 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-500/30">
                Terdeteksi: {formatIDR(parsedPreview.amount)} ({parsedPreview.note})
              </span>
            )}
          </div>

          <form onSubmit={handleQuickExpenseSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={expenseInput}
                onChange={(e) => setExpenseInput(e.target.value)}
                placeholder="Ketik pengeluaran / pemasukan... (cth: 'kopi 25rb #jajan' atau 'gaji 5jt')"
                className="w-full px-4 py-3 rounded-xl text-xs bg-zinc-50 dark:bg-[#07090e] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-pink-500"
              />
              <span className="absolute right-3 top-3 text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-white/10 text-zinc-500 dark:text-zinc-400 hidden sm:inline-block">
                Enter ↵
              </span>
            </div>

            <button
              type="submit"
              disabled={isPending || !expenseInput.trim()}
              className="px-5 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer shrink-0"
            >
              {isPending ? "Mencatat..." : "Simpan Transaksi"}
            </button>
          </form>
        </div>

        {/* Bento Grid Main Section (8 cols left, 4 cols right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (8 cols): Recent Transactions & Scratchpad */}
          <div className="lg:col-span-8 space-y-6">
            {/* Recent Transactions Card (Copilot Money style) */}
            <div className="bg-white dark:bg-[#0e121b]/80 rounded-2xl p-6 border border-zinc-200 dark:border-white/[0.08] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    Riwayat Transaksi Terbaru
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Ringkasan transaksi lintas akun dompet</p>
                </div>

                <Link
                  href="/finance"
                  className="text-xs font-semibold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1 transition-colors"
                >
                  Kelola Keuangan <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {finance.recentTransactions.length === 0 ? (
                <div className="py-12 text-center text-zinc-400 dark:text-zinc-500 text-xs">
                  Belum ada transaksi. Gunakan input di atas untuk mencatat pengeluaran pertama!
                </div>
              ) : (
                <div className="space-y-2">
                  {finance.recentTransactions.slice(0, 5).map((tx) => {
                    const isExpense = tx.type === "expense";
                    const dateStr = new Date(tx.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    });

                    return (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.05] hover:border-pink-500/30 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isExpense
                                ? "bg-rose-500/10 text-rose-500 dark:text-rose-400"
                                : "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400"
                            }`}
                          >
                            {isExpense ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : (
                              <ArrowDownLeft className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-zinc-900 dark:text-white">
                              {tx.note || "Transaksi"}
                            </p>
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">{dateStr}</p>
                          </div>
                        </div>

                        <span
                          className={`text-xs font-mono font-bold ${
                            isExpense
                              ? "text-rose-600 dark:text-rose-400"
                              : "text-emerald-600 dark:text-emerald-400"
                          }`}
                        >
                          {isExpense ? "-" : "+"}
                          {formatIDR(tx.amount)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Markdown Scratchpad (Linear / Notion style) */}
            <div className="bg-white dark:bg-[#0e121b]/80 rounded-2xl p-6 border border-zinc-200 dark:border-white/[0.08] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                    Scratchpad Harian
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Pencatat ide cepat bebas hambatan (Markdown didukung)
                  </p>
                </div>

                <button
                  onClick={handleSaveNote}
                  disabled={isSavingNote}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingNote ? "Menyimpan..." : "Simpan"}</span>
                </button>
              </div>

              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Tulis ide cepat, catatan singkat, atau potongan kode..."
                rows={6}
                className="w-full p-4 rounded-xl text-xs font-mono leading-relaxed resize-none bg-zinc-50 dark:bg-[#07090e] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Right Column (4 cols): Priority Tasks & Manga Tracker */}
          <div className="lg:col-span-4 space-y-6">
            {/* Tasks Checklist Card (Linear style) */}
            <div className="bg-white dark:bg-[#0e121b]/80 rounded-2xl p-6 border border-zinc-200 dark:border-white/[0.08] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    Checklist Tugas
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Prioritas kerja hari ini</p>
                </div>

                <Link
                  href="/notes"
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                >
                  Semua <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Add Task Quick Form */}
              <form onSubmit={handleAddTask} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  placeholder="Tambah tugas baru..."
                  className="flex-1 px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-[#07090e] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>

              {/* Task Items */}
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {tasksList.length === 0 ? (
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 py-6 text-center">Tidak ada tugas aktif.</p>
                ) : (
                  tasksList.slice(0, 6).map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task.id)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                        task.isDone
                          ? "bg-zinc-100 dark:bg-white/[0.01] opacity-50 border-transparent"
                          : "bg-zinc-50 dark:bg-white/[0.03] border-zinc-200 dark:border-white/[0.04] hover:border-emerald-500/30"
                      }`}
                    >
                      {task.isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-zinc-400 shrink-0" />
                      )}
                      <span
                        className={`text-xs truncate flex-1 ${
                          task.isDone
                            ? "line-through text-zinc-400 dark:text-zinc-500"
                            : "text-zinc-900 dark:text-white font-medium"
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Reading Tracker Card (Kenmei style) */}
            <div className="bg-white dark:bg-[#0e121b]/80 rounded-2xl p-6 border border-zinc-200 dark:border-white/[0.08] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    Sedang Dibaca
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Update chapter dengan 1 klik</p>
                </div>

                <Link
                  href="/comics"
                  className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-0.5"
                >
                  Katalog <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              {comicsList.length === 0 ? (
                <p className="text-xs text-zinc-400 dark:text-zinc-500 py-6 text-center">Belum ada komik aktif.</p>
              ) : (
                <div className="space-y-3">
                  {comicsList.slice(0, 4).map((comic) => (
                    <div
                      key={comic.id}
                      className="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.04] flex items-center justify-between gap-3 hover:border-amber-500/30 transition-all"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {comic.coverUrl ? (
                          <img
                            src={comic.coverUrl}
                            alt={comic.title}
                            className="w-9 h-12 object-cover rounded-lg shrink-0 border border-zinc-200 dark:border-white/10"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-9 h-12 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-[10px] text-zinc-500">
                            Manga
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">
                            {comic.title}
                          </p>
                          <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                            Ch. {comic.currentChapter}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleIncrementChapter(comic.id, comic.title)}
                          title="Tambah 1 Chapter"
                          className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-600 dark:text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>+1</span>
                        </button>

                        {comic.sourceUrl && (
                          <a
                            href={comic.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors"
                            title="Baca Lanjut"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
