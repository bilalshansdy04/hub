"use client";

import { useState } from "react";
import { AppShell } from "./app-shell";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Plus,
  Trash2,
  TrendingUp,
  CreditCard,
  Banknote,
  Smartphone,
  Sparkles,
  ArrowRightLeft,
} from "lucide-react";
import { formatIDR } from "@shrimphub/core-logic";
import {
  addQuickTransactionAction,
  deleteTransactionAction,
  addWalletAction,
} from "@/actions/finance-actions";
import { toast } from "sonner";

interface FinanceClientProps {
  user: { username: string };
  finance: {
    wallets: any[];
    recentTransactions: any[];
    categories: any[];
    totalBalance: number;
  };
}

export function FinanceClient({ user, finance }: FinanceClientProps) {
  const [filterType, setFilterType] = useState<"all" | "expense" | "income">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWallet, setSelectedWallet] = useState<string>("all");
  const [quickInput, setQuickInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddWalletModal, setShowAddWalletModal] = useState(false);
  const [newWalletName, setNewWalletName] = useState("");
  const [newWalletType, setNewWalletType] = useState<"cash" | "bank" | "ewallet">("bank");
  const [newWalletBalance, setNewWalletBalance] = useState("");

  const filteredTransactions = finance.recentTransactions.filter((tx) => {
    if (filterType !== "all" && tx.type !== filterType) return false;
    if (selectedWallet !== "all" && tx.walletId !== selectedWallet) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (tx.note || "").toLowerCase().includes(q);
    }
    return true;
  });

  const totalExpense = finance.recentTransactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalIncome = finance.recentTransactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;

    setIsSubmitting(true);
    try {
      const targetWId = selectedWallet !== "all" ? selectedWallet : undefined;
      const res = await addQuickTransactionAction(quickInput, targetWId);
      if (res.success && res.parsed) {
        toast.success(`Tercatat: ${formatIDR(res.parsed.amount)} (${res.parsed.note})`);
        setQuickInput("");
      } else {
        toast.error(res.error || "Gagal mencatat transaksi.");
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTx = async (txId: string) => {
    if (!confirm("Hapus transaksi ini? Saldo dompet akan disesuaikan kembali.")) return;
    try {
      const res = await deleteTransactionAction(txId);
      if (res.success) {
        toast.success("Transaksi berhasil dihapus.");
      } else {
        toast.error(res.error || "Gagal menghapus.");
      }
    } catch {
      toast.error("Gagal menghapus transaksi.");
    }
  };

  const handleCreateWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWalletName.trim()) return;

    try {
      const bal = parseFloat(newWalletBalance) || 0;
      const res = await addWalletAction(newWalletName, newWalletType, bal);
      if (res.success) {
        toast.success("Dompet baru berhasil ditambahkan!");
        setShowAddWalletModal(false);
        setNewWalletName("");
        setNewWalletBalance("");
      } else {
        toast.error(res.error || "Gagal menambahkan dompet.");
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    }
  };

  const getWalletIcon = (type: string) => {
    switch (type) {
      case "bank":
        return <CreditCard className="w-4 h-4 text-sky-400" />;
      case "ewallet":
        return <Smartphone className="w-4 h-4 text-violet-400" />;
      default:
        return <Banknote className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        {/* Top Summary Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="aurora-glass aurora-card-interactive rounded-2xl p-5 border dark:border-white/[0.08] light:border-zinc-200">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
              <span className="flex items-center gap-1.5 font-medium">
                <Wallet className="w-4 h-4 text-emerald-400" />
                Total Kekayaan Bersih
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/25">
                Real-Time
              </span>
            </div>
            <div className="text-3xl font-bold font-mono tracking-tight text-white light:text-zinc-900">
              {formatIDR(finance.totalBalance)}
            </div>
            <div className="text-[11px] text-zinc-400 mt-2">
              Akumulasi dari {finance.wallets.length} dompet aktif
            </div>
          </div>

          <div className="aurora-glass aurora-card-interactive rounded-2xl p-5 border dark:border-white/[0.08] light:border-zinc-200">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
              <span className="flex items-center gap-1.5 font-medium">
                <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                Pemasukan Tercatat
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">+IDR</span>
            </div>
            <div className="text-3xl font-bold font-mono tracking-tight text-emerald-400">
              {formatIDR(totalIncome)}
            </div>
            <div className="text-[11px] text-zinc-400 mt-2">Arus kas masuk bulan ini</div>
          </div>

          <div className="aurora-glass aurora-card-interactive rounded-2xl p-5 border dark:border-white/[0.08] light:border-zinc-200">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
              <span className="flex items-center gap-1.5 font-medium">
                <ArrowUpRight className="w-4 h-4 text-rose-400" />
                Pengeluaran Tercatat
              </span>
              <span className="text-[10px] font-mono text-rose-400 font-bold">-IDR</span>
            </div>
            <div className="text-3xl font-bold font-mono tracking-tight text-rose-400">
              {formatIDR(totalExpense)}
            </div>
            <div className="text-[11px] text-zinc-400 mt-2">Arus kas keluar tercatat</div>
          </div>
        </div>

        {/* Digital Wallets Cards Grid (Luxury FinTech Cards) */}
        <div className="aurora-glass rounded-2xl p-6 border dark:border-white/[0.08] light:border-zinc-200">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold tracking-tight text-white light:text-zinc-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-sky-400" />
                Akun & Rekening Dompet
              </h3>
              <p className="text-xs text-zinc-400">Pilih dompet untuk memfilter transaksi</p>
            </div>
            <button
              onClick={() => setShowAddWalletModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-pink-500/15 text-pink-400 hover:bg-pink-500/25 text-xs font-semibold border border-pink-500/30 transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Dompet</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* All Wallets Card */}
            <div
              onClick={() => setSelectedWallet("all")}
              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                selectedWallet === "all"
                  ? "bg-gradient-to-br from-pink-500/20 via-purple-600/15 to-transparent border-pink-500/50 shadow-lg"
                  : "dark:bg-white/[0.03] light:bg-zinc-100/70 dark:border-white/[0.05] light:border-zinc-200 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-4">
                <span className="font-semibold text-zinc-300 light:text-zinc-700">Semua Saldo</span>
                <Wallet className="w-4 h-4 text-pink-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-mono text-zinc-400">Total Gabungan</p>
                <p className="text-lg font-bold font-mono text-white light:text-zinc-900">
                  {formatIDR(finance.totalBalance)}
                </p>
              </div>
            </div>

            {/* Individual Wallets */}
            {finance.wallets.map((w) => (
              <div
                key={w.id}
                onClick={() => setSelectedWallet(w.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                  selectedWallet === w.id
                    ? "bg-gradient-to-br from-white/15 via-white/5 to-transparent border-pink-500/50 shadow-lg"
                    : "dark:bg-white/[0.03] light:bg-zinc-100/70 dark:border-white/[0.05] light:border-zinc-200 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-4">
                  <span className="font-semibold text-white light:text-zinc-900 truncate">
                    {w.name}
                  </span>
                  {getWalletIcon(w.type)}
                </div>
                <div>
                  <p className="text-[10px] uppercase font-mono text-zinc-400">{w.type}</p>
                  <p className="text-lg font-bold font-mono text-white light:text-zinc-900">
                    {formatIDR(w.balance)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Natural Language Transaction Form */}
        <div className="aurora-glass rounded-2xl p-6 border dark:border-white/[0.08] light:border-zinc-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-zinc-300 light:text-zinc-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              Catat Cepat Natural Language
            </span>
            <span className="text-[10px] text-zinc-400 hidden sm:inline-block">
              Contoh: <code className="text-pink-400">makan siang 35rb #kuliner</code> atau{" "}
              <code className="text-emerald-400">transfer 200rb</code>
            </span>
          </div>

          <form onSubmit={handleQuickSubmit} className="flex gap-2">
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="Ketik pengeluaran / pemasukan... (cth: beli token listrik 100rb)"
              className="flex-1 glass-input px-4 py-2.5 rounded-xl text-xs placeholder:text-zinc-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSubmitting || !quickInput.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-pink-500/25 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Mencatat..." : "Simpan Transaksi"}
            </button>
          </form>
        </div>

        {/* Transaction History & Filter Table */}
        <div className="aurora-glass rounded-2xl p-6 border dark:border-white/[0.08] light:border-zinc-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
            <div>
              <h3 className="text-sm font-bold tracking-tight text-white light:text-zinc-900">
                Riwayat Transaksi Lengkap
              </h3>
              <p className="text-xs text-zinc-400">
                Menampilkan {filteredTransactions.length} transaksi
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Type Filter */}
              <div className="flex rounded-xl p-1 bg-black/20 dark:bg-white/[0.04] light:bg-zinc-200 border dark:border-white/[0.05] light:border-zinc-300">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    filterType === "all"
                      ? "bg-white/20 text-white shadow-sm font-semibold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setFilterType("expense")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    filterType === "expense"
                      ? "bg-rose-500/20 text-rose-400 shadow-sm font-semibold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Pengeluaran
                </button>
                <button
                  onClick={() => setFilterType("income")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    filterType === "income"
                      ? "bg-emerald-500/20 text-emerald-400 shadow-sm font-semibold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Pemasukan
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 sm:w-52">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari transaksi..."
                  className="w-full glass-input pl-8 pr-3 py-1.5 rounded-xl text-xs placeholder:text-zinc-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Transaction List */}
          {filteredTransactions.length === 0 ? (
            <div className="py-16 text-center text-zinc-500 text-xs">
              Belum ada transaksi yang sesuai kriteria pencarian.
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTransactions.map((tx) => {
                const isExpense = tx.type === "expense";
                const wallet = finance.wallets.find((w) => w.id === tx.walletId);
                const dateStr = new Date(tx.date).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3.5 rounded-xl dark:bg-white/[0.03] light:bg-zinc-100/70 border dark:border-white/[0.04] light:border-zinc-200 hover:border-pink-500/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isExpense ? "bg-rose-500/15 text-rose-400" : "bg-emerald-500/15 text-emerald-400"
                        }`}
                      >
                        {isExpense ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownLeft className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white light:text-zinc-900">
                          {tx.note || "Transaksi Tanpa Catatan"}
                        </div>
                        <div className="text-[10px] text-zinc-400 flex items-center gap-2 mt-0.5">
                          <span>{dateStr}</span>
                          <span>•</span>
                          <span className="text-zinc-300 light:text-zinc-600 font-medium">
                            {wallet?.name || "Dompet"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-bold font-mono ${
                          isExpense ? "text-rose-400" : "text-emerald-400"
                        }`}
                      >
                        {isExpense ? "-" : "+"}
                        {formatIDR(tx.amount)}
                      </span>

                      <button
                        onClick={() => handleDeleteTx(tx.id)}
                        title="Hapus Transaksi"
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal Tambah Dompet */}
      {showAddWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setShowAddWalletModal(false)}
          />
          <div className="relative w-full max-w-sm aurora-glass rounded-2xl p-6 border dark:border-white/10 light:border-zinc-200 z-10 shadow-2xl">
            <h3 className="text-sm font-bold text-white light:text-zinc-900 mb-1">
              Tambah Dompet Baru
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Buat wadah rekening bank, e-wallet, atau kas fisik
            </p>

            <form onSubmit={handleCreateWallet} className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-zinc-300 light:text-zinc-700 mb-1 block">
                  Nama Dompet
                </label>
                <input
                  type="text"
                  required
                  value={newWalletName}
                  onChange={(e) => setNewWalletName(e.target.value)}
                  placeholder="Contoh: Bank BCA, GoPay, Dompet Saku"
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-zinc-300 light:text-zinc-700 mb-1 block">
                  Tipe Dompet
                </label>
                <select
                  value={newWalletType}
                  onChange={(e) => setNewWalletType(e.target.value as any)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs focus:outline-none"
                >
                  <option value="bank">Rekening Bank</option>
                  <option value="ewallet">E-Wallet (GoPay, OVO, ShopeePay)</option>
                  <option value="cash">Tunai / Dompet Fisik</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-zinc-300 light:text-zinc-700 mb-1 block">
                  Saldo Awal (IDR)
                </label>
                <input
                  type="number"
                  value={newWalletBalance}
                  onChange={(e) => setNewWalletBalance(e.target.value)}
                  placeholder="0"
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddWalletModal(false)}
                  className="flex-1 py-2 text-xs rounded-xl border dark:border-white/10 light:border-zinc-200 text-zinc-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold rounded-xl bg-pink-500 hover:bg-pink-600 text-white transition-all shadow-md shadow-pink-500/20"
                >
                  Simpan Dompet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
