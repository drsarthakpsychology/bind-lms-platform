import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./neurocognitive-1";
import { part2 } from "./neurocognitive-2";

export const meta: ModuleMeta = {
  id: "neurocognitive",
  num: 17,
  title: "Delirium and dementia",
  emoji: "🕰️",
  tagline: "Sudden confusion versus gradual decline: delirium, the dementias, MMSE, MoCA and ACE-III, treatment, carers and the 2026 frontier",
  when: "Delirium and dementia",
  outcomes: [
    "Explain in plain words the difference between normal ageing, delirium and dementia",
    "Diagnose delirium with DSM-5-TR, the CAM and the 4AT, find its causes and manage it without harm",
    "Define mild and major neurocognitive disorder and describe Alzheimer's, vascular, Lewy body, frontotemporal and other dementias",
    "Run a reversible-cause work-up and tell depression from dementia",
    "Administer and interpret MMSE, MoCA and ACE-III with attention to education and language",
    "Prescribe cholinesterase inhibitors and memantine, explain anti-amyloid antibodies and ARIA, manage behavioural symptoms, and support carers and planning",
  ],
  writeTask:
    "On paper, from memory: the DSM-5-TR delirium criteria, the CAM algorithm and the 4AT items; PINCH ME; a delirium-versus-dementia table; the four core features of dementia with Lewy bodies and the one-year rule; six features of behavioural variant FTD; the NPH triad; the reversible-cause blood tests; the domains and totals of MMSE, MoCA and ACE-III with cut-offs; donepezil, rivastigmine and memantine titration; and the DICE approach. Then check and correct in red.",
  activities: [
    act.lesson("ls-2", "Quiz: delirium and dementia", "Criteria, subtypes and causes."),
    act.scenarios("dementia", "Patient case: “Maa keeps asking the same thing”", "Supporting a carer and spotting delirium."),
    act.coach("neuroscience", "Coach: neuroscience", "Brain areas and transmitters."),
  ],
  noteId: "dementia",
};

export const text = part1 + part2;
