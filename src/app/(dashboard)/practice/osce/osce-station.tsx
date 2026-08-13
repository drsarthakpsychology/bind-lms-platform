"use client";

import * as React from "react";
import { Mic, Timer } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { SEED_OSCE_STATIONS, scoreOsce, seededRotate } from "@/lib/practice/osce";
import { OSCE_COMPETENCY_KEYS, recordCompetencyEvent } from "@/lib/practice/competency-client";
import { buildOsceAttemptPayload } from "@/lib/practice/osce-attempt";

export function OsceStationView() {
  const [stationIdx, setStationIdx] = React.useState(0);
  const [phase, setPhase] = React.useState<"choose" | "active" | "selfassess">("choose");
  const [seconds, setSeconds] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});
  const [selfGlobal, setSelfGlobal] = React.useState(0);
  const [startedAt, setStartedAt] = React.useState<Date | null>(null);

  // Daily rotation so the station order isn't fixed — everyone still practises
  // all stations, just not always #1 first. Seed is the day of month.
  const ordered = React.useMemo(() => {
    const day = new Date().getDate();
    return seededRotate(SEED_OSCE_STATIONS, (day % SEED_OSCE_STATIONS.length) / SEED_OSCE_STATIONS.length);
  }, []);

  const station = ordered[stationIdx];
  const stationNumber = SEED_OSCE_STATIONS.indexOf(station) + 1;

  React.useEffect(() => {
    if (phase !== "active") return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  // Auto-timeout at duration — schedule a timeout, don't setState in the effect.
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => {
    if (phase !== "active") return;
    timeoutRef.current = setTimeout(() => {
      setPhase((p) => (p === "active" ? "selfassess" : p));
    }, station.duration_seconds * 1000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [phase, station.duration_seconds]);

  function start() {
    setSeconds(0);
    setChecked({});
    setDone(false);
    setSelfGlobal(0);
    setStartedAt(new Date());
    setPhase("active");
    haptic("tap");
  }

  function toggleItem(item: string) {
    setChecked((c) => ({ ...c, [item]: !c[item] }));
    haptic("tap");
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const checklistWithDone = station.checklist.map((c) => ({ ...c, done: !!checked[c.item] }));
  const frac = scoreOsce(checklistWithDone);
  // The same 60/40 composite the persistence helper stores (buildOsceAttemptPayload).
  const normalizedGlobal = station.global_rating.max ? selfGlobal / station.global_rating.max : 0;
  const composite = Math.round((frac * 0.6 + normalizedGlobal * 0.4) * 100) / 100;

  if (phase === "choose") {
    return (
      <div className="space-y-3">
        {ordered.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => { setStationIdx(i); setPhase("active"); start(); haptic("tap"); }}
            className="w-full rounded-md border-2 border-border bg-card p-5 text-left hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none"
          >
            <span className="text-eyebrow text-muted-foreground">
              Station {SEED_OSCE_STATIONS.indexOf(s) + 1}
              {i === 0 ? " · today's first" : ""}
            </span>
            <span className="block text-base font-semibold">{s.title}</span>
            <span className="mt-1 block text-small text-muted-foreground">{s.task}</span>
            <span className="mt-2 inline-flex items-center gap-1 text-caption text-muted-foreground">
              <Timer className="size-3.5" aria-hidden /> {Math.round(s.duration_seconds / 60)} minutes
            </span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            const i = Math.floor(Math.random() * ordered.length);
            setStationIdx(i);
            setPhase("active");
            start();
            haptic("tap");
          }}
          className="w-full rounded-md border-2 border-dashed border-border bg-card p-4 text-center text-small font-medium text-muted-foreground transition-transform active:translate-y-px active:hard-shadow-none"
        >
          🎲 Pick a random station
        </button>
      </div>
    );
  }

  if (phase === "active") {
    return (
      <div className="space-y-4">
        <div className="rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-eyebrow text-muted-foreground">Station {stationNumber} · {station.title}</span>
            <span className="text-numeric text-h3" aria-live="polite">{mm}:{ss}</span>
          </div>
          <p className="mt-3 text-base font-medium">{station.task}</p>
          <p className="mt-2 flex items-center gap-1 text-caption text-muted-foreground">
            <Mic className="size-3.5" aria-hidden /> Speak your station — delivery is what&apos;s being assessed.
          </p>
          <button
            type="button"
            onClick={() => { setPhase("selfassess"); haptic("tap"); }}
            className="mt-4 rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none"
          >
            I&apos;m done — self-assess
          </button>
        </div>
      </div>
    );
  }

  // selfassess
  return (
    <div className="space-y-4 rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Self-assess the checklist</h2>
        <span className="text-numeric text-small">{mm}:{ss} used</span>
      </div>
      <ul className="space-y-2">
        {station.checklist.map((c) => (
          <li key={c.item}>
            <label className="flex items-start gap-2 rounded-md border border-border bg-background p-2 text-small">
              <input
                type="checkbox"
                checked={!!checked[c.item]}
                onChange={() => toggleItem(c.item)}
                className="mt-0.5"
              />
              <span>{c.item}</span>
            </label>
          </li>
        ))}
      </ul>

      <div>
        <p className="text-small font-medium">{station.global_rating.label}</p>
        <div className="mt-2 flex gap-1">
          {Array.from({ length: station.global_rating.max }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { setSelfGlobal(i + 1); haptic("tap"); }}
              aria-pressed={selfGlobal === i + 1}
              className={`flex-1 rounded-md border-2 border-border px-2 py-1.5 text-caption font-semibold transition-transform active:translate-y-px ${
                selfGlobal === i + 1 ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-md border-2 border-border bg-background p-3">
          <p className="text-caption text-muted-foreground">Checklist</p>
          <p className="mt-0.5 text-base font-semibold text-numeric">{Math.round(frac * 100)}%</p>
          <p className="mt-1 text-caption text-muted-foreground">
            {checklistWithDone.filter((c) => c.done).length} of {checklistWithDone.length} done
          </p>
        </div>
        <div className="rounded-md border-2 border-border bg-background p-3">
          <p className="text-caption text-muted-foreground">Global rating</p>
          <p className="mt-0.5 text-base font-semibold text-numeric">
            {selfGlobal || "—"}{selfGlobal ? `/${station.global_rating.max}` : ""}
          </p>
          <p className="mt-1 text-caption text-muted-foreground">
            {selfGlobal ? `norm ${Math.round((selfGlobal / station.global_rating.max) * 100)}%` : "pick above"}
          </p>
        </div>
        <div className="rounded-md border-2 border-border bg-background p-3">
          <p className="text-caption text-muted-foreground">Composite</p>
          <p className="mt-0.5 text-base font-semibold text-numeric">
            {selfGlobal ? `${Math.round(composite * 100)}%` : "—"}
          </p>
          <p className="mt-1 text-caption text-muted-foreground">60/40 checklist·global</p>
        </div>
      </div>

      <button
        type="button"
        onClick={async () => {
          if (!done) {
            // Credit the station's competencies into the Skills Passport once.
            const keys = OSCE_COMPETENCY_KEYS[station.id] ?? ["clinical_interviewing"];
            void recordCompetencyEvent("osce", keys, selfGlobal || Math.round(frac * 5), `OSCE: ${station.title}`).catch(() => {});
            // Persist the attempt (checklist + global rating + composite) so
            // /admin/osce-review and weak-spots can read per-station history.
            if (startedAt) {
              const completedAt = new Date();
              const payload = buildOsceAttemptPayload(station, checked, selfGlobal || Math.round(frac * 5), startedAt, completedAt);
              await fetch("/api/practice/osce/attempt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              }).catch(() => {}); // silent; a check, not a test
            }
          }
          setDone(true);
          setPhase("choose");
          haptic("success");
        }}
        className="w-full rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none"
      >
        {done ? "Practise another station" : "Save & pick another"}
      </button>
    </div>
  );
}
