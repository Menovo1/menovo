import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { adminList, adminSave } from "@/lib/admin.functions";
import { AdminButton, AdminCard, inputCls, labelCls } from "@/components/admin/ui";
import { CMS_DEFAULTS, type CmsGroup } from "@/content/cms";
import { broadcastSiteDataUpdate } from "@/lib/site-data";

type Block = { key: string; value: Record<string, unknown> };
type Blocks = Record<string, Record<string, unknown>>;

/** Renders CMS groups with the live value pre-filled (never blank). */
export function CmsEditor({ groups }: { groups: CmsGroup[] }) {
  const list = useServerFn(adminList);
  const save = useServerFn(adminSave);
  const [blocks, setBlocks] = useState<Blocks | null>(null);
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const rows = (await list({ data: { table: "site_content" } })) as unknown as Block[];
    const stored: Blocks = {};
    for (const r of rows) stored[r.key] = (r.value ?? {}) as Record<string, unknown>;

    const merged: Blocks = {};
    for (const g of groups) {
      const defaults = CMS_DEFAULTS[g.key] ?? {};
      const current = stored[g.key] ?? {};
      const out: Record<string, unknown> = {};
      for (const f of g.fields) {
        const v = current[f.name];
        const isEmpty =
          v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);
        out[f.name] = isEmpty ? (defaults[f.name] ?? (f.type === "list" || f.type === "pairs" ? [] : "")) : v;
      }
      merged[g.key] = out;
    }
    setBlocks(merged);
  }, [list, groups]);

  useEffect(() => {
    void load().catch((e) => {
      setError(e instanceof Error ? e.message : "Could not load content.");
      setBlocks({});
    });
  }, [load]);

  const setField = (group: string, name: string, value: unknown) =>
    setBlocks((b) => ({ ...(b ?? {}), [group]: { ...((b ?? {})[group] ?? {}), [name]: value } }));

  const commit = async (group: string) => {
    setBusy(group);
    setNotice("");
    setError("");
    try {
      await save({
        data: { table: "site_content", row: { key: group, value: (blocks ?? {})[group] ?? {} } },
      });
      broadcastSiteDataUpdate();
      setNotice("Saved — the website is updated.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save.");
    }
    setBusy("");
  };

  if (!blocks) return <Loader2 className="h-5 w-5 animate-spin text-gold" />;

  return (
    <>
      {notice && <p className="mb-4 text-sm text-gold">{notice}</p>}
      {error && <p className="mb-4 text-sm text-red-300">{error}</p>}
      <div className="space-y-5">
        {groups.map((g) => (
          <AdminCard key={g.key}>
            <h2 className="font-display text-xl text-white">{g.label}</h2>
            {g.description && <p className="mt-1 text-xs text-white/50">{g.description}</p>}
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {g.fields.map((f) => {
                const raw = (blocks[g.key] ?? {})[f.name];
                const wide = f.type === "textarea" || f.type === "list" || f.type === "pairs";
                return (
                  <div key={f.name} className={wide ? "sm:col-span-2" : ""}>
                    <label className={labelCls}>{f.label}</label>
                    {f.type === "list" || f.type === "pairs" ? (
                      <textarea
                        rows={f.type === "pairs" ? 6 : 4}
                        placeholder={f.type === "pairs" ? "Title | Description (one per line)" : "One item per line"}
                        className={inputCls}
                        value={Array.isArray(raw) ? (raw as string[]).join("\n") : ""}
                        onChange={(e) =>
                          setField(
                            g.key,
                            f.name,
                            e.target.value.split("\n").map((l) => l.trimStart()).filter((l) => l.trim() !== ""),
                          )
                        }
                      />
                    ) : f.type === "textarea" ? (
                      <textarea
                        rows={3}
                        className={inputCls}
                        value={(raw as string) ?? ""}
                        onChange={(e) => setField(g.key, f.name, e.target.value)}
                      />
                    ) : (
                      <input
                        className={inputCls}
                        value={(raw as string) ?? ""}
                        onChange={(e) => setField(g.key, f.name, e.target.value)}
                      />
                    )}
                    {f.help && <p className="mt-1 text-[11px] text-white/40">{f.help}</p>}
                  </div>
                );
              })}
            </div>
            <AdminButton className="mt-6" disabled={busy === g.key} onClick={() => void commit(g.key)}>
              {busy === g.key ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : `Save ${g.label}`}
            </AdminButton>
          </AdminCard>
        ))}
      </div>
    </>
  );
}
