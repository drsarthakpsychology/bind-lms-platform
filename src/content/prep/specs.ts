import type { ExamSpec, Subject } from "@/lib/prep/types";

/**
 * Mock exam patterns. Every number comes from docs/plans/PG_PREP_RESEARCH.md
 * (6 Nov 2026), with its source tag:
 * - `verified: true` only where the research read the conducting body's own
 *   document (OFFICIAL).
 * - `verified: false` where the pattern comes from a coaching site or news
 *   report (SECONDARY), or is VIBHA's own practice format. The page shows
 *   "pattern being verified" next to these.
 * How questions spread across subjects inside a section is VIBHA's choice
 * (no exam publishes unit weightage), except IHBAS, whose reported weightage
 * is mirrored as parts.
 */
export type PrepSpec = ExamSpec & {
  /** Stable id used in links and stored attempts. Never rename. */
  id: string;
  /** Short name for buttons and lists. */
  short: string;
  /** The exam cycle the pattern was reported for. */
  cycle: string;
  /** Plain-English notes shown with the pattern (what is unknown, what we chose). */
  notes?: string[];
};

/** CUET PG HUQP20's 13 official units, mapped to bank subjects. */
const CUET_SUBJECTS: Subject[] = [
  "research-methods",
  "history-systems",
  "indian-psychology",
  "biological",
  "learning-motivation-emotion",
  "perception-attention",
  "cognitive",
  "personality-theories",
  "psychometrics-assessment",
  "developmental",
  "psychopathology",
  "clinical-therapies",
  "statistics",
];

/** UGC NET Paper 2's 10 official units, mapped to bank subjects. */
const NET_P2_SUBJECTS: Subject[] = [
  "history-systems",
  "indian-psychology",
  "research-methods",
  "statistics",
  "psychometrics-assessment",
  "biological",
  "perception-attention",
  "learning-motivation-emotion",
  "cognitive",
  "personality-theories",
  "social",
  "developmental",
  "psychopathology",
  "clinical-therapies",
  "counselling",
  "positive",
  "health",
];

/** The broad master's-level syllabus used by most clinical entrances. */
const CLINICAL_ENTRANCE: Subject[] = [
  "research-methods",
  "statistics",
  "psychometrics-assessment",
  "cognitive",
  "perception-attention",
  "learning-motivation-emotion",
  "biological",
  "developmental",
  "social",
  "personality-theories",
  "history-systems",
  "psychopathology",
  "clinical-therapies",
  "counselling",
  "organisational",
  "health",
  "ethics-law",
];

/** The common core across the MA/MSc curricula read in the research (§5.3). */
const SEMESTER_CORE: Subject[] = ["cognitive", "social", "research-methods", "statistics", "psychometrics-assessment", "personality-theories", "developmental", "biological", "psychopathology"];

const one = (count: number, subjects: Subject[], title = "Psychology") => [{ title, count, subjects }];

