import type { ReactNode } from "react";

export const inputCls =
  "w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base sm:text-sm text-white placeholder:text-white/40 outline-none focus:border-gold transition-colors";

export const labelCls = "block text-[11px] uppercase tracking-[0.2em] text-white/50 mb-2";

export function AdminCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-white/12 bg-[#00002B]/70 backdrop-blur-xl p-5 sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function AdminHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-3xl sm:text-4xl text-white">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-white/60 max-w-2xl">{subtitle}</p>}
    </div>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <AdminCard className="min-w-0">
      <div className="text-[11px] uppercase tracking-[0.2em] text-white/50">{label}</div>
      <div className="mt-3 font-display text-3xl sm:text-4xl text-gold">{value}</div>
      {hint && <div className="mt-1 text-xs text-white/45">{hint}</div>}
    </AdminCard>
  );
}

export function AdminButton({
  children,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-medium tracking-wide transition-all disabled:opacity-50";
  const styles = {
    primary: "bg-gold text-[#00002B] hover:brightness-110",
    ghost: "border border-white/20 text-white/80 hover:border-gold hover:text-gold",
    danger: "border border-red-400/40 text-red-300 hover:bg-red-400/10",
  } as const;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}
