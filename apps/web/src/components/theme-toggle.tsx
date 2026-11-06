"use client";

import { useTheme } from "./theme-provider";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ collapsed = false }: { collapsed?: boolean }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={theme === "dark" ? "Ganti ke Mode Terang (Light Mode)" : "Ganti ke Mode Gelap (Dark Mode)"}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border border-white/10 dark:border-white/10 dark:hover:bg-white/10 text-xs text-zinc-400 hover:text-zinc-100 transition-all cursor-pointer ${
        collapsed ? "justify-center px-2" : "w-full"
      } bg-zinc-900/40 dark:bg-zinc-900/60 light:bg-white/70 light:border-zinc-200 light:text-zinc-700 light:hover:bg-zinc-100`}
    >
      {theme === "dark" ? (
        <>
          <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-200" />
          {!collapsed && <span>Mode Terang</span>}
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-indigo-500 animate-in spin-in-180 duration-200" />
          {!collapsed && <span>Mode Gelap</span>}
        </>
      )}
    </button>
  );
}
