import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./therapies-1";
import { part2 } from "./therapies-2";

export const meta: ModuleMeta = {
  id: "therapies",
  num: 13,
  title: "Psychotherapies and counselling",
  emoji: "🛋️",
  tagline: "Common factors and counselling microskills; supportive, behavioural, CBT, MI, IPT, family, career and school counselling; DBT, ACT, MBCT, group and expressive therapies; with worked sessions and the evidence for each",
  when: "Psychotherapies",
  outcomes: [
    "Explain the common factors and use counselling microskills (attending, open questions, paraphrase, reflection, summarising, challenging)",
    "Describe and apply supportive therapy, problem-solving, exposure-based behaviour therapy and CBT, with a worked session",
    "Conduct a motivational interviewing conversation and plan IPT for each of its four problem areas",
    "Explain family and systemic therapies, family psychoeducation, and career and school counselling with Indian examples",
    "Describe DBT, ACT, MBCT, group and expressive therapies, their techniques and their evidence",
    "Choose, sequence, adapt and monitor therapy for a given client, including task-shared and digital options",
  ],
  writeTask:
    "On paper, from memory: Bordin's alliance, Rogers's conditions and ten microskills with an example each; the seven problem-solving steps; an exposure hierarchy for a fear of your choice; a five-column thought record; Ellis's ABCDE; OARS and DARN-CAT; the four IPT problem areas; six family therapy schools with founders; Holland's RIASEC and Super's stages; DBT's biosocial theory, four modes and four skills modules; the ACT hexaflex; the MBCT rationale; Yalom's factors; and an evidence table matching ten problems to therapies. Then check and correct in red.",
  activities: [
    act.coach("therapy", "Coach: therapies", "Techniques and their founders."),
    act.coach("counselling", "Coach: counselling", "Micro-skills and tricky moments."),
    act.scenarios("depression", "Patient case: “Mann nahi lagta”", "Putting the skills to work."),
  ],
  noteId: "therapies",
};

export const text = part1 + part2;
