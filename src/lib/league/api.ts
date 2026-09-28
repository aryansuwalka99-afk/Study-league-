import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql, type Sql } from "@/lib/db";
import { addDays, mondayOf } from "@/lib/utils";
import type {
  DailyLog,
  LeagueSnapshot,
  Member,
  MemberTotals,
  Metric,
  Period,
  Role,
  Team,
  TeamTotals,
  Viewer,
} from "./types";

const dateRe = /^\d{4}-\d{2}-\d{2}$/;

const periodSchema = z.enum(["today", "week", "all"]);
const metricSchema = z.enum(["score", "study", "cam"]);

type ProfileRow = {
  user_id: string;
  display_name: string;
  role: Role;
};

type MemberRow = {
  id: number;
  user_id: string | null;
  display_name: string;
  team_id: number | null;
  is_active: boolean;
};

type TeamRow = { id: number; name: string };

type LogRow = {
  id: number;
  member_id: number;
  log_date: string;
  study_minutes: number;
  cam_minutes: number;
  score: string | number;
  notes: string | null;
};

function asNumber(v: string | number | null | undefined): number {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function mapLog(row: LogRow): DailyLog {
  return {
    id: row.id,
    memberId: row.member_id,
    logDate: row.log_date,
    studyMinutes: asNumber(row.study_minutes),
    camMinutes: asNumber(row.cam_minutes),
    score: asNumber(row.score),
    notes: row.notes,
  };
}

function serverIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function assertDate(value: string, label: string): string {
  if (!dateRe.test(value)) throw new Error(`Invalid ${label}`);
  return value;
}

function rangeFor(period: Period, today: string): { start: string | null; end: string } {
  if (period === "today") return { start: today, end: today };
  if (period === "week") return { start: mondayOf(today), end: addDays(mondayOf(today), 6) };
  return { start: null, end: today };
}

function inRange(logDate: string, start: string | null, end: string): boolean {
  if (logDate > end) return false;
  if (start && logDate < start) return false;
  return true;
}

function metricValue(row: { score: number; studyMinutes: number; camMinutes: number }, metric: Metric): number {
  if (metric === "study") return row.studyMinutes;
  if (metric === "cam") return row.camMinutes;
  return row.score;
}

function assignRanks<T extends { score: number; studyMinutes: number; camMinutes: number }>(
  rows: T[],
  metric: Metric,
): (T & { rank: number })[] {
  const sorted = [...rows].sort((a, b) => {
    const dv = metricValue(b, metric) - metricValue(a, metric);
    if (dv !== 0) return dv;
    const ds = b.studyMinutes - a.studyMinutes;
    if (ds !== 0) return ds;
    const dc = b.camMinutes - a.camMinutes;
    if (dc !== 0) return dc;
    return 0;
  });
  let lastKey = "";
  let lastRank = 0;
  return sorted.map((row, i) => {
    const key = `${metricValue(row, metric)}|${row.studyMinutes}|${row.camMinutes}`;
    const rank = key === lastKey ? lastRank : i + 1;
    lastKey = key;
    lastRank = rank;
    return { ...row, rank };
  });
}

async function ensureProfile(sql: Sql, userId: string): Promise<void> {
  const existing = await sql<ProfileRow>`
    select user_id, display_name, role from profiles where user_id = ${userId}
  `;
  if (existing[0]) {
    const member = await sql<MemberRow>`
      select id, user_id, display_name, team_id, is_active from members where user_id = ${userId}
    `;
    if (!member[0]) {
      await sql`
        insert into members (user_id, display_name, is_active)
        values (${userId}, ${existing[0].display_name}, true)
      `;
    }
    return;
  }

  const authUsers = await sql<{ name: string | null; email: string | null }>`
    select name, email from "user" where id = ${userId}
  `;
  const rawName = authUsers[0]?.name?.trim() || authUsers[0]?.email?.split("@")[0] || "Participant";
  const displayName = rawName.slice(0, 48);

  const admins = await sql<{ n: number }>`
    select count(*)::int as n from profiles where role = 'admin'
  `;
  const role: Role = (admins[0]?.n ?? 0) === 0 ? "admin" : "participant";

  await sql`
    insert into profiles (user_id, display_name, role)
    values (${userId}, ${displayName}, ${role})
    on conflict (user_id) do nothing
  `;
  await sql`
    insert into members (user_id, display_name, is_active)
    values (${userId}, ${displayName}, true)
    on conflict (user_id) do nothing
  `;
}

async function loadViewer(sql: Sql, userId: string): Promise<Viewer> {
  await ensureProfile(sql, userId);
  const profiles = await sql<ProfileRow>`
    select user_id, display_name, role from profiles where user_id = ${userId}
  `;
  const profile = profiles[0];
  if (!profile) throw new Error("Profile missing");
  const members = await sql<MemberRow & { team_name: string | null }>`
    select m.id, m.user_id, m.display_name, m.team_id, m.is_active, t.name as team_name
    from members m
    left join teams t on t.id = m.team_id
    where m.user_id = ${userId}
  `;
  const member = members[0];
  return {
    userId,
    displayName: member?.display_name ?? profile.display_name,
    role: profile.role,
    memberId: member ? member.id : null,
    memberActive: member ? member.is_active : false,
    teamId: member?.team_id ?? null,
    teamName: member?.team_name ?? null,
  };
}

async function requireAdmin(sql: Sql, userId: string): Promise<Viewer> {
  const viewer = await loadViewer(sql, userId);
  if (viewer.role !== "admin") throw new Error("Forbidden");
  return viewer;
}

function buildSnapshot(args: {
  viewer: Viewer;
  period: Period;
  metric: Metric;
  today: string;
  teams: Team[];
  members: Member[];
  logs: DailyLog[];
}): LeagueSnapshot {
  const { start, end } = rangeFor(args.period, args.today);
  const ranged = args.logs.filter((l) => inRange(l.logDate, start, end));
  const activeMembers = args.members.filter((m) => m.isActive);

  const totals: MemberTotals[] = activeMembers.map((m) => {
    const mine = ranged.filter((l) => l.memberId === m.id);
    return {
      memberId: m.id,
      displayName: m.displayName,
      teamId: m.teamId,
      teamName: m.teamName,
      userId: m.userId,
      isAdmin: m.isAdmin,
      studyMinutes: mine.reduce((s, l) => s + l.studyMinutes, 0),
      camMinutes: mine.reduce((s, l) => s + l.camMinutes, 0),
      score: mine.reduce((s, l) => s + l.score, 0),
      daysLogged: mine.filter((l) => l.studyMinutes + l.camMinutes + l.score > 0).length,
      rank: 0,
    };
  });

  const individual = assignRanks(totals, args.metric);

  const teamBoard: TeamTotals[] = assignRanks(
    args.teams.map((team) => {
      const members = individual.filter((m) => m.teamId === team.id);
      return {
        teamId: team.id,
        name: team.name,
        studyMinutes: members.reduce((s, m) => s + m.studyMinutes, 0),
        camMinutes: members.reduce((s, m) => s + m.camMinutes, 0),
        score: members.reduce((s, m) => s + m.score, 0),
        memberCount: members.length,
        rank: 0,
        members: members.sort((a, b) => metricValue(b, args.metric) - metricValue(a, args.metric)),
      };
    }),
    args.metric,
  );

  const todayLog =
    args.viewer.memberId == null
      ? null
      : (args.logs.find((l) => l.memberId === args.viewer.memberId && l.logDate === args.today) ?? null);

  return {
    viewer: args.viewer,
    period: args.period,
    metric: args.metric,
    rangeStart: start,
    rangeEnd: end,
    teams: args.teams,
    members: args.members,
    logs: ranged,
    individual,
    teamBoard,
    unaffiliated: individual.filter((m) => m.teamId == null),
    todayLog,
  };
}

async function fetchLeagueParts(sql: Sql) {
  const teamRows = await sql<TeamRow>`select id, name from teams order by lower(name)`;
  const memberRows = await sql<
    MemberRow & { team_name: string | null; is_admin: boolean }
  >`
    select
      m.id, m.user_id, m.display_name, m.team_id, m.is_active,
      t.name as team_name,
      coalesce(p.role = 'admin', false) as is_admin
    from members m
    left join teams t on t.id = m.team_id
    left join profiles p on p.user_id = m.user_id
    order by lower(m.display_name)
  `;
  const logRows = await sql<LogRow>`
    select id, member_id, log_date, study_minutes, cam_minutes, score, notes
    from daily_logs
    order by log_date desc, id desc
  `;
  const teams: Team[] = teamRows.map((t) => ({ id: t.id, name: t.name }));
  const members: Member[] = memberRows.map((m) => ({
    id: m.id,
    userId: m.user_id,
    displayName: m.display_name,
    teamId: m.team_id,
    teamName: m.team_name,
    isActive: m.is_active,
    isAdmin: Boolean(m.is_admin),
  }));
  const logs = logRows.map(mapLog);
  return { teams, members, logs };
}

const leagueInput = z.object({
  period: periodSchema,
  metric: metricSchema,
  today: z.string().regex(dateRe),
});

export const getLeague = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => leagueInput.parse(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const viewer = await loadViewer(sql, context.userId);
    const today = assertDate(data.today, "date");
    const { teams, members, logs } = await fetchLeagueParts(sql);
    return buildSnapshot({
      viewer,
      period: data.period,
      metric: data.metric,
      today,
      teams,
      members,
      logs,
    });
  });

