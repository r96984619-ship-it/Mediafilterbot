import { useState } from "react";
import { useGetTopSearches, getGetTopSearchesQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Search, Trophy, RefreshCw } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from "recharts";

const LIMIT = 20;

const PODIUM_COLORS = [
  "hsl(45 100% 60%)",
  "hsl(220 15% 70%)",
  "hsl(25 80% 55%)",
];

const BAR_COLORS = [
  "hsl(var(--primary))",
  "hsl(210 70% 55%)",
  "hsl(160 60% 50%)",
  "hsl(280 60% 60%)",
  "hsl(350 70% 60%)",
  "hsl(40 90% 55%)",
  "hsl(190 65% 50%)",
  "hsl(310 55% 58%)",
  "hsl(80 60% 48%)",
  "hsl(240 60% 65%)",
];

function formatRelativeTime(iso: string | null): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function Searches() {
  const [showAll, setShowAll] = useState(false);

  const { data: searches, isLoading, refetch, isFetching } = useGetTopSearches(
    { limit: LIMIT },
    {
      query: {
        queryKey: getGetTopSearchesQueryKey({ limit: LIMIT }),
        refetchInterval: 60_000,
      },
    }
  );

  const hasData = searches && searches.length > 0;
  const top3 = searches?.slice(0, 3) ?? [];
  const rest = searches?.slice(3) ?? [];
  const chartData = (searches ?? []).slice(0, 10).map((s) => ({
    name: s.query.length > 16 ? s.query.slice(0, 14) + "…" : s.query,
    fullName: s.query,
    count: s.count,
  }));
  const displayRest = showAll ? rest : rest.slice(0, 7);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Search Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">
            What users are searching for in your bot
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className={`w-3 h-3 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : !hasData ? (
        <EmptyState />
      ) : (
        <>
          {top3.length > 0 && <Podium entries={top3} />}

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Top 10 by Search Volume
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 0, right: 24, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                    <XAxis
                      type="number"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={100}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: "hsl(var(--muted)/0.4)" }}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        color: "hsl(var(--foreground))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      formatter={(value: number, _name, props) => [
                        `${value.toLocaleString()} searches`,
                        props.payload.fullName,
                      ]}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {chartData.map((_entry, index) => (
                        <Cell
                          key={index}
                          fill={BAR_COLORS[index % BAR_COLORS.length]}
                          fillOpacity={0.85}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Search className="w-4 h-4 text-primary" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {displayRest.map((entry, idx) => {
                    const rank = idx + 4;
                    const maxCount = searches?.[0]?.count ?? 1;
                    const pct = Math.max(6, Math.round((entry.count / maxCount) * 100));
                    return (
                      <div
                        key={entry.query}
                        className="flex items-center gap-3 py-1.5 group"
                      >
                        <span className="text-xs text-muted-foreground w-5 text-right tabular-nums">
                          {rank}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-sm font-medium truncate">{entry.query}</span>
                            <span className="text-xs text-muted-foreground tabular-nums ml-2 shrink-0">
                              {entry.count.toLocaleString()}
                            </span>
                          </div>
                          <div className="h-1 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary/50 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-[10px] text-muted-foreground/60 shrink-0 w-14 text-right">
                          {formatRelativeTime(entry.last_searched ?? null)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {rest.length > 7 && (
                  <button
                    onClick={() => setShowAll((v) => !v)}
                    className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors w-full text-center"
                  >
                    {showAll ? "Show less ↑" : `Show ${rest.length - 7} more ↓`}
                  </button>
                )}
                {rest.length === 0 && top3.length > 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    Only {top3.length} unique search{top3.length !== 1 ? "es" : ""} recorded so far.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function Podium({ entries }: { entries: Array<{ query: string; count: number; last_searched?: string | null }> }) {
  const order = entries.length === 1
    ? [0]
    : entries.length === 2
    ? [1, 0]
    : [1, 0, 2];

  const heights = ["h-20", "h-28", "h-14"];
  const labels = ["🥇", "🥈", "🥉"];

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Trophy className="w-4 h-4 text-yellow-500" />
          Top 3 Most Searched
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-center gap-4">
          {order.map((realIdx) => {
            const entry = entries[realIdx];
            if (!entry) return null;
            return (
              <div key={entry.query} className="flex flex-col items-center gap-2 flex-1 max-w-[160px]">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground font-medium truncate max-w-[140px]" title={entry.query}>
                    {entry.query}
                  </p>
                  <p className="text-lg font-bold tabular-nums">{entry.count.toLocaleString()}</p>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    {entry.count === 1 ? "1 search" : `${entry.count.toLocaleString()} searches`}
                  </Badge>
                </div>
                <div
                  className={`w-full ${heights[realIdx]} rounded-t-lg flex items-start justify-center pt-2 font-bold text-xl`}
                  style={{ backgroundColor: PODIUM_COLORS[realIdx], opacity: 0.85 }}
                >
                  {labels[realIdx]}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="border-border/50 bg-card/50">
      <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
        <Search className="w-12 h-12 text-muted-foreground/30" />
        <div className="text-center">
          <p className="font-semibold text-muted-foreground">No search data yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1 max-w-sm">
            Search analytics will appear here once users start searching for movies in your bot groups.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-36 bg-muted/40 rounded-xl animate-pulse" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-72 bg-muted/40 rounded-xl animate-pulse" />
        <div className="h-72 bg-muted/40 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}
