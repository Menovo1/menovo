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
            <StatCard label="Total bookings" value={stats.totalBookings} hint={`${stats.newBookings} new`} />
            <StatCard label="Today's appointments" value={stats.todaysAppointments} />
            <StatCard label="Upcoming" value={stats.upcomingAppointments} />
            <StatCard label="Completed projects" value={stats.completedProjects} />
            <StatCard label="Messages" value={stats.contactMessages} hint={`${stats.newMessages} unread`} />
            <StatCard label="Portfolio projects" value={stats.portfolioCount} />
            <StatCard label="Blog posts" value={stats.blogPosts} />
            <StatCard label="Page views" value={stats.totalViews} hint={`${stats.viewsThisMonth} in last 30 days`} />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <AdminCard>
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/50">Google Calendar</div>
              <p className="mt-3 text-sm text-white/75">
                {stats.calendarConnected
                  ? "Connected — new bookings are added to your calendar automatically."
                  : "Not connected yet. Bookings are still saved safely and flagged for retry."}
              </p>
            </AdminCard>
            <AdminCard>
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/50">Quick actions</div>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <Link to="/admin/bookings" className="text-gold hover:underline">Manage bookings</Link>
                <Link to="/admin/messages" className="text-gold hover:underline">Read messages</Link>
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
