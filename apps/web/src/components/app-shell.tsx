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
  Sparkles,
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

export function AppShell({ user, children, onQuickExpense, onQuickNote }: AppShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard, color: "text-rose-400" },
    { name: "Keuangan", href: "/finance", icon: Wallet, color: "text-emerald-400" },
    { name: "Jadwal & Timebox", href: "/calendar", icon: Calendar, color: "text-violet-400" },
    { name: "Comic Tracker", href: "/comics", icon: BookOpen, color: "text-amber-400" },
    { name: "Snippet Studio", href: "/snippets", icon: Code2, color: "text-pink-400" },
    { name: "Catatan & To-Do", href: "/notes", icon: FileText, color: "text-sky-400" },
  ];

  return (
    <div className="min-h-screen flex relative overflow-x-hidden selection:bg-pink-500/25">
      {/* Aurora Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 dark:opacity-100 opacity-60 transition-opacity">
        <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-transparent blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tl from-emerald-500/10 via-sky-500/5 to-transparent blur-[140px]" />
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r transition-all duration-300 ease-in-out sticky top-0 h-screen z-30 aurora-glass ${
          collapsed ? "w-20" : "w-64"
        } dark:border-white/10 dark:bg-black/40 light:border-zinc-200/80 light:bg-white/70`}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between border-b dark:border-white/5 light:border-zinc-200/60">
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-emerald-400/20 border dark:border-white/15 light:border-zinc-300 flex items-center justify-center text-xl shrink-0 shadow-sm">
              🦐
            </div>
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="font-bold text-sm tracking-tight flex items-center gap-1.5 dark:text-white light:text-zinc-900">
                  ShrimpHub
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-pink-500/15 text-pink-400 font-mono">
                    v1.0
                  </span>
                </span>
                <span className="text-[10px] text-zinc-400 truncate">
                  {user.username}&apos;s workspace
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-xl border dark:border-white/10 dark:hover:bg-white/10 light:border-zinc-200 light:hover:bg-zinc-100 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            title={collapsed ? "Perluas Sidebar" : "Ciutkan Sidebar"}
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "dark:bg-white/10 dark:text-white light:bg-zinc-900 light:text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-100 dark:hover:bg-white/5 light:hover:bg-zinc-100 light:hover:text-zinc-900"
                } ${collapsed ? "justify-center px-2" : ""}`}
                title={collapsed ? item.name : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${item.color}`} />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t dark:border-white/5 light:border-zinc-200/60 space-y-2">
          {/* Theme Switcher */}
          <ThemeToggle collapsed={collapsed} />

          {/* User & Logout Button */}
          <div
            className={`flex items-center justify-between p-2 rounded-xl dark:bg-white/5 light:bg-zinc-100/80 border dark:border-white/5 light:border-zinc-200 ${
              collapsed ? "flex-col gap-2" : ""
            }`}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center text-xs font-bold uppercase shrink-0">
                {user.username.slice(0, 1)}
              </div>
              {!collapsed && (
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold truncate dark:text-zinc-200 light:text-zinc-800">
                    {user.username}
                  </p>
                  <p className="text-[10px] text-zinc-500">Online</p>
                </div>
              )}
            </div>

            <button
              onClick={() => logoutAction()}
              title="Kunci / Logout Sesi"
              className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-20 border-b dark:border-white/10 dark:bg-black/30 light:border-zinc-200/80 light:bg-white/70 aurora-glass px-4 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl border dark:border-white/10 light:border-zinc-200 text-zinc-400 cursor-pointer"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <div>
              <h2 className="text-sm font-bold tracking-tight dark:text-white light:text-zinc-900 capitalize">
                {pathname === "/" ? "Dashboard Hub" : pathname.replace("/", "")}
              </h2>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Personal Life & Work Operating System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CommandMenu onQuickExpense={onQuickExpense} onQuickNote={onQuickNote} />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 h-full bg-[#121217] p-4 flex flex-col justify-between border-r border-white/10 z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <span className="font-bold text-sm text-white flex items-center gap-2">
                  🦐 ShrimpHub
                </span>
                <button onClick={() => setMobileOpen(false)} className="text-zinc-400 p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium ${
                      pathname === item.href
                        ? "bg-white/15 text-white"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <ThemeToggle />
              <button
                onClick={() => logoutAction()}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs text-rose-400 bg-rose-500/10 rounded-xl"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
