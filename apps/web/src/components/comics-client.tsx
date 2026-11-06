"use client";

import { useState } from "react";
import { AppShell } from "./app-shell";
import {
  BookOpen,
  Plus,
  ExternalLink,
  Search,
  Trash2,
  BookmarkCheck,
  Check,
  Sparkles,
} from "lucide-react";
import {
  addComicAction,
  incrementChapterAction,
  deleteComicAction,
  updateComicStatusAction,
} from "@/actions/comic-actions";
import { toast } from "sonner";

interface ComicsClientProps {
  user: { username: string };
  comicsList: any[];
}

export function ComicsClient({ user, comicsList }: ComicsClientProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [localComics, setLocalComics] = useState(comicsList);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state if props change
  if (localComics.length !== comicsList.length) {
    setLocalComics(comicsList);
  }

  const filteredComics = localComics.filter((comic) => {
    if (filterStatus !== "all" && comic.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      return comic.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const handleIncrement = async (comicId: string, current: number) => {
    // Optimistic UI update
    setLocalComics((prev) =>
      prev.map((c) => (c.id === comicId ? { ...c, currentChapter: current + 1 } : c))
    );

    try {
      const res = await incrementChapterAction(comicId);
      if (res.success) {
        toast.success(`Chapter diupdate ke Ch. ${res.newChapter}! 📖`);
      } else {
        toast.error("Gagal update chapter.");
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus komik ini dari daftar bacaan?")) return;
    try {
      const res = await deleteComicAction(id);
      if (res.success) {
        setLocalComics((prev) => prev.filter((c) => c.id !== id));
        toast.success("Komik berhasil dihapus.");
      }
    } catch {
      toast.error("Gagal menghapus.");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await updateComicStatusAction(id, newStatus);
      if (res.success) {
        setLocalComics((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
        );
        toast.success(`Status diubah ke ${newStatus}!`);
      }
    } catch {
      toast.error("Gagal update status.");
    }
  };

  const handleAddComic = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await addComicAction(formData);
      if (res.success) {
        toast.success("Komik baru berhasil ditambahkan!");
        setShowAddModal(false);
      } else {
        toast.error(res.error || "Gagal menambahkan komik.");
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white light:text-zinc-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              Reading & Comic Tracker
            </h2>
            <p className="text-xs text-zinc-400">
              Pantau progres manga, manhwa & webtoon tanpa risiko penyimpanan gambar ilegal
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 text-white text-xs font-bold shadow-md shadow-amber-500/20 hover:opacity-90 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Komik</span>
          </button>
        </div>

        {/* Filter Tabs & Search */}
        <div className="aurora-glass rounded-2xl p-4 border dark:border-white/10 light:border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex rounded-xl p-1 bg-black/20 dark:bg-white/5 light:bg-zinc-200 border dark:border-white/5 light:border-zinc-300 w-full md:w-auto">
            {[
              { id: "all", label: "Semua" },
              { id: "reading", label: "Sedang Dibaca" },
              { id: "plan_to_read", label: "Rencana Baca" },
              { id: "completed", label: "Selesai" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterStatus === tab.id
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul komik..."
              className="w-full pl-8 pr-3 py-2 rounded-xl text-xs dark:bg-white/5 light:bg-zinc-100 border dark:border-white/10 light:border-zinc-200 text-white light:text-zinc-900 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Comic Catalog Grid */}
        {filteredComics.length === 0 ? (
          <div className="aurora-glass rounded-2xl p-16 text-center text-zinc-400 text-xs border dark:border-white/10 light:border-zinc-200">
            Tidak ada komik yang ditemukan. Tambahkan komik baru untuk mulai membaca!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredComics.map((comic) => (
              <div
                key={comic.id}
                className="group aurora-glass rounded-2xl overflow-hidden border dark:border-white/10 light:border-zinc-200 hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                {/* Cover Image Area */}
                <div className="relative aspect-[3/4] bg-zinc-800 overflow-hidden">
                  {comic.coverUrl ? (
                    <img
                      src={comic.coverUrl}
                      alt={comic.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 p-4 text-center">
                      <BookOpen className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-[10px] font-mono">No Cover</span>
                    </div>
                  )}

                  {/* Chapter Overlay Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-black/60 backdrop-blur-md text-amber-400 border border-amber-500/30">
                      Ch. {comic.currentChapter}
                    </span>
                  </div>

                  {/* Status Dropdown / Action */}
                  <div className="absolute top-2 right-2">
                    <select
                      value={comic.status}
                      onChange={(e) => handleStatusChange(comic.id, e.target.value)}
                      className="text-[9px] px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-zinc-300 border border-white/10 focus:outline-none"
                    >
                      <option value="reading">Reading</option>
                      <option value="plan_to_read">Plan</option>
                      <option value="completed">Done</option>
                      <option value="dropped">Drop</option>
                    </select>
                  </div>
                </div>

                {/* Details & Actions */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3
                      className="text-xs font-bold line-clamp-2 text-white light:text-zinc-900 group-hover:text-amber-400 transition-colors"
                      title={comic.title}
                    >
                      {comic.title}
                    </h3>
                  </div>

                  <div className="space-y-1.5">
                    {/* +1 Chapter Button */}
                    <button
                      onClick={() => handleIncrement(comic.id, comic.currentChapter)}
                      className="w-full py-1.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+1 Chapter</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {/* External Read Link */}
                      {comic.sourceUrl ? (
                        <a
                          href={comic.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-1.5 px-2 rounded-xl dark:bg-white/5 light:bg-zinc-100 hover:bg-white/10 text-zinc-300 text-[11px] font-medium border dark:border-white/5 light:border-zinc-200 transition-all flex items-center justify-center gap-1 text-center"
                        >
                          <ExternalLink className="w-3 h-3 text-zinc-400" />
                          <span>Baca</span>
                        </a>
                      ) : (
                        <span className="flex-1 py-1.5 text-center text-[10px] text-zinc-500">
                          Tanpa link
                        </span>
                      )}

                      <button
                        onClick={() => handleDelete(comic.id)}
                        title="Hapus Komik"
                        className="p-1.5 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Tambah Komik */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative w-full max-w-sm aurora-glass rounded-2xl p-6 border dark:border-white/10 light:border-zinc-200 z-10">
            <h3 className="text-sm font-bold text-white light:text-zinc-900 mb-1">
              Tambah Komik ke Daftar
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Masukkan informasi judul dan link baca luar
            </p>

            <form onSubmit={handleAddComic} className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-zinc-300 light:text-zinc-700 mb-1 block">
                  Judul Komik
                </label>
                <input
                  name="title"
                  type="text"
                  required
                  placeholder="Contoh: Solo Leveling, Omniscient Reader"
                  className="w-full px-3 py-2 rounded-xl text-xs dark:bg-white/5 light:bg-zinc-100 border dark:border-white/10 light:border-zinc-200 text-white light:text-zinc-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-zinc-300 light:text-zinc-700 mb-1 block">
                  URL Cover Image (Opsional)
                </label>
                <input
                  name="coverUrl"
                  type="url"
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl text-xs dark:bg-white/5 light:bg-zinc-100 border dark:border-white/10 light:border-zinc-200 text-white light:text-zinc-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-zinc-300 light:text-zinc-700 mb-1 block">
                  Link Halaman Baca (Opsional)
                </label>
                <input
                  name="sourceUrl"
                  type="url"
                  placeholder="https://kiryuu.id/..."
                  className="w-full px-3 py-2 rounded-xl text-xs dark:bg-white/5 light:bg-zinc-100 border dark:border-white/10 light:border-zinc-200 text-white light:text-zinc-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-zinc-300 light:text-zinc-700 mb-1 block">
                    Chapter Sekarang
                  </label>
                  <input
                    name="currentChapter"
                    type="number"
                    step="0.5"
                    defaultValue="1"
                    className="w-full px-3 py-2 rounded-xl text-xs dark:bg-white/5 light:bg-zinc-100 border dark:border-white/10 light:border-zinc-200 text-white light:text-zinc-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-zinc-300 light:text-zinc-700 mb-1 block">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue="reading"
                    className="w-full px-3 py-2 rounded-xl text-xs dark:bg-[#18181b] light:bg-white border dark:border-white/10 light:border-zinc-200 text-white light:text-zinc-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value="reading">Sedang Dibaca</option>
                    <option value="plan_to_read">Rencana Baca</option>
                    <option value="completed">Selesai</option>
                  </select>
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
                  className="flex-1 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-md shadow-amber-500/20"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Komik"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
