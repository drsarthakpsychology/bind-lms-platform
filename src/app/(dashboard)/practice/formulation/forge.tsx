"use client";

import { noteAnswer } from "@/lib/history/client";
import Link from "next/link";
import type { ProgressSnapshot } from "@/lib/cases/progress";
import { clearCaseProgress, saveCaseProgress, useCaseProgress } from "@/lib/cases/progress-client";
import * as React from "react";
import fx from "@/lib/games/ui/fx.module.css";
import { haptic } from "@/lib/haptics";
import { diffNarratives, FIVE_P, scoreSort, SEED_FORMULATION, type FiveP, type FormulationFactor } from "@/lib/practice/formulation";
import { buildFormulationAttemptPayload } from "@/lib/practice/formulation-attempt";
import { FORMULATION_COMPETENCY_KEYS, recordCompetencyEvent } from "@/lib/practice/competency-client";
import { OnceHint } from "@/components/help/once-hint";
import { showEndReaction } from "@/components/reactions/store";
import { moodForScore } from "@/lib/reactions/stickers";
import { trySave } from "@/lib/save/client";

/** The finish sticker for a word diff: happy when most of the model's words are there. */
function diffMood(d: { missing: string[]; present: string[] }) {
  return moodForScore(d.present.length, d.present.length + d.missing.length);
}

/** In-flight snapshot: a refresh mid-sort or mid-narrative restores the work
 *  instead of dropping it (T46/T47). */
const FORGE_BASE = "formulation:in-flight";

/**
 * Stage 1: sort factor cards. Mobile: tap a card to select, tap a bucket to
 * place (drag-and-drop has a tap fallback). Stage 2: narrative. Stage 3: diff.
 */
export type ForgeSeed = { id: string; title: string; prompt: string; factors: FormulationFactor[]; modelNarrative: string };

type Snapshot = { attempt?: Array<{ factorId: string; bucket: FiveP | null }>; stage?: number; narrative?: string };

