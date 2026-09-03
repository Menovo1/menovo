import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { analyticsOverview } from "@/lib/analytics.functions";
import { AdminCard, AdminHeading, AdminButton, StatCard } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/analytics")({ component: AnalyticsPage });

type Overview = Awaited<ReturnType<typeof analyticsOverview>>;

const RANGES = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
  { label: "12 months", days: 365 },
];

function Bars({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  if (!data.length) return <p className="mt-4 text-sm text-white/45">No data yet.</p>;
  return (
    <div className="mt-4 space-y-3">
      {data.map((d) => (
        <div key={d.label}>
          <div className="flex items-center justify-between text-xs text-white/70">
            <span className="truncate pr-3">{d.label}</span>
            <span className="text-white/50">{d.value}</span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-white/10">
            <div className="h-1.5 rounded-full bg-gold" style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Timeline({ data }: { data: { date: string; value: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="mt-5 flex h-40 items-end gap-[3px]">
      {data.map((d) => (
        <div
          key={d.date}
          title={`${d.date}: ${d.value} views`}
          className="flex-1 rounded-t bg-gold/70 transition-colors hover:bg-gold"
          style={{ height: `${Math.max(2, (d.value / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

function AnalyticsPage() {
  const load = useServerFn(analyticsOverview);
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setData(null);
    load({ data: { days } })
      .then((res) => !cancelled && setData(res))
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : "Could not load analytics."));
    return () => {
      cancelled = true;
    };
  }, [load, days]);

  return (
    <div>
      <AdminHeading title="Analytics" subtitle="Visitors, page views, traffic sources, devices and countries." />

      <div className="mb-6 flex flex-wrap gap-2">
        {RANGES.map((r) => (
          <AdminButton
            key={r.days}
            variant={r.days === days ? "primary" : "ghost"}
            onClick={() => setDays(r.days)}
          >
            {r.label}
          </AdminButton>
        ))}
      </div>

      {error && <p className="text-sm text-red-300">{error}</p>}

      {!data ? (
        <Loader2 className="h-5 w-5 animate-spin text-gold" />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Visitors" value={data.visitors} hint={`last ${data.days} days`} />
            <StatCard label="Page views" value={data.totalViews} hint={`last ${data.days} days`} />
            <StatCard
              label="Views per visitor"
              value={data.visitors ? (data.totalViews / data.visitors).toFixed(1) : "0"}
            />
          </div>

          <AdminCard className="mt-6">
            <div className="text-[11px] uppercase tracking-[0.2em] text-white/50">Page views over time</div>
            <Timeline data={data.timeline} />
          </AdminCard>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <AdminCard>
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/50">Top pages</div>
              <Bars data={data.topPages} />
            </AdminCard>
            <AdminCard>
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/50">Traffic sources</div>
              <Bars data={data.sources} />
            </AdminCard>
            <AdminCard>
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/50">Devices</div>
              <Bars data={data.devices} />
            </AdminCard>
            <AdminCard>
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/50">Countries</div>
              <Bars data={data.countries} />
            </AdminCard>
          </div>
        </>
      )}
    </div>
  );
}
