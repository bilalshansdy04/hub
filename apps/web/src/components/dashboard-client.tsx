"use client";

import { useState, useTransition } from "react";
import { CommandMenu } from "@/components/command-menu";
import { addQuickTransactionAction } from "@/actions/finance-actions";
import { incrementChapterAction } from "@/actions/comic-actions";
import { toggleTaskAction, addTaskAction } from "@/actions/task-actions";
import { saveNoteAction } from "@/actions/note-actions";
import { logoutAction } from "@/actions/auth-actions";
import { parseQuickTransaction, formatIDR } from "@shrimphub/core-logic";
import {
  Wallet,
  BookOpen,
  CheckCircle2,
  Circle,
  FileText,
  Plus,
  Sparkles,
  ArrowUpRight,
  LogOut,
  ExternalLink,
  Send,
  Calendar,
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

  // Modals state
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);

  // Quick expense input & live parser preview
  const [expenseInput, setExpenseInput] = useState("");
  const parsedPreview = parseQuickTransaction(expenseInput);

  // Scratchpad note state
  const [noteContent, setNoteContent] = useState(pinnedNote?.content || "");

  // Task input state
  const [newTaskInput, setNewTaskInput] = useState("");

  // Submit quick expense
  const handleQuickExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseInput.trim() || parsedPreview.amount <= 0) {
      toast.error("Format input belum ada nominal. Cth: 'kopi 25k #jajan'");
      return;
    }

    startTransition(async () => {
      const res = await addQuickTransactionAction(expenseInput);
      if (res.success) {
        toast.success(`Tersimpan: ${formatIDR(res.parsed?.amount || 0)} (${res.parsed?.note})`);
        setExpenseInput("");
        setExpenseModalOpen(false);
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
      await addTaskAction(newTaskInput);
      setNewTaskInput("");
      toast.success("Tugas ditambahkan");
    });
  };

  // Save scratchpad
  const handleSaveNote = () => {
    startTransition(async () => {
      await saveNoteAction(noteContent, pinnedNote?.id);
      toast.success("Scratchpad tersimpan");
      setNoteModalOpen(false);
    });
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#09090b]/80 backdrop-blur-xl px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-emerald-400/10 border border-emerald-500/30 flex items-center justify-center text-lg shadow-inner">
            🦐
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">ShrimpHub</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                personal
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Hai, <span className="text-zinc-200 font-medium">{user.username}</span> 👋
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CommandMenu
            onQuickExpense={() => setExpenseModalOpen(true)}
            onQuickNote={() => setNoteModalOpen(true)}
          />

          <button
            onClick={() => logoutAction()}
            title="Kunci / Logout Sesi"
            className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl border border-white/5 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Bento Dashboard Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
        {/* Quick Action Ribbon */}
        <div className="flex items-center justify-between flex-wrap gap-3 p-3.5 rounded-2xl border border-white/10 bg-[#121217]/60 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Shortcut Cepat:</span>
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] font-mono text-zinc-300">T</kbd>
            <span>Catat Uang</span>
            <span className="text-zinc-600">•</span>
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] font-mono text-zinc-300">N</kbd>
            <span>Scratchpad</span>
            <span className="text-zinc-600">•</span>
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] font-mono text-zinc-300">⌘K</kbd>
            <span>Command Menu</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpenseModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-md shadow-emerald-900/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Catat Transaksi</span>
            </button>
            <button
              onClick={() => setNoteModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 text-xs font-medium active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Catatan</span>
            </button>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Finance Overview */}
          <div className="rounded-2xl border border-white/10 bg-[#121217]/70 backdrop-blur-md p-5 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-emerald-500/30 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                  <Wallet className="w-4 h-4" />
                  <span>Total Saldo Keuangan</span>
                </div>
                <button
                  onClick={() => setExpenseModalOpen(true)}
                  className="text-xs text-zinc-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                >
                  <span>+ Catat</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-3xl font-extrabold tracking-tight text-white mb-4">
                {formatIDR(finance.totalBalance)}
              </div>

              {/* Wallets Pill List */}
              <div className="space-y-2 mb-4">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Dompet Aktif</span>
                <div className="grid grid-cols-2 gap-2">
                  {finance.wallets.map((w) => (
                    <div key={w.id} className="p-2 rounded-xl bg-white/5 border border-white/5 flex flex-col">
                      <span className="text-[11px] text-zinc-400 truncate">{w.name}</span>
                      <span className="text-xs font-semibold text-zinc-200 mt-0.5">{formatIDR(w.balance)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Transactions Preview */}
            <div className="pt-3 border-t border-white/5">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block mb-2">
                Mutasi Terakhir
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {finance.recentTransactions.length === 0 ? (
                  <p className="text-xs text-zinc-600">Belum ada transaksi.</p>
                ) : (
                  finance.recentTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between text-xs py-1">
                      <span className="text-zinc-300 truncate max-w-[150px]">{tx.note || "Transaksi"}</span>
                      <span
                        className={`font-mono text-xs font-medium ${
                          tx.type === "income" ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {tx.type === "income" ? "+" : "-"}
                        {formatIDR(tx.amount)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Comic & Reading Tracker */}
          <div className="rounded-2xl border border-white/10 bg-[#121217]/70 backdrop-blur-md p-5 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-amber-500/30 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-medium text-amber-400">
                  <BookOpen className="w-4 h-4" />
                  <span>Comic & Reading Log</span>
                </div>
                <span className="text-xs text-zinc-500">{comicsList.length} Judul</span>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {comicsList.length === 0 ? (
                  <p className="text-xs text-zinc-600">Belum ada komik tersimpan.</p>
                ) : (
                  comicsList.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-3 hover:bg-white/[0.08] transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-semibold text-zinc-200 truncate">{c.title}</h4>
                          {c.sourceUrl && (
                            <a
                              href={c.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-zinc-500 hover:text-amber-400 transition-colors"
                              title="Buka link baca"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <span className="text-[11px] text-amber-400/90 font-mono">Chapter {c.currentChapter}</span>
                      </div>

                      <button
                        onClick={() => handleIncrementChapter(c.id, c.title)}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold active:scale-90 transition-all cursor-pointer whitespace-nowrap"
                      >
                        +1 Ch
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <p className="text-[10px] text-zinc-500 mt-4 pt-2 border-t border-white/5">
              Klik <b>+1 Ch</b> untuk memperbarui progress bacaan seketika.
            </p>
          </div>

          {/* Card 3: Tasks & Checklist */}
          <div className="rounded-2xl border border-white/10 bg-[#121217]/70 backdrop-blur-md p-5 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-violet-500/30 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-medium text-violet-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>To-Do List Harian</span>
                </div>
                <span className="text-xs text-zinc-500">
                  {tasksList.filter((t) => t.isDone).length}/{tasksList.length} Selesai
                </span>
              </div>

              {/* Task Add Form */}
              <form onSubmit={handleAddTask} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  placeholder="Tambah tugas baru..."
                  className="flex-1 px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-xl text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Task list items */}
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                {tasksList.length === 0 ? (
                  <p className="text-xs text-zinc-600">Semua tugas selesai!</p>
                ) : (
                  tasksList.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => handleToggleTask(t.id)}
                      className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-xs cursor-pointer transition-all ${
                        t.isDone
                          ? "bg-white/[0.02] border-white/5 text-zinc-500 line-through"
                          : "bg-white/5 border-white/10 text-zinc-200 hover:bg-white/[0.08]"
                      }`}
                    >
                      {t.isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-zinc-500 shrink-0" />
                      )}
                      <span className="truncate flex-1">{t.title}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <p className="text-[10px] text-zinc-500 mt-4 pt-2 border-t border-white/5">
              Tekan item untuk mencentang status selesai.
            </p>
          </div>

          {/* Card 4: Quick Scratchpad Note */}
          <div className="rounded-2xl border border-white/10 bg-[#121217]/70 backdrop-blur-md p-5 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-sky-500/30 transition-all md:col-span-2">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-medium text-sky-400">
                  <FileText className="w-4 h-4" />
                  <span>Scratchpad & Catatan Bebas</span>
                </div>
                <button
                  onClick={handleSaveNote}
                  disabled={isPending}
                  className="px-3 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/30 text-sky-300 text-xs font-medium transition-all cursor-pointer"
                >
                  Simpan Note
                </button>
              </div>

              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={5}
                placeholder="Tulis ide, catatan cepat, atau to-do di sini..."
                className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-sky-500/40 resize-none font-mono"
              />
            </div>
            <p className="text-[10px] text-zinc-500 mt-2">
              Dukungan Markdown. Data tersimpan secara persisten di database.
            </p>
          </div>

          {/* Card 5: Schedule & Timebox Status */}
          <div className="rounded-2xl border border-white/10 bg-[#121217]/70 backdrop-blur-md p-5 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-purple-500/30 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-medium text-purple-400">
                  <Calendar className="w-4 h-4" />
                  <span>Timebox & Fokus Hari Ini</span>
                </div>
                <span className="text-[10px] text-zinc-500">Live</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center py-6 space-y-2">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
                  <Calendar className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-semibold text-zinc-200">Sesi Kerja Fokus</h4>
                <p className="text-[11px] text-zinc-400 max-w-xs mx-auto">
                  Atur blok waktu kerja fokus tanpa distraksi.
                </p>
              </div>
            </div>

            <p className="text-[10px] text-zinc-500 mt-2 pt-2 border-t border-white/5">
              Jadwal tersinkronisasi dengan kalender.
            </p>
          </div>
        </div>
      </main>

      {/* Quick Expense Modal */}
      {expenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setExpenseModalOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-[#121217] p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span>Catat Pengeluaran Cepat</span>
              </div>
              <kbd
                onClick={() => setExpenseModalOpen(false)}
                className="px-1.5 py-0.5 text-[10px] bg-white/10 text-zinc-400 rounded cursor-pointer hover:bg-white/20"
              >
                ESC
              </kbd>
            </div>

            <form onSubmit={handleQuickExpenseSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 block mb-1.5">
                  Ketik natural (Contoh: <span className="text-emerald-400">kopi 25k #jajan</span> atau <span className="text-emerald-400">gaji 5jt #income</span>)
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    autoFocus
                    value={expenseInput}
                    onChange={(e) => setExpenseInput(e.target.value)}
                    placeholder="kopi susu 25k #jajan..."
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                  <button
                    type="submit"
                    disabled={isPending || parsedPreview.amount <= 0}
                    className="absolute right-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-medium cursor-pointer transition-all"
                  >
                    Simpan
                  </button>
                </div>
              </div>

              {/* Live Parser Feedback */}
              {expenseInput && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1 text-xs">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block">
                    Hasil Deteksi Otomatis:
                  </span>
                  <div className="flex items-center justify-between text-zinc-200">
                    <span>Nominal:</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {parsedPreview.amount > 0 ? formatIDR(parsedPreview.amount) : "Belum terdeteksi"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-200">
                    <span>Catatan:</span>
                    <span className="text-zinc-300">{parsedPreview.note}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-200">
                    <span>Tipe:</span>
                    <span className={parsedPreview.type === "income" ? "text-emerald-400" : "text-rose-400"}>
                      {parsedPreview.type === "income" ? "Pemasukan (+)" : "Pengeluaran (-)"}
                    </span>
                  </div>
                  {parsedPreview.category && (
                    <div className="flex items-center justify-between text-zinc-200">
                      <span>Kategori:</span>
                      <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-zinc-300">
                        #{parsedPreview.category}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Quick Note Modal */}
      {noteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setNoteModalOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-[#121217] p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <FileText className="w-4 h-4 text-sky-400" />
                <span>Scratchpad Cepat</span>
              </div>
              <kbd
                onClick={() => setNoteModalOpen(false)}
                className="px-1.5 py-0.5 text-[10px] bg-white/10 text-zinc-400 rounded cursor-pointer hover:bg-white/20"
              >
                ESC
              </kbd>
            </div>

            <textarea
              autoFocus
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows={8}
              placeholder="Tulis ide atau catatan cepat di sini..."
              className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-sky-500/40 resize-none font-mono"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setNoteModalOpen(false)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveNote}
                disabled={isPending}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium rounded-xl shadow cursor-pointer"
              >
                Simpan Catatan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
