import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { c as mondayOf, t as addDays } from "./utils-Cd5yxydh.mjs";
import { A as boolean, D as _enum, F as object, P as number, R as string } from "../_libs/@better-auth/core+[...].mjs";
import { r as getSql } from "./db-DEqfbW0n.mjs";
import { t as authMiddleware } from "./middleware-BcNOIurl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-DjHEix_y.js
var dateRe = /^\d{4}-\d{2}-\d{2}$/;
var periodSchema = _enum([
	"today",
	"week",
	"all"
]);
var metricSchema = _enum([
	"score",
	"study",
	"cam"
]);
function asNumber(v) {
	if (typeof v === "number") return Number.isFinite(v) ? v : 0;
	if (typeof v === "string") {
		const n = Number(v);
		return Number.isFinite(n) ? n : 0;
	}
	return 0;
}
function mapLog(row) {
	return {
		id: row.id,
		memberId: row.member_id,
		logDate: row.log_date,
		studyMinutes: asNumber(row.study_minutes),
		camMinutes: asNumber(row.cam_minutes),
		score: asNumber(row.score),
		notes: row.notes
	};
}
function serverIsoDate() {
	return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function assertDate(value, label) {
	if (!dateRe.test(value)) throw new Error(`Invalid ${label}`);
	return value;
}
function rangeFor(period, today) {
	if (period === "today") return {
		start: today,
		end: today
	};
	if (period === "week") return {
		start: mondayOf(today),
		end: addDays(mondayOf(today), 6)
	};
	return {
		start: null,
		end: today
	};
}
function inRange(logDate, start, end) {
	if (logDate > end) return false;
	if (start && logDate < start) return false;
	return true;
}
function metricValue(row, metric) {
	if (metric === "study") return row.studyMinutes;
	if (metric === "cam") return row.camMinutes;
	return row.score;
}
function assignRanks(rows, metric) {
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
		return {
			...row,
			rank
		};
	});
}
async function ensureProfile(sql, userId) {
	const existing = await sql`
    select user_id, display_name, role from profiles where user_id = ${userId}
  `;
	if (existing[0]) {
		if (!(await sql`
      select id, user_id, display_name, team_id, is_active from members where user_id = ${userId}
    `)[0]) await sql`
        insert into members (user_id, display_name, is_active)
        values (${userId}, ${existing[0].display_name}, true)
      `;
		return;
	}
	const authUsers = await sql`
    select name, email from "user" where id = ${userId}
  `;
	const displayName = (authUsers[0]?.name?.trim() || authUsers[0]?.email?.split("@")[0] || "Participant").slice(0, 48);
	await sql`
    insert into profiles (user_id, display_name, role)
    values (${userId}, ${displayName}, ${((await sql`
    select count(*)::int as n from profiles where role = 'admin'
  `)[0]?.n ?? 0) === 0 ? "admin" : "participant"})
    on conflict (user_id) do nothing
  `;
	await sql`
    insert into members (user_id, display_name, is_active)
    values (${userId}, ${displayName}, true)
    on conflict (user_id) do nothing
  `;
}
async function loadViewer(sql, userId) {
	await ensureProfile(sql, userId);
	const profile = (await sql`
    select user_id, display_name, role from profiles where user_id = ${userId}
  `)[0];
	if (!profile) throw new Error("Profile missing");
	const member = (await sql`
    select m.id, m.user_id, m.display_name, m.team_id, m.is_active, t.name as team_name
    from members m
    left join teams t on t.id = m.team_id
    where m.user_id = ${userId}
  `)[0];
	return {
		userId,
		displayName: member?.display_name ?? profile.display_name,
		role: profile.role,
		memberId: member ? member.id : null,
		memberActive: member ? member.is_active : false,
		teamId: member?.team_id ?? null,
		teamName: member?.team_name ?? null
	};
}
async function requireAdmin(sql, userId) {
	const viewer = await loadViewer(sql, userId);
	if (viewer.role !== "admin") throw new Error("Forbidden");
	return viewer;
}
function buildSnapshot(args) {
	const { start, end } = rangeFor(args.period, args.today);
	const ranged = args.logs.filter((l) => inRange(l.logDate, start, end));
	const individual = assignRanks(args.members.filter((m) => m.isActive).map((m) => {
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
			rank: 0
		};
	}), args.metric);
	const teamBoard = assignRanks(args.teams.map((team) => {
		const members = individual.filter((m) => m.teamId === team.id);
		return {
			teamId: team.id,
			name: team.name,
			studyMinutes: members.reduce((s, m) => s + m.studyMinutes, 0),
			camMinutes: members.reduce((s, m) => s + m.camMinutes, 0),
			score: members.reduce((s, m) => s + m.score, 0),
			memberCount: members.length,
			rank: 0,
			members: members.sort((a, b) => metricValue(b, args.metric) - metricValue(a, args.metric))
		};
	}), args.metric);
	const todayLog = args.viewer.memberId == null ? null : args.logs.find((l) => l.memberId === args.viewer.memberId && l.logDate === args.today) ?? null;
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
		todayLog
	};
}
async function fetchLeagueParts(sql) {
	const teamRows = await sql`select id, name from teams order by lower(name)`;
	const memberRows = await sql`
    select
      m.id, m.user_id, m.display_name, m.team_id, m.is_active,
      t.name as team_name,
      coalesce(p.role = 'admin', false) as is_admin
    from members m
    left join teams t on t.id = m.team_id
    left join profiles p on p.user_id = m.user_id
    order by lower(m.display_name)
  `;
	const logRows = await sql`
    select id, member_id, log_date, study_minutes, cam_minutes, score, notes
    from daily_logs
    order by log_date desc, id desc
  `;
	return {
		teams: teamRows.map((t) => ({
			id: t.id,
			name: t.name
		})),
		members: memberRows.map((m) => ({
			id: m.id,
			userId: m.user_id,
			displayName: m.display_name,
			teamId: m.team_id,
			teamName: m.team_name,
			isActive: m.is_active,
			isAdmin: Boolean(m.is_admin)
		})),
		logs: logRows.map(mapLog)
	};
}
var leagueInput = object({
	period: periodSchema,
	metric: metricSchema,
	today: string().regex(dateRe)
});
var getLeague_createServerFn_handler = createServerRpc({
	id: "069113cece55bec7e277eee2a5f32b61a5bde3525f86b229f50cf76fc549b368",
	name: "getLeague",
	filename: "src/lib/league/api.ts"
}, (opts) => getLeague.__executeServer(opts));
var getLeague = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => leagueInput.parse(input)).handler(getLeague_createServerFn_handler, async ({ context, data }) => {
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
		logs
	});
});
var getMe_createServerFn_handler = createServerRpc({
	id: "4912ed8e8ab2cd67a8bda4bdd84b3c37af2ed3e410b40706ab2eac199a6f6332",
	name: "getMe",
	filename: "src/lib/league/api.ts"
}, (opts) => getMe.__executeServer(opts));
var getMe = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMe_createServerFn_handler, async ({ context }) => {
	return loadViewer(await getSql(), context.userId);
});
var memberIdInput = object({ memberId: number().int().positive() });
var getMemberDetail_createServerFn_handler = createServerRpc({
	id: "b5aa31426c7ebb71eea3d4c9387064d91e4f7cd2662c6f64373767228c8955b8",
	name: "getMemberDetail",
	filename: "src/lib/league/api.ts"
}, (opts) => getMemberDetail.__executeServer(opts));
var getMemberDetail = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => memberIdInput.parse(input)).handler(getMemberDetail_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await loadViewer(sql, context.userId);
	const row = (await sql`
      select
        m.id, m.user_id, m.display_name, m.team_id, m.is_active,
        t.name as team_name,
        coalesce(p.role = 'admin', false) as is_admin
      from members m
      left join teams t on t.id = m.team_id
      left join profiles p on p.user_id = m.user_id
      where m.id = ${data.memberId}
    `)[0];
	if (!row) throw new Error("Member not found");
	const member = {
		id: row.id,
		userId: row.user_id,
		displayName: row.display_name,
		teamId: row.team_id,
		teamName: row.team_name,
		isActive: row.is_active,
		isAdmin: Boolean(row.is_admin)
	};
	const logs = (await sql`
      select id, member_id, log_date, study_minutes, cam_minutes, score, notes
      from daily_logs
      where member_id = ${data.memberId}
      order by log_date desc
    `).map(mapLog);
	return {
		member,
		logs,
		totals: {
			studyMinutes: logs.reduce((s, l) => s + l.studyMinutes, 0),
			camMinutes: logs.reduce((s, l) => s + l.camMinutes, 0),
			score: logs.reduce((s, l) => s + l.score, 0),
			daysLogged: logs.length
		}
	};
});
var upsertLogInput = object({
	date: string().regex(dateRe),
	today: string().regex(dateRe),
	studyMinutes: number().int().min(0).max(1440),
	camMinutes: number().int().min(0).max(1440),
	score: number().min(0).max(1e6),
	notes: string().max(400).optional()
});
var upsertMyLog_createServerFn_handler = createServerRpc({
	id: "47ef7b32bc5e8eebab1670ddaa6f9204414dba3c0764d6fec96f89375c440611",
	name: "upsertMyLog",
	filename: "src/lib/league/api.ts"
}, (opts) => upsertMyLog.__executeServer(opts));
var upsertMyLog = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => upsertLogInput.parse(input)).handler(upsertMyLog_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const viewer = await loadViewer(sql, context.userId);
	if (viewer.memberId == null || !viewer.memberActive) throw new Error("You are not on the board. Ask an admin to restore you.");
	if (data.date > data.today) throw new Error("Cannot log a future date");
	const serverToday = serverIsoDate();
	if (data.today > addDays(serverToday, 1) || data.today < addDays(serverToday, -2)) throw new Error("Date looks out of range");
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
	return { ok: true };
});
var nameInput = object({ displayName: string().trim().min(1).max(48) });
var updateMyName_createServerFn_handler = createServerRpc({
	id: "a771e0003465a5bff7441ae3a4c8c37e1043508c89e1675bcdb8e590b8276459",
	name: "updateMyName",
	filename: "src/lib/league/api.ts"
}, (opts) => updateMyName.__executeServer(opts));
var updateMyName = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => nameInput.parse(input)).handler(updateMyName_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const viewer = await loadViewer(sql, context.userId);
	const name = data.displayName.trim();
	await sql`update profiles set display_name = ${name} where user_id = ${context.userId}`;
	if (viewer.memberId != null) await sql`update members set display_name = ${name} where id = ${viewer.memberId}`;
	return { ok: true };
});
var adminAddMemberInput = object({
	displayName: string().trim().min(1).max(48),
	teamId: number().int().positive().nullable()
});
var adminAddMember_createServerFn_handler = createServerRpc({
	id: "db7b75e3ae093c30023e7a01d7bdfe87d2fd4cef5bdf91e7eb7493ff7a691740",
	name: "adminAddMember",
	filename: "src/lib/league/api.ts"
}, (opts) => adminAddMember.__executeServer(opts));
var adminAddMember = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => adminAddMemberInput.parse(input)).handler(adminAddMember_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	await sql`
      insert into members (user_id, display_name, team_id, is_active)
      values (null, ${data.displayName.trim()}, ${data.teamId}, true)
    `;
	return { ok: true };
});
var adminUpdateMemberInput = object({
	memberId: number().int().positive(),
	displayName: string().trim().min(1).max(48).optional(),
	teamId: number().int().positive().nullable().optional(),
	isActive: boolean().optional()
});
var adminUpdateMember_createServerFn_handler = createServerRpc({
	id: "ac1dadf47d2a5043ccf4c1379b5ebe931939af635dde5088d9a52a87f3626d0a",
	name: "adminUpdateMember",
	filename: "src/lib/league/api.ts"
}, (opts) => adminUpdateMember.__executeServer(opts));
var adminUpdateMember = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => adminUpdateMemberInput.parse(input)).handler(adminUpdateMember_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	const member = (await sql`
      select id, user_id, display_name, team_id, is_active from members where id = ${data.memberId}
    `)[0];
	if (!member) throw new Error("Member not found");
	const displayName = data.displayName?.trim() ?? member.display_name;
	await sql`
      update members
      set display_name = ${displayName}, team_id = ${data.teamId === void 0 ? member.team_id : data.teamId}, is_active = ${data.isActive ?? member.is_active}
      where id = ${data.memberId}
    `;
	if (member.user_id && data.displayName) await sql`update profiles set display_name = ${displayName} where user_id = ${member.user_id}`;
	return { ok: true };
});
var adminRemoveMember_createServerFn_handler = createServerRpc({
	id: "6eb642846100289b89aca931cd9ee39a1e878245b4400e17114b066e0973ec60",
	name: "adminRemoveMember",
	filename: "src/lib/league/api.ts"
}, (opts) => adminRemoveMember.__executeServer(opts));
var adminRemoveMember = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => memberIdInput.parse(input)).handler(adminRemoveMember_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const viewer = await requireAdmin(sql, context.userId);
	const member = (await sql`
      select id, user_id, display_name, team_id, is_active from members where id = ${data.memberId}
    `)[0];
	if (!member) throw new Error("Member not found");
	if (member.user_id === viewer.userId) throw new Error("You cannot remove yourself");
	await sql`update members set is_active = false, team_id = null where id = ${data.memberId}`;
	return { ok: true };
});
var teamNameInput = object({ name: string().trim().min(1).max(48) });
var adminAddTeam_createServerFn_handler = createServerRpc({
	id: "4c010247ad5d37879b64a72d8fcc46a572d7e68bb8f6b109a9ecffe40e865562",
	name: "adminAddTeam",
	filename: "src/lib/league/api.ts"
}, (opts) => adminAddTeam.__executeServer(opts));
var adminAddTeam = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => teamNameInput.parse(input)).handler(adminAddTeam_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	const name = data.name.trim();
	if ((await sql`select id, name from teams where lower(name) = lower(${name})`)[0]) throw new Error("A group with that name already exists");
	await sql`insert into teams (name) values (${name})`;
	return { ok: true };
});
var adminRenameTeamInput = object({
	teamId: number().int().positive(),
	name: string().trim().min(1).max(48)
});
var adminRenameTeam_createServerFn_handler = createServerRpc({
	id: "b9925ac6c6c950d501604eacb333ccd3cf032f593005dd8e55b42777450e0093",
	name: "adminRenameTeam",
	filename: "src/lib/league/api.ts"
}, (opts) => adminRenameTeam.__executeServer(opts));
var adminRenameTeam = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => adminRenameTeamInput.parse(input)).handler(adminRenameTeam_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	const name = data.name.trim();
	if ((await sql`
      select id, name from teams where lower(name) = lower(${name}) and id <> ${data.teamId}
    `)[0]) throw new Error("A group with that name already exists");
	await sql`update teams set name = ${name} where id = ${data.teamId}`;
	return { ok: true };
});
var teamIdInput = object({ teamId: number().int().positive() });
var adminDeleteTeam_createServerFn_handler = createServerRpc({
	id: "76aa006933b0edc25389c92342f22da400bd232d6884beb3373bfab4287a718b",
	name: "adminDeleteTeam",
	filename: "src/lib/league/api.ts"
}, (opts) => adminDeleteTeam.__executeServer(opts));
var adminDeleteTeam = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => teamIdInput.parse(input)).handler(adminDeleteTeam_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	await sql`update members set team_id = null where team_id = ${data.teamId}`;
	await sql`delete from teams where id = ${data.teamId}`;
	return { ok: true };
});
var adminUpsertLogInput = upsertLogInput.extend({ memberId: number().int().positive() });
var adminUpsertLog_createServerFn_handler = createServerRpc({
	id: "340129dc05d4e38e939bde095783b0e0398c097c511d34ac69a0f1852573e935",
	name: "adminUpsertLog",
	filename: "src/lib/league/api.ts"
}, (opts) => adminUpsertLog.__executeServer(opts));
var adminUpsertLog = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => adminUpsertLogInput.parse(input)).handler(adminUpsertLog_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	if (data.date > data.today) throw new Error("Cannot log a future date");
	const notes = data.notes?.trim() ? data.notes.trim() : null;
	if (!(await sql`
      select id, user_id, display_name, team_id, is_active from members where id = ${data.memberId}
    `)[0]) throw new Error("Member not found");
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
	return { ok: true };
});
var adminSetRoleInput = object({
	userId: string().min(1),
	role: _enum(["admin", "participant"])
});
var adminSetRole_createServerFn_handler = createServerRpc({
	id: "433a7ec39d882556efdc549f87713edcfa74e3daa34b3dcfb509cde7fc237828",
	name: "adminSetRole",
	filename: "src/lib/league/api.ts"
}, (opts) => adminSetRole.__executeServer(opts));
var adminSetRole = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => adminSetRoleInput.parse(input)).handler(adminSetRole_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const viewer = await requireAdmin(sql, context.userId);
	if (data.userId === viewer.userId && data.role !== "admin") throw new Error("You cannot demote yourself");
	if (!(await sql`
      update profiles set role = ${data.role} where user_id = ${data.userId}
      returning user_id, display_name, role
    `)[0]) throw new Error("That person does not have an account yet");
	return { ok: true };
});
//#endregion
export { adminAddMember_createServerFn_handler, adminAddTeam_createServerFn_handler, adminDeleteTeam_createServerFn_handler, adminRemoveMember_createServerFn_handler, adminRenameTeam_createServerFn_handler, adminSetRole_createServerFn_handler, adminUpdateMember_createServerFn_handler, adminUpsertLog_createServerFn_handler, getLeague_createServerFn_handler, getMe_createServerFn_handler, getMemberDetail_createServerFn_handler, updateMyName_createServerFn_handler, upsertMyLog_createServerFn_handler };
