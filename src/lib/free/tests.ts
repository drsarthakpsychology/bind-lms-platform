/**
 * Free self-check questionnaires on the public site.
 *
 * Only validated, free-to-use instruments, with their published wording,
 * response options and scoring. Nothing a person answers is stored or sent
 * anywhere: scoring runs in the browser.
 *
 * Sources (wording and scoring follow these exactly):
 * - PHQ-9: Kroenke, Spitzer & Williams (2001). Free to use (Pfizer; no permission needed).
 * - GAD-7: Spitzer, Kroenke, Williams & Löwe (2006). Free to use (Pfizer).
 * - WHO-5 Well-Being Index: WHO Collaborating Centre in Mental Health (1998). Free to use.
 * - Rosenberg Self-Esteem Scale: Rosenberg (1965). Free for educational and non-commercial use.
 * - ASRS v1.1 screener (Part A, 6 items): WHO / Kessler et al. (2005). Free to use.
 * - Mini-IPIP (Big Five, 20 items): Donnellan et al. (2006); IPIP items are public domain.
 */

export type Option = { label: string; value: number };
export type Item = { text: string; reverse?: boolean; trait?: TraitKey };
export type Band = { min: number; max: number; label: string; tone: "ok" | "mild" | "moderate" | "high"; advice: string };
export type TraitKey = "E" | "A" | "C" | "N" | "O";

export type Instrument = {
  id: string;
  name: string;
  short: string;
  measures: string;
  minutes: number;
  forWhom: string;
  intro: string;
  stem: string;
  options: Option[];
  items: Item[];
  /** Optional unscored follow-up question (PHQ-9 / GAD-7 "how difficult"). */
  extra?: { text: string; options: string[] };
  source: string;
  kind: "total" | "who5" | "asrs" | "bigfive";
  bands?: Band[];
  maxScore?: number;
};

const FREQ_2W: Option[] = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

const DIFFICULTY = {
  text: "If you checked off any problems, how difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?",
  options: ["Not difficult at all", "Somewhat difficult", "Very difficult", "Extremely difficult"],
};