export function FormulationForge({ seed = SEED_FORMULATION, progress: server, nextHref = null }: { seed?: ForgeSeed; progress?: ProgressSnapshot; nextHref?: string | null }) {
  const FORGE_KEY = `${FORGE_BASE}:${seed.id}`;
  const progress = useCaseProgress("formulation", server);
  const [attempt, setAttempt] = React.useState<Array<{ factorId: string; bucket: FiveP | null }>>(
    seed.factors.map((f) => ({ factorId: f.id, bucket: null })),
  );
  const [selected, setSelected] = React.useState<string | null>(null);
  const [stage, setStage] = React.useState<1 | 2 | 3 | 4>(1);
  const [narrative, setNarrative] = React.useState("");
  const [diff, setDiff] = React.useState<{ missing: string[]; present: string[] } | null>(null);
  // The attempt window starts when the forge opens.
  const [startedAt] = React.useState(() => new Date());
  const restored = React.useRef(false);

  // Restore the saved step after first paint (deferred past hydration): the
  // saved progress (server and this browser, src/lib/cases), else the old
  // browser-only snapshot.
  React.useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    const saved = progress.get<Snapshot>(seed.id);
    const id = window.setTimeout(() => {
      try {
        let s: Snapshot | null = saved;
        if (!s) {
          const raw = window.localStorage.getItem(FORGE_KEY);
          s = raw ? (JSON.parse(raw) as Snapshot) : null;
        }
        if (!s) return;
        // Only restore if the saved sort matches this seed's factor set.
        if (Array.isArray(s.attempt) && s.attempt.length === seed.factors.length) {
          setAttempt(s.attempt);
        }
        // The compare step needs its diff, so a saved compare reopens on the narrative.
        if (typeof s.stage === "number" && s.stage >= 1 && s.stage <= 2) setStage(s.stage as 1 | 2);
        if (typeof s.narrative === "string") setNarrative(s.narrative);
      } catch {
        /* ignore */
      }
    }, 0);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per case
  }, []);

  // Save the step once there is something to keep (a card placed or words written).
  const touched = attempt.some((a) => a.bucket !== null) || narrative.trim().length > 0;
  React.useEffect(() => {
    if (!touched || stage > 2) return;
    saveCaseProgress("formulation", seed.id, { attempt, stage, narrative } satisfies Snapshot);
  }, [attempt, stage, narrative, touched, seed.id]);

  /** Persist the completed scaffolded pass (a check, not a test, silent on failure). */
  async function persistSeedAttempt(diff: { missing: string[]; present: string[] }) {
    const completedAt = new Date();
    noteAnswer("formulation", seed.id, score >= 0.6);
    const payload = buildFormulationAttemptPayload(
      {
        caseId: seed.id,
        caseTitle: seed.title,
        sortedFactors: attempt,
        narrative,
        diff,
        score: Math.round(score * 100) / 100,
      },
      startedAt,
      completedAt,
    );
    await fetch("/api/practice/formulation/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {}); // silent; a check, not a test
    // The pass is submitted: clear the saved step so a later visit starts fresh.
    clearCaseProgress("formulation", seed.id);
    try {
      window.localStorage.removeItem(FORGE_KEY);
    } catch {
      /* ignore */
    }
  }

  function assign(factorId: string, bucket: FiveP) {
    setAttempt((a) => a.map((x) => (x.factorId === factorId ? { ...x, bucket } : x)));
    setSelected(null);
    haptic("tap");
  }

  function placeSelected(bucket: FiveP) {
    if (selected) {
      assign(selected, bucket);
    }
  }

  const placed = (bucket: FiveP) => attempt.filter((a) => a.bucket === bucket);
  const unplaced = seed.factors.filter((f) => !attempt.find((a) => a.factorId === f.id)?.bucket);
  const sorted = attempt.filter((a) => a.bucket !== null);
  const score = scoreSort(sorted, seed.factors);

  return (
    <div className="space-y-4">
      {/* stage indicator: four numbered steps, the current one filled */}
      <ol className="grid grid-cols-4 gap-1.5" aria-label="Steps">
        {[1, 2, 3, 4].map((s) => (
          <li key={s} className="min-w-0">
            <button
              type="button"
              onClick={() => setStage(s as 1 | 2 | 3 | 4)}
              aria-current={stage === s ? "step" : undefined}
              className={`flex min-h-14 w-full flex-col items-center justify-center gap-1 rounded-md border-2 border-foreground px-1 py-1.5 text-center text-caption leading-tight font-semibold transition-[transform,box-shadow] duration-fast ease-snappy active:translate-y-px ${
                stage === s ? "bg-brand text-brand-foreground hard-shadow-xs" : "bg-card text-foreground"
              }`}
            >
              <span aria-hidden className={`grid size-6 place-items-center rounded-full border-2 border-current font-mono text-[0.7rem] ${stage === s ? "bg-card text-foreground" : ""}`}>
                {s}
              </span>
              {s === 1 ? "Sort" : s === 2 ? "Write" : s === 3 ? "Compare" : "Your session"}
            </button>
          </li>
        ))}
      </ol>

      {/* STAGE 1: sort */}
      {stage === 1 ? (
        <div className="space-y-4">
          <p className="text-small text-muted-foreground">{seed.prompt}</p>

          {/* the 5P grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
            {FIVE_P.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => placeSelected(p)}
                className={`min-h-16 rounded-[10px] border-2 border-dashed p-3 text-left transition-[transform,background-color] duration-fast ease-snappy active:translate-y-px sm:min-h-[120px] ${selected ? "border-foreground bg-primary/30" : "border-foreground/40 bg-card"}`}
              >
                <span className="text-caption font-semibold uppercase text-link">{p}</span>
                <span className="mt-1 flex flex-col gap-1">
                  {placed(p).map((a) => {
                    const f = seed.factors.find((x) => x.id === a.factorId);
                    return (
                      <span key={a.factorId} className="rounded-md border-2 border-foreground bg-background px-2 py-1 text-small leading-snug">
                        {f?.text}
                      </span>
                    );
                  })}
                </span>
              </button>
            ))}
          </div>

          {/* unplaced + distractor cards */}
          <div>
            <OnceHint id="formulation-sort" className="text-caption text-muted-foreground">Tap a card, then tap a bucket. Or drag.</OnceHint>
            <div className="mt-2 flex flex-wrap gap-2">
              {seed.factors.map((f) => {
                const placedIn = attempt.find((a) => a.factorId === f.id)?.bucket;
                const isSel = selected === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => { setSelected(isSel ? null : f.id); haptic("tap"); }}
                    aria-pressed={isSel}
                    className={`min-h-11 rounded-md border-2 border-foreground px-3 py-2 text-left text-small leading-snug transition-[transform,box-shadow] duration-fast ease-snappy active:translate-y-px ${
                      isSel ? "-translate-y-0.5 bg-brand text-brand-foreground hard-shadow-xs" : placedIn ? "border-foreground/30 bg-secondary text-muted-foreground" : "bg-background hard-shadow-xs"
                    }`}
                  >
                    {f.text}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-caption text-muted-foreground">
              Score so far: <span className="font-semibold text-numeric">{Math.round(score * 100)}%</span>
            </p>
          </div>

          {/* Phones and tablets: a picked card goes into a bucket from here, without scrolling up. */}
          {selected ? (
            <div className={`sticky bottom-[calc(var(--nav-h,0px)+0.5rem)] z-10 space-y-2 rounded-md border-2 border-foreground bg-foreground p-3 text-background hard-shadow-sm sm:hidden ${fx.rise}`}>
              <p className="text-sm">
                <strong>Picked:</strong> {seed.factors.find((x) => x.id === selected)?.text}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {FIVE_P.map((p) => (
                  <button key={p} type="button" onClick={() => placeSelected(p)} className="min-h-12 rounded-md border-2 border-background bg-primary px-2.5 py-2 text-left text-sm font-bold capitalize text-primary-foreground active:translate-y-px">
                    {p}
                  </button>
                ))}
                <button type="button" onClick={() => setSelected(null)} className="min-h-12 rounded-md border-2 border-background px-2.5 py-2 text-sm font-bold">
                  Cancel
                </button>
              </div>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => { setStage(2); haptic("tap"); }}
            disabled={unplaced.length > 0}
            className="w-full rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none disabled:opacity-50"
          >
            {unplaced.length ? `${unplaced.length} cards left to sort` : "Write the story →"}
          </button>
        </div>
      ) : null}

      {/* STAGE 2: narrative */}
      {stage === 2 ? (
        <div className="space-y-3 rounded-lg border-2 border-border bg-card p-5 hard-shadow-sm">
          <p className="text-small text-muted-foreground">
            Write a 3-6 sentence formulation linking the factors you sorted.
          </p>
          <textarea enterKeyHint="enter"
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            rows={8}
            placeholder="Ravi presents with…"
            className="w-full resize-none rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="button"
            onClick={() => {
              const d = diffNarratives(narrative, seed.modelNarrative);
              setDiff(d);
              setStage(3);
              // The case is done once it is compared with the answer.
              void persistSeedAttempt(d);
              haptic("tap");
              // The finish sticker: happy or sad by the sort score.
              showEndReaction(moodForScore(Math.round(score * 100), 100));
            }}
            disabled={narrative.trim().length < 40}
            className="w-full rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none disabled:opacity-50"
          >
            Compare with the answer →
          </button>
        </div>
      ) : null}

      {/* STAGE 3: diff */}
      {stage === 3 && diff ? (
        <div className="space-y-3 rounded-lg border-2 border-border bg-card p-5 hard-shadow-sm">
          <h2 className="text-base font-semibold">Your formulation vs the model</h2>
          <div className="rounded-md border border-border bg-background p-3 text-small">
            <span className="font-semibold text-muted-foreground">The answer: </span>
            <span className="italic">{seed.modelNarrative}</span>
          </div>
          <p className="text-small text-muted-foreground">
            Words you missed: <span className="text-status-pending-fg">{diff.missing.join(", ") || "(none, excellent)"}</span>
          </p>
          <p className="text-small text-muted-foreground">
            Words you got: <span className="text-status-success-fg">{diff.present.join(", ") || "(none yet)"}</span>
          </p>
          <p className="text-small text-muted-foreground">
            This is a diff, not a grade. The structure is the skill.
          </p>
          <div className="mt-1 flex flex-wrap gap-2">
            {nextHref ? (
              <Link
                href={nextHref}
                className="inline-flex min-h-11 items-center rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
              >
                Next case →
              </Link>
            ) : null}
            <button
              type="button"
              onClick={() => { setStage(4); haptic("tap"); }}
              className={`min-h-11 rounded-md border-2 border-border px-4 py-2 text-small font-semibold transition-transform active:translate-y-px ${nextHref ? "bg-card text-foreground" : "bg-primary text-primary-foreground hard-shadow-sm"}`}
            >
              Formulate from your own session →
            </button>
          </div>
        </div>
      ) : null}

      {/* STAGE 4: formulate from the student's OWN Consulting Room transcript */}
      {stage === 4 ? (
        <OwnTranscriptForge />
      ) : null}
    </div>
  );
}

/**
 * Stage 4 (v5 §4): the loop that matters: run a Consulting Room session,
 * then formulate the patient from YOUR OWN transcript. Loads the student's
 * completed sessions via /api/practice/mse/transcripts; the 5P narrative is
 * diffed against the case's expert MSE code (the ground truth of what the
 * patient actually presented).
 */
function OwnTranscriptForge() {
  const [data, setData] = React.useState<{
    transcripts: Array<{ sessionId: string; title: string; difficulty: string }>;
    full: {
      sessionId: string;
      title: string;
      turns: Array<{ role: string; content: string }>;
      expert?: Record<string, string[]>;
    } | null;
    count: number;
  } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [narrative, setNarrative] = React.useState("");
  const [diff, setDiff] = React.useState<{ missing: string[]; present: string[] } | null>(null);
  const [loading, setLoading] = React.useState(true);
  // The attempt window starts when stage 4 opens.
  const [startedAt] = React.useState(() => new Date());

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/practice/mse/transcripts");
        if (!res.ok) throw new Error("load failed");
        const j = await res.json();
        if (alive) { setData(j); setLoading(false); }
      } catch {
        if (alive) { setError("Could not load your sessions."); setLoading(false); }
      }
    })();
    return () => { alive = false; };
  }, []);

  if (loading) return <p className="text-small text-muted-foreground">Loading your sessions…</p>;
  if (error) return <p className="text-small text-destructive">{error}</p>;
  if (!data || data.count === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-border bg-card p-6 text-center">
        <p className="text-base font-medium">No sessions to formulate from yet</p>
        <p className="mt-1 text-small text-muted-foreground">
          Run a Consulting Room session and finish its debrief, then come back here
          and write the formulation from your own transcript. That loop is the point.
        </p>
      </div>
    );
  }

  // Build a model narrative from the expert MSE code (the ground truth).
  const modelNarrative = (() => {
    const ex = data.full?.expert;
    if (!ex) return "";
    const parts: string[] = [];
    if (ex.mood?.length) parts.push(`Mood: ${ex.mood.join(", ")}`);
    if (ex.affect?.length) parts.push(`Affect: ${ex.affect.join(", ")}`);
    if (ex.thought_content?.length) parts.push(`Thought content: ${ex.thought_content.join(", ")}`);
    if (ex.perception?.length) parts.push(`Perception: ${ex.perception.join(", ")}`);
    if (ex.insight?.length) parts.push(`Insight: ${ex.insight.join(", ")}`);
    if (parts.length === 0) return "";
    return `The patient presented with ${parts.join("; ").toLowerCase()}.`;
  })();

  function diffIt() {
    const d = diffNarratives(narrative, modelNarrative || SEED_FORMULATION.modelNarrative);
    setDiff(d);
    showEndReaction(diffMood(d));
    // Credit the formulation competencies into the Skills Passport.
    void trySave(() => recordCompetencyEvent("formulation", FORMULATION_COMPETENCY_KEYS, narrative.trim().length >= 120 ? 4 : 3, "Formulation from own transcript"), "Skills Passport credit");
    // Persist this own-transcript attempt (session-based; no formulation case).
    const completedAt = new Date();
    const payload = buildFormulationAttemptPayload(
      {
        caseId: null,
        sourceSimSessionId: data?.full?.sessionId,
        sortedFactors: [],
        narrative,
        diff: d,
      },
      startedAt,
      completedAt,
    );
    void trySave(
      () =>
        fetch("/api/practice/formulation/attempt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      "Formulation attempt",
    );
    haptic("tap");
  }

  return (
    <div className="space-y-3 rounded-lg border-2 border-border bg-card p-5 hard-shadow-sm">
      <h2 className="text-base font-semibold">Stage 4: formulate your own session</h2>
      <p className="text-small text-muted-foreground">
        Session: <span className="font-medium text-foreground">{data.full?.title ?? "Untitled"}</span> ({data.count} completed
        session{data.count === 1 ? "" : "s"}; the most recent is shown).
      </p>
      <div className="max-h-40 overflow-y-auto rounded-md border border-border bg-background p-3 text-small">
        {(data.full?.turns ?? []).slice(-14).map((t, i) => (
          <p key={i} className={t.role === "patient" ? "italic text-muted-foreground" : ""}>
            <span className="font-semibold text-caption">{t.role === "student" ? "S: " : "P: "}</span>
            {t.content}
          </p>
        ))}
        {(data.full?.turns ?? []).length === 0 ? (
          <p className="text-caption text-muted-foreground">No turns found in this session.</p>
        ) : null}
      </div>
      <textarea enterKeyHint="enter"
        value={narrative}
        onChange={(e) => setNarrative(e.target.value)}
        rows={6}
        placeholder="From your own transcript: what was this patient's 5P picture, predisposing, precipitating, perpetuating, protective, presenting?"
        className="w-full resize-none rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <button
        type="button"
        onClick={diffIt}
        disabled={narrative.trim().length < 40}
        className="w-full rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none disabled:opacity-50"
      >
        Compare with what the patient really said →
      </button>
      {diff ? (
        <div className="rounded-md border border-border bg-background p-3 text-small">
          {modelNarrative ? (
            <p>
              <span className="font-semibold text-muted-foreground">The patient&apos;s presentation: </span>
              <span className="italic">{modelNarrative}</span>
            </p>
          ) : null}
          <p className="mt-2 text-muted-foreground">
            Presentation words you missed: <span className="text-status-pending-fg">{diff.missing.join(", ") || "(none, you caught it all)"}</span>
          </p>
          <p className="text-muted-foreground">
            Presentation words you captured: <span className="text-status-success-fg">{diff.present.join(", ") || "(none yet)"}</span>
          </p>
          <p className="mt-1 text-caption text-muted-foreground">
            Same patient, your ears. This is the loop the programme exists for.
          </p>
        </div>
      ) : null}
    </div>
  );
}
