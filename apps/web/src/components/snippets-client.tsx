"use client";

import { useState } from "react";
import { AppShell } from "./app-shell";
import {
  Code2,
  Copy,
  Check,
  Save,
  Trash2,
} from "lucide-react";
import { saveSnippetAction, deleteSnippetAction } from "@/actions/snippet-actions";
import { toast } from "sonner";

interface SnippetsClientProps {
  user: { username: string };
  snippetsList: any[];
}

const THEMES = [
  { id: "aurora", name: "Aurora Neon", bg: "bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-500" },
  { id: "emerald", name: "Cyber Emerald", bg: "bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-700" },
  { id: "sunset", name: "Solar Sunset", bg: "bg-gradient-to-tr from-amber-500 via-rose-600 to-pink-600" },
  { id: "oled", name: "Deep OLED", bg: "bg-gradient-to-tr from-zinc-950 via-zinc-900 to-black border border-white/10" },
  { id: "ocean", name: "Nordic Ocean", bg: "bg-gradient-to-tr from-blue-600 via-indigo-700 to-slate-950" },
];

export function SnippetsClient({ user, snippetsList }: SnippetsClientProps) {
  const [title, setTitle] = useState("api-handler.ts");
  const [language, setLanguage] = useState("typescript");
  const [code, setCode] = useState(
    `export async function GET(req: Request) {\n  const session = await validateSession();\n  if (!session) return new Response("Unauthorized", { status: 401 });\n  \n  return Response.json({ success: true, timestamp: Date.now() });\n}`
  );
  const [theme, setTheme] = useState(THEMES[0]);
  const [padding, setPadding] = useState(32);
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [localSnippets, setLocalSnippets] = useState(snippetsList);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Kode berhasil disalin ke clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!code.trim()) return;
    setIsSaving(true);
    try {
      const res = await saveSnippetAction({
        title,
        language,
        code,
        theme: theme.id,
      });

      if (res.success) {
        toast.success("Snippet berhasil disimpan ke database!");
        setLocalSnippets((prev) => [
          {
            id: res.id,
            title,
            language,
            code,
            theme: theme.id,
            createdAt: new Date(),
          },
          ...prev,
        ]);
      } else {
        toast.error("Gagal menyimpan snippet.");
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus snippet ini?")) return;
    try {
      const res = await deleteSnippetAction(id);
      if (res.success) {
        setLocalSnippets((prev) => prev.filter((s) => s.id !== id));
        toast.success("Snippet berhasil dihapus.");
      }
    } catch {
      toast.error("Gagal menghapus.");
    }
  };

  const handleLoadSnippet = (snip: any) => {
    setTitle(snip.title);
    setLanguage(snip.language);
    setCode(snip.code);
    const foundTheme = THEMES.find((t) => t.id === snip.theme) || THEMES[0];
    setTheme(foundTheme);
    toast.info(`Memuat snippet: ${snip.title}`);
  };

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-pink-500 dark:text-pink-400" />
              Snippet & Card Studio
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Ray.so style code beautifier untuk screenshot presentasi dan dokumentasi
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-white/[0.05] hover:bg-zinc-200 dark:hover:bg-white/10 text-xs font-semibold text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-white/[0.08] transition-all cursor-pointer shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Tersalin!" : "Salin Kode"}</span>
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Menyimpan..." : "Simpan Snippet"}</span>
            </button>
          </div>
        </div>

        {/* Studio Controls Row (Ray.so style) */}
        <div className="bg-white dark:bg-[#0e121b]/80 rounded-2xl p-4 border border-zinc-200 dark:border-white/[0.08] shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 mb-1 block">
              Nama File
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl text-xs bg-zinc-50 dark:bg-[#07090e] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 mb-1 block">
              Bahasa Kode
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl text-xs bg-zinc-50 dark:bg-[#07090e] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:border-pink-500"
            >
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="sql">SQL / Drizzle</option>
              <option value="json">JSON</option>
              <option value="html">HTML / CSS</option>
              <option value="bash">Shell / Bash</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 mb-1 block">
              Canvas Background
            </label>
            <select
              value={theme.id}
              onChange={(e) => {
                const found = THEMES.find((t) => t.id === e.target.value);
                if (found) setTheme(found);
              }}
              className="w-full px-3 py-1.5 rounded-xl text-xs bg-zinc-50 dark:bg-[#07090e] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:border-pink-500"
            >
              {THEMES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 mb-1 block">
              Padding Frame ({padding}px)
            </label>
            <div className="flex gap-2">
              {[16, 32, 48].map((pad) => (
                <button
                  key={pad}
                  type="button"
                  onClick={() => setPadding(pad)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    padding === pad
                      ? "bg-pink-50 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 border-pink-500/40"
                      : "bg-zinc-50 dark:bg-white/[0.04] border-zinc-200 dark:border-white/5 text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {pad}px
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Card Preview Canvas (Ray.so Mac Frame) */}
        <div
          className={`rounded-3xl transition-all duration-300 flex items-center justify-center overflow-x-auto shadow-2xl ${theme.bg}`}
          style={{ padding: `${padding}px` }}
        >
          {/* macOS Window Frame Card */}
          <div className="w-full max-w-2xl rounded-2xl bg-[#090d16]/95 backdrop-blur-2xl border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Window Header */}
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500 ring-1 ring-rose-600/30" />
                <div className="w-3 h-3 rounded-full bg-amber-500 ring-1 ring-amber-600/30" />
                <div className="w-3 h-3 rounded-full bg-emerald-500 ring-1 ring-emerald-600/30" />
              </div>
              <span className="text-[11px] font-mono font-medium text-zinc-400">
                {title || "snippet.ts"}
              </span>
              <span className="text-[10px] text-zinc-500 uppercase font-mono">{language}</span>
            </div>

            {/* Code Input Area */}
            <div className="p-4 sm:p-5">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={10}
                spellCheck={false}
                placeholder="// Masukkan kode Anda di sini..."
                className="w-full bg-transparent font-mono text-xs text-pink-200 leading-relaxed resize-none focus:outline-none selection:bg-pink-500/30"
              />
            </div>
          </div>
        </div>

        {/* Saved Snippets List */}
        <div className="bg-white dark:bg-[#0e121b]/80 rounded-2xl p-6 border border-zinc-200 dark:border-white/[0.08] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white">
                Daftar Snippet Tersimpan
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Klik kartu untuk memuat ulang ke studio
              </p>
            </div>
          </div>

          {localSnippets.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 dark:text-zinc-500 text-xs">
              Belum ada snippet tersimpan di database.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {localSnippets.map((snip) => (
                <div
                  key={snip.id}
                  className="p-3.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.04] hover:border-pink-500/30 transition-all group flex flex-col justify-between"
                >
                  <div
                    onClick={() => handleLoadSnippet(snip)}
                    className="cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                        {snip.title}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-white/10 text-pink-600 dark:text-pink-300 font-semibold">
                        {snip.language}
                      </span>
                    </div>
                    <pre className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono line-clamp-3 overflow-hidden bg-zinc-100 dark:bg-black/40 p-2.5 rounded-lg border border-zinc-200 dark:border-white/5">
                      {snip.code}
                    </pre>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-white/[0.05] mt-2">
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                      {new Date(snip.createdAt).toLocaleDateString("id-ID")}
                    </span>
                    <button
                      onClick={() => handleDelete(snip.id)}
                      className="p-1 rounded text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
