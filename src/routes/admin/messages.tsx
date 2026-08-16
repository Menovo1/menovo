import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Mail, MessageCircle } from "lucide-react";
import { adminList, adminSave, adminDelete } from "@/lib/admin.functions";
import { AdminButton, AdminCard, AdminHeading } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/messages")({
  component: MessagesPage,
});

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  status: string;
  created_at: string;
};

const STATUSES = ["new", "read", "replied", "archived"];

function MessagesPage() {
  const list = useServerFn(adminList);
  const save = useServerFn(adminSave);
  const remove = useServerFn(adminDelete);
  const [rows, setRows] = useState<Message[] | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const data = (await list({ data: { table: "messages" } })) as unknown as Message[];
    setRows(data);
  }, [list]);

  useEffect(() => {
    void load().catch(() => setRows([]));
  }, [load]);

  const update = async (id: string, status: string) => {
    setBusy(true);
    await save({ data: { table: "messages", row: { id, status } } });
    await load();
    setBusy(false);
  };

  return (
    <div>
      <AdminHeading title="Messages" subtitle="Enquiries sent from the contact page." />
      {rows === null ? (
        <Loader2 className="h-5 w-5 animate-spin text-gold" />
      ) : (
        <div className="space-y-3">
          {rows.map((m) => (
            <AdminCard key={m.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium text-white">
                    {m.name} <span className="text-white/50">{m.company ? `— ${m.company}` : ""}</span>
                  </div>
                  <div className="mt-1 text-xs text-white/50">
                    {m.email} {m.phone ? `· ${m.phone}` : ""} · {new Date(m.created_at).toLocaleString()}
                  </div>
                </div>
                <span className="rounded-full bg-gold/15 px-3 py-1 text-[10px] uppercase tracking-widest text-gold">
                  {m.status}
                </span>
              </div>
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-white/75">{m.message}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {STATUSES.filter((s) => s !== m.status).map((s) => (
                  <AdminButton key={s} variant="ghost" disabled={busy} onClick={() => void update(m.id, s)}>
                    Mark {s}
                  </AdminButton>
                ))}
                <a
                  href={`mailto:${m.email}`}
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-xs font-medium text-[#00002B]"
                >
                  <Mail className="h-3.5 w-3.5" /> Reply
                </a>
                {m.phone && (
                  <a
                    href={`https://wa.me/${m.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-xs text-white/80 hover:text-gold"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                  </a>
                )}
                <AdminButton
                  variant="danger"
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    await remove({ data: { table: "messages", id: m.id } });
                    await load();
                    setBusy(false);
                  }}
                >
                  Delete
                </AdminButton>
              </div>
            </AdminCard>
          ))}
          {rows.length === 0 && <p className="text-sm text-white/50">No messages yet.</p>}
        </div>
      )}
    </div>
  );
}
