import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./learning-memory-1";
import { part2 } from "./learning-memory-2";
import { part3 } from "./learning-memory-3";
import { part4 } from "./learning-memory-4";

export const meta: ModuleMeta = {
  id: "learning-memory",
  num: 44,
  title: "Learning and memory",
  emoji: "🧩",
  tagline: "Conditioning, schedules, observational learning, memory models, forgetting, false memory and memory in the clinic",
  when: "Cognitive psychology · open to all levels",
  outcomes: [
    "Explain classical conditioning and its phenomena, and use the Rescorla-Wagner model to explain blocking and extinction",
    "Distinguish the four kinds of operant consequence and the four reinforcement schedules, with their response patterns",
    "Describe latent, insight and observational learning, and Bandura's four processes and self-efficacy",
    "Compare Hull, Guthrie, Estes and Tolman, and explain LTP, Kandel's work and dopamine prediction error",
    "Evaluate the multi-store model, working memory and levels of processing with their key experiments",
    "Explain theories of forgetting, reconstructive memory, eyewitness error and false memory",
    "Recognise the amnesias and memory problems in psychiatric disorders, and apply learning theory to exposure, addiction and behaviour change",
  ],
  writeTask:
    "On paper, from memory: a labelled diagram of classical conditioning; the 2 by 2 table of reinforcement and punishment with an example each; the four schedules with their response patterns and cumulative-record shapes; the Rescorla-Wagner equation with one worked trial and the blocking explanation; Bandura's four processes; the Atkinson-Shiffrin model with duration, capacity and coding; Baddeley's four components with one piece of evidence each; five theories of forgetting; and H. M.'s memory profile. Then check and correct in red.",
  activities: [
    act.coach("therapy", "Coach: therapies", "Conditioning, exposure and behaviour therapy terms."),
    act.coach("neuroscience", "Coach: neuroscience", "Memory systems, the hippocampus and dopamine."),
    act.lesson("ls-2", "Quiz: delirium and dementia", "Memory loss in the clinic."),
    act.lesson("ls-3", "Quiz: alcohol and substances", "Wernicke, Korsakoff and withdrawal."),
  ],
};

export const text = part1 + part2 + part3 + part4;
