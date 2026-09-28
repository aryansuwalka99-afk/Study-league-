import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { PeriodBar } from "@/components/period-bar";
import { TeamBoard } from "@/components/team-board";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLeague, useMe } from "@/lib/league/hooks";
import type { Metric, Period } from "@/lib/league/types";
import { localToday } from "@/lib/utils";

export const Route = createFileRoute("/teams")({ component: TeamsPage });

function TeamsPage() {
  const today = localToday();
  const [period, setPeriod] = useState<Period>("week");
  const [metric, setMetric] = useState<Metric>("score");
  const me = useMe();
  const league = useLeague(period, metric, today);

  return (
    <AppShell isAdmin={(league.data?.viewer ?? me.data)?.role === "admin"}>
      <div className="mb-6">
        <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Challenge</p>
        <h1 className="mt-1 font-display text-4xl font-medium tracking-tight">Team ranking</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Groups compete on combined study, cam, and score. Members of the same group sit together.
        </p>
      </div>
      <PeriodBar period={period} metric={metric} onPeriod={setPeriod} onMetric={setMetric} />
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>League groups</CardTitle>
          <CardDescription>Totals are the sum of everyone in the group for the selected range.</CardDescription>
        </CardHeader>
        <CardContent>
          {league.isPending ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <TeamBoard
              teams={league.data?.teamBoard ?? []}
              unaffiliated={league.data?.unaffiliated ?? []}
            />
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
