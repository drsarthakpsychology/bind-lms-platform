"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { scoreMseCode, summarizeMseScore } from "@/lib/mse/ladder";

interface TurnLine {
  role: "student" | "patient";
  content: string;
}

interface TranscriptData {
  transcripts: Array<{ sessionId: string; title: string; difficulty: string; endedAt: string | null }>;
  full: {
    sessionId: string;
    title: string;
    turns: TurnLine[];
    expert?: Record<string, string[]>;
    smallThings?: string[];
  } | null;
  count: number;
}

/** 11 domains in the standard order (matching the ladder). */
const DOMAINS = [
  "appearance", "behavior", "speech", "mood", "affect", "thought_process",
  "thought_content", "perception", "cognition", "insight", "judgment",
] as const;

/**
 * MSE Level 5 — MSE from live interview. The student's own completed
 * Consulting Room sessions are the raw material: run a session, then write
 * the MSE from your own transcript. Scored against what the patient actually
 * presented (the case's expert MSE code).
 */
export function LiveMseLevel({ onComplete }: { onComplete?: () => void }) {
  const [data, setData] = React.useState<TranscriptData | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [selected, setSelected] = React.useState<TranscriptData["full"]>(null);
  const [fields, setFields] = React.useState<Record<string, string[]>>({});
  const [rawText, setRawText] = React.useState<Record<string, string>>({});
  const [scored, setScored] = React.useState<Record<string, string> | null>(null);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/practice/mse/transcripts");
        const j = (await res.json()) as TranscriptData & { error?: string };
        if (!res.ok) {
          setError(j.error ?? "Could not load your sessions.");
          return;
        }
        if (!alive) return;
        setData(j);
        setSelected(j.full);
      } catch {
        if (alive) setError("Network error loading sessions.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  function pickSession(sessionId: string) {
    if (!data?.transcripts) return;
    // Re-select by refetching the full transcript for the chosen session.
    setLoading(true);
    setError(null);
    void (async () => {
      try {
        const q = new URLSearchParams({ sessionId });
        const res = await fetch(`/api/practice/mse/transcripts?${q.toString()}`);
        const j = (await res.json()) as TranscriptData & { error?: string };
        if (!res.ok) {
          setError(j.error ?? "Could not load that session.");
          return;
        }
        setData((d) => (d ? { ...d, transcripts: j.transcripts, count: j.count, full: j.full } : d));
        setSelected(j.full);
        resetAttempt();
      } catch {
        setError("Network error.");
      } finally {
        setLoading(false);
      }
    })();
  }

  function resetAttempt() {
    setFields({});
    setRawText({});
    setScored(null);
  }

  function setDomain(domain: string, value: string) {
    setRawText((r) => ({ ...r, [domain]: value }));
    setFields((f) => ({
      ...f,
      [domain]: value.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean),
    }));
  }

  // Score against what the patient ACTUALLY presented — the expert code for
  // the case came with the transcript from the server. No expert code (case
  // not yet coded) → score is withheld; it never fabricates a ground truth.
  function scoreAttempt() {
    haptic("success");
    if (!selected?.expert) {
      setScored({ _uncoded: "uncoded" });
      return;
    }
    const expert: Parameters<typeof scoreMseCode>[0] = {};
    for (const d of DOMAINS) expert[d] = selected.expert[d] ?? [];
    setScored(scoreMseCode(expert, fields));
  }

  const turns = selected?.turns ?? [];
  const filled = DOMAINS.filter((d) => (fields[d] ?? []).length > 0).length;
  const perDomain = scored ? DOMAINS.map((d) => [d, scored[d]] as const).filter(([, v]) => v) : [];
  const summary = scored && !scored._uncoded ? summarizeMseScore(scored as Record<string, "green" | "amber" | "red">) : null;

  return (
    <div className="space-y-4 rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
      <div className="flex items-center justify-between text-small text-muted-foreground">
        <span>Level 5 · MSE from your own interview</span>
        <span>{selected ? selected.title : "pick a session"}</span>
      </div>

      {loading ? (
        <p className="text-small text-muted-foreground">Loading your Consulting Room sessions…</p>
      ) : error ? (
        <p className="text-small text-red-700" role="alert">{error}</p>
      ) : !data || data.count === 0 ? (
        <div className="rounded-md border border-border bg-background p-4 text-small text-muted-foreground">
          You don&apos;t have a completed Consulting Room session yet. Run one
          first — the whole point of Level 5 is writing the MSE from a patient
          you actually talked to.
        </div>
      ) : (
        <>
          {/* Session selector */}
          <div className="flex flex-wrap gap-2">
            {data.transcripts.slice(0, 5).map((t) => (
              <button
                key={t.sessionId}
                type="button"
                onClick={() => pickSession(t.sessionId)}
                aria-pressed={selected?.sessionId === t.sessionId}
                className={cn(
                  "rounded-md border-2 border-border px-3 py-1.5 text-caption transition-transform active:translate-y-px",
                  selected?.sessionId === t.sessionId ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground",
                )}
              >
                {t.title.split("—")[0].trim()}
              </button>
            ))}
          </div>

          {/* Your transcript */}
          <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border border-border bg-background p-3">
            {turns.map((t, i) => (
              <div key={i} className="text-small">
                <span className={cn("font-semibold", t.role === "patient" ? "text-primary" : "text-muted-foreground")}>
                  {t.role === "patient" ? "Patient: " : "You: "}
                </span>
                <span className="text-muted-foreground">{t.content}</span>
              </div>
            ))}
          </div>

          {/* MSE coding inputs */}
          <div className="space-y-2">
            <p className="text-small text-muted-foreground">
              Now write the MSE from your own transcript. {filled} of 11 domains tagged.
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {DOMAINS.map((d) => (
                <label key={d} className="block">
                  <span className="text-caption font-semibold text-muted-foreground">{d}</span>
                  <input
                    value={rawText[d] ?? ""}
                    onChange={(e) => setDomain(d, e.target.value)}
                    placeholder="flat, congruent…"
                    className="mt-0.5 w-full rounded-md border-2 border-border bg-background px-2.5 py-1.5 text-small focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={scoreAttempt}
              disabled={filled < 6}
              className="rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px disabled:opacity-50"
            >
              Score against what the patient presented
            </button>
          </div>

          {/* The scored result — Level 5 comparison is the key loop */}
          {scored ? (
            scored._uncoded ? (
              <div className="rounded-md border border-border bg-secondary/40 p-3 text-small text-muted-foreground">
                <span className="font-semibold">This case isn&apos;t coded yet.</span>{" "}
                The expert coding for this patient isn&apos;t authored, so there is no
                ground truth to score against — nothing is fabricated. Pick another
                session, or run a Consulting Room session on one of the coded cases
                (Ravi, Meera, Vikram, Neha, Rohit) and come back.
              </div>
            ) : (
              <div className="space-y-3 rounded-md border border-border bg-background p-3">
                <p className="text-small font-semibold">
                  Score: {summary?.green}/{summary?.max} domains matched
                  {summary && summary.amber > 0 ? ` · ${summary.amber} amber` : ""}
                  {summary && summary.red > 0 ? ` · ${summary.red} red` : ""}
                </p>
                <div className="space-y-1.5">
                  {perDomain.map(([d, v]) => {
                    const student = fields[d] ?? [];
                    const expert = selected?.expert?.[d] ?? [];
                    return (
                      <div
                        key={d}
                        className={cn(
                          "flex items-start gap-2 rounded-md border px-2 py-1.5 text-small",
                          v === "green" && "border-green-400 bg-green-50 text-green-800",
                          v === "amber" && "border-amber-400 bg-amber-50 text-amber-800",
                          v === "red" && "border-red-400 bg-red-50 text-red-800",
                        )}
                      >
                        <span className="w-28 shrink-0 font-semibold">{d}</span>
                        <span className="flex-1">
                          <span className="font-medium">You: </span>
                          {student.length ? student.join(", ") : "(none)"}
                          <span className="text-caption opacity-70">
                            {" "}
                            · Patient: {expert.length ? expert.join(", ") : "no finding presented"}
                          </span>
                        </span>
                        <span className="text-caption font-bold uppercase">{v}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-small text-muted-foreground">
                  <span className="font-semibold">The loop: </span>green is what the
                  patient actually presented, amber is defensible, red is what you
                  never elicited. The gap between your transcript and the
                  patient&apos;s real MSE is your interview&apos;s blind spot. Run the
                  session again — or re-run Level 4&apos;s vignettes to sharpen.
                </p>
                {onComplete && filled >= 9 ? (
                  <button
                    type="button"
                    onClick={onComplete}
                    className="rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
                  >
                    Mark Level 5 complete
                  </button>
                ) : null}
              </div>
            )
          ) : null}
        </>
      )}
    </div>
  );
}