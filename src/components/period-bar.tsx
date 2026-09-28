import type { Metric, Period } from "@/lib/league/types";
import { cn } from "@/lib/utils";

const periods: { id: Period; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "week", label: "This week" },
  { id: "all", label: "All time" },
];

const metrics: { id: Metric; label: string }[] = [
  { id: "score", label: "Score" },
  { id: "study", label: "Study" },
  { id: "cam", label: "Cam" },
];

function Segmented<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string }[];
  ariaLabel: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex h-11 w-full rounded-lg bg-secondary p-1 sm:w-auto"
    >
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          role="tab"
          aria-selected={value === opt.id}
          onClick={() => onChange(opt.id)}
          className={cn(
            "flex-1 rounded-md px-3 text-sm font-medium transition-colors duration-150 sm:flex-none",
            value === opt.id ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function PeriodBar({
  period,
  metric,
  onPeriod,
  onMetric,
}: {
  period: Period;
  metric: Metric;
  onPeriod: (p: Period) => void;
  onMetric: (m: Metric) => void;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <Segmented value={period} onChange={onPeriod} options={periods} ariaLabel="Time range" />
      <Segmented value={metric} onChange={onMetric} options={metrics} ariaLabel="Rank by" />
    </div>
  );
}
