"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  Calendar,
  BookOpen,
  Code2,
  FileText,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Search,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { CommandMenu } from "./command-menu";
import { logoutAction } from "@/actions/auth-actions";

interface AppShellProps {
  user: { username: string };
  children: React.ReactNode;
  onQuickExpense?: () => void;
  onQuickNote?: () => void;
}

// Precision Vector SVG Brand Logo
function ShrimpHubLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="12" r="10" fill="#ec4899" fillOpacity="0.25" />
      <path
        d="M7 14.5C8 17 11 18.5 14 18M17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12"
        stroke="#ec4899"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="10" cy="11" r="1.25" fill="#f43f5e" />
    </svg>
  );
}

export function AppShell({ user, children, onQuickExpense, onQuickNote }: AppShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard, tag: "01", color: "text-rose-500 dark:text-rose-400" },
    { name: "Keuangan", href: "/finance", icon: Wallet, tag: "02", color: "text-emerald-500 dark:text-emerald-400" },
    { name: "Jadwal & Timebox", href: "/calendar", icon: Calendar, tag: "03", color: "text-violet-500 dark:text-violet-400" },
    { name: "Comic Tracker", href: "/comics", icon: BookOpen, tag: "04", color: "text-amber-500 dark:text-amber-400" },
    { name: "Snippet Studio", href: "/snippets", icon: Code2, tag: "05", color: "text-pink-500 dark:text-pink-400" },
    { name: "Catatan & To-Do", href: "/notes", icon: FileText, tag: "06", color: "text-sky-500 dark:text-sky-400" },
  ];

  const getPageTitle = (path: string) => {
    switch (path) {
      case "/":
        return "Command Hub";
      case "/finance":
        return "Personal Finance & Wallets (Copilot Money Style)";
      case "/calendar":
        return "Timebox & Focus Schedule (Cal.com Style)";
      case "/comics":
        return "Reading & Manga Tracker (Kenmei Style)";
      case "/snippets":
        return "Snippet & Card Studio (Ray.so Style)";
      case "/notes":
        return "Notes & Priority Tasks (Linear Style)";
      default:
        return "ShrimpHub";
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#07090e] text-zinc-900 dark:text-white relative overflow-x-hidden selection:bg-pink-500/25">
      {/* Ambient Lighting in Dark Mode */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden dark:block hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-pink-500/10 blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] rounded-full bg-emerald-500/10 blur-[140px]" />
        <div className="absolute -bottom-40 left-1/4 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[140px]" />
      </div>

      {/* Desktop Fixed Sidebar (Stays fixed when page is scrolled) */}
      <aside
        className={`hidden md:flex flex-col fixed top-0 bottom-0 left-0 h-screen z-40 transition-all duration-200 ease-in-out border-r ${
          collapsed ? "w-20" : "w-64"
        } bg-white dark:bg-[#0a0d17] border-zinc-200 dark:border-white/[0.08] shadow-sm`}
      >
        {/* Header (Logo + Toggle Button) */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-zinc-200 dark:border-white/[0.06] shrink-0">
          <Link href="/" className="flex items-center gap-3 overflow-hidden group">
            <div className="w-9 h-9 rounded-xl bg-pink-500/10 dark:bg-pink-500/20 border border-pink-500/20 dark:border-pink-500/30 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <ShrimpHubLogo className="w-5 h-5" />
            </div>

            {!collapsed && (
              <div className="flex flex-col overflow-hidden leading-tight">
                <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-white">
                  ShrimpHub
                </span>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                  {user.username}&apos;s workspace
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Perluas Sidebar" : "Ciutkan Sidebar"}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
            title={collapsed ? "Perluas Sidebar" : "Ciutkan Sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Search Button */}
        {!collapsed && (
          <div className="px-3 pt-3 shrink-0">
            <button
              onClick={() => {
                const event = new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true });
                document.dispatchEvent(event);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs bg-zinc-100/80 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.06] text-zinc-600 dark:text-zinc-400 hover:border-pink-500/40 hover:text-zinc-900 dark:hover:text-white transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 group-hover:text-pink-500 transition-colors" />
                <span className="text-[11px]">Command Palette</span>
              </div>
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-white/10 text-zinc-600 dark:text-zinc-300">
                ⌘K
              </kbd>
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
          {!collapsed && (
            <div className="px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-mono">
              Workspace
            </div>
          )}

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-pink-50 dark:bg-pink-500/15 text-pink-600 dark:text-pink-300 border border-pink-200 dark:border-pink-500/30 shadow-sm font-semibold"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.05]"
                  } ${collapsed ? "justify-center px-0 w-11 h-11 mx-auto" : ""}`}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? "text-pink-500 dark:text-pink-400" : item.color
                    }`}
                  />

                  {!collapsed && (
                    <span className="flex-1 truncate tracking-tight">{item.name}</span>
                  )}

                  {!collapsed && (
                    <span
                      className={`text-[9px] font-mono opacity-50 group-hover:opacity-100 transition-opacity ${
                        isActive ? "text-pink-500 dark:text-pink-400" : "text-zinc-400 dark:text-zinc-500"
                      }`}
                    >
                      {item.tag}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-zinc-200 dark:border-white/[0.06] space-y-2 shrink-0">
          <ThemeToggle collapsed={collapsed} />

          {/* Profile Card */}
          <div
            className={`flex items-center justify-between p-2 rounded-xl bg-zinc-100/70 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.06] ${
              collapsed ? "flex-col gap-2 p-1.5" : ""
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-pink-500/15 text-pink-500 dark:text-pink-400 border border-pink-500/30 flex items-center justify-center text-xs font-bold uppercase shrink-0">
                {user.username.slice(0, 1)}
              </div>

              {!collapsed && (
                <div className="overflow-hidden leading-tight">
                  <p className="text-xs font-semibold truncate text-zinc-900 dark:text-white">
                    {user.username}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                      Online • Turso
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => logoutAction()}
              title="Kunci / Logout Sesi"
              className="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content (Padded to match fixed sidebar width) */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ease-in-out ${
          collapsed ? "md:pl-20" : "md:pl-64"
        }`}
      >
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 border-b border-zinc-200 dark:border-white/[0.06] bg-white/90 dark:bg-[#07090e]/90 backdrop-blur-xl px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 cursor-pointer"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  SHRIMPHUB /
                </span>
                <h1 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white">
                  {getPageTitle(pathname)}
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CommandMenu onQuickExpense={onQuickExpense} onQuickNote={onQuickNote} />
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 h-full bg-white dark:bg-[#0a0d17] p-5 flex flex-col justify-between border-r border-zinc-200 dark:border-white/10 z-10 shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-white/10 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center">
                    <ShrimpHubLogo className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm text-zinc-900 dark:text-white">ShrimpHub</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-zinc-500 dark:text-zinc-400 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-medium transition-all ${
                      pathname === item.href
                        ? "bg-pink-50 dark:bg-white/15 text-pink-600 dark:text-white font-semibold"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t border-zinc-200 dark:border-white/10 space-y-3">
              <ThemeToggle />
              <button
                onClick={() => logoutAction()}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Kunci Sesi / Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
