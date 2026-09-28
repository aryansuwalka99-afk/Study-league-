import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as cn } from "./utils-Cd5yxydh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/period-bar-Dpe-by-T.js
var import_jsx_runtime = require_jsx_runtime();
var periods = [
	{
		id: "today",
		label: "Today"
	},
	{
		id: "week",
		label: "This week"
	},
	{
		id: "all",
		label: "All time"
	}
];
var metrics = [
	{
		id: "score",
		label: "Score"
	},
	{
		id: "study",
		label: "Study"
	},
	{
		id: "cam",
		label: "Cam"
	}
];
function Segmented({ value, onChange, options, ariaLabel }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "tablist",
		"aria-label": ariaLabel,
		className: "inline-flex h-11 w-full rounded-lg bg-secondary p-1 sm:w-auto",
		children: options.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			role: "tab",
			"aria-selected": value === opt.id,
			onClick: () => onChange(opt.id),
			className: cn("flex-1 rounded-md px-3 text-sm font-medium transition-colors duration-150 sm:flex-none", value === opt.id ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"),
			children: opt.label
		}, opt.id))
	});
}
function PeriodBar({ period, metric, onPeriod, onMetric }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmented, {
			value: period,
			onChange: onPeriod,
			options: periods,
			ariaLabel: "Time range"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmented, {
			value: metric,
			onChange: onMetric,
			options: metrics,
			ariaLabel: "Rank by"
		})]
	});
}
//#endregion
export { PeriodBar as t };
