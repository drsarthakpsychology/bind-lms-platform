"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { diffNarratives, FIVE_P, scoreSort, SEED_FORMULATION, type FiveP } from "@/lib/practice/formulation";
import { FORMULATION_COMPETENCY_KEYS, recordCompetencyEvent } from "@/lib/practice/competency-client";

/**
 * Stage 1: sort factor cards. Mobile: tap a card to select, tap a bucket to
 * place (drag-and-drop has a tap fallback). Stage 2: narrative. Stage 3: diff.
 */
export function FormulationForge() {
  const [attempt, setAttempt] = React.useState<Array<{ factorId: string; bucket: FiveP | null }>>(
    SEED_FORMULATION.factors.map((f) => ({ factorId: f.id, bucket: null })),
  );
  const [selected, setSelected] = React.useState<string | null>(null);
  const [stage, setStage] = React.useState<1 | 2 | 3 | 4>(1);
  const [narrative, setNarrative] = React.useState("");
  const [diff, setDiff] = React.useState<{ missing: string[]; present: string[] } | null>(null);

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
  const unplaced = SEED_FORMULATION.factors.filter((f) => !attempt.find((a) => a.factorId === f.id)?.bucket);
  const sorted = attempt.filter((a) => a.bucket !== null);
  const score = scoreSort(sorted, SEED_FORMULATION.factors);

  return (
    <div className="space-y-4">
      {/* stage indicator */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStage(s as 1 | 2 | 3 | 4)}
            className={`rounded-md border-2 border-border px-3 py-1.5 text-caption font-medium transition-transform active:translate-y-px ${
              stage === s ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
            }`}
          >
            {s === 1 ? "1 · Sort" : s === 2 ? "2 · Narrative" : s === 3 ? "3 · Diff" : "4 · Your session"}
          </button>
        ))}
      </div>

      {/* STAGE 1: sort */}
      {stage === 1 ? (
        <div className="space-y-4">
          <p className="text-small text-muted-foreground">{SEED_FORMULATION.prompt}</p>

          {/* the 5P grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
            {FIVE_P.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => placeSelected(p)}
                className="min-h-[120px] rounded-md border-2 border-dashed border-border bg-card p-3 text-left transition-transform active:translate-y-px"
              >
                <span className="text-caption font-semibold uppercase text-primary">{p}</span>
                <span className="mt-1 flex flex-col gap-1">
                  {placed(p).map((a) => {
                    const f = SEED_FORMULATION.factors.find((x) => x.id === a.factorId);
                    return (
                      <span key={a.factorId} className="rounded border border-border bg-background px-2 py-1 text-caption">
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
            <p className="text-caption text-muted-foreground">Tap a card, then tap a bucket. Or drag.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SEED_FORMULATION.factors.map((f) => {
                const placedIn = attempt.find((a) => a.factorId === f.id)?.bucket;
                const isSel = selected === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => { setSelected(isSel ? null : f.id); haptic("tap"); }}
                    aria-pressed={isSel}
                    className={`rounded-md border-2 border-border px-3 py-1.5 text-caption transition-transform active:translate-y-px ${
                      isSel ? "bg-primary text-primary-foreground ring-2 ring-ring" : placedIn ? "bg-secondary text-muted-foreground" : "bg-background"
                    }`}
                  >
                    {f.text.slice(0, 42)}…
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-caption text-muted-foreground">
              Score so far: <span className="font-semibold text-numeric">{Math.round(score * 100)}%</span> — a diff, not a grade.
            </p>
          </div>

          <button
            type="button"
            onClick={() => { setStage(2); haptic("tap"); }}
            disabled={unplaced.length > 0}
            className="w-full rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none disabled:opacity-50"
          >
            {unplaced.length ? `${unplaced.length} cards left to sort` : "Write the narrative →"}
          </button>
        </div>
      ) : null}

      {/* STAGE 2: narrative */}
      {stage === 2 ? (
        <div className="space-y-3 rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
          <p className="text-small text-muted-foreground">
            Write a 3-6 sentence formulation linking the factors you sorted.
          </p>
          <textarea
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            rows={8}
            placeholder="Ravi presents with…"
            className="w-full resize-none rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="button"
            onClick={() => { setDiff(diffNarratives(narrative, SEED_FORMULATION.modelNarrative)); setStage(3); haptic("tap"); }}
            disabled={narrative.trim().length < 40}
            className="w-full rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none disabled:opacity-50"
          >
            Diff against the model →
          </button>
        </div>
      ) : null}

      {/* STAGE 3: diff */}
      {stage === 3 && diff ? (
        <div className="space-y-3 rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
          <h2 className="text-base font-semibold">Your formulation vs the model</h2>
          <div className="rounded-md border border-border bg-background p-3 text-small">
            <span className="font-semibold text-muted-foreground">The model says: </span>
            <span className="italic">{SEED_FORMULATION.modelNarrative}</span>
          </div>
          <p className="text-small text-muted-foreground">
            Words the model used that you missed: <span className="text-amber-700">{diff.missing.join(", ") || "(none — excellent)"}</span>
          </p>
          <p className="text-small text-muted-foreground">
            Model words you captured: <span className="text-green-700">{diff.present.join(", ") || "(none yet)"}</span>
          </p>
          <p className="text-small text-muted-foreground">
            This is a diff, not a grade. The structure is the skill.
          </p>
          <button
            type="button"
            onClick={() => { setStage(4); haptic("tap"); }}
            className="mt-1 rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
          >
            Next: formulate from your own session →
          </button>
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
 * Stage 4 (v5 §4) — the loop that matters: run a Consulting Room session,
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
  if (error) return <p className="text-small text-red-600">{error}</p>;
  if (!data || data.count === 0) {
    return (
      <div className="rounded-md border-2 border-dashed border-border bg-card p-6 text-center">
        <p className="text-base font-medium">No sessions to formulate from yet</p>
        <p className="mt-1 text-small text-muted-foreground">
          Run a Consulting Room session and finish its debrief — then come back here
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
    setDiff(diffNarratives(narrative, modelNarrative || SEED_FORMULATION.modelNarrative));
    // Credit the formulation competencies into the Skills Passport.
    void recordCompetencyEvent("formulation", FORMULATION_COMPETENCY_KEYS, narrative.trim().length >= 120 ? 4 : 3, "Formulation from own transcript").catch(() => {});
    haptic("tap");
  }

  return (
    <div className="space-y-3 rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
      <h2 className="text-base font-semibold">Stage 4 — formulate your own session</h2>
      <p className="text-small text-muted-foreground">
        Session: <span className="font-medium text-foreground">{data.full?.title ?? "—"}</span> ({data.count} completed
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
      <textarea
        value={narrative}
        onChange={(e) => setNarrative(e.target.value)}
        rows={6}
        placeholder="From your own transcript: what was this patient's 5P picture — predisposing, precipitating, perpetuating, protective, presenting?"
        className="w-full resize-none rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <button
        type="button"
        onClick={diffIt}
        disabled={narrative.trim().length < 40}
        className="w-full rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none disabled:opacity-50"
      >
        Diff against what the patient actually presented →
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
            Presentation words you missed: <span className="text-amber-700">{diff.missing.join(", ") || "(none — you caught it all)"}</span>
          </p>
          <p className="text-muted-foreground">
            Presentation words you captured: <span className="text-green-700">{diff.present.join(", ") || "(none yet)"}</span>
          </p>
          <p className="mt-1 text-caption text-muted-foreground">
            Same patient, your ears. This is the loop the programme exists for.
          </p>
        </div>
      ) : null}
    </div>
  );
}
