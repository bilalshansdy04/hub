"use client";

import { useState } from "react";
import { AppShell } from "./app-shell";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Sparkles,
  Zap,
  Target,
  Flame,
} from "lucide-react";
import {
  addScheduleBlockAction,
  toggleScheduleBlockAction,
  deleteScheduleBlockAction,
} from "@/actions/calendar-actions";
import { toast } from "sonner";

interface CalendarClientProps {
  user: { username: string };
  blocks: any[];
}

export function CalendarClient({ user, blocks }: CalendarClientProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"focus" | "routine" | "meeting" | "rest">("focus");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:30");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completedCount = blocks.filter((b) => b.isCompleted).length;
  const progressPercent = blocks.length > 0 ? Math.round((completedCount / blocks.length) * 100) : 0;

  const handleCreateBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const today = new Date();
      const [startH, startM] = startTime.split(":");
      const [endH, endM] = endTime.split(":");

      const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(startH), parseInt(startM));
      const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(endH), parseInt(endM));

      const colors = {
        focus: "#a855f7",
        routine: "#3b82f6",
        meeting: "#f59e0b",
        rest: "#10b981",
      };

      const res = await addScheduleBlockAction({
        title,
        category,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        color: colors[category],
      });

      if (res.success) {
        toast.success("Blok jadwal ditambahkan!");
        setShowAddModal(false);
        setTitle("");
      } else {
        toast.error(res.error || "Gagal menambahkan jadwal.");
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const res = await toggleScheduleBlockAction(id);
      if (res.success) {
        toast.success(res.isCompleted ? "Blok diselesaikan! 🎉" : "Blok diaktifkan kembali.");
      }
    } catch {
      toast.error("Gagal update jadwal.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus blok waktu ini?")) return;
    try {
      const res = await deleteScheduleBlockAction(id);
      if (res.success) {
        toast.success("Jadwal dihapus.");
      }
    } catch {
      toast.error("Gagal menghapus.");
    }
  };

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case "focus":
        return {
          badge: "bg-purple-500/15 text-purple-400 border-purple-500/30",
          bar: "bg-purple-500",
          label: "Deep Focus",
        };
      case "meeting":
        return {
          badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
          bar: "bg-amber-500",
          label: "Meeting / Diskusi",
        };
      case "routine":
        return {
          badge: "bg-sky-500/15 text-sky-400 border-sky-500/30",
          bar: "bg-sky-500",
          label: "Routine Task",
        };
      case "rest":
        return {
          badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
          bar: "bg-emerald-500",
          label: "Rest & Recovery",
        };
      default:
        return {
          badge: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
          bar: "bg-zinc-500",
          label: "Task",
        };
    }
  };

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="aurora-glass aurora-card-interactive rounded-2xl p-5 border dark:border-white/[0.08] light:border-zinc-200">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
              <span className="flex items-center gap-1.5 font-medium">
                <CalendarIcon className="w-4 h-4 text-violet-400" />
                Kalender Timebox
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
            <div className="text-3xl font-bold font-mono tracking-tight text-white light:text-zinc-900">
              {blocks.length} Slot
            </div>
            <div className="text-[11px] text-zinc-400 mt-2">Blok fokus aktif hari ini</div>
          </div>

          <div className="aurora-glass aurora-card-interactive rounded-2xl p-5 border dark:border-white/[0.08] light:border-zinc-200">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
              <span className="flex items-center gap-1.5 font-medium">
                <Target className="w-4 h-4 text-emerald-400" />
                Efisiensi & Eksekusi
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="text-3xl font-bold font-mono tracking-tight text-emerald-400">
              {completedCount} / {blocks.length}
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="aurora-glass rounded-2xl p-5 border dark:border-white/[0.08] light:border-zinc-200 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-zinc-300 light:text-zinc-700 mb-1 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-pink-400" />
                Timeboxing Philosophy
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tolak multitasking. Alokasikan jendela waktu terisolasi untuk satu prioritas utama.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-3 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 text-white text-xs font-bold shadow-md shadow-violet-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Blok Waktu</span>
            </button>
          </div>
        </div>

        {/* Schedule Timeline Grid */}
        <div className="aurora-glass rounded-2xl p-6 border dark:border-white/[0.08] light:border-zinc-200">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold tracking-tight text-white light:text-zinc-900">
                Timeline Agenda Harian
              </h3>
              <p className="text-xs text-zinc-400">
                Urutan terstruktur dari slot fokus hingga waktu istirahat
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-500/15 text-violet-300 hover:bg-violet-500/25 text-xs font-semibold border border-violet-500/30 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Slot</span>
            </button>
          </div>

          {blocks.length === 0 ? (
            <div className="py-20 text-center text-zinc-500 text-xs">
              Belum ada blok jadwal hari ini. Klik &quot;Tambah Slot&quot; untuk merancang hari produktifmu!
            </div>
          ) : (
            <div className="space-y-3">
              {blocks.map((block) => {
                const sDate = new Date(block.startTime);
                const eDate = new Date(block.endTime);
                const sStr = sDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
                const eStr = eDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
                const catTheme = getCategoryTheme(block.category);

                return (
                  <div
                    key={block.id}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      block.isCompleted
                        ? "dark:bg-white/[0.01] light:bg-zinc-100/40 opacity-50 border-transparent"
                        : "dark:bg-white/[0.03] light:bg-zinc-100/80 dark:border-white/[0.05] light:border-zinc-200 hover:border-violet-500/40"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleToggle(block.id)}
                        className="text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer"
                      >
                        {block.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold ${
                              block.isCompleted
                                ? "line-through text-zinc-500"
                                : "text-white light:text-zinc-900"
                            }`}
                          >
                            {block.title}
                          </span>
                          <span
                            className={`text-[9px] uppercase px-2 py-0.5 rounded-full border font-mono ${catTheme.badge}`}
                          >
                            {catTheme.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 mt-1">
                          <Clock className="w-3 h-3 text-zinc-500" />
                          <span>
                            {sStr} — {eStr}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(block.id)}
                      className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal Tambah Slot */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative w-full max-w-sm aurora-glass rounded-2xl p-6 border dark:border-white/10 light:border-zinc-200 z-10 shadow-2xl">
            <h3 className="text-sm font-bold text-white light:text-zinc-900 mb-1">
              Tambah Blok Jadwal Baru
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Tentukan slot fokus untuk produktivitas maksimal
            </p>

            <form onSubmit={handleCreateBlock} className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-zinc-300 light:text-zinc-700 mb-1 block">
                  Nama Aktivitas
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Coding Auth Module, Review Dokumen"
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-zinc-300 light:text-zinc-700 mb-1 block">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs focus:outline-none"
                >
                  <option value="focus">Deep Focus (Koding / Kerja Inti)</option>
                  <option value="routine">Routine (Email / Admin / Olahraga)</option>
                  <option value="meeting">Meeting / Diskusi</option>
                  <option value="rest">Istirahat / Makan</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-zinc-300 light:text-zinc-700 mb-1 block">
                    Jam Mulai
                  </label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-zinc-300 light:text-zinc-700 mb-1 block">
                    Jam Selesai
                  </label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 text-xs rounded-xl border dark:border-white/10 light:border-zinc-200 text-zinc-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 text-xs font-bold rounded-xl bg-violet-500 hover:bg-violet-600 text-white transition-all shadow-md shadow-violet-500/20"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
