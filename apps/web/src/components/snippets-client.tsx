"use client";

import { useState } from "react";
import { AppShell } from "./app-shell";
import {
  Code2,
  Copy,
  Check,
  Save,
  Trash2,
  Sparkles,
  Sliders,
  Palette,
  Terminal,
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
  { id: "oled", name: "Deep OLED", bg: "bg-gradient-to-tr from-zinc-900 via-black to-zinc-950 border border-white/10" },
  { id: "ocean", name: "Nordic Ocean", bg: "bg-gradient-to-tr from-blue-600 via-indigo-700 to-slate-900" },
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
        padding,
      });

      if (res.success) {
        toast.success("Snippet berhasil disimpan ke database! 💾");
        setLocalSnippets((prev) => [
          {
            id: res.id,
            title,
            language,
            code,
            theme: theme.id,
            padding,
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
    setPadding(snip.padding || 32);
    toast.info(`Memuat snippet: ${snip.title}`);
  };

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white light:text-zinc-900 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-pink-400" />
              Snippet & Card Studio
            </h2>
            <p className="text-xs text-zinc-400">
              Ray.so style code beautifier untuk dokumentasi, snippet cepat, dan portfolio
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl dark:bg-white/10 light:bg-zinc-100 hover:bg-white/15 text-xs font-semibold text-zinc-200 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Tersalin!" : "Salin Kode"}</span>
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-pink-500/20 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Menyimpan..." : "Simpan Snippet"}</span>
            </button>
          </div>
        </div>

        {/* Studio Controls Row */}
        <div className="aurora-glass rounded-2xl p-4 border dark:border-white/10 light:border-zinc-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-[11px] font-medium text-zinc-300 light:text-zinc-700 mb-1 block">
              Nama File / Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl text-xs dark:bg-white/5 light:bg-zinc-100 border dark:border-white/10 light:border-zinc-200 text-white light:text-zinc-900 focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-zinc-300 light:text-zinc-700 mb-1 block">
              Bahasa Kode
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl text-xs dark:bg-[#18181b] light:bg-white border dark:border-white/10 light:border-zinc-200 text-white light:text-zinc-900 focus:outline-none focus:border-pink-500"
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
            <label className="text-[11px] font-medium text-zinc-300 light:text-zinc-700 mb-1 block">
              Gradient Background
            </label>
            <select
              value={theme.id}
              onChange={(e) => {
                const found = THEMES.find((t) => t.id === e.target.value);
                if (found) setTheme(found);
              }}
              className="w-full px-3 py-1.5 rounded-xl text-xs dark:bg-[#18181b] light:bg-white border dark:border-white/10 light:border-zinc-200 text-white light:text-zinc-900 focus:outline-none focus:border-pink-500"
            >
              {THEMES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-medium text-zinc-300 light:text-zinc-700 mb-1 block">
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
                      ? "bg-pink-500/20 text-pink-400 border-pink-500/40"
                      : "dark:bg-white/5 light:bg-zinc-100 border-transparent text-zinc-400"
                  }`}
                >
                  {pad}px
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Card Preview Area */}
        <div
          className={`rounded-3xl transition-all duration-300 flex items-center justify-center overflow-x-auto shadow-2xl ${theme.bg}`}
          style={{ padding: `${padding}px` }}
        >
          {/* Mac OS Window Card */}
          <div className="w-full max-w-2xl rounded-2xl bg-[#090d16]/90 backdrop-blur-2xl border border-white/15 shadow-2xl overflow-hidden">
            {/* Window Title Bar */}
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[11px] font-mono font-medium text-zinc-400">
                {title || "snippet.ts"}
              </span>
              <span className="text-[10px] text-zinc-500 uppercase font-mono">{language}</span>
            </div>

            {/* Code Editor */}
            <div className="p-4">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={10}
                spellCheck={false}
                placeholder="// Masukkan kode Anda di sini..."
                className="w-full bg-transparent font-mono text-xs text-pink-200/90 leading-relaxed resize-none focus:outline-none selection:bg-pink-500/30"
              />
            </div>
          </div>
        </div>

        {/* Saved Snippets List */}
        <div className="aurora-glass rounded-2xl p-6 border dark:border-white/10 light:border-zinc-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold tracking-tight dark:text-white light:text-zinc-900">
                Daftar Snippet Tersimpan
              </h3>
              <p className="text-xs text-zinc-400">
                Klik salah satu untuk memuat kembali ke studio
              </p>
            </div>
          </div>

          {localSnippets.length === 0 ? (
            <div className="py-10 text-center text-zinc-400 text-xs">
              Belum ada snippet tersimpan di database.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {localSnippets.map((snip) => (
                <div
                  key={snip.id}
                  className="p-3.5 rounded-xl dark:bg-white/5 light:bg-zinc-100/70 border dark:border-white/5 light:border-zinc-200 hover:border-pink-500/30 transition-all group flex flex-col justify-between"
                >
                  <div
                    onClick={() => handleLoadSnippet(snip)}
                    className="cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white light:text-zinc-900 truncate">
                        {snip.title}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-pink-300">
                        {snip.language}
                      </span>
                    </div>
                    <pre className="text-[10px] text-zinc-400 font-mono line-clamp-3 overflow-hidden bg-black/30 p-2 rounded-lg">
                      {snip.code}
                    </pre>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t dark:border-white/5 light:border-zinc-200/60 mt-2">
                    <span className="text-[10px] text-zinc-500">
                      {new Date(snip.createdAt).toLocaleDateString("id-ID")}
                    </span>
                    <button
                      onClick={() => handleDelete(snip.id)}
                      className="p-1 rounded text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
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
