"use client";

import { useState } from "react";
import { AppShell } from "./app-shell";
import {
  FileText,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Save,
  ListTodo,
} from "lucide-react";
import { saveNoteAction, deleteNoteAction } from "@/actions/note-actions";
import { addTaskAction, toggleTaskAction, deleteTaskAction } from "@/actions/task-actions";
import { toast } from "sonner";

interface NotesClientProps {
  user: { username: string };
  allNotes: any[];
  allTasks: any[];
}

export function NotesClient({ user, allNotes, allTasks }: NotesClientProps) {
  // Notes State
  const [notesList, setNotesList] = useState(allNotes);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(
    allNotes.length > 0 ? allNotes[0].id : null
  );
  const [activeTitle, setActiveTitle] = useState(
    allNotes.length > 0 ? allNotes[0].title || "Catatan Harian" : "Catatan Baru"
  );
  const [activeContent, setActiveContent] = useState(
    allNotes.length > 0 ? allNotes[0].content : ""
  );
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Tasks State
  const [tasksList, setTasksList] = useState(allTasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");
  const [taskFilter, setTaskFilter] = useState<"all" | "active" | "completed">("all");

  const handleSelectNote = (note: any) => {
    setActiveNoteId(note.id);
    setActiveTitle(note.title || "Tanpa Judul");
    setActiveContent(note.content);
  };

  const handleCreateNewNote = () => {
    setActiveNoteId(null);
    setActiveTitle("Catatan Baru");
    setActiveContent("");
  };

  const handleSaveNote = async () => {
    if (!activeContent.trim()) return;
    setIsSavingNote(true);
    try {
      const res = await saveNoteAction(activeContent, activeNoteId || undefined, activeTitle);
      if (res.success) {
        toast.success("Catatan berhasil disimpan! 📝");
      } else {
        toast.error("Gagal menyimpan catatan.");
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("Hapus catatan ini?")) return;
    try {
      const res = await deleteNoteAction(noteId);
      if (res.success) {
        setNotesList((prev) => prev.filter((n) => n.id !== noteId));
        if (activeNoteId === noteId) {
          handleCreateNewNote();
        }
        toast.success("Catatan dihapus.");
      }
    } catch {
      toast.error("Gagal menghapus.");
    }
  };

  // Task Handlers
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const res = await addTaskAction(newTaskTitle, newTaskPriority);
      if (res.success) {
        setTasksList((prev) => [
          {
            id: `task-${Date.now()}`,
            title: newTaskTitle.trim(),
            priority: newTaskPriority,
            isDone: false,
            createdAt: new Date(),
          },
          ...prev,
        ]);
        setNewTaskTitle("");
        toast.success("Tugas berhasil ditambahkan!");
      }
    } catch {
      toast.error("Gagal menambahkan tugas.");
    }
  };

  const handleToggleTask = async (taskId: string) => {
    setTasksList((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isDone: !t.isDone } : t))
    );

    try {
      const res = await toggleTaskAction(taskId);
      if (res.success) {
        toast.success(res.isDone ? "Tugas selesai! 🎉" : "Tugas dibuka kembali.");
      }
    } catch {
      toast.error("Gagal update status tugas.");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const res = await deleteTaskAction(taskId);
      if (res.success) {
        setTasksList((prev) => prev.filter((t) => t.id !== taskId));
        toast.success("Tugas dihapus.");
      }
    } catch {
      toast.error("Gagal menghapus.");
    }
  };

  const filteredTasks = tasksList.filter((t) => {
    if (taskFilter === "active") return !t.isDone;
    if (taskFilter === "completed") return t.isDone;
    return true;
  });

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case "high":
        return "bg-rose-500/10 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30";
      case "low":
        return "bg-sky-500/10 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30";
      default:
        return "bg-amber-500/10 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
    }
  };

  return (
    <AppShell user={user}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Markdown Notes & Scratchpad (Notion style, 7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-500 dark:text-sky-400" />
                Catatan & Scratchpad
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Pencatat ide cepat, to-do harian, dan markdown bebas
              </p>
            </div>

            <button
              onClick={handleCreateNewNote}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-300 hover:bg-sky-500/20 text-xs font-semibold border border-sky-500/30 transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Catatan Baru</span>
            </button>
          </div>

          {/* Editor Card */}
          <div className="bg-white dark:bg-[#0e121b]/80 rounded-2xl p-5 border border-zinc-200 dark:border-white/[0.08] shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-white/[0.06]">
              <input
                type="text"
                value={activeTitle}
                onChange={(e) => setActiveTitle(e.target.value)}
                placeholder="Judul Catatan..."
                className="font-bold text-sm bg-transparent text-zinc-900 dark:text-white focus:outline-none flex-1 mr-4 py-1"
              />

              <button
                onClick={handleSaveNote}
                disabled={isSavingNote}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingNote ? "Menyimpan..." : "Simpan"}</span>
              </button>
            </div>

            <textarea
              value={activeContent}
              onChange={(e) => setActiveContent(e.target.value)}
              placeholder="Tulis ide cepat, catatan meeting, atau potongan artikel di sini (Markdown didukung)..."
              rows={14}
              className="w-full p-4 rounded-xl text-xs leading-relaxed font-mono resize-none bg-zinc-50 dark:bg-[#07090e] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Saved Notes List */}
          <div className="bg-white dark:bg-[#0e121b]/80 rounded-2xl p-4 border border-zinc-200 dark:border-white/[0.08] shadow-sm">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block mb-3">
              Catatan Tersimpan ({notesList.length})
            </span>
            {notesList.length === 0 ? (
              <p className="text-xs text-zinc-400 dark:text-zinc-500">Belum ada catatan.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {notesList.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleSelectNote(n)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      activeNoteId === n.id
                        ? "bg-sky-50 dark:bg-sky-500/15 border-sky-500/50 shadow-sm"
                        : "bg-zinc-50 dark:bg-white/[0.03] border-zinc-200 dark:border-white/[0.04] hover:border-sky-500/30"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">
                        {n.title || "Tanpa Judul"}
                      </p>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                        {n.content.slice(0, 40) || "(kosong)"}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(n.id);
                      }}
                      className="p-1 text-zinc-400 hover:text-rose-500 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: To-Do & Task Manager (Linear style, 5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
              To-Do & Tasks
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Checklist tugas prioritas harian
            </p>
          </div>

          <div className="bg-white dark:bg-[#0e121b]/80 rounded-2xl p-5 border border-zinc-200 dark:border-white/[0.08] shadow-sm space-y-4">
            {/* Add Task Form */}
            <form onSubmit={handleAddTask} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Tambahkan tugas baru..."
                  className="flex-1 px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-[#07090e] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Prioritas:</span>
                <div className="flex gap-1.5">
                  {(["low", "medium", "high"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewTaskPriority(p)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-mono capitalize border transition-all ${
                        newTaskPriority === p
                          ? getPriorityBadge(p)
                          : "text-zinc-500 border-transparent hover:text-zinc-700 dark:hover:text-zinc-300"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </form>

            {/* Filter Tabs */}
            <div className="flex rounded-xl p-1 bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.05]">
              {[
                { id: "all", label: "Semua" },
                { id: "active", label: "Aktif" },
                { id: "completed", label: "Selesai" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTaskFilter(tab.id as any)}
                  className={`flex-1 py-1 rounded-lg text-xs font-medium transition-all ${
                    taskFilter === tab.id
                      ? "bg-white dark:bg-white/20 text-zinc-900 dark:text-white shadow-sm font-semibold"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Task List */}
            {filteredTasks.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 dark:text-zinc-500 text-xs">
                Tidak ada tugas yang sesuai.
              </div>
            ) : (
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {filteredTasks.map((t) => (
                  <div
                    key={t.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                      t.isDone
                        ? "bg-zinc-100 dark:bg-white/[0.01] opacity-50 border-transparent"
                        : "bg-zinc-50 dark:bg-white/[0.03] border-zinc-200 dark:border-white/[0.04] hover:border-emerald-500/30"
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <button
                        onClick={() => handleToggleTask(t.id)}
                        className="text-zinc-400 hover:text-emerald-500 transition-colors cursor-pointer shrink-0"
                      >
                        {t.isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>

                      <div className="overflow-hidden">
                        <p
                          className={`text-xs font-medium truncate ${
                            t.isDone
                              ? "line-through text-zinc-400 dark:text-zinc-500"
                              : "text-zinc-900 dark:text-white"
                          }`}
                        >
                          {t.title}
                        </p>
                        <span
                          className={`inline-block text-[9px] uppercase px-1.5 py-0.2 rounded font-mono border mt-1 ${getPriorityBadge(
                            t.priority
                          )}`}
                        >
                          {t.priority}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteTask(t.id)}
                      className="p-1 text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
