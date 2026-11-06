import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./case-sheet-1";
import { part2 } from "./case-sheet-2";

export const meta: ModuleMeta = {
  id: "case-sheet",
  num: 22,
  title: "Writing the case sheet and formulation",
  emoji: "📝",
  tagline: "History-taking turned into a clear, defensible record: every heading with worked examples, formulation, differential, plans, risk and legal documentation, progress notes, special records and a full sample case sheet",
  when: "Clinical records",
  outcomes: [
    "Explain what a case sheet is for and write each heading in clear, attributed, respectful clinical language",
    "Write chief complaints, a chronological HPI with biological functions and relevant negatives, and a complete treatment and substance history",
    "Draw a genogram with shapes and labels, and write personal history and premorbid personality from informants",
    "Write a summary, a 5P narrative formulation and a reasoned differential diagnosis",
    "Write a biopsychosocial plan, a risk formulation, MHCA-compliant documentation, SOAP notes, a discharge summary and special records",
    "Present a long case clearly and defend it in a viva",
  ],
  writeTask:
    "Pick a patient you have seen (or Ms P from the sample) and write the whole case sheet on paper from memory of the headings: identification and informants with reliability; chief complaints with durations; an HPI in prose with biological functions and negatives; past, treatment (with adequacy) and substance history; a genogram; personal history and premorbid personality; MSE in eight headings; a summary; a 5P grid and narrative formulation; a differential with points for and against; investigations with reasons; a biopsychosocial plan; a risk formulation with MHCA legal status. Then compare with the sample case sheet and correct in red.",
  activities: [
    act.terms("Say it clinically", "Everyday words into case-sheet language."),
    act.scenarios("casesheet", "Patient case: writing it up", "Choosing the right words for the record."),
    act.lesson("cs-1", "Case files: clinic morning", "Short cases to formulate."),
    act.lesson("mse-2", "Quiz: describe it right", "Descriptions, not labels."),
  ],
  noteId: "casesheet",
};

export const text = part1 + part2;
