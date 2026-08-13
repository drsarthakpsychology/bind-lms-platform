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
  {
    id: "osce-4",
    title: "Assess capacity",
    task: "A 72-year-old man with dementia wants to discharge himself against advice to 'check on the shop'. Assess his capacity to make this decision.",
    duration_seconds: 420,
    checklist: [
      { item: "Explained the purpose of the capacity assessment", weight: 1 },
      { item: "Assessed ability to understand the relevant information", weight: 2 },
      { item: "Assessed ability to retain it", weight: 1 },
      { item: "Assessed ability to weigh it up", weight: 2 },
      { item: "Assessed ability to communicate a decision", weight: 1 },
      { item: "Did not equate capacity with agreement", weight: 2 },
      { item: "Documented the assessment", weight: 1 },
    ],
    global_rating: { label: "Global capacity-assessment competence", max: 5 },
  },
  {
    id: "osce-5",
    title: "An angry relative",
    task: "A patient's brother is furious in the waiting room: 'You people have made him worse!' Manage the anger without being defensive or dismissive.",
    duration_seconds: 420,
    checklist: [
      { item: "Acknowledged the emotion before the content", weight: 2 },
      { item: "Did not get defensive or argue", weight: 2 },
      { item: "Reflected what the relative said they observed", weight: 1 },
      { item: "Offered a concrete next step (review, second opinion, complaint route)", weight: 2 },
      { item: "Set safe boundaries on behaviour without escalating", weight: 1 },
      { item: "Followed up on what can actually change", weight: 1 },
    ],
    global_rating: { label: "Global anger-management competence", max: 5 },
  },
  {
    id: "osce-6",
    title: "Non-adherence conversation",
    task: "A 38-year-old woman on an antidepressant stopped taking it two weeks ago because of weight gain. She says she's 'never going back on it'. Address this without coercion.",
    duration_seconds: 420,
    checklist: [
      { item: "Asked about the reason before assuming the cause", weight: 2 },
      { item: "Validated the side-effect concern", weight: 1 },
      { item: "Explored the trade-off honestly (benefit vs side effect)", weight: 1 },
      { item: "Did not lecture or guilt-trip", weight: 2 },
      { item: "Offered options: dose timing, prescriber review, alternatives", weight: 1 },
      { item: "Closed with a concrete plan she owns", weight: 1 },
      { item: "Explained discontinuation risk of stopping abruptly", weight: 1 },
    ],
    global_rating: { label: "Global adherence-conversation competence", max: 5 },
  },
  {
    id: "osce-7",
    title: "First psychotic episode — the family",
    task: "A 19-year-old was hospitalised with a first psychotic episode. His parents are terrified he's 'ruined for life'. Explain what a first episode means, honestly.",
    duration_seconds: 420,
    checklist: [
      { item: "Named the diagnosis clearly without jargon", weight: 1 },
      { item: "Explained that first-episode outcomes vary — honest hope, not false promise", weight: 2 },
      { item: "Addressed the stigma fear directly ('mad', 'ruined')", weight: 2 },
      { item: "Explained the treatment timeline (weeks-months, not days)", weight: 1 },
      { item: "Involved the family in the care plan", weight: 1 },
      { item: "Checked their understanding and emotion", weight: 1 },
      { item: "Offered support resources", weight: 1 },
    ],
    global_rating: { label: "Global first-episode psychoeducation", max: 5 },
  },
  {
    id: "osce-8",
    title: "Adolescent alone",
    task: "A 15-year-old is brought by parents who want 'the full report' on their daughter. She won't speak while they're in the room. Gain her trust and negotiate the disclosure question.",
    duration_seconds: 420,
    checklist: [
      { item: "Asked the parents to step out at some point", weight: 2 },
      { item: "Engaged the adolescent directly, not through the parents", weight: 2 },
      { item: "Named the confidentiality rules clearly (safety exceptions)", weight: 2 },
      { item: "Did not promise blanket secrecy", weight: 1 },
      { item: "Explored what she wants the parents to know", weight: 1 },
      { item: "Set up a feedback structure that protects her voice", weight: 1 },
    ],
    global_rating: { label: "Global adolescent-engagement competence", max: 5 },
  },
  {
    id: "osce-9",
    title: "Grief, not depression",
    task: "A 58-year-old man, four weeks after his wife's death, is eating little and sleeping badly. His daughter fears 'he's depressed'. Assess what this is before labelling it.",
    duration_seconds: 420,
    checklist: [
      { item: "Did not jump to the depression label", weight: 2 },
      { item: "Explored the grief timeline and function honestly", weight: 2 },
      { item: "Distinguished normal grief from complicated grief/depression", weight: 2 },
      { item: "Asked about risk without pathologising", weight: 1 },
      { item: "Normalised the family's worry while correcting the frame", weight: 1 },
      { item: "Offered follow-up if things don't shift", weight: 1 },
    ],
    global_rating: { label: "Global grief-assessment competence", max: 5 },
  },
  {
    id: "osce-10",
    title: "Disclosure of abuse",
    task: "A 26-year-old woman, in her third session, reveals her partner 'gets physical' when angry. She says she's not ready to leave. Respond safely.",
    duration_seconds: 420,
    checklist: [
      { item: "Believed and validated the disclosure", weight: 2 },
      { item: "Assessed immediate danger (weapon, threats, children)", weight: 2 },
      { item: "Did not pressure her to leave", weight: 2 },
      { item: "Explored safety planning step by step", weight: 1 },
      { item: "Offered concrete resources (helplines, shelters) without pushing", weight: 1 },
      { item: "Explained the confidentiality limits (risk to life)", weight: 1 },
    ],
    global_rating: { label: "Global abuse-disclosure competence", max: 5 },
  },
  {
    id: "osce-11",
    title: "Side-effect complaint",
    task: "A 29-year-old on an antipsychotic reports 'my hands won't stay still' — pacing, restless legs, unbearable urge to move. The treating doctor said 'it's just anxiety'. Take the complaint seriously.",
    duration_seconds: 420,
    checklist: [
      { item: "Recognised akathisia as a possibility (drug-induced)", weight: 2 },
      { item: "Did not dismiss it as anxiety", weight: 2 },
      { item: "Took a medication timeline (started when?)", weight: 1 },
      { item: "Explained the concern and its management to the prescriber", weight: 2 },
      { item: "Did not stop or change the medication himself", weight: 1 },
      { item: "Reassured with action, not platitudes", weight: 1 },
    ],
    global_rating: { label: "Global akathisia-recognition competence", max: 5 },
  },
  {
    id: "osce-12",
    title: "Telehealth boundary",
    task: "A client calls you on video from their car at 9pm, mid-panic, and wants 'a full session now'. They have done this twice this month. Establish the boundary safely.",
    duration_seconds: 420,
    checklist: [
      { item: "Stabilised the immediate panic with grounding (not full therapy)", weight: 2 },
      { item: "Did not run the full session on demand", weight: 2 },
      { item: "Named the pattern without shaming", weight: 1 },
      { item: "Set a clear on-demand vs scheduled boundary", weight: 1 },
      { item: "Gave a concrete crisis plan for outside-session moments", weight: 2 },
      { item: "Scheduled a proper session to process the pattern", weight: 1 },
    ],
    global_rating: { label: "Global telehealth-boundary competence", max: 5 },
  },
];

/** Score an attempt against the checklist. Returns 0..1 fraction, weighting
 *  each item by its declared `weight` (higher-weight items count more). */
export function scoreOsce(checked: Array<{ item: string; done: boolean; weight?: number }>): number {
  const totalWeight = checked.reduce((a, c) => a + (c.weight ?? 1), 0);
  const earned = checked.reduce((a, c) => a + (c.done ? (c.weight ?? 1) : 0), 0);
  return totalWeight ? earned / totalWeight : 0;
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
