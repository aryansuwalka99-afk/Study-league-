import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as formatScore, i as formatPrettyDate, r as formatMinutes, s as localToday } from "./utils-Cd5yxydh.mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as useLeague, a as CardHeader, g as upsertMyLog, i as CardDescription, n as Card, o as CardTitle, r as CardContent, s as Skeleton, t as AppShell, v as useMe } from "./hooks-DwiKxJ2Y.mjs";
import { t as LogForm } from "./log-form-BBsD8yR2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-1Gw388Wz.js
var import_jsx_runtime = require_jsx_runtime();
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
		onError: (err) => toast.error(err instanceof Error ? err.message : "Could not save")
	});
	const snapshot = league.data;
	const viewer = snapshot?.viewer ?? me.data;
	const mine = snapshot?.individual.find((r) => r.memberId === viewer?.memberId);
	const top = snapshot?.individual.slice(0, 3) ?? [];
	const topTeam = snapshot?.teamBoard[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		isAdmin: viewer?.role === "admin",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.18em] text-muted-foreground uppercase",
					children: formatPrettyDate(today)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-4xl font-medium tracking-tight",
					children: viewer ? `Hello, ${viewer.displayName}` : "Today"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xl text-sm text-muted-foreground",
					children: "Put in study time, cam time, and your score. The whole league can see every entry."
				})
			]
		}), league.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96 rounded-xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96 rounded-xl" })]
		}) : league.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-destructive",
			children: "Could not load the league. Try signing in again."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Log today" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: viewer?.memberActive ? "Update today’s numbers anytime. Past days stay on your page." : "You are not on the board. Ask an admin to add or restore your name." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: viewer?.memberActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogForm, {
				today,
				initial: snapshot?.todayLog,
				submitting: save.isPending,
				submitLabel: snapshot?.todayLog ? "Update today" : "Save today",
				showDate: false,
				onSubmit: (values) => save.mutate({ data: {
					date: today,
					today,
					studyMinutes: values.studyMinutes,
					camMinutes: values.camMinutes,
					score: values.score,
					notes: values.notes
				} })
			}) : null })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "This week" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Your totals across the league week." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
								label: "Study",
								value: formatMinutes(mine?.studyMinutes ?? 0)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
								label: "Cam",
								value: formatMinutes(mine?.camMinutes ?? 0)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
								label: "Score",
								value: formatScore(mine?.score ?? 0)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm text-muted-foreground",
						children: [mine ? `Board rank ${mine.rank} of ${snapshot?.individual.length ?? 0}` : "Log today to appear on the board.", viewer?.teamName ? ` · ${viewer.teamName}` : ""]
					}),
					viewer?.memberId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/people/$memberId",
						params: { memberId: String(viewer.memberId) },
						className: "mt-3 inline-block text-sm underline-offset-4 hover:underline",
						children: "See every score"
					}) : null
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Leaders" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Week ranking by score." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "grid gap-3",
					children: [
						top.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "No logs this week yet."
						}) : top.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/people/$memberId",
							params: { memberId: String(row.memberId) },
							className: "flex items-center justify-between gap-3 rounded-md bg-secondary px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "truncate",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mr-2 font-mono text-xs text-muted-foreground",
									children: row.rank
								}), row.displayName]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs tabular-nums",
								children: formatScore(row.score)
							})]
						}, row.memberId)),
						topTeam ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: ["Team challenge lead: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground",
								children: topTeam.name
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-4 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/board",
								className: "underline-offset-4 hover:underline",
								children: "Full board"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/teams",
								className: "underline-offset-4 hover:underline",
								children: "Team ranking"
							})]
						})
					]
				})] })]
			})]
		})]
	});
}
function MiniStat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-secondary px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] tracking-wide text-muted-foreground uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-mono text-sm tabular-nums",
			children: value
		})]
	});
}
//#endregion
export { Home as component };
