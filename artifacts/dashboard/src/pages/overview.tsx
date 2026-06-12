import { useState, useEffect, useRef } from "react";
import { useGetStatsOverview, useGetFilesByType, getGetStatsOverviewQueryKey, getGetFilesByTypeQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileVideo, MessageSquare, Ban, RefreshCw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

const REFRESH_INTERVAL = 60_000;

const TYPE_COLORS: Record<string, string> = {
  Video: "hsl(var(--primary))",
  Audio: "hsl(210 70% 55%)",
  Other: "hsl(var(--muted-foreground))",
};

export default function Overview() {
  const [secondsLeft, setSecondsLeft] = useState(REFRESH_INTERVAL / 1000);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: stats, isLoading: statsLoading, dataUpdatedAt: statsUpdatedAt } = useGetStatsOverview({
    query: {
      queryKey: getGetStatsOverviewQueryKey(),
      refetchInterval: REFRESH_INTERVAL,
    },
  });

  const { data: fileStats, isLoading: fileStatsLoading } = useGetFilesByType({
    query: {
      queryKey: getGetFilesByTypeQueryKey(),
      refetchInterval: REFRESH_INTERVAL,
    },
  });

  useEffect(() => {
    if (statsUpdatedAt) setLastUpdated(new Date(statsUpdatedAt));
  }, [statsUpdatedAt]);

  useEffect(() => {
    setSecondsLeft(REFRESH_INTERVAL / 1000);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) return REFRESH_INTERVAL / 1000;
        return s - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [statsUpdatedAt]);

  const hasFileData = fileStats && fileStats.length > 0;
  const progress = ((REFRESH_INTERVAL / 1000 - secondsLeft) / (REFRESH_INTERVAL / 1000)) * 100;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Mission Control</h1>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Live
          </span>
          <div className="flex items-center gap-1.5">
            <RefreshCw className="w-3 h-3" />
            <div className="relative w-20 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-primary/60 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="tabular-nums w-5 text-right">{secondsLeft}s</span>
          </div>
          {lastUpdated && (
            <span className="hidden sm:inline">
              Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Users" value={stats?.totalUsers} icon={Users} loading={statsLoading} />
        <StatsCard title="Total Files" value={stats?.totalFiles} icon={FileVideo} loading={statsLoading} />
        <StatsCard title="Active Chats" value={stats?.totalChats} icon={MessageSquare} loading={statsLoading} />
        <StatsCard title="Banned Users" value={stats?.bannedUsers} icon={Ban} loading={statsLoading} />
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Files by Type</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {fileStatsLoading ? (
            <div className="w-full h-full animate-pulse bg-muted rounded-md" />
          ) : !hasFileData ? (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
              No file data yet — index some files with your bot first.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fileStats} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="type"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted)/0.4)" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [value.toLocaleString(), "Files"]}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {fileStats.map((entry) => (
                    <Cell key={entry.type} fill={TYPE_COLORS[entry.type] ?? "hsl(var(--primary))"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon: Icon,
  loading,
}: {
  title: string;
  value?: number;
  icon: React.ElementType;
  loading: boolean;
}) {
  return (
    <Card className="border-border/50 bg-card/50 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 w-24 bg-muted animate-pulse rounded" />
        ) : (
          <div className="text-3xl font-bold text-foreground">
            {(value ?? 0).toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
