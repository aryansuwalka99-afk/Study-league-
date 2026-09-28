import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { PeriodBar } from "@/components/period-bar";
import { RankTable } from "@/components/rank-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLeague, useMe } from "@/lib/league/hooks";
import type { Metric, Period } from "@/lib/league/types";
import { localToday } from "@/lib/utils";

export const Route = createFileRoute("/board")({ component: BoardPage });

function BoardPage() {
  const today = localToday();
  const [period, setPeriod] = useState<Period>("week");
  const [metric, setMetric] = useState<Metric>("score");
  const me = useMe();
  const league = useLeague(period, metric, today);

  return (
    <AppShell isAdmin={(league.data?.viewer ?? me.data)?.role === "admin"}>
      <div className="mb-6">
        <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Everyone</p>
        <h1 className="mt-1 font-display text-4xl font-medium tracking-tight">Board</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Every participant, every score. Rank by score, study time, or cam time.
        </p>
      </div>
      <PeriodBar period={period} metric={metric} onPeriod={setPeriod} onMetric={setMetric} />
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Individual ranking</CardTitle>
          <CardDescription>
            {period === "today" ? "Today" : period === "week" ? "This week" : "All logged days"} ·
            tap a name for the full history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {league.isPending ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <RankTable
              rows={league.data?.individual ?? []}
              metric={metric}
              empty="No one is on the board yet."
            />
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
