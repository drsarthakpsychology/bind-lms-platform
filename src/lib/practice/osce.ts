/**
 * OSCE Station Mode (Part 6.12) — timed single-station assessment.
 * 7 minutes, one task. Scored on a station-specific checklist + global rating.
 * Students face this format in RCI-track exams; almost nobody practises it.
 */

export interface OsceStation {
  id: string;
  title: string;
  task: string;
  duration_seconds: number;
  checklist: Array<{ item: string; weight: number }>;
  global_rating: { label: string; max: number };
}

export const SEED_OSCE_STATIONS: OsceStation[] = [
  {
    id: "osce-1",
    title: "Focused risk assessment",
    task: "Take a focused risk assessment of a 26-year-old woman who has been feeling 'very low' since a breakup.",
    duration_seconds: 420,
    checklist: [
      { item: "Asked about suicidal ideation in clear language", weight: 2 },
      { item: "Explored plan, means, intent", weight: 2 },
      { item: "Asked about prior attempts", weight: 1 },
      { item: "Asked about protective factors", weight: 1 },
      { item: "Asked about alcohol/substance use", weight: 1 },
      { item: "Made a clear safety plan / referral", weight: 2 },
      { item: "Maintained a non-judgemental stance", weight: 1 },
    ],
    global_rating: { label: "Global risk-assessment competence", max: 5 },
  },
  {
    id: "osce-2",
    title: "Explain an SSRI to a reluctant patient",
    task: "Explain what an SSRI is, what to expect, and address a 40-year-old man's fears that 'antidepressants are addictive'.",
    duration_seconds: 420,
    checklist: [
      { item: "Explained mechanism in plain language", weight: 1 },
      { item: "Set realistic timeline (2-4 weeks)", weight: 1 },
      { item: "Addressed the 'addiction' myth directly", weight: 2 },
      { item: "Discussed common side effects + what to do", weight: 1 },
      { item: "Discussed discontinuation (not abrupt)", weight: 1 },
      { item: "Checked understanding", weight: 1 },
      { item: "Shared decision-making (not lecturing)", weight: 2 },
    ],
    global_rating: { label: "Global psychoeducation competence", max: 5 },
  },
  {
    id: "osce-3",
    title: "Break the news you're referring them",
    task: "Break the news to a 30-year-old man that you're referring him to a psychiatrist — he's worried it means he's 'mad'.",
    duration_seconds: 420,
    checklist: [
      { item: "Used a warning shot ('I have something important to share')", weight: 1 },
      { item: "Normalised referral without minimising", weight: 2 },
      { item: "Addressed the stigma directly", weight: 1 },
      { item: "Explained what will happen at the referral", weight: 1 },
      { item: "Checked emotional response", weight: 1 },
      { item: "Offered support / follow-up", weight: 1 },
      { item: "Paced the information", weight: 1 },
    ],
    global_rating: { label: "Global breaking-bad-news competence", max: 5 },
  },
];

/** Score an attempt against the checklist. Returns 0..1 fraction. */
export function scoreOsce(checked: Array<{ item: string; done: boolean }>): number {
  const total = checked.reduce((a, c) => a + (c.done ? 1 : 0), 0);
  return checked.length ? total / checked.length : 0;
}

/**
 * Deterministic shuffle from a numeric seed (0..1). Returns a new array with
 * the same items in a rotated order, so a given day's seed yields a stable
 * station order (all stations still appear, just not always #1 first).
 */
export function seededRotate<T>(items: T[], seed: number): T[] {
  const n = items.length;
  if (n === 0) return [...items];
  const offset = Math.floor(Math.abs(seed) * n) % n;
  return [...items.slice(offset), ...items.slice(0, offset)];
}
