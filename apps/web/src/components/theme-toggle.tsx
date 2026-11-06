"use client";

import { useTheme } from "./theme-provider";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ collapsed = false }: { collapsed?: boolean }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={theme === "dark" ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
        collapsed ? "justify-center px-0 w-10 h-10 mx-auto" : "w-full"
      } bg-zinc-100 dark:bg-white/[0.05] border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10`}
    >
      {theme === "dark" ? (
        <>
          <Sun className="w-4 h-4 text-amber-400 shrink-0" />
          {!collapsed && <span className="truncate">Mode Terang</span>}
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-indigo-500 shrink-0" />
          {!collapsed && <span className="truncate">Mode Gelap</span>}
        </>
      )}
    </button>
  );
}
