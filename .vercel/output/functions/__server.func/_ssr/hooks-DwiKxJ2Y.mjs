import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { d as useRouterState, v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { n as cn } from "./utils-Cd5yxydh.mjs";
import { A as boolean, D as _enum, F as object, P as number, R as string } from "../_libs/@better-auth/core+[...].mjs";
import { i as signOut } from "./client-B40BzJxt.mjs";
import { a as hasGateSessionMarker } from "./server-RUllGE13.mjs";
import { t as authMiddleware } from "./middleware-BcNOIurl.mjs";
import { a as LayoutGrid, i as Shield, n as Users, o as ClipboardList } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as createSsrRpc } from "./router-CwGtZk7G.mjs";
import { n as useCurrentUserState, t as useCurrentUser } from "./use-current-user-DG6UNzh9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hooks-DwiKxJ2Y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
function Skeleton({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("animate-pulse rounded-md bg-secondary", className) });
}
var nav = [
	{
		to: "/",
		label: "Today",
		icon: ClipboardList
	},
	{
		to: "/board",
		label: "Board",
		icon: LayoutGrid
	},
	{
		to: "/teams",
		label: "Teams",
		icon: Users
	}
];
function AppShell({ children, isAdmin }) {
	const { user, isPending } = useCurrentUserState();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-border px-4 py-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-6 w-36" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-5xl space-y-4 p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full rounded-xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full rounded-xl" })]
		})]
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background pb-20 md:pb-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "font-display text-lg tracking-tight",
							children: "Desk League"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "hidden items-center gap-1 md:flex",
							children: [nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: item.to,
								className: cn("rounded-md px-3 py-2 text-sm transition-colors", pathname === item.to ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"),
								children: item.label
							}, item.to)), isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin",
								className: cn("rounded-md px-3 py-2 text-sm transition-colors", pathname === "/admin" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"),
								children: "Admin"
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-3 [&_img]:size-8 [&_span]:text-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto w-full max-w-5xl px-4 py-6",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] md:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("grid", isAdmin ? "grid-cols-4" : "grid-cols-3"),
					children: [nav.map((item) => {
						const Icon = item.icon;
						const active = pathname === item.to;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex min-h-14 flex-col items-center justify-center gap-1 text-[11px]", active ? "text-foreground" : "text-muted-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.label]
						}, item.to);
					}), isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin",
						className: cn("flex min-h-14 flex-col items-center justify-center gap-1 text-[11px]", pathname === "/admin" ? "text-foreground" : "text-muted-foreground"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-4" }), "Admin"]
					}) : null]
				})
			})
		]
	});
}
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-xl border border-border bg-card text-card-foreground shadow-soft", className),
		...props
	});
}
function CardHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1 p-5 pb-0", className),
		...props
	});
}
function CardTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
		className: cn("font-display text-xl font-medium", className),
		...props
	});
}
function CardDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: cn("text-sm text-muted-foreground", className),
		...props
	});
}
function CardContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("p-5", className),
		...props
	});
}
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
var leagueInput = object({
	period: periodSchema,
	metric: metricSchema,
	today: string().regex(dateRe)
});
var getLeague = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => leagueInput.parse(input)).handler(createSsrRpc("069113cece55bec7e277eee2a5f32b61a5bde3525f86b229f50cf76fc549b368"));
var getMe = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("4912ed8e8ab2cd67a8bda4bdd84b3c37af2ed3e410b40706ab2eac199a6f6332"));
var memberIdInput = object({ memberId: number().int().positive() });
var getMemberDetail = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => memberIdInput.parse(input)).handler(createSsrRpc("b5aa31426c7ebb71eea3d4c9387064d91e4f7cd2662c6f64373767228c8955b8"));
var upsertLogInput = object({
	date: string().regex(dateRe),
	today: string().regex(dateRe),
	studyMinutes: number().int().min(0).max(1440),
	camMinutes: number().int().min(0).max(1440),
	score: number().min(0).max(1e6),
	notes: string().max(400).optional()
});
var upsertMyLog = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => upsertLogInput.parse(input)).handler(createSsrRpc("47ef7b32bc5e8eebab1670ddaa6f9204414dba3c0764d6fec96f89375c440611"));
var nameInput = object({ displayName: string().trim().min(1).max(48) });
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => nameInput.parse(input)).handler(createSsrRpc("a771e0003465a5bff7441ae3a4c8c37e1043508c89e1675bcdb8e590b8276459"));
var adminAddMemberInput = object({
	displayName: string().trim().min(1).max(48),
	teamId: number().int().positive().nullable()
});
var adminAddMember = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => adminAddMemberInput.parse(input)).handler(createSsrRpc("db7b75e3ae093c30023e7a01d7bdfe87d2fd4cef5bdf91e7eb7493ff7a691740"));
var adminUpdateMemberInput = object({
	memberId: number().int().positive(),
	displayName: string().trim().min(1).max(48).optional(),
	teamId: number().int().positive().nullable().optional(),
	isActive: boolean().optional()
});
var adminUpdateMember = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => adminUpdateMemberInput.parse(input)).handler(createSsrRpc("ac1dadf47d2a5043ccf4c1379b5ebe931939af635dde5088d9a52a87f3626d0a"));
var adminRemoveMember = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => memberIdInput.parse(input)).handler(createSsrRpc("6eb642846100289b89aca931cd9ee39a1e878245b4400e17114b066e0973ec60"));
var teamNameInput = object({ name: string().trim().min(1).max(48) });
var adminAddTeam = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => teamNameInput.parse(input)).handler(createSsrRpc("4c010247ad5d37879b64a72d8fcc46a572d7e68bb8f6b109a9ecffe40e865562"));
var adminRenameTeamInput = object({
	teamId: number().int().positive(),
	name: string().trim().min(1).max(48)
});
var adminRenameTeam = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => adminRenameTeamInput.parse(input)).handler(createSsrRpc("b9925ac6c6c950d501604eacb333ccd3cf032f593005dd8e55b42777450e0093"));
var teamIdInput = object({ teamId: number().int().positive() });
var adminDeleteTeam = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => teamIdInput.parse(input)).handler(createSsrRpc("76aa006933b0edc25389c92342f22da400bd232d6884beb3373bfab4287a718b"));
var adminUpsertLogInput = upsertLogInput.extend({ memberId: number().int().positive() });
var adminUpsertLog = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => adminUpsertLogInput.parse(input)).handler(createSsrRpc("340129dc05d4e38e939bde095783b0e0398c097c511d34ac69a0f1852573e935"));
var adminSetRoleInput = object({
	userId: string().min(1),
	role: _enum(["admin", "participant"])
});
var adminSetRole = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => adminSetRoleInput.parse(input)).handler(createSsrRpc("433a7ec39d882556efdc549f87713edcfa74e3daa34b3dcfb509cde7fc237828"));
function useMe() {
	return useQuery({
		queryKey: ["me"],
		queryFn: () => getMe()
	});
}
function useLeague(period, metric, today) {
	return useQuery({
		queryKey: [
			"league",
			period,
			metric,
			today
		],
		queryFn: () => getLeague({ data: {
			period,
			metric,
			today
		} })
	});
}
function useMemberDetail(memberId) {
	return useQuery({
		queryKey: ["member", memberId],
		queryFn: () => getMemberDetail({ data: { memberId } }),
		enabled: Number.isFinite(memberId) && memberId > 0
	});
}
//#endregion
export { useLeague as _, CardHeader as a, adminAddMember as c, adminRemoveMember as d, adminRenameTeam as f, upsertMyLog as g, adminUpsertLog as h, CardDescription as i, adminAddTeam as l, adminUpdateMember as m, Card as n, CardTitle as o, adminSetRole as p, CardContent as r, Skeleton as s, AppShell as t, adminDeleteTeam as u, useMe as v, useMemberDetail as y };
