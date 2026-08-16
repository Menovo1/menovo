import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Copy, Loader2, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminButton, AdminCard, AdminHeading } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/media")({ component: Page });

type Item = { name: string; url: string };

const BUCKET = "media";
const YEAR = 60 * 60 * 24 * 365;

function Page() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const load = useCallback(async () => {
    const { data, error: err } = await supabase.storage.from(BUCKET).list("", {
      limit: 200,
      sortBy: { column: "created_at", order: "desc" },
    });
    if (err) {
      setError(err.message);
      setItems([]);
      return;
    }
    const files = (data ?? []).filter((f) => f.id);
    const signed = await Promise.all(
      files.map(async (f) => {
        const { data: s } = await supabase.storage.from(BUCKET).createSignedUrl(f.name, YEAR);
        return { name: f.name, url: s?.signedUrl ?? "" };
      }),
    );
    setItems(signed);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    for (const file of Array.from(files)) {
      const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
      const { error: err } = await supabase.storage.from(BUCKET).upload(path, file);
      if (err) setError(err.message);
    }
    await load();
    setBusy(false);
  };

  return (
    <div>
      <AdminHeading title="Media library" subtitle="Upload images and videos, then paste the link into any page." />

      <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-xs font-medium text-[#00002B]">
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
        Upload files
        <input
          type="file"
          multiple
          className="hidden"
          onChange={(e) => void upload(e.target.files)}
        />
      </label>

      {error && <p className="mt-4 text-sm text-red-300">{error}</p>}

      {items === null ? (
        <Loader2 className="mt-6 h-5 w-5 animate-spin text-gold" />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((f) => (
            <AdminCard key={f.name}>
              <div className="aspect-video overflow-hidden rounded-2xl bg-white/5">
                {/\.(mp4|webm|mov)$/i.test(f.name) ? (
                  <video src={f.url} className="h-full w-full object-cover" controls />
                ) : (
                  <img src={f.url} alt={f.name} className="h-full w-full object-cover" loading="lazy" />
                )}
              </div>
              <p className="mt-3 truncate text-xs text-white/60">{f.name}</p>
              <div className="mt-3 flex gap-2">
                <AdminButton
                  variant="ghost"
                  onClick={() => {
                    void navigator.clipboard.writeText(f.url);
                    setCopied(f.name);
                  }}
                >
                  <Copy className="h-3.5 w-3.5" /> {copied === f.name ? "Copied" : "Copy link"}
                </AdminButton>
                <AdminButton
                  variant="danger"
                  onClick={async () => {
                    await supabase.storage.from(BUCKET).remove([f.name]);
                    await load();
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </AdminButton>
              </div>
            </AdminCard>
          ))}
          {items.length === 0 && <p className="text-sm text-white/50">No files yet.</p>}
        </div>
      )}
    </div>
  );
}
