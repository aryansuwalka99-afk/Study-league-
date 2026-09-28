import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as formatScore, r as formatMinutes, s as localToday } from "./utils-Cd5yxydh.mjs";
import { _ as useLeague, a as CardHeader, i as CardDescription, n as Card, o as CardTitle, r as CardContent, s as Skeleton, t as AppShell, v as useMe } from "./hooks-DwiKxJ2Y.mjs";
import { t as PeriodBar } from "./period-bar-Dpe-by-T.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/teams-SbrBgpem.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TeamBoard({ teams, unaffiliated }) {
	if (teams.length === 0 && unaffiliated.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "py-8 text-center text-sm text-muted-foreground",
		children: "No groups yet. An admin can add group names from Admin."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [teams.map((team) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "rounded-lg border border-border bg-secondary/40",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-end justify-between gap-3 border-b border-border px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-[11px] tracking-wide text-muted-foreground uppercase",
					children: ["Rank ", team.rank]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-xl font-medium",
					children: team.name
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "grid grid-cols-3 gap-4 text-right",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Study",
							value: formatMinutes(team.studyMinutes)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Cam",
							value: formatMinutes(team.camMinutes)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Score",
							value: formatScore(team.score)
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: team.members.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "px-4 py-3 text-sm text-muted-foreground",
				children: "No members in this group yet."
			}) : team.members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center justify-between gap-3 border-b border-border/60 px-4 py-2.5 last:border-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/people/$memberId",
					params: { memberId: String(m.memberId) },
					className: "min-w-0 truncate font-medium hover:underline",
					children: m.displayName
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 gap-4 font-mono text-[11px] tabular-nums text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMinutes(m.studyMinutes) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMinutes(m.camMinutes) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatScore(m.score) })
					]
				})]
			}, m.memberId)) })]
		}, team.teamId)), unaffiliated.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "rounded-lg border border-dashed border-border px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-2 text-sm font-medium text-muted-foreground",
				children: "Ungrouped"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-1",
				children: unaffiliated.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-3 py-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/people/$memberId",
						params: { memberId: String(m.memberId) },
						className: "truncate hover:underline",
						children: m.displayName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[11px] tabular-nums text-muted-foreground",
						children: formatScore(m.score)
					})]
				}, m.memberId))
			})]
		}) : null]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-[10px] tracking-wide text-muted-foreground uppercase",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "font-mono text-xs tabular-nums",
		children: value
	})] });
}
function TeamsPage() {
	const today = localToday();
	const [period, setPeriod] = (0, import_react.useState)("week");
	const [metric, setMetric] = (0, import_react.useState)("score");
	const me = useMe();
	const league = useLeague(period, metric, today);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		isAdmin: (league.data?.viewer ?? me.data)?.role === "admin",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.18em] text-muted-foreground uppercase",
						children: "Challenge"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-4xl font-medium tracking-tight",
						children: "Team ranking"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-xl text-sm text-muted-foreground",
						children: "Groups compete on combined study, cam, and score. Members of the same group sit together."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PeriodBar, {
				period,
				metric,
				onPeriod: setPeriod,
				onMetric: setMetric
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "League groups" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Totals are the sum of everyone in the group for the selected range." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: league.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamBoard, {
					teams: league.data?.teamBoard ?? [],
					unaffiliated: league.data?.unaffiliated ?? []
				}) })]
			})
		]
	});
}
//#endregion
export { TeamsPage as component };
