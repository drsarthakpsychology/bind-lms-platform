import { DoorOpen, Hospital, Layers, LayoutGrid, Pill, ScanEye, Swords, Timer, type LucideIcon } from "lucide-react";

export type Tone = "lime" | "blue" | "ink";
export type Game = { href: string; title: string; text: string; tag: string; icon: LucideIcon; tone: Tone };

/**
 * Only real games (plan section 8): timed, competitive or animated. Each has
 * one plain line that says what it is, a tag and its own colour. A tag never
 * shows a small number (no "16 cards" or "60 sec"): only a large real total
 * from the bank, or a word. Daily case lives in Practice; Coach and the quiz
 * path live in Smart practice (Exam Prep).
 */
export const SOLO: Game[] = [
  { href: "/games/blitz", title: "Blitz", text: "Fast facts against the clock.", tag: "500+ questions", icon: Timer, tone: "lime" },
  { href: "/games/sort", title: "Criteria sort", text: "Sort criteria into look-alike disorders.", tag: "500+ criteria", icon: LayoutGrid, tone: "blue" },
  { href: "/games/mse", title: "MSE Lab", text: "Tag every finding in an interview.", tag: "500+ excerpts", icon: ScanEye, tone: "ink" },
  { href: "/games/ward", title: "Ward Week", text: "One patient. Your choices change the ending.", tag: "Story", icon: Hospital, tone: "lime" },
  { href: "/games/rx", title: "Rx Detective", text: "Medicines, receptors and risky mixes.", tag: "270+ cases", icon: Pill, tone: "blue" },
];

export const WITH_OTHERS: Game[] = [
  { href: "/games/duel", title: "Differential duel", text: "1v1 on look-alike diagnoses. Live or against the bot.", tag: "1v1", icon: Swords, tone: "ink" },
  { href: "/games/escape", title: "Team Escape Room", text: "Race other teams through linked clues.", tag: "Teams", icon: DoorOpen, tone: "blue" },
  { href: "/games/comorbid", title: "Comorbid", text: "A card duel. Build a diagnosis; block your rival with rule-outs.", tag: "Cards", icon: Layers, tone: "lime" },
];