export const getMe = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return loadViewer(sql, context.userId);
  });

const memberIdInput = z.object({ memberId: z.number().int().positive() });

export const getMemberDetail = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => memberIdInput.parse(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await loadViewer(sql, context.userId);
    const memberRows = await sql<
      MemberRow & { team_name: string | null; is_admin: boolean }
    >`
      select
        m.id, m.user_id, m.display_name, m.team_id, m.is_active,
        t.name as team_name,
        coalesce(p.role = 'admin', false) as is_admin
      from members m
      left join teams t on t.id = m.team_id
      left join profiles p on p.user_id = m.user_id
      where m.id = ${data.memberId}
    `;
    const row = memberRows[0];
    if (!row) throw new Error("Member not found");
    const member: Member = {
      id: row.id,
      userId: row.user_id,
      displayName: row.display_name,
      teamId: row.team_id,
      teamName: row.team_name,
      isActive: row.is_active,
      isAdmin: Boolean(row.is_admin),
    };
    const logRows = await sql<LogRow>`
      select id, member_id, log_date, study_minutes, cam_minutes, score, notes
      from daily_logs
      where member_id = ${data.memberId}
      order by log_date desc
    `;
    const logs = logRows.map(mapLog);
    const totals = {
      studyMinutes: logs.reduce((s, l) => s + l.studyMinutes, 0),
      camMinutes: logs.reduce((s, l) => s + l.camMinutes, 0),
      score: logs.reduce((s, l) => s + l.score, 0),
      daysLogged: logs.length,
    };
    return { member, logs, totals };
  });

