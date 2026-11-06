/**
 * Test-only sample bank (about 20 questions and a few interview items) so the
 * prep logic can be tested while the real banks fill. Never imported by app code.
 */
import type { Difficulty, InterviewCategory, InterviewQuestion, PrepExam, PrepQuestion, Subject } from "./types";

const ALL: PrepExam[] = ["cuet-pg", "ugc-net", "mcp-entrance", "ma-semester"];

function q(id: string, subject: Subject, difficulty: Difficulty, answer: 0 | 1 | 2 | 3, exams: PrepExam[] = ALL, extra: Partial<PrepQuestion> = {}): PrepQuestion {
  return {
    id,
    subject,
    topic: `${subject}-topic`,
    exams,
    difficulty,
    type: "mcq",
    stem: `Sample question ${id} about ${subject}?`,
    options: [`${id} option A`, `${id} option B`, `${id} option C`, `${id} option D`],
    answer,
    explanation: `Option ${"ABCD"[answer]} is right for ${id}; the other three are wrong for stated reasons.`,
    ...extra,
  };
}

export const SAMPLE_QUESTIONS: PrepQuestion[] = [
  q("st-1", "statistics", 1, 0),
  q("st-2", "statistics", 2, 1),
  q("st-3", "statistics", 3, 2),
  q("st-4", "statistics", 4, 3),
  q("st-5", "statistics", 2, 0, ["ugc-net"]),
  q("rm-1", "research-methods", 1, 1),
  q("rm-2", "research-methods", 3, 2),
  q("rm-3", "research-methods", 2, 0, ["mcp-entrance"], { module: "exam-prep/2-2" }),
  q("pp-1", "psychopathology", 2, 3, ["mcp-entrance", "ugc-net"], { module: "more-disorders" }),
  q("pp-2", "psychopathology", 3, 1, ["mcp-entrance"], { module: "more-disorders" }),
  q("pp-3", "psychopathology", 4, 2, ["mcp-entrance"]),
  q("bio-1", "biological", 1, 0),
  q("bio-2", "biological", 3, 1),
  q("cog-1", "cognitive", 2, 2),
  q("cog-2", "cognitive", 4, 3),
  q("soc-1", "social", 2, 0, ["ugc-net", "mcp-entrance"]),
  q("p1-1", "ugc-paper1", 1, 1, ["ugc-net"]),
  q("p1-2", "ugc-paper1", 2, 2, ["ugc-net"]),
  q("p1-3", "ugc-paper1", 3, 0, ["ugc-net"], { type: "passage", passage: "A short passage for a reading comprehension set, long enough to count." }),
  q("dev-1", "developmental", 2, 1, ALL, { type: "assertion-reason", statements: ["Assertion text", "Reason text"] }),
];

function iv(id: string, category: InterviewCategory, exams: PrepExam[] = ["mcp-entrance"]): InterviewQuestion {
  return {
    id,
    category,
    exams,
    difficulty: 2,
    question: `Interview question ${id}?`,
    followUps: [`Follow-up one for ${id}`, `Follow-up two for ${id}`],
    modelAnswer: `A model answer for ${id}.`,
    mustCover: ["Point one", "Point two", "Point three", "Point four"],
    redFlags: ["Red flag one", "Red flag two"],
  };
}

export const SAMPLE_INTERVIEWS: InterviewQuestion[] = [
  iv("iv-mot-1", "motivation"),
  iv("iv-mot-2", "motivation"),
  iv("iv-aca-1", "academic"),
  iv("iv-vig-1", "clinical-vignette"),
  iv("iv-ass-1", "assessment"),
  iv("iv-res-1", "research"),
  iv("iv-eth-1", "ethics", ["ugc-net", "mcp-entrance"]),
  iv("iv-cur-1", "current-affairs", ["cuet-pg"]),
];
