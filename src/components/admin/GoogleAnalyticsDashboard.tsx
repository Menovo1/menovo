import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Activity, BarChart2, Eye, Globe, Loader2, ShieldCheck, Users } from "lucide-react";
import { getGoogleAnalyticsData, type AnalyticsReport } from "@/lib/google-analytics.server";
import { AdminCard } from "@/components/admin/ui";

export function GoogleAnalyticsDashboard() {
  const fetchGA = useServerFn(getGoogleAnalyticsData);
  const [data, setData] = useState<AnalyticsReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGA({})
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [fetchGA]);

  if (loading) {
    return (
      <AdminCard className="p-8 text-center">
        <div className="flex items-center justify-center gap-3 text-gold">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm font-medium">Connecting Google Analytics Property 404792337...</span>
        </div>
      </AdminCard>
    );
  }

  if (!data) return null;

  const maxViews = Math.max(...data.viewsOverTime.map((v) => v.views), 1);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-gold/30 bg-gold/10 p-5 sm:p-6 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gold/20 text-gold">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg text-white">Google Analytics Live Stream</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="h-3 w-3" /> Connected
              </span>
            </div>
            <p className="text-xs text-white/60">
              Account / Property ID: <strong className="text-gold font-mono">{data.propertyId}</strong>
            </p>
          </div>
        </div>
        <div className="text-right text-xs text-white/50">
          Last sync: <span className="text-white/80">{data.lastUpdated}</span>
        </div>
      </div>

      {/* Main Analytics Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminCard>
          <div className="flex items-center justify-between text-white/50 text-[11px] uppercase tracking-wider font-semibold">
            <span>Total Users</span>
            <Users className="h-4 w-4 text-gold" />
          </div>
          <div className="mt-2 font-display text-3xl text-gold font-semibold">{data.totalUsers.toLocaleString()}</div>
          <div className="mt-1 text-xs text-white/45">Real visitors tracked</div>
        </AdminCard>

        <AdminCard>
          <div className="flex items-center justify-between text-white/50 text-[11px] uppercase tracking-wider font-semibold">
            <span>Sessions</span>
            <Activity className="h-4 w-4 text-gold" />
          </div>
          <div className="mt-2 font-display text-3xl text-gold font-semibold">{data.totalSessions.toLocaleString()}</div>
          <div className="mt-1 text-xs text-white/45">Active user sessions</div>
        </AdminCard>

        <AdminCard>
          <div className="flex items-center justify-between text-white/50 text-[11px] uppercase tracking-wider font-semibold">
            <span>Page Views</span>
            <Eye className="h-4 w-4 text-gold" />
          </div>
          <div className="mt-2 font-display text-3xl text-gold font-semibold">{data.totalPageViews.toLocaleString()}</div>
          <div className="mt-1 text-xs text-white/45">{data.viewsToday} views today</div>
        </AdminCard>

        <AdminCard>
          <div className="flex items-center justify-between text-white/50 text-[11px] uppercase tracking-wider font-semibold">
            <span>Monthly Views</span>
            <BarChart2 className="h-4 w-4 text-gold" />
          </div>
          <div className="mt-2 font-display text-3xl text-gold font-semibold">{data.viewsThisMonth.toLocaleString()}</div>
          <div className="mt-1 text-xs text-white/45">In last 30 days</div>
        </AdminCard>
      </div>

      {/* Views Over Time & Top Pages */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Views Over Time Bar Chart */}
        <AdminCard>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display text-base text-white flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-gold" /> Views Over Time (14 Days)
            </h4>
          </div>
          <div className="flex items-end justify-between gap-2 h-44 pt-6 pb-2 px-1 border-b border-white/10">
            {data.viewsOverTime.map((item) => {
              const heightPct = Math.max((item.views / maxViews) * 100, 8);
              return (
                <div key={item.date} className="flex-1 flex flex-col items-center gap-2 group">
                  <div
                    className="w-full bg-gold/70 group-hover:bg-gold rounded-t transition-all relative"
                    style={{ height: `${heightPct}%` }}
                  >
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-navy border border-white/20 px-1.5 py-0.5 rounded text-[10px] text-white whitespace-nowrap z-10 transition-opacity">
                      {item.views} views
                    </span>
                  </div>
                  <span className="text-[10px] text-white/40 rotate-[-45deg] origin-top-left sm:rotate-0">
                    {item.date}
                  </span>
                </div>
              );
            })}
          </div>
        </AdminCard>

        {/* Top Pages */}
        <AdminCard>
          <h4 className="font-display text-base text-white flex items-center gap-2 mb-4">
            <Globe className="h-4 w-4 text-gold" /> Top Viewed Pages
          </h4>
          <div className="space-y-3">
            {data.topPages.length === 0 ? (
              <p className="text-xs text-white/40">No page views recorded yet.</p>
            ) : (
              data.topPages.map((page) => (
                <div key={page.path} className="flex items-center justify-between border-b border-white/5 pb-2 text-xs">
                  <span className="font-mono text-white/80 truncate max-w-[240px]">{page.path}</span>
                  <span className="font-medium text-gold bg-gold/10 px-2.5 py-1 rounded-full border border-gold/20">
                    {page.views} views
                  </span>
                </div>
              ))
            )}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
