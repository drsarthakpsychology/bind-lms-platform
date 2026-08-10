"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";

/**
 * Dictate form — Dr. Sarthak types/records a composite case. Saves to
 * sim_cases as source='faculty_dictated', approved=false, status='draft'.
 */
export function DictateForm() {
  const [title, setTitle] = React.useState("");
  const [difficulty, setDifficulty] = React.useState("cooperative");
  const [presentation, setPresentation] = React.useState("");
  const [history, setHistory] = React.useState("");
  const [redFlags, setRedFlags] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (!title.trim() || !presentation.trim()) {
      setError("Title and presentation are required.");
      return;
    }
    setBusy(true);
    setError(null);
    haptic("tap");
    const caseData = {
      identity: { name: "Faculty composite", age: 0, gender: "other" as const, occupation: "", city: "", family_structure: "", language_register: "" },
      presentation: presentation.trim(),
      chief_complaint_in_own_words: presentation.trim().slice(0, 200),
      history: { timeline: history.trim() },
      cognitive_model: { core_belief: "", intermediate_beliefs: [], coping: [] },
      disclosure_rules: [],
      resistance: { deflections: [], topic_changes: [], irritation_triggers: [], silence_tolerance_seconds: 8 },
      affect_rules: { on_interruption: "withdraws", on_premature_advice: "deflects", on_validation: "opens up", tts_rate: 0.9, tts_pitch: 0.9 },
      red_flags: redFlags.split("\n").map((s) => s.trim()).filter(Boolean).map((content) => ({ content, gate: "asked_about_self_harm_clearly" })),
      context_pack: { family_in_room: false, stigma: [], cost_concerns: false, legal_relevance: [] },
      style_refs: [],
      rubric_targets: ["history taking", "safety assessment", "cultural attunement"],
      few_shot: [],
    };
    try {
      const res = await fetch("/api/practice/corpus/dictate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), difficulty, caseData }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        setError(j?.error ?? "Could not save the case.");
        return;
      }
      haptic("success");
      setDone(true);
      setTitle(""); setPresentation(""); setHistory(""); setRedFlags("");
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
      <div>
        <label className="text-small font-medium" htmlFor="dict-title">Case title</label>
        <input
          id="dict-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Young man, academic pressure, first-episode anxiety"
          className="mt-1 w-full rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <label className="text-small font-medium" htmlFor="dict-diff">Difficulty</label>
        <select
          id="dict-diff"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="mt-1 w-full rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="cooperative">Cooperative</option>
          <option value="guarded">Guarded</option>
          <option value="resistant">Resistant</option>
          <option value="crisis">Crisis</option>
        </select>
      </div>

      <div>
        <label className="text-small font-medium" htmlFor="dict-pres">Presentation (chief complaint + how they present)</label>
        <textarea
          id="dict-pres"
          value={presentation}
          onChange={(e) => setPresentation(e.target.value)}
          rows={4}
          placeholder="What brought them in, in their own words. Somatic-first? Family in the room?"
          className="mt-1 w-full resize-none rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <label className="text-small font-medium" htmlFor="dict-hist">History (timeline, prior, substances, help-seeking)</label>
        <textarea
          id="dict-hist"
          value={history}
          onChange={(e) => setHistory(e.target.value)}
          rows={4}
          placeholder="Realistic help-seeking delay, prior contacts (GP, faith healer, family remedy)."
          className="mt-1 w-full resize-none rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <label className="text-small font-medium" htmlFor="dict-red">Red flags (one per line)</label>
        <textarea
          id="dict-red"
          value={redFlags}
          onChange={(e) => setRedFlags(e.target.value)}
          rows={2}
          placeholder="e.g. Passive suicidal ideation, no plan"
          className="mt-1 w-full resize-none rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {error ? (
        <div className="rounded-md border-2 border-red-400 bg-red-50 p-3 text-small text-red-700" role="alert">{error}</div>
      ) : null}
      {done ? (
        <div className="rounded-md border-2 border-green-500 bg-green-50 p-3 text-small text-green-800" role="status">
          Saved as a draft. Add the next one.
        </div>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none disabled:opacity-50"
      >
        {busy ? "Saving…" : "Save case draft"}
      </button>
    </form>
  );
}
