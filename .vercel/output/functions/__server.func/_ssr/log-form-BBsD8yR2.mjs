import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { l as totalFromHoursMinutes, n as cn, o as hoursMinutesFromTotal } from "./utils-Cd5yxydh.mjs";
import { n as Input, r as Label, t as Button } from "./label-C78Prz9B.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/log-form-BBsD8yR2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-20 w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground", "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className),
		...props
	});
}
function LogForm({ today, initial, submitting, submitLabel, showDate = true, onSubmit }) {
	const study = hoursMinutesFromTotal(initial?.studyMinutes ?? 0);
	const cam = hoursMinutesFromTotal(initial?.camMinutes ?? 0);
	const [date, setDate] = (0, import_react.useState)(initial?.logDate ?? today);
	const [studyH, setStudyH] = (0, import_react.useState)(study.hours);
	const [studyM, setStudyM] = (0, import_react.useState)(study.minutes);
	const [camH, setCamH] = (0, import_react.useState)(cam.hours);
	const [camM, setCamM] = (0, import_react.useState)(cam.minutes);
	const [score, setScore] = (0, import_react.useState)(initial?.score ?? 0);
	const [notes, setNotes] = (0, import_react.useState)(initial?.notes ?? "");
	(0, import_react.useEffect)(() => {
		const s = hoursMinutesFromTotal(initial?.studyMinutes ?? 0);
		const c = hoursMinutesFromTotal(initial?.camMinutes ?? 0);
		setDate(initial?.logDate ?? today);
		setStudyH(s.hours);
		setStudyM(s.minutes);
		setCamH(c.hours);
		setCamM(c.minutes);
		setScore(initial?.score ?? 0);
		setNotes(initial?.notes ?? "");
	}, [initial, today]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid gap-4",
		onSubmit: (e) => {
			e.preventDefault();
			onSubmit({
				date,
				studyMinutes: totalFromHoursMinutes(studyH, studyM),
				camMinutes: totalFromHoursMinutes(camH, camM),
				score: Number.isFinite(score) ? Math.max(0, score) : 0,
				notes
			});
		},
		children: [
			showDate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "log-date",
					children: "Date"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "log-date",
					type: "date",
					max: today,
					value: date,
					onChange: (e) => setDate(e.target.value),
					required: true
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimePair, {
				label: "Study time",
				hours: studyH,
				minutes: studyM,
				onHours: setStudyH,
				onMinutes: setStudyM,
				hoursId: "study-h"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimePair, {
				label: "Cam time",
				hours: camH,
				minutes: camM,
				onHours: setCamH,
				onMinutes: setCamM,
				hoursId: "cam-h"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "score",
					children: "Score"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "score",
					type: "number",
					min: 0,
					step: "0.1",
					inputMode: "decimal",
					value: Number.isFinite(score) ? score : 0,
					onChange: (e) => setScore(e.target.value === "" ? 0 : Number(e.target.value))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "notes",
					children: "Notes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "notes",
					maxLength: 400,
					placeholder: "Optional",
					value: notes,
					onChange: (e) => setNotes(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				disabled: submitting,
				children: submitting ? "Saving…" : submitLabel
			})
		]
	});
}
function TimePair({ label, hours, minutes, onHours, onMinutes, hoursId }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			htmlFor: hoursId,
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: hoursId,
					type: "number",
					min: 0,
					max: 24,
					inputMode: "numeric",
					value: hours,
					onChange: (e) => onHours(Math.max(0, Number(e.target.value) || 0)),
					className: "pr-10"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground",
					children: "hrs"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					min: 0,
					max: 59,
					inputMode: "numeric",
					value: minutes,
					onChange: (e) => onMinutes(Math.max(0, Math.min(59, Number(e.target.value) || 0))),
					className: "pr-10"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground",
					children: "min"
				})]
			})]
		})]
	});
}
//#endregion
export { LogForm as t };
