import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe, useMemberDetail } from "@/lib/league/hooks";
import { formatMinutes, formatPrettyDate, formatScore } from "@/lib/utils";

export const Route = createFileRoute("/people/$memberId")({ component: PersonPage });

function PersonPage() {
  const { memberId } = Route.useParams();
  const id = Number(memberId);
  const me = useMe();
  const detail = useMemberDetail(id);

  const member = detail.data?.member;
  const logs = detail.data?.logs ?? [];
  const totals = detail.data?.totals;
  const chart = [...logs].reverse().map((l) => ({
    date: l.logDate.slice(5),
    study: Math.round((l.studyMinutes / 60) * 10) / 10,
    cam: Math.round((l.camMinutes / 60) * 10) / 10,
    score: l.score,
  }));

  return (
    <AppShell isAdmin={me.data?.role === "admin"}>
      <Link to="/board" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
        Back to board
      </Link>
      {detail.isPending ? (
        <div className="mt-6 space-y-4">
          <Skeleton className="h-16 w-64" />
          <Skeleton className="h-72 w-full rounded-xl" />
        </div>
      ) : !member ? (
        <p className="mt-6 text-sm text-destructive">That person is not on the league.</p>
      ) : (
        <>
          <div className="mt-4 mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-4xl font-medium tracking-tight">{member.displayName}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {member.teamName ?? "Ungrouped"}
                {member.isAdmin ? " · Admin" : ""}
                {member.isActive ? "" : " · Removed from the board"}
              </p>
            </div>
            <div className="flex gap-2">
              {member.userId ? <Badge>Has account</Badge> : <Badge>Roster only</Badge>}
            </div>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-3">
            <Stat label="Study" value={formatMinutes(totals?.studyMinutes ?? 0)} />
            <Stat label="Cam" value={formatMinutes(totals?.camMinutes ?? 0)} />
            <Stat label="Score" value={formatScore(totals?.score ?? 0)} />
          </div>

          {chart.length > 1 ? (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>History</CardTitle>
                <CardDescription>Hours and score across every logged day.</CardDescription>
              </CardHeader>
              <CardContent className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="color-mix(in oklab, var(--color-foreground) 6%, transparent)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 8,
                        color: "var(--color-foreground)",
                      }}
                    />
                    <Area type="monotone" dataKey="study" stroke="var(--color-primary)" fill="color-mix(in oklab, var(--color-primary) 18%, transparent)" />
                    <Area type="monotone" dataKey="cam" stroke="var(--color-muted-foreground)" fill="color-mix(in oklab, var(--color-muted-foreground) 12%, transparent)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>Every score</CardTitle>
              <CardDescription>All daily entries, newest first.</CardDescription>
            </CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">No logs yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[32rem] text-left text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs tracking-wide text-muted-foreground uppercase">
                        <th className="py-2 pr-3 font-medium">Date</th>
                        <th className="py-2 pr-3 text-right font-medium">Study</th>
                        <th className="py-2 pr-3 text-right font-medium">Cam</th>
                        <th className="py-2 pr-3 text-right font-medium">Score</th>
                        <th className="py-2 font-medium">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log.id} className="border-b border-border/70 last:border-0">
                          <td className="py-3 pr-3">{formatPrettyDate(log.logDate)}</td>
                          <td className="py-3 pr-3 text-right font-mono text-xs tabular-nums">
                            {formatMinutes(log.studyMinutes)}
                          </td>
                          <td className="py-3 pr-3 text-right font-mono text-xs tabular-nums">
                            {formatMinutes(log.camMinutes)}
                          </td>
                          <td className="py-3 pr-3 text-right font-mono text-xs tabular-nums">
                            {formatScore(log.score)}
                          </td>
                          <td className="py-3 text-muted-foreground">{log.notes || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-4">
      <p className="text-[10px] tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-1 font-mono text-lg tabular-nums">{value}</p>
    </div>
  );
}