const upsertLogInput = z.object({
  date: z.string().regex(dateRe),
  today: z.string().regex(dateRe),
  studyMinutes: z.number().int().min(0).max(24 * 60),
  camMinutes: z.number().int().min(0).max(24 * 60),
  score: z.number().min(0).max(1_000_000),
  notes: z.string().max(400).optional(),
});

export const upsertMyLog = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => upsertLogInput.parse(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const viewer = await loadViewer(sql, context.userId);
    if (viewer.memberId == null || !viewer.memberActive) {
      throw new Error("You are not on the board. Ask an admin to restore you.");
    }
    if (data.date > data.today) throw new Error("Cannot log a future date");
    const serverToday = serverIsoDate();
    if (data.today > addDays(serverToday, 1) || data.today < addDays(serverToday, -2)) {
      throw new Error("Date looks out of range");
    }
    const notes = data.notes?.trim() ? data.notes.trim() : null;
    await sql`
      insert into daily_logs (member_id, log_date, study_minutes, cam_minutes, score, notes, updated_by, updated_at)
      values (
        ${viewer.memberId}, ${data.date}, ${data.studyMinutes}, ${data.camMinutes},
        ${data.score}, ${notes}, ${context.userId}, now()
      )
      on conflict (member_id, log_date) do update set
        study_minutes = excluded.study_minutes,
        cam_minutes = excluded.cam_minutes,
        score = excluded.score,
        notes = excluded.notes,
        updated_by = excluded.updated_by,
        updated_at = now()
    `;
    return { ok: true as const };
  });

const nameInput = z.object({ displayName: z.string().trim().min(1).max(48) });

export const updateMyName = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => nameInput.parse(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const viewer = await loadViewer(sql, context.userId);
    const name = data.displayName.trim();
    await sql`update profiles set display_name = ${name} where user_id = ${context.userId}`;
    if (viewer.memberId != null) {
      await sql`update members set display_name = ${name} where id = ${viewer.memberId}`;
    }
    return { ok: true as const };
  });

const adminAddMemberInput = z.object({
  displayName: z.string().trim().min(1).max(48),
  teamId: z.number().int().positive().nullable(),
});

export const adminAddMember = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => adminAddMemberInput.parse(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    const name = data.displayName.trim();
    await sql`
      insert into members (user_id, display_name, team_id, is_active)
      values (null, ${name}, ${data.teamId}, true)
    `;
    return { ok: true as const };
  });

