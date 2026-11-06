import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./ethics-law-1";
import { part2 } from "./ethics-law-2";

export const meta: ModuleMeta = {
  id: "ethics-law",
  num: 21,
  title: "Ethics and Indian mental health law",
  emoji: "⚖️",
  tagline: "Principles, consent, capacity, confidentiality and boundaries; the Mental Healthcare Act section by section; RCI, training routes and codes; POCSO, JJ, RPwD, BNS, BNSS and NDPS; research ethics; dilemmas; and India's mental health programmes",
  when: "Ethics and law",
  outcomes: [
    "Apply the four ethical principles, valid consent, capacity and boundaries to real clinical situations",
    "Explain confidentiality and its limits, including MHCA section 23, the duty to protect, families, minors and digital records",
    "State the key provisions of the Mental Healthcare Act 2017 with section numbers: rights, advance directives, nominated representatives, admissions, prohibited procedures, restraint, research and suicide",
    "Describe RCI regulation, the M.Clin.Psy and PsyD training routes, and the structure of the APA and RCI codes",
    "Apply POCSO reporting, the JJ Act, the RPwD Act, BNS 22, BNSS 367 to 378, NDPS 64A and expert-witness duties",
    "Plan ethical research under ICMR 2017 and MHCA section 99, work through dilemmas with a step-by-step model, and describe India's mental health programmes",
  ],
  writeTask:
    "On paper, from memory: the four principles with an example each; the four elements of consent and the three abilities of capacity; five limits of confidentiality; the MHCA sections for capacity, determination, advance directive, nominated representative, rights 18 to 28, admissions 86, 87, 89, 90 and 94, prohibited procedures 95, restraint 97, research 99, police 100 and suicide 115; POCSO sections 19 and 21; the RPwD benchmark and reservations; BNS 22, BNSS 367 to 378 and BSA 39; the RCI renaming of 3 May 2026; the Belmont principles; the eight-step dilemma model; and the timeline from NMHP 1982 to Tele-MANAS 2022. Then check and correct in red.",
  activities: [
    act.lesson("rk-2", "Quiz: Mental Healthcare Act 2017", "Rights, admissions, prohibited treatments."),
    act.coach("ethics", "Coach: ethics", "Principles and dilemmas."),
    act.coach("law", "Coach: law", "Indian acts and sections."),
  ],
};

export const text = part1 + part2;
