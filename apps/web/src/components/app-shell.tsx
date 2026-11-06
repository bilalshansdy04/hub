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
  Zap,
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

// Precision SVG Logo Mark (Clean, futuristic, no childish emoji)
function ShrimpHubLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
        fill="url(#shrimp-grad)"
        fillOpacity="0.15"
      />
      <path
        d="M7 14.5C8 17 11 18.5 14 18M17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 13.5 7.8 14.8 9 15.6M14 6L16.5 3.5M16 8L19.5 6.5"
        stroke="url(#shrimp-stroke)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="11" r="1.25" fill="#f43f5e" />
      <defs>
        <linearGradient id="shrimp-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f43f5e" />
          <stop offset="0.5" stopColor="#a855f7" />
          <stop offset="1" stopColor="#10b981" />
        </linearGradient>
        <linearGradient id="shrimp-stroke" x1="7" y1="3.5" x2="19.5" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ec4899" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function AppShell({ user, children, onQuickExpense, onQuickNote }: AppShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard, tag: "01", color: "text-rose-400" },
    { name: "Keuangan", href: "/finance", icon: Wallet, tag: "02", color: "text-emerald-400" },
    { name: "Jadwal & Timebox", href: "/calendar", icon: Calendar, tag: "03", color: "text-violet-400" },
    { name: "Comic Tracker", href: "/comics", icon: BookOpen, tag: "04", color: "text-amber-400" },
    { name: "Snippet Studio", href: "/snippets", icon: Code2, tag: "05", color: "text-pink-400" },
    { name: "Catatan & To-Do", href: "/notes", icon: FileText, tag: "06", color: "text-sky-400" },
  ];

  const getPageTitle = (path: string) => {
    switch (path) {
      case "/":
        return "Command Hub";
      case "/finance":
        return "Personal Finance & Wallets";
      case "/calendar":
        return "Timebox & Focus Schedule";
      case "/comics":
        return "Reading & Manga Tracker";
      case "/snippets":
        return "Snippet & Card Studio";
      case "/notes":
        return "Notes & Priority Tasks";
      default:
        return "ShrimpHub";
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-x-hidden selection:bg-pink-500/25">
      {/* Precision Ambient Radial Lighting (Subtle, high-end mesh, not muddy) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-pink-500/10 via-purple-600/5 to-transparent blur-[120px] dark:opacity-80 opacity-40" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-emerald-500/10 via-teal-600/5 to-transparent blur-[120px] dark:opacity-80 opacity-30" />
        <div className="absolute -bottom-40 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-violet-600/10 via-indigo-500/5 to-transparent blur-[140px] dark:opacity-70 opacity-30" />
      </div>

      {/* Desktop Sidebar (Linear/Raycast Grade) */}
      <aside
        className={`hidden md:flex flex-col border-r transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sticky top-0 h-screen z-30 aurora-glass ${
          collapsed ? "w-[72px]" : "w-64"
        } dark:border-white/[0.08] dark:bg-[#090c14]/80 light:border-zinc-200/80 light:bg-white/80`}
      >
        {/* Brand Header */}
        <div className="p-4 flex items-center justify-between border-b dark:border-white/[0.06] light:border-zinc-200/60">
          <Link href="/" className="flex items-center gap-3 overflow-hidden group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-emerald-500/20 border dark:border-white/10 light:border-zinc-300/80 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <ShrimpHubLogo className="w-5 h-5" />
            </div>

            {!collapsed && (
              <div className="flex flex-col overflow-hidden leading-tight">
                <span className="font-bold text-xs tracking-wider uppercase text-white light:text-zinc-900 flex items-center gap-1.5">
                  ShrimpHub
                  <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-pink-500/15 text-pink-400 font-mono font-normal">
                    OS
                  </span>
                </span>
                <span className="text-[10px] text-zinc-400 truncate mt-0.5">
                  {user.username}&apos;s workspace
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="p-1.5 rounded-lg border dark:border-white/10 dark:hover:bg-white/10 light:border-zinc-200 light:hover:bg-zinc-100 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title={collapsed ? "Perluas (240px)" : "Ciutkan (72px)"}
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Quick Search Button in Sidebar */}
        {!collapsed && (
          <div className="px-3 pt-3">
            <button
              onClick={() => {
                const event = new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true });
                document.dispatchEvent(event);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-zinc-400 dark:bg-white/[0.03] light:bg-zinc-100/70 border dark:border-white/[0.06] light:border-zinc-200 hover:border-pink-500/40 hover:text-zinc-200 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 group-hover:text-pink-400 transition-colors" />
                <span className="text-[11px]">Command Palette</span>
              </div>
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-zinc-400">
                ⌘K
              </kbd>
            </button>
          </div>
        )}

        {/* Navigation Section */}
        <div className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
          {!collapsed && (
            <div className="px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 font-mono">
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
                  className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? "dark:bg-white/[0.08] dark:text-white light:bg-zinc-900 light:text-white shadow-sm ring-1 dark:ring-white/10 light:ring-zinc-900"
                      : "text-zinc-400 hover:text-zinc-100 dark:hover:bg-white/[0.04] light:hover:bg-zinc-100/80 light:hover:text-zinc-900"
                  } ${collapsed ? "justify-center px-2" : ""}`}
                  title={collapsed ? item.name : undefined}
                >
                  {/* Active Indicator Strip */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-pink-500 to-purple-500 rounded-r" />
                  )}

                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? item.color : "text-zinc-400 group-hover:text-zinc-200"
                    }`}
                  />

                  {!collapsed && (
                    <span className="flex-1 truncate tracking-tight">{item.name}</span>
                  )}

                  {!collapsed && (
                    <span
                      className={`text-[9px] font-mono opacity-40 group-hover:opacity-80 transition-opacity ${
                        isActive ? "text-pink-300" : "text-zinc-500"
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
        <div className="p-3 border-t dark:border-white/[0.06] light:border-zinc-200/60 space-y-2">
          {/* Theme Switcher */}
          <ThemeToggle collapsed={collapsed} />

          {/* User Workspace Status & Logout */}
          <div
            className={`flex items-center justify-between p-2 rounded-xl dark:bg-white/[0.03] light:bg-zinc-100/80 border dark:border-white/[0.06] light:border-zinc-200 ${
              collapsed ? "flex-col gap-2" : ""
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="relative shrink-0">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-400 flex items-center justify-center text-xs font-bold uppercase">
                  {user.username.slice(0, 1)}
                </div>
                {/* Online Pulse Dot */}
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-black" />
              </div>

              {!collapsed && (
                <div className="overflow-hidden leading-tight">
                  <p className="text-xs font-semibold truncate dark:text-zinc-200 light:text-zinc-800">
                    {user.username}
                  </p>
                  <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-400" />
                    Online • Turso Cloud
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => logoutAction()}
              title="Kunci / Logout Sesi"
              className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar Header */}
        <header className="sticky top-0 z-20 border-b dark:border-white/[0.06] dark:bg-[#080b12]/80 light:border-zinc-200/80 light:bg-white/80 aurora-glass px-4 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl border dark:border-white/10 light:border-zinc-200 text-zinc-400 cursor-pointer"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  SHRIMPHUB /
                </span>
                <h1 className="text-sm font-bold tracking-tight text-white light:text-zinc-900">
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
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {children}
        </main>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 h-full bg-[#0a0d17] p-5 flex flex-col justify-between border-r border-white/10 z-10 shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center">
                    <ShrimpHubLogo className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm text-white">ShrimpHub OS</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-zinc-400 p-1.5 rounded-lg hover:bg-white/10"
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
                        ? "bg-white/15 text-white font-semibold"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <ThemeToggle />
              <button
                onClick={() => logoutAction()}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-colors cursor-pointer"
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