const adminUpdateMemberInput = z.object({
  memberId: z.number().int().positive(),
  displayName: z.string().trim().min(1).max(48).optional(),
  teamId: z.number().int().positive().nullable().optional(),
  isActive: z.boolean().optional(),
});

export const adminUpdateMember = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => adminUpdateMemberInput.parse(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    const rows = await sql<MemberRow>`
      select id, user_id, display_name, team_id, is_active from members where id = ${data.memberId}
    `;
    const member = rows[0];
    if (!member) throw new Error("Member not found");
    const displayName = data.displayName?.trim() ?? member.display_name;
    const teamId = data.teamId === undefined ? member.team_id : data.teamId;
    const isActive = data.isActive ?? member.is_active;
    await sql`
      update members
      set display_name = ${displayName}, team_id = ${teamId}, is_active = ${isActive}
      where id = ${data.memberId}
    `;
    if (member.user_id && data.displayName) {
      await sql`update profiles set display_name = ${displayName} where user_id = ${member.user_id}`;
    }
    return { ok: true as const };
  });

export const adminRemoveMember = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => memberIdInput.parse(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const viewer = await requireAdmin(sql, context.userId);
    const rows = await sql<MemberRow>`
      select id, user_id, display_name, team_id, is_active from members where id = ${data.memberId}
    `;
    const member = rows[0];
    if (!member) throw new Error("Member not found");
    if (member.user_id === viewer.userId) {
      throw new Error("You cannot remove yourself");
    }
    await sql`update members set is_active = false, team_id = null where id = ${data.memberId}`;
    return { ok: true as const };
  });

const teamNameInput = z.object({ name: z.string().trim().min(1).max(48) });

export const adminAddTeam = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => teamNameInput.parse(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    const name = data.name.trim();
    const clash = await sql<TeamRow>`select id, name from teams where lower(name) = lower(${name})`;
    if (clash[0]) throw new Error("A group with that name already exists");
    await sql`insert into teams (name) values (${name})`;
    return { ok: true as const };
  });

const adminRenameTeamInput = z.object({
  teamId: z.number().int().positive(),
  name: z.string().trim().min(1).max(48),
});

export const adminRenameTeam = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => adminRenameTeamInput.parse(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    const name = data.name.trim();
    const clash = await sql<TeamRow>`
      select id, name from teams where lower(name) = lower(${name}) and id <> ${data.teamId}
    `;
    if (clash[0]) throw new Error("A group with that name already exists");
    await sql`update teams set name = ${name} where id = ${data.teamId}`;
    return { ok: true as const };
  });

const teamIdInput = z.object({ teamId: z.number().int().positive() });

export const adminDeleteTeam = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => teamIdInput.parse(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    await sql`update members set team_id = null where team_id = ${data.teamId}`;
    await sql`delete from teams where id = ${data.teamId}`;
    return { ok: true as const };
  });

const adminUpsertLogInput = upsertLogInput.extend({
  memberId: z.number().int().positive(),
});

export const adminUpsertLog = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => adminUpsertLogInput.parse(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    if (data.date > data.today) throw new Error("Cannot log a future date");
    const notes = data.notes?.trim() ? data.notes.trim() : null;
    const exists = await sql<MemberRow>`
      select id, user_id, display_name, team_id, is_active from members where id = ${data.memberId}
    `;
    if (!exists[0]) throw new Error("Member not found");
    await sql`
      insert into daily_logs (member_id, log_date, study_minutes, cam_minutes, score, notes, updated_by, updated_at)
      values (
        ${data.memberId}, ${data.date}, ${data.studyMinutes}, ${data.camMinutes},
        ${data.score}, ${notes}, ${context.userId}, now()
      )
      on conflict (member_id, log_date) do update set
        study_minutes = excluded.study_minutes,
        cam_minutes = excluded.cam_minutes,
        score = excluded.score,
        notes = excluded.notes,
        updated_by = excluded.updated_by,
        updated_at = now()
    `;
    return { ok: true as const };
  });

const adminSetRoleInput = z.object({
  userId: z.string().min(1),
  role: z.enum(["admin", "participant"]),
});

export const adminSetRole = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => adminSetRoleInput.parse(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const viewer = await requireAdmin(sql, context.userId);
    if (data.userId === viewer.userId && data.role !== "admin") {
      throw new Error("You cannot demote yourself");
    }
    const updated = await sql<ProfileRow>`
      update profiles set role = ${data.role} where user_id = ${data.userId}
      returning user_id, display_name, role
    `;
    if (!updated[0]) throw new Error("That person does not have an account yet");
    return { ok: true as const };
  });
