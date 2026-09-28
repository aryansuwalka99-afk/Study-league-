import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as formatScore, r as formatMinutes, s as localToday } from "./utils-Cd5yxydh.mjs";
import { _ as useLeague, a as CardHeader, i as CardDescription, n as Card, o as CardTitle, r as CardContent, s as Skeleton, t as AppShell, v as useMe } from "./hooks-DwiKxJ2Y.mjs";
import { t as PeriodBar } from "./period-bar-Dpe-by-T.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/board-DRwDeNg-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RankTable({ rows, metric, empty }) {
	if (rows.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "py-8 text-center text-sm text-muted-foreground",
		children: empty
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[34rem] text-left text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b border-border text-xs tracking-wide text-muted-foreground uppercase",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-2 pr-3 font-medium",
						children: "Rank"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-2 pr-3 font-medium",
						children: "Name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-2 pr-3 font-medium",
						children: "Group"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-2 pr-3 text-right font-medium",
						children: "Study"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-2 pr-3 text-right font-medium",
						children: "Cam"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-2 text-right font-medium",
						children: "Score"
					})
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b border-border/70 last:border-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-3 pr-3 font-mono text-xs tabular-nums text-muted-foreground",
						children: row.rank
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-3 pr-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/people/$memberId",
							params: { memberId: String(row.memberId) },
							className: "font-medium hover:underline",
							children: row.displayName
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-3 pr-3 text-muted-foreground",
						children: row.teamName ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-3 pr-3 text-right font-mono text-xs tabular-nums",
						children: formatMinutes(row.studyMinutes)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-3 pr-3 text-right font-mono text-xs tabular-nums",
						children: formatMinutes(row.camMinutes)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-3 text-right font-mono text-xs tabular-nums",
						children: formatScore(row.score)
					})
				]
			}, row.memberId)) })]
		})
	});
}
function BoardPage() {
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
						children: "Everyone"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-4xl font-medium tracking-tight",
						children: "Board"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-xl text-sm text-muted-foreground",
						children: "Every participant, every score. Rank by score, study time, or cam time."
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
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Individual ranking" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, { children: [period === "today" ? "Today" : period === "week" ? "This week" : "All logged days", " · tap a name for the full history."] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: league.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankTable, {
					rows: league.data?.individual ?? [],
					metric,
					empty: "No one is on the board yet."
				}) })]
			})
		]
	});
}
//#endregion
export { BoardPage as component };
