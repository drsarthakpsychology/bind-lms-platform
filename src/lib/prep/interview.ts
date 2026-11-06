/**
 * Mock interview: a short panel drawn by category, and the self-assessment
 * score. Pure.
 */
import { shuffle } from "@/lib/learn/model/picker";
import type { InterviewCategory, InterviewQuestion, PrepExam } from "./types";

/** The order a panel usually runs: settle in, then academics, a case, testing, research, ethics, the news. */
export const PANEL_ORDER: InterviewCategory[] = ["motivation", "academic", "clinical-vignette", "assessment", "research", "ethics", "current-affairs"];

export const CATEGORY_LABEL: Record<InterviewCategory, string> = {
  motivation: "About you",
  academic: "Subject knowledge",
  "clinical-vignette": "A case",
  assessment: "Tests and assessment",
  research: "Research",
  ethics: "Ethics and law",
  "current-affairs": "Current affairs",
};

export const PANEL_SIZE = 5;

/**
 * One question per category in panel order (up to `size`), preferring items
 * for this goal and ones the student hasn't had before. If categories run
 * short, the panel fills from what's left.
 */
export function pickPanel(bank: InterviewQuestion[], goal: PrepExam | null, rng: () => number, seen: ReadonlySet<string> = new Set(), size = PANEL_SIZE): InterviewQuestion[] {
  const fits = goal ? bank.filter((q) => q.exams.includes(goal)) : bank;
  const pool = fits.length >= size ? fits : bank;
  const rank = (list: InterviewQuestion[]) => shuffle(list, rng).sort((a, b) => Number(seen.has(a.id)) - Number(seen.has(b.id)));
  const out: InterviewQuestion[] = [];
  const used = new Set<string>();
  for (const c of PANEL_ORDER) {
    if (out.length >= size) break;
    const q = rank(pool.filter((x) => x.category === c))[0];
    if (q) {
      out.push(q);
      used.add(q.id);
    }
  }
  for (const q of rank(pool.filter((x) => !used.has(x.id)))) {
    if (out.length >= size) break;
    out.push(q);
  }
  return out;
}

export type SelfScore = { pct: number; band: "strong" | "okay" | "weak" };

/**
 * Self-assessment: share of the must-cover points ticked, minus 15 points per
 * red flag the student admits to. Clamped to 0–100.
 */
export function selfScore(mustCover: number, covered: number, redFlags: number): SelfScore {
  const base = mustCover > 0 ? (Math.min(covered, mustCover) / mustCover) * 100 : 0;
  const pct = Math.max(0, Math.min(100, Math.round(base - 15 * Math.max(0, redFlags))));
  return { pct, band: pct >= 75 ? "strong" : pct >= 45 ? "okay" : "weak" };
}
