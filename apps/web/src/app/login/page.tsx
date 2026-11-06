"use client";

import { useActionState, useState } from "react";
import { loginAction } from "@/actions/auth-actions";
import { User, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, UserPlus } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [showSecret, setShowSecret] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#09090b] text-[#fafafa] overflow-hidden selection:bg-emerald-500/30">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Card */}
      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#121217]/80 backdrop-blur-xl p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-emerald-400/10 border border-emerald-500/30 flex items-center justify-center mb-4 text-2xl shadow-inner">
            🦐
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            ShrimpHub
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              v1.0
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Masuk ke personal operating hub milikmu
          </p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1 bg-white/5 border border-white/5 rounded-xl mb-6 text-xs">
          <span className="py-1.5 text-center font-medium bg-emerald-500/20 text-emerald-300 rounded-lg shadow-sm">
            Masuk (Login)
          </span>
          <Link
            href="/register"
            className="py-1.5 text-center font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Daftar (Register)
          </Link>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Username</label>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-zinc-500 pointer-events-none">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="username"
                required
                autoFocus
                placeholder="Username akunmu..."
                className="w-full pl-9 pr-3 py-2.5 bg-zinc-900/80 border border-white/10 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-zinc-300">Password / PIN</label>
              <span className="text-[10px] text-zinc-500">Mendukung PIN</span>
            </div>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-zinc-500 pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showSecret ? "text" : "password"}
                name="password"
                required
                placeholder="Masukkan password atau PIN..."
                className="w-full pl-9 pr-10 py-2.5 bg-zinc-900/80 border border-white/10 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-3 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                aria-label="Toggle password visibility"
              >
                {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {state?.error && (
            <div className="p-3 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl animate-in fade-in duration-200">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none text-white text-sm font-medium rounded-xl shadow-lg shadow-emerald-900/30 transition-all duration-150 cursor-pointer mt-2"
          >
            {isPending ? (
              <span className="inline-block animate-pulse">Memverifikasi...</span>
            ) : (
              <>
                <span>Masuk ke ShrimpHub</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-white/5 flex flex-col items-center gap-2 text-center text-[11px] text-zinc-500">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sesi diperbarui otomatis selama aktif</span>
          </div>
          <span className="text-[10px] text-zinc-600">
            Reset otomatis jika tidak ada aktivitas selama 7 hari
          </span>
        </div>
      </div>
    </div>
  );
}
