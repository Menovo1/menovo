import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { adminList, adminSave } from "@/lib/admin.functions";
import { AdminButton, AdminCard, AdminHeading, inputCls, labelCls } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/website")({ component: Page });

type Block = { key: string; value: Record<string, unknown> };

const GROUPS: { key: string; label: string; fields: { name: string; label: string; area?: boolean; list?: boolean }[] }[] = [
  {
    key: "home",
    label: "Home page",
    fields: [
      { name: "heroHeadline", label: "Hero headline" },
      { name: "heroAnimated", label: "Hero animated words", list: true },
      { name: "heroVideoUrl", label: "Hero video URL" },
      { name: "problemTitle", label: "Problem title" },
      { name: "problemBody", label: "Problem text", area: true },
      { name: "solutionTitle", label: "Solution title" },
      { name: "solutionBody", label: "Solution text", area: true },
      { name: "ctaTitle", label: "CTA title" },
      { name: "ctaBody", label: "CTA text", area: true },
      { name: "mission", label: "Mission", area: true },
      { name: "vision", label: "Vision", area: true },
      { name: "values", label: "Values", list: true },
      { name: "whyMenovo", label: "Why MENOVO", list: true },
    ],
  },
  {
    key: "about",
    label: "About page",
    fields: [
      { name: "body", label: "Intro text", area: true },
      { name: "mission", label: "Mission", area: true },
      { name: "vision", label: "Vision", area: true },
      { name: "values", label: "Values", list: true },
      { name: "founderButtonText", label: "Founder button text" },
    ],
  },
  {
    key: "footer",
    label: "Footer",
    fields: [
      { name: "description", label: "Description", area: true },
      { name: "contact", label: "Contact line" },
      { name: "note", label: "Small note" },
    ],
  },
];

function Page() {
  const list = useServerFn(adminList);
  const save = useServerFn(adminSave);
  const [blocks, setBlocks] = useState<Record<string, Record<string, unknown>> | null>(null);
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    const rows = (await list({ data: { table: "site_content" } })) as unknown as Block[];
    const map: Record<string, Record<string, unknown>> = {};
    for (const r of rows) map[r.key] = (r.value ?? {}) as Record<string, unknown>;
    setBlocks(map);
  }, [list]);

  useEffect(() => {
    void load().catch(() => setBlocks({}));
  }, [load]);

  const setField = (group: string, name: string, value: unknown) =>
    setBlocks((b) => ({ ...(b ?? {}), [group]: { ...((b ?? {})[group] ?? {}), [name]: value } }));

  const commit = async (group: string) => {
    setBusy(group);
    setNotice("");
    await save({ data: { table: "site_content", row: { key: group, value: (blocks ?? {})[group] ?? {} } } });
    setNotice("Saved. Refresh the website to see the change.");
    setBusy("");
  };

  if (!blocks) return <Loader2 className="h-5 w-5 animate-spin text-gold" />;

  return (
    <div>
      <AdminHeading
        title="Website content"
        subtitle="Leave a field empty to keep the original MENOVO wording."
      />
      {notice && <p className="mb-4 text-sm text-gold">{notice}</p>}
      <div className="space-y-5">
        {GROUPS.map((g) => (
          <AdminCard key={g.key}>
            <h2 className="font-display text-xl text-white">{g.label}</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {g.fields.map((f) => {
                const raw = (blocks[g.key] ?? {})[f.name];
                return (
                  <div key={f.name} className={f.area || f.list ? "sm:col-span-2" : ""}>
                    <label className={labelCls}>{f.label}</label>
                    {f.list ? (
                      <textarea
                        rows={4}
                        placeholder="One item per line"
                        className={inputCls}
                        value={Array.isArray(raw) ? (raw as string[]).join("\n") : ""}
                        onChange={(e) =>
                          setField(
                            g.key,
                            f.name,
                            e.target.value.split("\n").map((l) => l.trim()).filter(Boolean),
                          )
                        }
                      />
                    ) : f.area ? (
                      <textarea
                        rows={4}
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
    </div>
  );
}
