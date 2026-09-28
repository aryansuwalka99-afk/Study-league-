import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-Cd5yxydh.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function localToday() {
	const d = /* @__PURE__ */ new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function mondayOf(isoDate) {
	const [y, m, d] = isoDate.split("-").map(Number);
	const dt = new Date(y, m - 1, d);
	const day = dt.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	dt.setDate(dt.getDate() + diff);
	return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}
function addDays(isoDate, days) {
	const [y, m, d] = isoDate.split("-").map(Number);
	const dt = new Date(y, m - 1, d);
	dt.setDate(dt.getDate() + days);
	return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}
function formatPrettyDate(isoDate) {
	const [y, m, d] = isoDate.split("-").map(Number);
	return new Date(y, m - 1, d).toLocaleDateString(void 0, {
		weekday: "short",
		month: "short",
		day: "numeric"
	});
}
function formatMinutes(total) {
	const safe = Math.max(0, Math.round(total));
	const h = Math.floor(safe / 60);
	const min = safe % 60;
	if (h === 0) return `${min}m`;
	if (min === 0) return `${h}h`;
	return `${h}h ${min}m`;
}
function formatScore(n) {
	if (!Number.isFinite(n)) return "0";
	if (Math.abs(n - Math.round(n)) < .001) return String(Math.round(n));
	return n.toFixed(1);
}
function hoursMinutesFromTotal(total) {
	const safe = Math.max(0, Math.round(total));
	return {
		hours: Math.floor(safe / 60),
		minutes: safe % 60
	};
}
function totalFromHoursMinutes(hours, minutes) {
	const h = Number.isFinite(hours) ? Math.max(0, hours) : 0;
	const m = Number.isFinite(minutes) ? Math.max(0, Math.min(59, minutes)) : 0;
	return Math.round(h * 60 + m);
}
//#endregion
export { formatScore as a, mondayOf as c, formatPrettyDate as i, totalFromHoursMinutes as l, cn as n, hoursMinutesFromTotal as o, formatMinutes as r, localToday as s, addDays as t };
