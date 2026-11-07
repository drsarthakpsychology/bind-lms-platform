import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./ocd-1";
import { part2 } from "./ocd-2";
import { part3 } from "./ocd-3";

export const meta: ModuleMeta = {
  id: "ocd",
  num: 8,
  title: "Obsessive-compulsive and related disorders",
  emoji: "🔁",
  tagline: "From everyday intrusive thoughts to criteria and ERP, to circuits, resistant OCD, surgery and the research frontier",
  when: "Obsessive-compulsive and related disorders",
  outcomes: [
    "Define obsessions and compulsions and state the OCD criteria with the insight specifier",
    "Describe the common symptom themes and how to ask about them",
    "Explain the brain circuit and the learning model of OCD",
    "Distinguish OCD from OCPD, delusions, GAD worry, depressive rumination and tics",
    "Plan treatment with exposure and response prevention and SSRIs, and recognise the related disorders",
    "Explain the circuit, habit and genetic evidence, manage treatment-resistant OCD, and know where neuromodulation, surgery and new treatments stand",
  ],
  writeTask:
    "On paper, from memory: definitions of obsession and compulsion, the OCD criteria and insight levels, the four main symptom themes, the OCD vs OCPD table, the cycle of obsession, anxiety, ritual and relief, and the treatment ladder. Then check and correct in red.",
  activities: [
    act.lesson("anx-2", "Quiz: OCD and PTSD", "Criteria and treatment."),
    act.scenarios("ocd", "Patient case: “Just once more”", "When reassurance feeds the ritual."),
    act.coach("therapy", "Coach: therapies", "ERP and CBT terms."),
  ],
  noteId: "ocd",
};

export const text = part1 + part2 + part3;