export const EXAM_SPECS: PrepSpec[] = [
  {
    id: "cuet-pg-huqp20",
    exam: "cuet-pg",
    title: "CUET PG Psychology (HUQP20)",
    short: "CUET PG",
    cycle: "2026",
    minutes: 90,
    marksPerRight: 4,
    marksPerWrong: -1,
    sections: one(75, CUET_SUBJECTS),
    verified: true,
    source: "NTA CUET (PG) 2026 Information Bulletin and HUQP20 syllabus",
    notes: ["All 75 questions are compulsory.", "Blank answers get 0. A wrong answer loses 1 mark."],
  },
  {
    id: "ugc-net-04",
    exam: "ugc-net",
    title: "UGC NET Psychology (Paper 1 + Paper 2)",
    short: "UGC NET",
    cycle: "December 2026",
    minutes: 180,
    marksPerRight: 2,
    marksPerWrong: 0,
    sections: [
      { title: "Paper 1", count: 50, subjects: ["ugc-paper1"] },
      { title: "Paper 2", count: 100, subjects: NET_P2_SUBJECTS },
    ],
    verified: true,
    source: "NTA UGC-NET December 2026 Information Bulletin",
    notes: ["Both papers in one sitting of 3 hours, with no break.", "No negative marking, so never leave a question blank."],
  },
  {
    id: "nimhans-mclinpsy",
    exam: "mcp-entrance",
    title: "NIMHANS M.Clin.Psy entrance",
    short: "NIMHANS",
    cycle: "2026",
    minutes: 90,
    marksPerRight: 1,
    marksPerWrong: -0.25,
    sections: one(100, CLINICAL_ENTRANCE),
    verified: false,
    source: "Reported by a coaching summary of the 2026 notification (official PDF not yet read)",
    notes: ["No interview for M.Clin.Psy in 2026 (reported)."],
  },
  {
    id: "cip-ranchi",
    exam: "mcp-entrance",
    title: "CIP Ranchi clinical psychology entrance",
    short: "CIP Ranchi",
    cycle: "2025 (M.Phil)",
    minutes: 60,
    marksPerRight: 1,
    marksPerWrong: 0,
    sections: one(100, CLINICAL_ENTRANCE),
    verified: false,
    source: "Reported by coaching summaries of the 2025 cycle",
    notes: ["An interview of 50 marks followed the test in 2025 (reported).", "The 2026–27 pattern has not been published."],
  },
  {
    id: "ihbas-delhi",
    exam: "mcp-entrance",
    title: "IHBAS Delhi clinical psychology entrance",
    short: "IHBAS",
    cycle: "2025",
    minutes: 90,
    marksPerRight: 1,
    marksPerWrong: 0,
    sections: [
      { title: "Clinical", count: 25, subjects: ["clinical-therapies", "counselling", "psychometrics-assessment", "ethics-law"] },
      { title: "Abnormal", count: 15, subjects: ["psychopathology"] },
      { title: "General", count: 10, subjects: ["history-systems", "cognitive", "perception-attention", "learning-motivation-emotion"] },
      { title: "Personality", count: 10, subjects: ["personality-theories"] },
      { title: "Social", count: 10, subjects: ["social"] },
      { title: "Developmental", count: 10, subjects: ["developmental"] },
      { title: "Physiological", count: 10, subjects: ["biological"] },
      { title: "Statistics and research", count: 10, subjects: ["statistics", "research-methods"] },
    ],
    verified: false,
    source: "Reported by a coaching page; the date is on the official IHBAS notice, the pattern is not",
    notes: ["Marks per question are not published; we use 1.", "The parts follow the only reported weightage."],
  },
  {
    id: "rinpas-ranchi",
    exam: "mcp-entrance",
    title: "RINPAS Ranchi clinical psychology entrance",
    short: "RINPAS",
    cycle: "2025–27 (M.Phil)",
    minutes: 90,
    marksPerRight: 2,
    marksPerWrong: -1,
    sections: one(100, CLINICAL_ENTRANCE),
    verified: false,
    source: "Ranchi University notice, PG courses 2025–27 (RINPAS)",
    notes: ["The notice does not give the duration; we time it at 90 minutes.", "A practical and viva on interview day is mandatory."],
  },
  {
    id: "gmch-chandigarh",
    exam: "mcp-entrance",
    title: "GMCH Chandigarh clinical psychology entrance",
    short: "GMCH",
    cycle: "2025 (M.Phil)",
    minutes: 120,
    marksPerRight: 1,
    marksPerWrong: 0,
    sections: one(100, CLINICAL_ENTRANCE),
    verified: true,
    source: "GMCH-32 M.Phil Combined Prospectus 2025",
    notes: ["No interview: rank only.", "To qualify: 50% (General) or 45% (SC)."],
  },
  {
    id: "csjmu-kanpur",
    exam: "mcp-entrance",
    title: "CSJMU Kanpur MA Clinical Psychology entrance",
    short: "CSJMU",
    cycle: "2026",
    minutes: 60,
    marksPerRight: 1,
    marksPerWrong: 0,
    sections: one(70, CLINICAL_ENTRANCE),
    verified: true,
    source: "CSJMU entrance guidelines, Ref. CSJMU/DCP/40/2026",
    notes: ["An interview of 30 marks follows on the same day (total 100)."],
  },
  {
    id: "semester-objective",
    exam: "ma-semester",
    title: "Semester revision test",
    short: "Semester test",
    cycle: "VIBHA practice format",
    minutes: 45,
    marksPerRight: 1,
    marksPerWrong: 0,
    sections: one(40, SEMESTER_CORE),
    verified: false,
    source: "VIBHA practice format, not an official pattern",
    notes: ["University semester papers are mostly written answers. Use this for the objective part and for revision."],
  },
];

export function specById(id: string): PrepSpec | undefined {
  return EXAM_SPECS.find((s) => s.id === id);
}
