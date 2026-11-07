import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./substance-1";
import { part2 } from "./substance-2";
import { part3, test } from "./substance-3";
import { qa } from "./substance-qa";

export const meta: ModuleMeta = {
  id: "substance",
  num: 15,
  title: "Substance use and addictive disorders",
  emoji: "🍶",
  tagline: "From use to addiction: alcohol, opioids, cannabis, tobacco, stimulants, sedatives and gambling, withdrawal care, motivational interviewing and India's services",
  when: "Substance use and addiction",
  outcomes: [
    "Explain in plain words the spectrum from use to addiction, and how reward, tolerance and withdrawal work",
    "Take a non-judgemental substance history, screen with AUDIT and ASSIST, and deliver a brief intervention",
    "Apply the eleven criteria with severity, and recognise intoxication and withdrawal for each major substance",
    "Manage alcohol and opioid withdrawal safely using CIWA-Ar and COWS, including delirium tremens and Wernicke's encephalopathy",
    "Choose relapse-prevention and opioid agonist medicines with correct dosing, and use motivational interviewing",
    "Describe India's pattern of use, the NDPS Act, opioid substitution programmes and integrated dual-diagnosis care",
  ],
  writeTask:
    "On paper, from memory: the eleven criteria in four groups with severity cut-offs; the alcohol withdrawal timeline with seizures and DTs; the CIWA-Ar and COWS score bands; a chlordiazepoxide reducing regimen and the thiamine doses for prophylaxis and Wernicke's; opioid intoxication versus withdrawal and the naloxone dose; buprenorphine induction; the three alcohol relapse-prevention medicines with dose and one caution each; OARS and the stages of change; and NDPS Section 64A. Then check and correct in red.",
  activities: [
    act.lesson("ls-3", "Quiz: alcohol and substances", "Withdrawal, Wernicke and medicines."),
    act.scenarios("substance", "Patient case: “I can stop anytime”", "Motivational interviewing in practice."),
    act.coach("counselling", "Coach: counselling", "Motivational interviewing and stages of change."),
    act.detective("Clinic detective", "Guess the substance or medicine from clues."),
  ],
  noteId: "substance",
};

export const text = part1 + part2 + part3 + qa + test;
