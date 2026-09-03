import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { adminStats } from "@/lib/admin.functions";
import { AdminCard, AdminHeading, StatCard } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/")({
  component: DashboardPage,
});

type Stats = Awaited<ReturnType<typeof adminStats>>;

function DashboardPage() {
  const fetchStats = useServerFn(adminStats);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetchStats({})
      .then(setStats)
      .catch(() => setStats(null));
  }, [fetchStats]);

  return (
    <div>
      <AdminHeading title="Dashboard" subtitle="Everything happening across MENOVO right now." />

      {!stats ? (
        <Loader2 className="h-5 w-5 animate-spin text-gold" />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Calendly meetings" value={stats.calendlyUpcoming} hint="upcoming" />
            <StatCard label="Total booking requests" value={stats.totalBookings} hint={`${stats.newBookings} new`} />
            <StatCard label="Completed projects" value={stats.completedProjects} />
            <StatCard label="Messages" value={stats.contactMessages} hint={`${stats.newMessages} unread`} />
            <StatCard label="Portfolio projects" value={stats.portfolioCount} />
            <StatCard label="Blog posts" value={stats.blogPosts} />
            <Link to="/admin/analytics" className="block">
              <StatCard label="Page views" value={stats.totalViews} hint={`${stats.viewsThisMonth} in last 30 days — view analytics`} />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <AdminCard>
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/50">Calendly + Zoom</div>
              <p className="mt-3 text-sm text-white/75">
                {stats.calendlyConnected
                  ? "Connected — every booking on the contact page creates a Calendly meeting with an automatic Zoom link."
                  : "Not reachable right now. Bookings still reach Calendly; reconnect the integration if this persists."}
              </p>
            </AdminCard>

            <AdminCard>
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/50">Quick actions</div>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <Link to="/admin/bookings" className="text-gold hover:underline">Manage bookings</Link>
                <Link to="/admin/messages" className="text-gold hover:underline">Read messages</Link>
                <Link to="/admin/analytics" className="text-gold hover:underline">Analytics</Link>
                <Link to="/admin/website" className="text-gold hover:underline">Edit website text</Link>
                <Link to="/admin/blog" className="text-gold hover:underline">Write a post</Link>
              </div>
            </AdminCard>
          </div>
        </>
      )}
    </div>
  );
}
