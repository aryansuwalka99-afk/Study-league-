import { Link } from "@tanstack/react-router";
import type { MemberTotals, TeamTotals } from "@/lib/league/types";
import { formatMinutes, formatScore } from "@/lib/utils";

export function TeamBoard({
  teams,
  unaffiliated,
}: {
  teams: TeamTotals[];
  unaffiliated: MemberTotals[];
}) {
  if (teams.length === 0 && unaffiliated.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No groups yet. An admin can add group names from Admin.
      </p>
    );
  }
  return (
    <div className="grid gap-4">
      {teams.map((team) => (
        <article key={team.teamId} className="rounded-lg border border-border bg-secondary/40">
          <header className="flex items-end justify-between gap-3 border-b border-border px-4 py-3">
            <div>
              <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
                Rank {team.rank}
              </p>
              <h3 className="font-display text-xl font-medium">{team.name}</h3>
            </div>
            <dl className="grid grid-cols-3 gap-4 text-right">
              <Stat label="Study" value={formatMinutes(team.studyMinutes)} />
              <Stat label="Cam" value={formatMinutes(team.camMinutes)} />
              <Stat label="Score" value={formatScore(team.score)} />
            </dl>
          </header>
          <ul>
            {team.members.length === 0 ? (
              <li className="px-4 py-3 text-sm text-muted-foreground">No members in this group yet.</li>
            ) : (
              team.members.map((m) => (
                <li
                  key={m.memberId}
                  className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-2.5 last:border-0"
                >
                  <Link
                    to="/people/$memberId"
                    params={{ memberId: String(m.memberId) }}
                    className="min-w-0 truncate font-medium hover:underline"
                  >
                    {m.displayName}
                  </Link>
                  <div className="flex shrink-0 gap-4 font-mono text-[11px] tabular-nums text-muted-foreground">
                    <span>{formatMinutes(m.studyMinutes)}</span>
                    <span>{formatMinutes(m.camMinutes)}</span>
                    <span>{formatScore(m.score)}</span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </article>
      ))}
      {unaffiliated.length > 0 ? (
        <article className="rounded-lg border border-dashed border-border px-4 py-3">
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">Ungrouped</h3>
          <ul className="grid gap-1">
            {unaffiliated.map((m) => (
              <li key={m.memberId} className="flex items-center justify-between gap-3 py-1">
                <Link
                  to="/people/$memberId"
                  params={{ memberId: String(m.memberId) }}
                  className="truncate hover:underline"
                >
                  {m.displayName}
                </Link>
                <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                  {formatScore(m.score)}
                </span>
              </li>
            ))}
          </ul>
        </article>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] tracking-wide text-muted-foreground uppercase">{label}</dt>
      <dd className="font-mono text-xs tabular-nums">{value}</dd>
    </div>
  );
}