export const PHQ9: Instrument = {
  id: "phq-9",
  name: "PHQ-9",
  short: "Low mood check",
  measures: "Symptoms of depression over the last 2 weeks",
  minutes: 3,
  forWhom: "Adults and teens 12+",
  intro: "The questionnaire doctors and psychologists use most often to check for depression. 9 questions about the last two weeks.",
  stem: "Over the last 2 weeks, how often have you been bothered by any of the following problems?",
  options: FREQ_2W,
  items: [
    { text: "Little interest or pleasure in doing things" },
    { text: "Feeling down, depressed, or hopeless" },
    { text: "Trouble falling or staying asleep, or sleeping too much" },
    { text: "Feeling tired or having little energy" },
    { text: "Poor appetite or overeating" },
    { text: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down" },
    { text: "Trouble concentrating on things, such as reading the newspaper or watching television" },
    {
      text: "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
    },
    { text: "Thoughts that you would be better off dead or of hurting yourself in some way" },
  ],
  extra: DIFFICULTY,
  source: "Kroenke K, Spitzer RL, Williams JBW. The PHQ-9. J Gen Intern Med. 2001;16(9):606–613.",
  kind: "total",
  maxScore: 27,
  bands: [
    { min: 0, max: 4, label: "Minimal", tone: "ok", advice: "Your answers suggest few or no symptoms of depression right now." },
    { min: 5, max: 9, label: "Mild", tone: "mild", advice: "Some symptoms. Keep an eye on how you feel and take this again in two weeks. If it isn't easing, talk to someone." },
    { min: 10, max: 14, label: "Moderate", tone: "moderate", advice: "This is the level where talking to a psychologist, counsellor or doctor is recommended." },
    { min: 15, max: 19, label: "Moderately severe", tone: "high", advice: "Please talk to a psychologist or psychiatrist soon. Treatment works well at this level." },
    { min: 20, max: 27, label: "Severe", tone: "high", advice: "Please see a psychiatrist or psychologist as soon as you can. You don't have to manage this alone." },
  ],
};

export const GAD7: Instrument = {
  id: "gad-7",
  name: "GAD-7",
  short: "Anxiety check",
  measures: "Symptoms of anxiety over the last 2 weeks",
  minutes: 2,
  forWhom: "Adults and teens 12+",
  intro: "The standard short questionnaire for anxiety. 7 questions about the last two weeks.",
  stem: "Over the last 2 weeks, how often have you been bothered by the following problems?",
  options: FREQ_2W,
  items: [
    { text: "Feeling nervous, anxious, or on edge" },
    { text: "Not being able to stop or control worrying" },
    { text: "Worrying too much about different things" },
    { text: "Trouble relaxing" },
    { text: "Being so restless that it is hard to sit still" },
    { text: "Becoming easily annoyed or irritable" },
    { text: "Feeling afraid, as if something awful might happen" },
  ],
  extra: DIFFICULTY,
  source: "Spitzer RL, Kroenke K, Williams JBW, Löwe B. A brief measure for assessing generalized anxiety disorder: the GAD-7. Arch Intern Med. 2006;166(10):1092–1097.",
  kind: "total",
  maxScore: 21,
  bands: [
    { min: 0, max: 4, label: "Minimal", tone: "ok", advice: "Your answers suggest little or no anxiety right now." },
    { min: 5, max: 9, label: "Mild", tone: "mild", advice: "Some anxiety. The breathing and grounding exercises on this site can help. Check again in two weeks." },
    { min: 10, max: 14, label: "Moderate", tone: "moderate", advice: "At 10 or above, a proper assessment by a psychologist or doctor is recommended." },
    { min: 15, max: 21, label: "Severe", tone: "high", advice: "Please talk to a psychologist or psychiatrist soon. Anxiety at this level is very treatable." },
  ],
};

export const WHO5: Instrument = {
  id: "who-5",
  name: "WHO-5",
  short: "Wellbeing check",
  measures: "How well you've been feeling over the last 2 weeks",
  minutes: 1,
  forWhom: "Ages 9+",
  intro: "The World Health Organization's five-question wellbeing index. Higher is better.",
  stem: "Please indicate for each of the five statements which is closest to how you have been feeling over the last two weeks.",
  options: [
    { label: "All of the time", value: 5 },
    { label: "Most of the time", value: 4 },
    { label: "More than half of the time", value: 3 },
    { label: "Less than half of the time", value: 2 },
    { label: "Some of the time", value: 1 },
    { label: "At no time", value: 0 },
  ],
  items: [
    { text: "I have felt cheerful and in good spirits" },
    { text: "I have felt calm and relaxed" },
    { text: "I have felt active and vigorous" },
    { text: "I woke up feeling fresh and rested" },
    { text: "My daily life has been filled with things that interest me" },
  ],
  source: "WHO Collaborating Centre in Mental Health, Psychiatric Research Unit (1998). Topp CW et al. The WHO-5 Well-Being Index: a systematic review. Psychother Psychosom. 2015;84:167–176.",
  kind: "who5",
  maxScore: 100,
  bands: [
    { min: 0, max: 28, label: "Low wellbeing", tone: "high", advice: "A score this low often goes with depression. Please take the PHQ-9 and talk to a professional." },
    { min: 29, max: 50, label: "Below average", tone: "moderate", advice: "Your wellbeing is lower than it should be. Taking the PHQ-9 is a good next step." },
    { min: 51, max: 100, label: "Good", tone: "ok", advice: "Your wellbeing looks good right now." },
  ],
};

const RSES_OPTIONS: Option[] = [
  { label: "Strongly agree", value: 3 },
  { label: "Agree", value: 2 },
  { label: "Disagree", value: 1 },
  { label: "Strongly disagree", value: 0 },
];

export const RSES: Instrument = {
  id: "self-esteem",
  name: "Rosenberg Self-Esteem Scale",
  short: "Self-esteem",
  measures: "How you feel about yourself overall",
  minutes: 2,
  forWhom: "Teens and adults",
  intro: "The most widely used self-esteem questionnaire in the world. 10 statements about how you generally feel about yourself.",
  stem: "Below is a list of statements dealing with your general feelings about yourself. How much do you agree?",
  options: RSES_OPTIONS,
  items: [
    { text: "On the whole, I am satisfied with myself." },
    { text: "At times I think I am no good at all.", reverse: true },
    { text: "I feel that I have a number of good qualities." },
    { text: "I am able to do things as well as most other people." },
    { text: "I feel I do not have much to be proud of.", reverse: true },
    { text: "I certainly feel useless at times.", reverse: true },
    { text: "I feel that I'm a person of worth, at least on an equal plane with others." },
    { text: "I wish I could have more respect for myself.", reverse: true },
    { text: "All in all, I am inclined to feel that I am a failure.", reverse: true },
    { text: "I take a positive attitude toward myself." },
  ],
  source: "Rosenberg M. Society and the Adolescent Self-Image. Princeton University Press; 1965.",
  kind: "total",
  maxScore: 30,
  bands: [
    { min: 0, max: 14, label: "Low", tone: "moderate", advice: "You may be quite hard on yourself at the moment. Talking it through with a counsellor or psychologist can genuinely help." },
    { min: 15, max: 25, label: "Typical range", tone: "ok", advice: "Most people score in this range." },
    { min: 26, max: 30, label: "High", tone: "ok", advice: "You feel positively about yourself." },
  ],
};

export const ASRS: Instrument = {
  id: "adhd-asrs",
  name: "ASRS v1.1 Screener",
  short: "Adult ADHD screen",
  measures: "Signs of adult ADHD over the last 6 months",
  minutes: 2,
  forWhom: "Adults 18+",
  intro: "The World Health Organization's 6-question adult ADHD screener. It can't diagnose ADHD, but it shows whether a full assessment is worth it.",
  stem: "Thinking about the past 6 months, how often…",
  options: [
    { label: "Never", value: 0 },
    { label: "Rarely", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Often", value: 3 },
    { label: "Very often", value: 4 },
  ],
  items: [
    { text: "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?" },
    { text: "How often do you have difficulty getting things in order when you have to do a task that requires organization?" },
    { text: "How often do you have problems remembering appointments or obligations?" },
    { text: "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?" },
    { text: "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?" },
    { text: "How often do you feel overly active and compelled to do things, like you were driven by a motor?" },
  ],
  source: "Kessler RC et al. The World Health Organization Adult ADHD Self-Report Scale (ASRS). Psychol Med. 2005;35(2):245–256.",
  kind: "asrs",
};

const IPIP_OPTIONS: Option[] = [
  { label: "Very inaccurate", value: 1 },
  { label: "Moderately inaccurate", value: 2 },
  { label: "Neither accurate nor inaccurate", value: 3 },
  { label: "Moderately accurate", value: 4 },
  { label: "Very accurate", value: 5 },
];

export const MINI_IPIP: Instrument = {
  id: "big-five",
  name: "Big Five (Mini-IPIP)",
  short: "Personality",
  measures: "Your five core personality traits",
  minutes: 4,
  forWhom: "Teens and adults",
  intro: "The Big Five is the personality model psychologists actually use in research. There are no good or bad results, just where you sit on five traits.",
  stem: "Describe yourself as you generally are now, not as you wish to be in the future. How accurately does each statement describe you?",
  options: IPIP_OPTIONS,
  items: [
    { text: "Am the life of the party.", trait: "E" },
    { text: "Sympathize with others' feelings.", trait: "A" },
    { text: "Get chores done right away.", trait: "C" },
    { text: "Have frequent mood swings.", trait: "N" },
    { text: "Have a vivid imagination.", trait: "O" },
    { text: "Don't talk a lot.", trait: "E", reverse: true },
    { text: "Am not interested in other people's problems.", trait: "A", reverse: true },
    { text: "Often forget to put things back in their proper place.", trait: "C", reverse: true },
    { text: "Am relaxed most of the time.", trait: "N", reverse: true },
    { text: "Am not interested in abstract ideas.", trait: "O", reverse: true },
    { text: "Talk to a lot of different people at parties.", trait: "E" },
    { text: "Feel others' emotions.", trait: "A" },
    { text: "Like order.", trait: "C" },
    { text: "Get upset easily.", trait: "N" },
    { text: "Have difficulty understanding abstract ideas.", trait: "O", reverse: true },
    { text: "Keep in the background.", trait: "E", reverse: true },
    { text: "Am not really interested in others.", trait: "A", reverse: true },
    { text: "Make a mess of things.", trait: "C", reverse: true },
    { text: "Seldom feel blue.", trait: "N", reverse: true },
    { text: "Do not have a good imagination.", trait: "O", reverse: true },
  ],
  source: "Donnellan MB, Oswald FL, Baird BM, Lucas RE. The Mini-IPIP scales. Psychol Assess. 2006;18(2):192–203. Items from the International Personality Item Pool (ipip.ori.org), public domain.",
  kind: "bigfive",
};

export const TRAITS: Record<TraitKey, { name: string; high: string; low: string; mid: string }> = {
  E: {
    name: "Extraversion",
    high: "You get energy from people and activity, and enjoy being in the thick of things.",
    low: "You recharge with quiet and smaller groups, and prefer depth over a crowd.",
    mid: "You enjoy people and activity, and you also value your quiet time. Many people sit here.",
  },
  A: {
    name: "Agreeableness",
    high: "Warm, cooperative and tuned in to how others feel.",
    low: "Direct and sceptical. You put honesty and your own judgement ahead of keeping the peace.",
    mid: "Warm and cooperative most of the time, and direct when it matters.",
  },
  C: {
    name: "Conscientiousness",
    high: "Organised, reliable and likes things done properly and on time.",
    low: "Flexible and spontaneous. Structure and routine feel less natural to you.",
    mid: "Organised when you need to be, flexible when you can be.",
  },
  N: {
    name: "Emotional sensitivity (Neuroticism)",
    high: "You feel stress, worry and low moods strongly and often.",
    low: "Calm and even. Stress tends to wash over you.",
    mid: "You feel stress and worry at times, but it usually settles.",
  },
  O: {
    name: "Openness / imagination",
    high: "Curious, imaginative and drawn to ideas, art and new experiences.",
    low: "Practical and down to earth. You prefer the concrete and familiar.",
    mid: "Open to new ideas, while still valuing what is practical and familiar.",
  },
};

export const INSTRUMENTS: Instrument[] = [PHQ9, GAD7, WHO5, RSES, ASRS, MINI_IPIP];

export function getInstrument(id: string): Instrument | undefined {
  return INSTRUMENTS.find((i) => i.id === id);
}

/** Value of one answer after reverse-keying. */
export function itemScore(inst: Instrument, index: number, value: number): number {
  const item = inst.items[index];
  if (!item.reverse) return value;
  const values = inst.options.map((o) => o.value);
  return Math.max(...values) + Math.min(...values) - value;
}

export type Result =
  | { kind: "total"; score: number; max: number; band: Band; flags: string[] }
  | { kind: "who5"; raw: number; score: number; max: number; band: Band; flags: string[] }
  | { kind: "asrs"; positives: number; positive: boolean; flags: string[] }
  | { kind: "bigfive"; traits: { key: TraitKey; score: number; level: "low" | "middle" | "high" }[]; flags: string[] };

export function bandFor(bands: Band[], score: number): Band {
  return bands.find((b) => score >= b.min && score <= b.max) ?? bands[bands.length - 1];
}

/** Score a fully answered instrument. `answers[i]` is the option value picked. */
export function scoreInstrument(inst: Instrument, answers: number[]): Result {
  if (answers.length !== inst.items.length || answers.some((a) => typeof a !== "number" || Number.isNaN(a))) {
    throw new Error("Every question needs an answer.");
  }
  const flags: string[] = [];
  if (inst.id === "phq-9" && answers[8] > 0) flags.push("self-harm");

  switch (inst.kind) {
    case "total": {
      const score = answers.reduce((sum, v, i) => sum + itemScore(inst, i, v), 0);
      return { kind: "total", score, max: inst.maxScore ?? 0, band: bandFor(inst.bands ?? [], score), flags };
    }
    case "who5": {
      const raw = answers.reduce((a, b) => a + b, 0);
      const score = raw * 4;
      return { kind: "who5", raw, score, max: 100, band: bandFor(inst.bands ?? [], score), flags };
    }
    case "asrs": {
      // Part A: items 1–3 count from "Sometimes", items 4–6 from "Often".
      const positives = answers.filter((v, i) => (i < 3 ? v >= 2 : v >= 3)).length;
      return { kind: "asrs", positives, positive: positives >= 4, flags };
    }
    case "bigfive": {
      const keys: TraitKey[] = ["E", "A", "C", "N", "O"];
      const traits = keys.map((key) => {
        const score = inst.items.reduce((sum, item, i) => (item.trait === key ? sum + itemScore(inst, i, answers[i]) : sum), 0);
        const level: "low" | "middle" | "high" = score <= 9 ? "low" : score >= 15 ? "high" : "middle";
        return { key, score, level };
      });
      return { kind: "bigfive", traits, flags };
    }
  }
}
