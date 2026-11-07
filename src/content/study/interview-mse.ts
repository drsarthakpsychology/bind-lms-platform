import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./interview-mse-1";
import { part2 } from "./interview-mse-2";
import { part3 } from "./interview-mse-3";
import { part4 } from "./interview-mse-4";

export const meta: ModuleMeta = {
  id: "interview-mse",
  num: 1,
  title: "The psychiatric interview & MSE",
  emoji: "🩺",
  tagline: "From a first conversation to a full history, a complete MSE, and the science of how reliable it all is",
  when: "Clinical skills",
  outcomes: [
    "Run an interview that gathers accurate data and builds trust",
    "Take and record a complete history in the standard order",
    "Write a full MSE across all eight headings, in the patient's words",
    "Define and tell apart every major sign of psychopathology",
    "Grade insight, assess judgement, and write a five-sentence formulation",
    "Assess capacity under the Mental Healthcare Act, weigh first-rank symptoms and structured interviews against the evidence, and use ICD-11, HiTOP and RDoC lenses",
  ],
  writeTask:
    "On blank paper, from memory: the 15 parts of the history, the 8-heading MSE proforma with every sub-heading, and the 6 grades of insight. Then check against the module and correct in red.",
  activities: [
    act.lesson("mse-1", "Quiz: the MSE domains, in order", "Locks in the eight headings and their sub-headings."),
    act.lesson("signs-1", "Quiz: thought and speech signs", "Flight of ideas, blocking, loosening and friends."),
    act.lesson("signs-2", "Quiz: perception and belief", "Hallucinations, illusions and delusions under time pressure."),
    act.coach("psychopathology", "Coach: psychopathology terms", "Chai spots the terms you mix up and repeats them until they stick."),
    act.terms("Say it clinically", "Turn what patients say into case-sheet language."),
  ],
  noteId: "mse",
};

export const text = part1 + part2 + part3 + part4;
