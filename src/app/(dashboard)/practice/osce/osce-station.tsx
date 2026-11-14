"use client";

import * as React from "react";
import { startHowTo } from "@/components/help/how-to";
import { OnceHint } from "@/components/help/once-hint";
import { showEndReaction } from "@/components/reactions/store";
import { moodForScore } from "@/lib/reactions/stickers";
import { ArrowRight, Mic, Square, Timer } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { SEED_OSCE_STATIONS, scoreOsce, type OsceStation } from "@/lib/practice/osce";
import { createWebStt, webSttSupported } from "@/lib/voice/stt";
import { OSCE_COMPETENCY_KEYS, recordCompetencyEvent } from "@/lib/practice/competency-client";
import { noteAnswer, useHistoryPrefetch, useToolHistory } from "@/lib/history/client";
import { arrangeCases } from "@/lib/cases/fresh";
import type { CaseContext } from "@/lib/cases/server";
import { clearCaseProgress, saveCaseProgress, useCaseProgress } from "@/lib/cases/progress-client";
import { CaseMarkTag, RecycleNote } from "@/components/cases/case-mark";
import { buildOsceAttemptPayload } from "@/lib/practice/osce-attempt";

/** A station left half-way (saved progress, src/lib/cases): a refresh or another device opens it where it was. */
type SavedStation = { phase: "active" | "selfassess"; seconds: number; checked: Record<string, boolean>; selfGlobal: number; startedAt: string | null; spoken: string };
/** The old single-slot snapshot (cleared on sight). */
const OLD_KEY = "osce:in-flight";
const PAGE = 20;
const level = (s: OsceStation) => s.tags?.difficulty ?? 0;
/** A moment `ms` from now (only called from event handlers). */
const inMs = (ms: number) => Date.now() + ms;

const NO_CASES: CaseContext = { student: "", history: [], progress: { owner: null, rows: [] }, now: 0 };

