import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Redo2, Undo2 } from "lucide-react";
import { adminHistory, adminRedo, adminUndo } from "@/lib/admin.functions";

type History = Awaited<ReturnType<typeof adminHistory>>;

/** Undo / redo across every CMS change, backed by the revision history. */
export function HistoryBar() {
  const load = useServerFn(adminHistory);
  const undo = useServerFn(adminUndo);
  const redo = useServerFn(adminRedo);
  const [history, setHistory] = useState<History | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const refresh = useCallback(async () => {
    try {
      setHistory(await load({}));
    } catch {
      setHistory(null);
    }
  }, [load]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const run = async (fn: () => Promise<{ ok: boolean; message: string }>) => {
    setBusy(true);
    try {
      const res = await fn();
      setNotice(res.message);
      await refresh();
      if (res.ok) window.setTimeout(() => window.location.reload(), 600);
    } catch {
      setNotice("Could not apply that change.");
    }
    setBusy(false);
  };

  const last = history?.entries.find((e) => !e.undone);

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <button
        onClick={() => void run(() => undo({}))}
        disabled={busy || !history?.canUndo}
        className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-xs text-white/75 transition hover:text-gold disabled:opacity-35"
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Undo2 className="h-3.5 w-3.5" />} Undo
      </button>
      <button
        onClick={() => void run(() => redo({}))}
        disabled={busy || !history?.canRedo}
        className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-xs text-white/75 transition hover:text-gold disabled:opacity-35"
      >
        <Redo2 className="h-3.5 w-3.5" /> Redo
      </button>
      <span className="text-xs text-white/45">
        {notice || (last ? `Last change: ${last.label} (${last.table})` : "No changes yet.")}
      </span>
    </div>
  );
}
