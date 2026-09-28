import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { LogForm } from "@/components/log-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { upsertMyLog } from "@/lib/league/api";
import { useLeague, useMe } from "@/lib/league/hooks";
import { formatMinutes, formatPrettyDate, formatScore, localToday } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const today = localToday();
  const me = useMe();
  const league = useLeague("week", "score", today);
  const queryClient = useQueryClient();
  const save = useMutation({
    mutationFn: upsertMyLog,
    onSuccess: async () => {
      toast.success("Today is saved");
      await queryClient.invalidateQueries();
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not save"),
  });

  const snapshot = league.data;
  const viewer = snapshot?.viewer ?? me.data;
  const mine = snapshot?.individual.find((r) => r.memberId === viewer?.memberId);
  const top = snapshot?.individual.slice(0, 3) ?? [];
  const topTeam = snapshot?.teamBoard[0];

  return (
    <AppShell isAdmin={viewer?.role === "admin"}>
      <div className="mb-8">
        <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
          {formatPrettyDate(today)}
        </p>
        <h1 className="mt-1 font-display text-4xl font-medium tracking-tight">
          {viewer ? `Hello, ${viewer.displayName}` : "Today"}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Put in study time, cam time, and your score. The whole league can see every entry.
        </p>
      </div>

      {league.isPending ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-96 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      ) : league.error ? (
        <p className="text-sm text-destructive">Could not load the league. Try signing in again.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Log today</CardTitle>
              <CardDescription>
                {viewer?.memberActive
                  ? "Update today’s numbers anytime. Past days stay on your page."
                  : "You are not on the board. Ask an admin to add or restore your name."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {viewer?.memberActive ? (
                <LogForm
                  today={today}
                  initial={snapshot?.todayLog}
                  submitting={save.isPending}
                  submitLabel={snapshot?.todayLog ? "Update today" : "Save today"}
                  showDate={false}
                  onSubmit={(values) =>
                    save.mutate({
                      data: {
                        date: today,
                        today,
                        studyMinutes: values.studyMinutes,
                        camMinutes: values.camMinutes,
                        score: values.score,
                        notes: values.notes,
                      },
                    })
                  }
                />
              ) : null}
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>This week</CardTitle>
                <CardDescription>Your totals across the league week.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  <MiniStat label="Study" value={formatMinutes(mine?.studyMinutes ?? 0)} />
                  <MiniStat label="Cam" value={formatMinutes(mine?.camMinutes ?? 0)} />
                  <MiniStat label="Score" value={formatScore(mine?.score ?? 0)} />
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  {mine
                    ? `Board rank ${mine.rank} of ${snapshot?.individual.length ?? 0}`
                    : "Log today to appear on the board."}
                  {viewer?.teamName ? ` · ${viewer.teamName}` : ""}
                </p>
                {viewer?.memberId ? (
                  <Link
                    to="/people/$memberId"
                    params={{ memberId: String(viewer.memberId) }}
                    className="mt-3 inline-block text-sm underline-offset-4 hover:underline"
                  >
                    See every score
                  </Link>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leaders</CardTitle>
                <CardDescription>Week ranking by score.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                {top.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No logs this week yet.</p>
                ) : (
                  top.map((row) => (
                    <Link
                      key={row.memberId}
                      to="/people/$memberId"
                      params={{ memberId: String(row.memberId) }}
                      className="flex items-center justify-between gap-3 rounded-md bg-secondary px-3 py-2"
                    >
                      <span className="truncate">
                        <span className="mr-2 font-mono text-xs text-muted-foreground">{row.rank}</span>
                        {row.displayName}
                      </span>
                      <span className="font-mono text-xs tabular-nums">{formatScore(row.score)}</span>
                    </Link>
                  ))
                )}
                {topTeam ? (
                  <p className="text-sm text-muted-foreground">
                    Team challenge lead: <span className="text-foreground">{topTeam.name}</span>
                  </p>
                ) : null}
                <div className="flex gap-4 text-sm">
                  <Link to="/board" className="underline-offset-4 hover:underline">
                    Full board
                  </Link>
                  <Link to="/teams" className="underline-offset-4 hover:underline">
                    Team ranking
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-secondary px-3 py-3">
      <p className="text-[10px] tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-1 font-mono text-sm tabular-nums">{value}</p>
    </div>
  );
}
