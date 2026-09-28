import { Link } from "@tanstack/react-router";
import type { MemberTotals, Metric } from "@/lib/league/types";
import { formatMinutes, formatScore } from "@/lib/utils";

export function RankTable({
  rows,
  metric,
  empty,
}: {
  rows: MemberTotals[];
  metric: Metric;
  empty: string;
}) {
  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">{empty}</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[34rem] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs tracking-wide text-muted-foreground uppercase">
            <th className="py-2 pr-3 font-medium">Rank</th>
            <th className="py-2 pr-3 font-medium">Name</th>
            <th className="py-2 pr-3 font-medium">Group</th>
            <th className="py-2 pr-3 text-right font-medium">Study</th>
            <th className="py-2 pr-3 text-right font-medium">Cam</th>
            <th className="py-2 text-right font-medium">Score</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.memberId} className="border-b border-border/70 last:border-0">
              <td className="py-3 pr-3 font-mono text-xs tabular-nums text-muted-foreground">
                {row.rank}
              </td>
              <td className="py-3 pr-3">
                <Link
                  to="/people/$memberId"
                  params={{ memberId: String(row.memberId) }}
                  className="font-medium hover:underline"
                >
                  {row.displayName}
                </Link>
              </td>
              <td className="py-3 pr-3 text-muted-foreground">{row.teamName ?? "—"}</td>
              <td className="py-3 pr-3 text-right font-mono text-xs tabular-nums">
                {formatMinutes(row.studyMinutes)}
              </td>
              <td className="py-3 pr-3 text-right font-mono text-xs tabular-nums">
                {formatMinutes(row.camMinutes)}
              </td>
              <td className="py-3 text-right font-mono text-xs tabular-nums">
                {formatScore(row.score)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
