import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { adminTeam, adminGrant, adminRevoke } from "@/lib/admin.functions";
import { AdminButton, AdminCard, AdminHeading, inputCls, labelCls } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/account")({ component: Page });

type Member = { userId: string; email: string; since: string; isSelf: boolean };

function Page() {
  return (
    <div>
      <AdminHeading
        title="Account & access"
        subtitle="Change your password and manage who else can sign in to the MENOVO control room."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <PasswordCard />
        <TeamCard />
      </div>
    </div>
  );
}

function PasswordCard() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setError("");
    if (password.length < 8) return setError("Use at least 8 characters.");
    if (password !== confirm) return setError("The two passwords do not match.");
    setBusy(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (err) setError(err.message);
    else {
      setMsg("Password updated.");
      setPassword("");
      setConfirm("");
    }
  };

  return (
    <AdminCard>
      <div className="text-[11px] uppercase tracking-[0.2em] text-white/50">Your password</div>
      <form onSubmit={submit} className="mt-4 space-y-4">
        <div>
          <label className={labelCls}>New password</label>
          <input
            className={inputCls}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <div>
          <label className={labelCls}>Confirm password</label>
          <input
            className={inputCls}
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        {error && <p className="text-sm text-red-300">{error}</p>}
        {msg && <p className="text-sm text-gold">{msg}</p>}
        <AdminButton type="submit" disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
        </AdminButton>
      </form>
    </AdminCard>
  );
}

function TeamCard() {
  const list = useServerFn(adminTeam);
  const grant = useServerFn(adminGrant);
  const revoke = useServerFn(adminRevoke);

  const [members, setMembers] = useState<Member[] | null>(null);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    try {
      setMembers((await list({})) as Member[]);
    } catch (e) {
      setMembers([]);
      setError(e instanceof Error ? e.message : "Could not load admins.");
    }
  }, [list]);

  useEffect(() => {
    void load();
  }, [load]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMsg("");
    try {
      await grant({ data: { email } });
      setEmail("");
      setMsg("Admin access granted.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not grant access.");
    }
    setBusy(false);
  };

  const remove = async (userId: string) => {
    setError("");
    setMsg("");
    try {
      await revoke({ data: { userId } });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not remove access.");
    }
  };

  return (
    <AdminCard>
      <div className="text-[11px] uppercase tracking-[0.2em] text-white/50">Admin accounts</div>
      <p className="mt-3 text-sm text-white/60">
        The person must sign in once with their email and password before you can grant access.
      </p>

      <div className="mt-4 space-y-2">
        {members === null ? (
          <Loader2 className="h-4 w-4 animate-spin text-gold" />
        ) : (
          members.map((m) => (
            <div
              key={m.userId}
              className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 px-4 py-3 text-sm"
            >
              <span className="truncate">
                {m.email}
                {m.isSelf && <span className="ml-2 text-xs text-gold">you</span>}
              </span>
              {!m.isSelf && (
                <button
                  onClick={() => void remove(m.userId)}
                  className="text-white/50 transition-colors hover:text-red-300"
                  aria-label={`Remove ${m.email}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <form onSubmit={add} className="mt-5 space-y-3">
        <label className={labelCls}>Grant admin access</label>
        <input
          className={inputCls}
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <p className="text-sm text-red-300">{error}</p>}
        {msg && <p className="text-sm text-gold">{msg}</p>}
        <AdminButton type="submit" disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Grant access"}
        </AdminButton>
      </form>
    </AdminCard>
  );
}
