import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./anxiety-1";
import { part2 } from "./anxiety-2";
import { part3 } from "./anxiety-3";

export const meta: ModuleMeta = {
  id: "anxiety",
  num: 7,
  title: "Anxiety disorders",
  emoji: "⚡",
  tagline: "From the body's alarm to criteria, exposure and medicines, to fear circuits, receptors and new treatments",
  when: "Anxiety disorders",
  outcomes: [
    "Tell normal anxiety from an anxiety disorder",
    "State the criteria for GAD, panic disorder, agoraphobia, social anxiety, specific phobia, separation anxiety and selective mutism",
    "Explain the fear circuit, the cognitive model of panic and how avoidance maintains anxiety",
    "Rule out medical and substance causes",
    "Plan treatment with CBT and exposure first, and medicines used safely",
    "Explain the fear circuit, anxiolytic receptor pharmacology and the inhibitory learning model of exposure, and weigh new treatments and ICD-11, HiTOP and RDoC views",
  ],
  writeTask:
    "On paper, from memory: the 6 GAD symptoms and the 6-month rule, the 13 panic attack symptoms with the 4-symptom threshold, the 5 agoraphobic situations, the 5 types of specific phobia, Clark's vicious circle of panic, and a treatment plan for panic disorder. Then check and correct in red.",
  activities: [
    act.lesson("anx-1", "Quiz: anxiety disorders", "Criteria and durations."),
    act.coach("therapy", "Coach: therapies", "Exposure, desensitisation and CBT terms."),
    act.coach("disorders", "Coach: disorders", "The diagnoses you mix up."),
    act.terms("Say it clinically", "Ghabrahat, tension, dil ghabrana into case-sheet language."),
  ],
  noteId: "anxiety",
};

export const text = part1 + part2 + part3;
