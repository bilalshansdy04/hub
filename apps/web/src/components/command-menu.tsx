"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import {
  Wallet,
  Calendar,
  FileText,
  BookOpen,
  Code2,
  Plus,
  Search,
  LogOut,
  Sparkles,
} from "lucide-react";
import { logoutAction } from "@/actions/auth-actions";

interface CommandMenuProps {
  onQuickExpense?: () => void;
  onQuickNote?: () => void;
}

export function CommandMenu({ onQuickExpense, onQuickNote }: CommandMenuProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "t" && !e.metaKey && !e.ctrlKey) {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== "input" && activeTag !== "textarea") {
          e.preventDefault();
          onQuickExpense?.();
        }
      }
      if (e.key === "n" && !e.metaKey && !e.ctrlKey) {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== "input" && activeTag !== "textarea") {
          e.preventDefault();
          onQuickNote?.();
        }
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onQuickExpense, onQuickNote]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-zinc-400 hover:text-zinc-200 transition-colors shadow-sm"
      >
        <Search className="w-3.5 h-3.5" />
        <span>Cari atau ketik perintah...</span>
        <kbd className="ml-2 px-1.5 py-0.5 text-[10px] bg-white/10 border border-white/10 rounded font-mono text-zinc-400">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-[#121217] shadow-2xl overflow-hidden z-10">
            <Command className="w-full">
              <div className="flex items-center border-b border-white/10 px-4 py-3">
                <Search className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
                <Command.Input
                  autoFocus
                  placeholder="Ketik navigasi atau aksi cepat..."
                  className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
                />
                <kbd
                  onClick={() => setOpen(false)}
                  className="px-1.5 py-0.5 text-[10px] bg-white/10 text-zinc-400 rounded cursor-pointer hover:bg-white/20"
                >
                  ESC
                </kbd>
              </div>

              <Command.List className="max-h-80 overflow-y-auto p-2 space-y-1">
                <Command.Empty className="py-6 text-center text-xs text-zinc-500">
                  Tidak ada perintah yang cocok.
                </Command.Empty>

                <Command.Group heading="Aksi Cepat" className="text-[10px] font-semibold text-zinc-500 px-2 py-1">
                  <Command.Item
                    onSelect={() => {
                      setOpen(false);
                      onQuickExpense?.();
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-200 rounded-xl hover:bg-emerald-500/15 hover:text-emerald-300 cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span className="flex-1">Catat Pengeluaran Cepat</span>
                    <kbd className="text-[10px] font-mono text-zinc-500">T</kbd>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => {
                      setOpen(false);
                      onQuickNote?.();
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-200 rounded-xl hover:bg-sky-500/15 hover:text-sky-300 cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4 text-sky-400" />
                    <span className="flex-1">Tulis Catatan / Scratchpad</span>
                    <kbd className="text-[10px] font-mono text-zinc-500">N</kbd>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Navigasi Modul" className="text-[10px] font-semibold text-zinc-500 px-2 py-1 mt-2">
                  <Command.Item
                    onSelect={() => {
                      setOpen(false);
                      window.location.hash = "finance";
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-200 rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    <Wallet className="w-4 h-4 text-emerald-400" />
                    <span className="flex-1">Keuangan & Dompet</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => {
                      setOpen(false);
                      window.location.hash = "schedule";
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-200 rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-violet-400" />
                    <span className="flex-1">Jadwal & Timebox</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => {
                      setOpen(false);
                      window.location.hash = "notes";
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-200 rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    <FileText className="w-4 h-4 text-sky-400" />
                    <span className="flex-1">Catatan & To-Do List</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => {
                      setOpen(false);
                      window.location.hash = "comics";
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-200 rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span className="flex-1">Comic & Reading Tracker</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => {
                      setOpen(false);
                      window.location.hash = "snippets";
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-200 rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    <Code2 className="w-4 h-4 text-pink-400" />
                    <span className="flex-1">Snippet & Card Studio</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Sistem" className="text-[10px] font-semibold text-zinc-500 px-2 py-1 mt-2">
                  <Command.Item
                    onSelect={() => logoutAction()}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-rose-300 rounded-xl hover:bg-rose-500/15 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Kunci / Logout Sesi</span>
                  </Command.Item>
                </Command.Group>
              </Command.List>

              <div className="border-t border-white/5 px-4 py-2 flex items-center justify-between text-[11px] text-zinc-500 bg-black/20">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  ShrimpHub Fast Navigation
                </span>
                <span>Gunakan ↑ ↓ untuk memilih</span>
              </div>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}
