import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowLeft,
  BadgeCheck,
  BarChart3,
  BookOpen,
  CalendarDays,
  HelpCircle,
  Image as ImageIcon,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  Menu,
  Settings as SettingsIcon,
  Share2,
  Sparkles,
  User,
  KeyRound,
  Wallpaper,
  Layers,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { isAdmin, claimAdmin } from "@/lib/bookings.functions";
import { AdminButton, inputCls } from "@/components/admin/ui";
import { HistoryBar } from "@/components/admin/HistoryBar";
import adminBg from "@/assets/admin-bg.jpg";
import logo from "@/assets/menovo-logo-2026.png";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "MENOVO Admin" },
      { name: "description", content: "Private MENOVO control room." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

type NavItem = {
  to:
    | "/admin"
    | "/admin/analytics"
    | "/admin/bookings"
    | "/admin/messages"
    | "/admin/website"
    | "/admin/identity"
    | "/admin/backgrounds"
    | "/admin/services"
    | "/admin/portfolio"
    | "/admin/blog"
    | "/admin/faq"
    | "/admin/social"
    | "/admin/founder"
    | "/admin/media"
    | "/admin/settings"
    | "/admin/account";
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/website", label: "Website", icon: Sparkles },
  { to: "/admin/identity", label: "Identity", icon: BadgeCheck },
  { to: "/admin/backgrounds", label: "Backgrounds", icon: Wallpaper },
  { to: "/admin/services", label: "Services", icon: Layers },
  { to: "/admin/portfolio", label: "Portfolio", icon: ImageIcon },
  { to: "/admin/blog", label: "Blog", icon: BookOpen },
  { to: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { to: "/admin/social", label: "Social media", icon: Share2 },
  { to: "/admin/founder", label: "Founder", icon: User },
  { to: "/admin/media", label: "Media", icon: ImageIcon },
  { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
  { to: "/admin/account", label: "Account & Access", icon: KeyRound },
];

function AdminLayout() {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const { data } = await supabase.auth.getSession();
      if (!cancelled) {
        setSignedIn(Boolean(data.session));
        setReady(true);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(Boolean(session));
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);


  return (
    <div
      className="min-h-screen bg-[#00002B] text-white"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(0,0,43,0.92), rgba(0,0,43,0.97)), url(${adminBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {!ready ? (
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gold" />
        </div>
      ) : signedIn ? (
        <AdminGate />
      ) : (
        <SignIn />
      )}
    </div>
  );
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) setError(err.message);
    setBusy(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-20">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl border border-white/12 bg-[#00002B]/70 p-8 backdrop-blur-xl"
      >
        <img src={logo} alt="MENOVO" width={56} height={56} className="h-14 w-14 rounded-full" />
        <h1 className="mt-5 font-display text-2xl">MENOVO Control Room</h1>
        <p className="mt-2 text-sm text-white/55">Sign in to manage your website.</p>
        <div className="mt-6 space-y-4">
          <input
            className={inputCls}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className={inputCls}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
        <AdminButton type="submit" disabled={busy} className="mt-6 w-full py-3">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
        </AdminButton>
        <Link to="/" className="mt-6 flex items-center gap-2 text-xs text-white/50 hover:text-gold">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to MENOVO
        </Link>
      </form>
    </div>
  );
}

function AdminGate() {
  const checkAdmin = useServerFn(isAdmin);
  const takeAdmin = useServerFn(claimAdmin);
  const [admin, setAdmin] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const load = useCallback(async () => {
    setError("");
    try {
      const res = await checkAdmin({});
      if (res.admin) {
        setAdmin(true);
        return;
      }

      // If no admin exists yet, automatically bootstrap the first signed-in account.
      // If another admin already exists, claimAdmin safely returns false.
      const claimed = await takeAdmin({});
      if (claimed.admin) {
        setAdmin(true);
      } else {
        setAdmin(false);
        setError(claimed.reason ?? "This account is not an admin.");
      }
    } catch (e) {
      setAdmin(false);
      setError(e instanceof Error ? e.message : "Could not verify admin access.");
    }
  }, [checkAdmin, takeAdmin]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (admin === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-md space-y-4 rounded-3xl border border-white/12 bg-[#00002B]/70 p-8 backdrop-blur-xl">
          <h1 className="font-display text-2xl">No admin access</h1>
          <p className="text-sm text-white/60">
            This account is signed in but is not the MENOVO admin. The first account can be
            claimed automatically; otherwise sign in with the existing admin account.
          </p>
          {error && <p className="text-sm text-red-300">{error}</p>}
          <div className="flex flex-wrap gap-3">
            <AdminButton
              onClick={async () => {
                const res = await takeAdmin({});
                if (res.admin) void load();
                else setError(res.reason ?? "Not allowed.");
              }}
            >
              Claim admin access
            </AdminButton>
            <AdminButton variant="ghost" onClick={() => void signOut()}>
              Sign out
            </AdminButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1400px]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 shrink-0 border-r border-white/10 bg-[#00002B]/95 backdrop-blur-xl px-5 py-6 transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3">
            <img src={logo} alt="MENOVO" width={40} height={40} className="h-10 w-10 rounded-full" />
            <span className="font-display tracking-[0.18em] text-sm">MENOVO</span>
          </Link>
          <button className="lg:hidden text-white/60" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 space-y-1">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors ${
                  active ? "bg-gold/15 text-gold" : "text-white/65 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" /> {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 space-y-2 border-t border-white/10 pt-6">
          <Link to="/" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/65 hover:text-gold">
            <ArrowLeft className="h-4 w-4" /> View website
          </Link>
          <button
            onClick={() => void signOut()}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/65 hover:text-gold"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-white/10 bg-[#00002B]/80 px-5 py-4 backdrop-blur-xl lg:hidden">
          <button onClick={() => setOpen(true)} className="text-white/80">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-display tracking-[0.18em] text-sm">MENOVO ADMIN</span>
        </header>

        <main className="px-5 py-8 sm:px-8 sm:py-10">
          <HistoryBar />
          <Outlet />

        </main>
      </div>
    </div>
  );
}
