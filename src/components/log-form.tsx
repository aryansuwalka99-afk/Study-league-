import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { DailyLog } from "@/lib/league/types";
import { hoursMinutesFromTotal, totalFromHoursMinutes } from "@/lib/utils";

export type LogValues = {
  date: string;
  studyMinutes: number;
  camMinutes: number;
  score: number;
  notes: string;
};

export function LogForm({
  today,
  initial,
  submitting,
  submitLabel,
  showDate = true,
  onSubmit,
}: {
  today: string;
  initial?: DailyLog | null;
  submitting?: boolean;
  submitLabel: string;
  showDate?: boolean;
  onSubmit: (values: LogValues) => void;
}) {
  const study = hoursMinutesFromTotal(initial?.studyMinutes ?? 0);
  const cam = hoursMinutesFromTotal(initial?.camMinutes ?? 0);
  const [date, setDate] = useState(initial?.logDate ?? today);
  const [studyH, setStudyH] = useState(study.hours);
  const [studyM, setStudyM] = useState(study.minutes);
  const [camH, setCamH] = useState(cam.hours);
  const [camM, setCamM] = useState(cam.minutes);
  const [score, setScore] = useState(initial?.score ?? 0);
  const [notes, setNotes] = useState(initial?.notes ?? "");

  useEffect(() => {
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

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          date,
          studyMinutes: totalFromHoursMinutes(studyH, studyM),
          camMinutes: totalFromHoursMinutes(camH, camM),
          score: Number.isFinite(score) ? Math.max(0, score) : 0,
          notes,
        });
      }}
    >
      {showDate ? (
        <div className="grid gap-1.5">
          <Label htmlFor="log-date">Date</Label>
          <Input
            id="log-date"
            type="date"
            max={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      ) : null}
      <TimePair
        label="Study time"
        hours={studyH}
        minutes={studyM}
        onHours={setStudyH}
        onMinutes={setStudyM}
        hoursId="study-h"
      />
      <TimePair
        label="Cam time"
        hours={camH}
        minutes={camM}
        onHours={setCamH}
        onMinutes={setCamM}
        hoursId="cam-h"
      />
      <div className="grid gap-1.5">
        <Label htmlFor="score">Score</Label>
        <Input
          id="score"
          type="number"
          min={0}
          step="0.1"
          inputMode="decimal"
          value={Number.isFinite(score) ? score : 0}
          onChange={(e) => setScore(e.target.value === "" ? 0 : Number(e.target.value))}
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          maxLength={400}
          placeholder="Optional"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <Button type="submit" disabled={submitting}>
        {submitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}

function TimePair({
  label,
  hours,
  minutes,
  onHours,
  onMinutes,
  hoursId,
}: {
  label: string;
  hours: number;
  minutes: number;
  onHours: (n: number) => void;
  onMinutes: (n: number) => void;
  hoursId: string;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={hoursId}>{label}</Label>
      <div className="grid grid-cols-2 gap-2">
        <div className="relative">
          <Input
            id={hoursId}
            type="number"
            min={0}
            max={24}
            inputMode="numeric"
            value={hours}
            onChange={(e) => onHours(Math.max(0, Number(e.target.value) || 0))}
            className="pr-10"
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
            hrs
          </span>
        </div>
        <div className="relative">
          <Input
            type="number"
            min={0}
            max={59}
            inputMode="numeric"
            value={minutes}
            onChange={(e) => onMinutes(Math.max(0, Math.min(59, Number(e.target.value) || 0)))}
            className="pr-10"
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
            min
          </span>
        </div>
      </div>
    </div>
  );
}
