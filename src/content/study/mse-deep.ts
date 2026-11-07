import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./mse-deep-1";
import { part2 } from "./mse-deep-2";
import { part3 } from "./mse-deep-3";

export const meta: ModuleMeta = {
  id: "mse-deep",
  num: 31,
  title: "The MSE in depth",
  emoji: "🔍",
  tagline: "How each part of the mental status examination looks and sounds in the room, how to tell look-alikes apart, and how to write it up",
  when: "Open to all levels",
  outcomes: [
    "Observe from the first moment and separate observation from interpretation",
    "Tell apart the confusable pairs by ear: circumstantial and tangential, flight of ideas and loosening, true and pseudo-hallucination, mood and affect, obsession and delusion",
    "Run a fair bedside cognitive screen and recognise delirium",
    "Assess insight in parts, respecting cultural explanatory models",
    "Examine mute, hostile and interpreted patients, and find risk within the MSE",
    "Write a clear, defensible MSE report with quotes, negatives and a one-line synthesis",
  ],
  writeTask:
    "On paper, from memory: the decision path for thought form (four questions); the four questions that sort perceptions; the five dimensions of affect; the bedside cognitive sequence; the four parts of insight; and the seven rules for writing an MSE. Then write a full MSE for Report 1 (Mr Iqbal) without looking, and compare with the model in red.",
  activities: [
    act.lesson("mse-1", "Quiz: the MSE domains, in order", "The headings and sub-headings."),
    act.lesson("signs-1", "Quiz: thought and speech signs", "The confusable pairs, fast."),
    act.lesson("signs-2", "Quiz: perception and belief", "Hallucinations, illusions and delusions."),
    act.lesson("mse-2", "Quiz: describe it right", "Descriptions, not labels."),
    act.terms("Say it clinically", "Turn what patients say into case-sheet language."),
  ],
};

export const text = part1 + part2 + part3;
