import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay, i as DialogDescription$1, n as DialogClose, o as DialogPortal, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as cn, s as localToday } from "./utils-Cd5yxydh.mjs";
import { t as X } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as useLeague, a as CardHeader, c as adminAddMember, d as adminRemoveMember, f as adminRenameTeam, h as adminUpsertLog, i as CardDescription, l as adminAddTeam, m as adminUpdateMember, n as Card, o as CardTitle, p as adminSetRole, r as CardContent, s as Skeleton, t as AppShell, u as adminDeleteTeam, v as useMe } from "./hooks-DwiKxJ2Y.mjs";
import { n as Input, r as Label, t as Button } from "./label-C78Prz9B.mjs";
import { t as LogForm } from "./log-form-BBsD8yR2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-wHJq-fDh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-background/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-5 shadow-soft", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-3 right-3 grid size-9 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mb-4 pr-8", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-xl font-medium", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("mt-1 text-sm text-muted-foreground", className),
		...props
	});
}
function NativeSelect({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		className: cn("h-11 w-full appearance-none rounded-md border border-input bg-secondary bg-[length:12px] bg-[right_12px_center] bg-no-repeat px-3 pr-9 text-sm text-foreground", "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 fill=%22none%22 stroke=%22%239a9488%22 stroke-width=%221.6%22><path d=%22M2 4l4 4 4-4%22/></svg>')]", "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className),
		...props
	});
}
function AdminPage() {
	const today = localToday();
	const me = useMe();
	const league = useLeague("all", "score", today);
	const viewer = league.data?.viewer ?? me.data;
	if (me.isPending || league.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		isAdmin: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 w-64" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-4 h-96 w-full rounded-xl" })]
	});
	if (viewer && viewer.role !== "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		isAdmin: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.18em] text-muted-foreground uppercase",
					children: "Admin"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-4xl font-medium tracking-tight",
					children: "League desk"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xl text-sm text-muted-foreground",
					children: "Add or remove names, create group names, assign teams, and edit anyone’s daily log. Participants cannot add names."
				})
			]
		}), league.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MembersCard, {
					members: league.data.members,
					teamOptions: league.data.teams
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamsCard, { teams: league.data.teams }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditLogCard, {
					members: league.data.members.filter((m) => m.isActive),
					logs: league.data.logs,
					today
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-destructive",
			children: "Could not load admin tools."
		})]
	});
}
function MembersCard({ members, teamOptions }) {
	const queryClient = useQueryClient();
	const [name, setName] = (0, import_react.useState)("");
	const [teamId, setTeamId] = (0, import_react.useState)("");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [editName, setEditName] = (0, import_react.useState)("");
	const [editTeam, setEditTeam] = (0, import_react.useState)("");
	const invalidate = () => queryClient.invalidateQueries();
	const add = useMutation({
		mutationFn: adminAddMember,
		onSuccess: async () => {
			toast.success("Name added");
			setName("");
			setTeamId("");
			await invalidate();
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "Could not add")
	});
	const update = useMutation({
		mutationFn: adminUpdateMember,
		onSuccess: async () => {
			toast.success("Saved");
			setEditing(null);
			await invalidate();
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "Could not save")
	});
	const remove = useMutation({
		mutationFn: adminRemoveMember,
		onSuccess: async () => {
			toast.success("Removed from the board");
			await invalidate();
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "Could not remove")
	});
	const setRole = useMutation({
		mutationFn: adminSetRole,
		onSuccess: async () => {
			toast.success("Role updated");
			await invalidate();
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "Could not update role")
	});
	const active = members.filter((m) => m.isActive);
	const inactive = members.filter((m) => !m.isActive);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Names" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Add people who are not signed up yet, or tidy names already on the board." })] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "grid gap-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "grid gap-2 sm:grid-cols-[1fr_10rem_auto]",
					onSubmit: (e) => {
						e.preventDefault();
						add.mutate({ data: {
							displayName: name,
							teamId: teamId ? Number(teamId) : null
						} });
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Add a name",
							value: name,
							onChange: (e) => setName(e.target.value),
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
							value: teamId,
							onChange: (e) => setTeamId(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "No group"
							}), teamOptions.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: t.id,
								children: t.name
							}, t.id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: add.isPending,
							children: "Add name"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "divide-y divide-border rounded-lg border border-border",
					children: [active.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-col gap-2 px-3 py-3 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-medium",
								children: m.displayName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									m.teamName ?? "Ungrouped",
									m.userId ? " · Account" : " · Roster",
									m.isAdmin ? " · Admin" : ""
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "secondary",
									onClick: () => {
										setEditing(m);
										setEditName(m.displayName);
										setEditTeam(m.teamId ? String(m.teamId) : "");
									},
									children: "Edit"
								}),
								m.userId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => setRole.mutate({ data: {
										userId: m.userId,
										role: m.isAdmin ? "participant" : "admin"
									} }),
									children: m.isAdmin ? "Make participant" : "Make admin"
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "destructive",
									onClick: () => remove.mutate({ data: { memberId: m.id } }),
									children: "Remove"
								})
							]
						})]
					}, m.id)), active.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "px-3 py-6 text-center text-sm text-muted-foreground",
						children: "No names yet."
					}) : null]
				}),
				inactive.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs tracking-wide text-muted-foreground uppercase",
					children: "Removed"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-2",
					children: inactive.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: m.displayName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => update.mutate({ data: {
								memberId: m.id,
								isActive: true
							} }),
							children: "Restore"
						})]
					}, m.id))
				})] }) : null
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: Boolean(editing),
			onOpenChange: (open) => !open && setEditing(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Rename and assign a group." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-3",
				onSubmit: (e) => {
					e.preventDefault();
					if (!editing) return;
					update.mutate({ data: {
						memberId: editing.id,
						displayName: editName,
						teamId: editTeam ? Number(editTeam) : null
					} });
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "edit-name",
							children: "Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "edit-name",
							value: editName,
							onChange: (e) => setEditName(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "edit-team",
							children: "Group"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
							id: "edit-team",
							value: editTeam,
							onChange: (e) => setEditTeam(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "No group"
							}), teamOptions.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: t.id,
								children: t.name
							}, t.id))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: update.isPending,
						children: "Save"
					})
				]
			})] })
		})
	] });
}
function TeamsCard({ teams }) {
	const queryClient = useQueryClient();
	const [name, setName] = (0, import_react.useState)("");
	const [renaming, setRenaming] = (0, import_react.useState)(null);
	const add = useMutation({
		mutationFn: adminAddTeam,
		onSuccess: async () => {
			toast.success("Group added");
			setName("");
			await queryClient.invalidateQueries();
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "Could not add group")
	});
	const rename = useMutation({
		mutationFn: adminRenameTeam,
		onSuccess: async () => {
			toast.success("Group renamed");
			setRenaming(null);
			await queryClient.invalidateQueries();
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "Could not rename")
	});
	const del = useMutation({
		mutationFn: adminDeleteTeam,
		onSuccess: async () => {
			toast.success("Group removed");
			await queryClient.invalidateQueries();
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "Could not remove group")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Groups" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Team names used on the challenge ranking. Members stay when a group is deleted." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "grid gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "flex flex-col gap-2 sm:flex-row",
			onSubmit: (e) => {
				e.preventDefault();
				add.mutate({ data: { name } });
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "New group name",
				value: name,
				onChange: (e) => setName(e.target.value),
				required: true
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				disabled: add.isPending,
				children: "Add group"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "divide-y divide-border rounded-lg border border-border",
			children: [teams.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "flex items-center justify-between gap-3 px-3 py-3",
				children: renaming?.id === t.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "flex w-full flex-col gap-2 sm:flex-row",
					onSubmit: (e) => {
						e.preventDefault();
						rename.mutate({ data: {
							teamId: t.id,
							name: renaming.name
						} });
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: renaming.name,
						onChange: (e) => setRenaming({
							id: t.id,
							name: e.target.value
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "sm",
						children: "Save"
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: t.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "secondary",
						onClick: () => setRenaming(t),
						children: "Rename"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "destructive",
						onClick: () => del.mutate({ data: { teamId: t.id } }),
						children: "Remove"
					})]
				})] })
			}, t.id)), teams.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "px-3 py-6 text-center text-sm text-muted-foreground",
				children: "No groups yet."
			}) : null]
		})]
	})] });
}
function EditLogCard({ members, logs, today }) {
	const queryClient = useQueryClient();
	const [memberId, setMemberId] = (0, import_react.useState)(members[0] ? String(members[0].id) : "");
	const [date, setDate] = (0, import_react.useState)(today);
	const selected = (0, import_react.useMemo)(() => {
		const id = Number(memberId);
		return logs.find((l) => l.memberId === id && l.logDate === date) ?? null;
	}, [
		logs,
		memberId,
		date
	]);
	const save = useMutation({
		mutationFn: adminUpsertLog,
		onSuccess: async () => {
			toast.success("Log updated");
			await queryClient.invalidateQueries();
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "Could not edit log")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Edit a log" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Change anyone’s study, cam time, or score for a day." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "grid gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "log-member",
					children: "Person"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
					id: "log-member",
					value: memberId,
					onChange: (e) => setMemberId(e.target.value),
					children: members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: m.id,
						children: m.displayName
					}, m.id))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "admin-date",
					children: "Date"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "admin-date",
					type: "date",
					max: today,
					value: date,
					onChange: (e) => setDate(e.target.value)
				})]
			})]
		}), memberId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogForm, {
			today,
			initial: selected ? {
				...selected,
				logDate: date
			} : {
				id: 0,
				memberId: Number(memberId),
				logDate: date,
				studyMinutes: 0,
				camMinutes: 0,
				score: 0,
				notes: null
			},
			showDate: false,
			submitting: save.isPending,
			submitLabel: "Save log",
			onSubmit: (values) => save.mutate({ data: {
				memberId: Number(memberId),
				date,
				today,
				studyMinutes: values.studyMinutes,
				camMinutes: values.camMinutes,
				score: values.score,
				notes: values.notes
			} })
		}, `${memberId}-${date}-${selected?.id ?? "new"}`) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Add a name first."
		})]
	})] });
}
//#endregion
export { AdminPage as component };
