import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./exam-prep-1";
import { part2 } from "./exam-prep-2";
import { part3 } from "./exam-prep-3";
import { part4 } from "./exam-prep-4";

export const meta: ModuleMeta = {
  id: "exam-prep",
  num: 33,
  title: "Exam prep: UGC NET, clinical entrances, CUET PG and semester exams",
  emoji: "🎯",
  tagline: "Know the pattern, study the way memory works, practise in exam style, and write answers that score",
  when: "Open to all levels",
  outcomes: [
    "Describe the reported pattern of UGC NET Psychology, CUET PG, NIMHANS and CIP entrances, and know to confirm it in the official notice",
    "Plan preparation in phases using practice testing, spacing, interleaving and an error log",
    "Decide when to guess under negative marking using expected marks",
    "Answer exam-style MCQs across research methods, cognitive, biological, developmental, personality, social, testing, psychopathology, therapies and law",
    "Write short notes, long answers and case-vignette answers that match the command word",
  ],
  writeTask:
    "On paper: the exam table for your target exam (format and marking, then check it against the official bulletin); your phase plan with what 'done' means for each phase; the expected-value calculation for your exam's marking scheme; and one 15-mark answer, written in timed conditions (minutes per mark), using the long answer frame. Then mark it against the frame in red.",
  activities: [
    act.lesson("mse-1", "Quiz: the MSE domains, in order", "A favourite of clinical entrances."),
    act.lesson("df-1", "Quiz: defence mechanisms", "High-yield in every paper."),
    act.coach("assessment", "Coach: assessment", "Tests, scales and their authors."),
    act.coach("disorders", "Coach: disorders", "The diagnoses you confuse."),
    act.coach("law", "Coach: law", "Indian acts and sections."),
  ],
};

export const text = part1 + part2 + part3 + part4;
