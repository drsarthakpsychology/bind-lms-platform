/**
 * What Practise holds, in the website's order and words
 * (src/components/learn/games-list.ts, src/components/practice/practice-hub.tsx,
 * src/components/navigation/v2-config.ts PRACTISE_GROUPS). Each entry opens
 * one screen. `tool` is the case-progress tool that keeps a half-finished
 * case (src/lib/cases/progress.ts), so the hub and the library can say Carry on.
 */
import type { ProgressTool, ToolId } from "./types";

export type Icon = "timer" | "grid" | "scan" | "hospital" | "pill" | "swords" | "door" | "layers" | "pair" | "sun" | "search" | "chat" | "words" | "gauge" | "scale" | "cap" | "clock" | "wand" | "alert" | "target" | "brain" | "book" | "trophy" | "list";

export type Entry = { id: string; title: string; line: string; href: string; icon: Icon; tool?: ProgressTool };

export const GAMES_SOLO: Entry[] = [
  { id: "blitz", title: "Blitz", line: "Fast facts against the clock.", href: "/game/blitz", icon: "timer" },
  { id: "sort", title: "Criteria sort", line: "Sort criteria into look-alike disorders.", href: "/game/sort", icon: "grid" },
  { id: "mse", title: "MSE Lab", line: "Tag every finding in an interview.", href: "/game/mse", icon: "scan" },
  { id: "ward", title: "Ward Week", line: "One patient. Your choices change the ending.", href: "/game/ward", icon: "hospital", tool: "ward" },
  { id: "rx", title: "Rx Detective", line: "Medicines, receptors and risky mixes.", href: "/game/rx", icon: "pill" },
];

export const GAMES_RIVAL: Entry[] = [
  { id: "duel", title: "Differential duel", line: "Look-alike diagnoses against the bot.", href: "/game/duel", icon: "swords" },
  { id: "escape", title: "Escape Room", line: "Open every door of one patient's case.", href: "/game/escape", icon: "door", tool: "escape" },
  { id: "comorbid", title: "Comorbid", line: "A card duel. Build a diagnosis; block your rival.", href: "/game/comorbid", icon: "layers" },
];

/** The case tools, by the id the case screen takes (/case/:id). */
export const CASE_TOOLS: (Entry & { kind: "daily" | "detective" | "tool"; toolId?: ToolId })[] = [
  { id: "daily", title: "Daily case", line: "One new patient a day. Name it in as few clues as you can.", href: "/case/daily", icon: "sun", kind: "daily" },
  { id: "detective", title: "Clinic detective", line: "Name the disorder or medicine from clues.", href: "/case/detective", icon: "search", kind: "detective", tool: "detective" },
  { id: "wwyd", title: "What would you do", line: "Tricky patient moments, real consequences.", href: "/case/wwyd", icon: "chat", kind: "tool", toolId: "wwyd", tool: "wwyd" },
  { id: "two-minute", title: "Two-minute clinic", line: "A patient, two minutes, your differential.", href: "/case/two-minute", icon: "clock", kind: "tool", toolId: "two-minute", tool: "two-minute" },
  { id: "say-it", title: "Say it clinically", line: "Everyday words into case-sheet words.", href: "/case/say-it", icon: "words", kind: "tool", toolId: "say-it" },
  { id: "judgment", title: "Judgment calls", line: "New facts change the odds.", href: "/case/judgment", icon: "gauge", kind: "tool", toolId: "judgment" },
  { id: "ethics", title: "Ethics, law and referral", line: "What to do, then the law behind it.", href: "/case/ethics", icon: "scale", kind: "tool", toolId: "ethics" },
  { id: "landmark", title: "Landmark cases", line: "Famous cases: what was believed, and what held up.", href: "/case/landmark", icon: "cap", kind: "tool", toolId: "landmark", tool: "landmark" },
  { id: "osce", title: "OSCE stations", line: "One task, out loud, against the clock.", href: "/case/osce", icon: "timer", kind: "tool", toolId: "osce", tool: "osce" },
  { id: "mse-trainer", title: "Mental state exam", line: "Describe what you see before you label it.", href: "/case/mse-trainer", icon: "brain", kind: "tool", toolId: "mse-trainer", tool: "mse-small" },
  { id: "formulation", title: "Formulation", line: "Sort the 5Ps and see the story of the case.", href: "/case/formulation", icon: "wand", kind: "tool", toolId: "formulation", tool: "formulation" },
  { id: "out-of-depth", title: "Out of depth", line: "Know when a case needs someone else.", href: "/case/out-of-depth", icon: "alert", kind: "tool", toolId: "out-of-depth" },
  { id: "weak-spots", title: "Weak spots", line: "A short drill on what you miss most.", href: "/case/weak-spots", icon: "target", kind: "tool", toolId: "weak-spots" },
];

export const PREP: Entry[] = [
  { id: "prep", title: "Question bank", line: "Questions by subject and topic, one at a time.", href: "/prep", icon: "list" },
  { id: "long", title: "Long answers", line: "Exam questions with a model answer.", href: "/prep/long", icon: "book" },
];

export const ALL_ENTRIES: Entry[] = [...GAMES_SOLO, ...GAMES_RIVAL, ...CASE_TOOLS, ...PREP];
export const entryById = (id: string) => ALL_ENTRIES.find((e) => e.id === id);
export const caseTool = (id: string) => CASE_TOOLS.find((e) => e.id === id);