export function OsceStationView({ cases = NO_CASES }: { cases?: CaseContext }) {
  const [stationId, setStationId] = React.useState<string>(SEED_OSCE_STATIONS[0].id);
  useHistoryPrefetch("osce");
  const history = useToolHistory("osce", cases.history);
  const progress = useCaseProgress("osce", cases.progress);
  const [phase, setPhase] = React.useState<"choose" | "active" | "selfassess">("choose");
  const [seconds, setSeconds] = React.useState(0);
  /** When the station's time runs out (epoch ms), set when it starts or resumes. */
  const [deadline, setDeadline] = React.useState<number | null>(null);
  const [done, setDone] = React.useState(false);
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});
  const [selfGlobal, setSelfGlobal] = React.useState(0);
  const [startedAt, setStartedAt] = React.useState<Date | null>(null);
  const [shown, setShown] = React.useState(PAGE);
  // Voice delivery (OSCE is voice-strongly-preferred): capture the spoken
  // response via web speech recognition, no storage, the transcript is the
  // record. Degrades silently when the browser has no speech recognition.
  const [recording, setRecording] = React.useState(false);
  const [spoken, setSpoken] = React.useState("");
  const sttRef = React.useRef<ReturnType<typeof createWebStt>>(null);

  React.useEffect(() => {
    try {
      window.localStorage.removeItem(OLD_KEY);
    } catch {
      /* ignore */
    }
    return () => sttRef.current?.abort();
  }, []);

  // Keep the station's place saved while it is open (ten-second steps for the clock).
  const tick = Math.floor(seconds / 10);
  React.useEffect(() => {
    if (phase === "choose" || done) return;
    saveCaseProgress("osce", stationId, { phase, seconds, checked, selfGlobal, startedAt: startedAt ? startedAt.toISOString() : null, spoken } satisfies SavedStation);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the clock saves every ten seconds, not every second
  }, [phase, done, stationId, checked, selfGlobal, startedAt, spoken, tick]);

  function toggleVoice() {
    if (recording) {
      sttRef.current?.stop();
      setRecording(false);
      haptic("tap");
      return;
    }
    const stt = createWebStt();
    if (!stt) return;
    sttRef.current = stt;
    stt.onResult = (r) => {
      if (r.isFinal) setSpoken((s) => (s ? `${s} ${r.transcript}` : r.transcript));
    };
    stt.onEnd = () => setRecording(false);
    stt.onError = () => setRecording(false);
    stt.start();
    setRecording(true);
    haptic("tap");
  }

  // Fresh-case order (src/lib/cases/fresh.ts): half done, new this week, new, done last.
  const arranged = arrangeCases(SEED_OSCE_STATIONS, (x) => x.id, { history, now: cases.now, student: cases.student, started: progress.started, level });
  const station = SEED_OSCE_STATIONS.find((x) => x.id === stationId) ?? SEED_OSCE_STATIONS[0];
  const stationNumber = SEED_OSCE_STATIONS.indexOf(station) + 1;

  React.useEffect(() => {
    if (phase !== "active") return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  // Auto-timeout at the deadline: schedule a timeout, don't setState in the effect.
  React.useEffect(() => {
    if (phase !== "active" || deadline === null) return;
    const t = setTimeout(() => setPhase((p) => (p === "active" ? "selfassess" : p)), Math.max(0, deadline - Date.now()));
    return () => clearTimeout(t);
  }, [phase, deadline]);

  function start(id: string) {
    startHowTo("osce");
    const st = SEED_OSCE_STATIONS.find((x) => x.id === id) ?? SEED_OSCE_STATIONS[0];
    setStationId(st.id);
    setSeconds(0);
    setChecked({});
    setDone(false);
    setSelfGlobal(0);
    setSpoken("");
    setStartedAt(new Date());
    setDeadline(inMs(st.duration_seconds * 1000));
    setPhase("active");
    haptic("tap");
  }

  /** Open a station: where it was left if it is half done, else from the start. */
  function open(id: string) {
    const saved = progress.get<SavedStation>(id);
    const st = SEED_OSCE_STATIONS.find((x) => x.id === id);
    if (!st || !saved || (saved.phase !== "active" && saved.phase !== "selfassess")) return start(id);
    startHowTo("osce");
    setStationId(st.id);
    setSeconds(Math.max(0, Math.floor(saved.seconds) || 0));
    setChecked(saved.checked && typeof saved.checked === "object" ? saved.checked : {});
    setSelfGlobal(Number(saved.selfGlobal) || 0);
    setSpoken(typeof saved.spoken === "string" ? saved.spoken : "");
    setStartedAt(saved.startedAt ? new Date(saved.startedAt) : new Date());
    setDone(false);
    setDeadline(inMs(Math.max(0, st.duration_seconds - (Number(saved.seconds) || 0)) * 1000));
    setPhase(saved.phase);
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
    const next = arranged.list.find((x) => x.mark !== "started") ?? arranged.list[0];
    return (
      <div className="space-y-3">
        {arranged.recycled ? <RecycleNote /> : null}
        {next ? (
          <button
            type="button"
            onClick={() => open(next.id)}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border-2 border-foreground bg-primary p-4 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none"
          >
            Next station: {next.item.title} <ArrowRight className="size-4" aria-hidden />
          </button>
        ) : null}
        <ul className="space-y-3">
          {arranged.list.slice(0, shown).map(({ item: s, mark }) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => open(s.id)}
                className={`w-full rounded-lg border-2 bg-card p-5 text-left transition-transform active:translate-y-px active:hard-shadow-none ${mark === "done" && !arranged.recycled ? "border-border" : "border-border hard-shadow-sm"}`}
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="text-eyebrow text-muted-foreground">Station {SEED_OSCE_STATIONS.indexOf(s) + 1}</span>
                  <CaseMarkTag mark={mark} />
                </span>
                <span className="block text-base font-semibold">{s.title}</span>
                <span className="mt-1 block text-small text-muted-foreground">{s.task}</span>
                <span className="mt-2 inline-flex items-center gap-1 text-caption text-muted-foreground">
                  <Timer className="size-3.5" aria-hidden /> {mark === "started" ? "Carry on" : `${Math.round(s.duration_seconds / 60)} minutes`}
                </span>
              </button>
            </li>
          ))}
        </ul>
        {shown < arranged.list.length ? (
          <button
            type="button"
            onClick={() => setShown((n) => n + PAGE)}
            className="min-h-11 w-full rounded-lg border-2 border-dashed border-border bg-card p-3 text-center text-small font-semibold text-muted-foreground"
          >
            Show more stations
          </button>
        ) : null}
      </div>
    );
  }

  if (phase === "active") {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border-2 border-border bg-card p-5 hard-shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-eyebrow text-muted-foreground">Station {stationNumber} · {station.title}</span>
            <span className="text-numeric text-h3" aria-live="polite">{mm}:{ss}</span>
          </div>
          <p className="mt-3 text-base font-medium">{station.task}</p>
          <OnceHint id="osce-speak" className="mt-2 flex items-center gap-1 text-caption text-muted-foreground">
            <Mic className="size-3.5" aria-hidden /> Speak your station: delivery is what&apos;s being assessed.
          </OnceHint>

          {webSttSupported() ? (
            <div className="mt-3 rounded-lg border-2 border-border bg-background p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-small font-medium text-foreground">
                  {recording ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="size-2.5 animate-pulse rounded-full bg-status-alert-bg" aria-hidden />
                      Recording…
                    </span>
                  ) : spoken ? (
                    "Captured: speak again to add"
                  ) : (
                    "Record your spoken response"
                  )}
                </span>
                <button
                  type="button"
                  onClick={toggleVoice}
                  aria-pressed={recording}
                  className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border-2 border-foreground px-3 py-1.5 text-caption font-semibold transition-transform active:translate-y-px ${
                    recording ? "bg-status-alert-bg text-destructive" : "bg-secondary text-foreground"
                  }`}
                >
                  {recording ? <Square className="size-4" aria-hidden /> : <Mic className="size-4" aria-hidden />}
                  {recording ? "Stop" : "Record"}
                </button>
              </div>
              {spoken ? (
                <p className="mt-2 min-w-0 break-words rounded-md border border-border bg-card p-2 text-small leading-relaxed text-muted-foreground">
                  {spoken}
                </p>
              ) : null}
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => { setPhase("selfassess"); haptic("tap"); }}
            className="mt-4 rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none"
          >
            I&apos;m done: self-assess
          </button>
        </div>
      </div>
    );
  }

  // selfassess
  return (
    <div className="space-y-4 rounded-lg border-2 border-border bg-card p-5 hard-shadow-sm">
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
        <div className="rounded-lg border-2 border-border bg-background p-3">
          <p className="text-caption text-muted-foreground">Checklist</p>
          <p className="mt-0.5 text-base font-semibold text-numeric">{Math.round(frac * 100)}%</p>
          <p className="mt-1 text-caption text-muted-foreground">
            {checklistWithDone.filter((c) => c.done).length} of {checklistWithDone.length} done
          </p>
        </div>
        <div className="rounded-lg border-2 border-border bg-background p-3">
          <p className="text-caption text-muted-foreground">Global rating</p>
          <p className="mt-0.5 text-base font-semibold text-numeric">
            {selfGlobal || "-"}{selfGlobal ? `/${station.global_rating.max}` : ""}
          </p>
          <p className="mt-1 text-caption text-muted-foreground">
            {selfGlobal ? "your overall call" : "pick above"}
          </p>
        </div>
        <div className="rounded-lg border-2 border-border bg-background p-3">
          <p className="text-caption text-muted-foreground">Overall</p>
          <p className="mt-0.5 text-base font-semibold text-numeric">
            {selfGlobal ? `${Math.round(composite * 100)}%` : "-"}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={async () => {
          if (!done) {
            // The finish sticker: happy or sad by the checklist score.
            showEndReaction(moodForScore(checklistWithDone.filter((c) => c.done).length, checklistWithDone.length));
            noteAnswer("osce", station.id, composite >= 0.6);
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
          clearCaseProgress("osce", station.id);
          haptic("success");
        }}
        className="w-full rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none"
      >
        {done ? "Practise another station" : "Save & pick another"}
      </button>
    </div>
  );
}
