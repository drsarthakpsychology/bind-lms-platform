import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./psychosis-1";
import { part2 } from "./psychosis-2";
import { part3 } from "./psychosis-3";

export const meta: ModuleMeta = {
  id: "psychosis",
  num: 9,
  title: "Schizophrenia spectrum and catatonia",
  emoji: "🌀",
  tagline: "From what psychosis is to criteria, antipsychotics, clozapine and catatonia, to dopamine, glutamate, genes and the first non-dopamine drug",
  when: "Psychotic disorders",
  outcomes: [
    "State the criteria for schizophrenia and the other psychotic disorders, separated by duration",
    "Describe positive, negative and cognitive symptoms with examples",
    "Explain the dopamine, glutamate and neurodevelopmental models",
    "List good and poor prognostic factors and the role of expressed emotion",
    "Recognise catatonia, rate it, and know why lorazepam and ECT come first",
    "Choose, dose and monitor antipsychotics and clozapine, and explain D2 occupancy, muscarinic drugs, genetics, ICD-11, HiTOP and Indian outcome evidence",
  ],
  writeTask:
    "On paper, from memory: the five A-criterion symptoms of schizophrenia, the duration ladder (brief psychotic, schizophreniform, schizophrenia), the schizoaffective rule, the 12 catatonic signs, 6 good and 6 poor prognostic factors, and the treatment plan including clozapine. Then check and correct in red.",
  activities: [
    act.lesson("psy-1", "Quiz: the schizophrenia spectrum", "Durations and criteria."),
    act.lesson("psy-2", "Quiz: catatonia and red flags", "Signs, lorazepam challenge, emergencies."),
    act.scenarios("schizophrenia", "Patient case: the voices", "Talking with someone who is hearing voices, without arguing or colluding."),
    act.lesson("signs-2", "Quiz: perception and belief", "Hallucinations and delusions."),
  ],
  noteId: "schizophrenia",
};

export const text = part1 + part2 + part3;
