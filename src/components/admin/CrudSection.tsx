import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";
import { adminList, adminSave, adminDelete } from "@/lib/admin.functions";
import { AdminButton, AdminCard, AdminHeading, inputCls, labelCls } from "@/components/admin/ui";
import { broadcastSiteDataUpdate } from "@/lib/site-data";

export type FieldType = "text" | "textarea" | "url" | "bool" | "number" | "list" | "image" | "date";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  rows?: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Row = Record<string, any>;

type Props = {
  table: string;
  title: string;
  subtitle?: string;
  fields: Field[];
  titleField: string;
  subtitleField?: string;
  singleton?: boolean;
  pk?: string;
  addLabel?: string;
  defaults?: Row;
};

export function CrudSection({
  table,
  title,
  subtitle,
  fields,
  titleField,
  subtitleField,
  singleton = false,
  pk = "id",
  addLabel = "Add new",
  defaults = {},
}: Props) {
  const list = useServerFn(adminList);
  const save = useServerFn(adminSave);
  const remove = useServerFn(adminDelete);

  const [rows, setRows] = useState<Row[] | null>(null);
  const [draft, setDraft] = useState<Row | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    try {
      const data = (await list({ data: { table } })) as Row[];
      setRows(data);
      if (singleton) setDraft(data[0] ?? { ...defaults });
    } catch {
      setError("Could not load this section.");
      setRows([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, table, singleton]);

  useEffect(() => {
    void load();
  }, [load]);

  const commit = async () => {
    if (!draft) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await save({ data: { table, row: draft } });
      broadcastSiteDataUpdate();
      setNotice("Saved.");
      if (!singleton) setDraft(null);
      await load();
    } catch {
      setError("Save failed. Please check the fields and try again.");
    } finally {
      setBusy(false);
    }
  };

  const destroy = async (id: string) => {
    setBusy(true);
    setError("");
    try {
      await remove({ data: { table, id } });
      broadcastSiteDataUpdate();
      await load();
    } catch {
      setError("Delete failed.");
    } finally {
      setBusy(false);
    }
  };

  const setValue = (name: string, value: unknown) =>
    setDraft((d) => ({ ...(d ?? {}), [name]: value }));

  const editor = draft && (
    <AdminCard className="mt-6">
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-display text-xl text-white">
          {draft[pk] ? "Edit" : "New"} {title.replace(/s$/, "")}
        </h2>
        {!singleton && (
          <button onClick={() => setDraft(null)} className="text-white/50 hover:text-gold">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className={f.type === "textarea" || f.type === "list" ? "sm:col-span-2" : ""}>
            <label className={labelCls}>{f.label}</label>
            {f.type === "textarea" ? (
              <textarea
                rows={f.rows ?? 5}
                className={inputCls}
                value={(draft[f.name] as string) ?? ""}
                onChange={(e) => setValue(f.name, e.target.value)}
              />
            ) : f.type === "list" ? (
              <textarea
                rows={f.rows ?? 4}
                className={inputCls}
                placeholder="One item per line"
                value={Array.isArray(draft[f.name]) ? (draft[f.name] as string[]).join("\n") : ""}
                onChange={(e) =>
                  setValue(
                    f.name,
                    e.target.value.split("\n").map((l) => l.trim()).filter(Boolean),
                  )
                }
              />
            ) : f.type === "bool" ? (
              <button
                onClick={() => setValue(f.name, !draft[f.name])}
                className={`rounded-full px-5 py-2.5 text-xs border transition-colors ${
                  draft[f.name]
                    ? "border-gold bg-gold/15 text-gold"
                    : "border-white/20 text-white/60"
                }`}
              >
                {draft[f.name] ? "Yes" : "No"}
              </button>
            ) : (
              <input
                className={inputCls}
                type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                value={(draft[f.name] as string | number) ?? ""}
                onChange={(e) =>
                  setValue(f.name, f.type === "number" ? Number(e.target.value) : e.target.value)
                }
              />
            )}
            {f.help && <p className="mt-2 text-[11px] text-white/40">{f.help}</p>}
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <AdminButton onClick={() => void commit()} disabled={busy}>
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save changes"}
        </AdminButton>
        {!singleton && (
          <AdminButton variant="ghost" onClick={() => setDraft(null)}>
            Cancel
          </AdminButton>
        )}
      </div>
    </AdminCard>
  );

  return (
    <div>
      <AdminHeading title={title} subtitle={subtitle} />

      {error && <p className="mb-4 text-sm text-red-300">{error}</p>}
      {notice && <p className="mb-4 text-sm text-gold">{notice}</p>}

      {rows === null ? (
        <Loader2 className="h-5 w-5 animate-spin text-gold" />
      ) : singleton ? (
        editor
      ) : (
        <>
          <AdminButton onClick={() => setDraft({ ...defaults })}>
            <Plus className="h-3.5 w-3.5" /> {addLabel}
          </AdminButton>

          <div className="mt-6 grid gap-3">
            {rows.map((r) => (
              <AdminCard key={r[pk] as string} className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-white font-medium truncate">{(r[titleField] as string) || "Untitled"}</div>
                  {subtitleField && (
                    <div className="mt-1 text-xs text-white/50 line-clamp-2">{r[subtitleField] as string}</div>
                  )}
                  {"published" in r && (
                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-[10px] uppercase tracking-widest ${
                        r["published"] ? "bg-gold/15 text-gold" : "bg-white/10 text-white/50"
                      }`}
                    >
                      {r["published"] ? "Published" : "Draft"}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <AdminButton variant="ghost" onClick={() => setDraft(r)}>
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </AdminButton>
                  <AdminButton variant="danger" onClick={() => void destroy(r[pk] as string)} disabled={busy}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </AdminButton>
                </div>
              </AdminCard>
            ))}
            {rows.length === 0 && <p className="text-sm text-white/50">Nothing here yet.</p>}
          </div>

          {editor}
        </>
      )}
    </div>
  );
}
