import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./more-disorders-1";
import { part2 } from "./more-disorders-2";
import { part3, test } from "./more-disorders-3";
import { qa } from "./more-disorders-qa";

export const meta: ModuleMeta = {
  id: "more-disorders",
  num: 20,
  title: "Eating, sleep, body, dissociative, sexual and impulse disorders",
  emoji: "🩻",
  tagline: "Anorexia to ARFID, insomnia to narcolepsy, functional and somatic symptoms, dissociation, sexual health and gender, impulse control and elimination",
  when: "Eating, sleep, body and impulse disorders",
  outcomes: [
    "Explain in plain words the main eating, sleep, somatic, dissociative, sexual, gender and impulse problems, and the myths that delay help",
    "State the criteria and medical risks of anorexia, bulimia, binge-eating disorder and ARFID, and manage refeeding safely",
    "Recognise insomnia, sleep apnoea, narcolepsy, circadian disorders, parasomnias and restless legs, and deliver CBT-I",
    "Diagnose functional neurological disorder on positive signs and work with somatic symptoms, factitious disorder and Dhat without dismissing patients",
    "Describe dissociative disorders and culture-related presentations, sexual dysfunctions, gender dysphoria and paraphilic disorders with respect for Indian law",
    "Prescribe safely across these areas, from fluoxetine and olanzapine to hypnotics, wake-promoting drugs and PDE5 inhibitors",
  ],
  writeTask:
    "On paper, from memory: the three criteria for anorexia with BMI severity bands and five medical complications; refeeding syndrome and its prevention; the bulimia and binge-eating disorder rules; the four CBT-I components and how to set a sleep window; the narcolepsy tetrad and its tests; NREM parasomnias versus nightmares versus RBD; the RLS features and iron rule; three positive signs of functional weakness or seizures; factitious disorder versus malingering; the PDE5 inhibitor contraindication; and the IED, kleptomania and pyromania rules. Then check and correct in red.",
  activities: [
    act.coach("disorders", "Coach: disorders", "These diagnoses side by side."),
    act.terms("Say it clinically", "Dhat, ghabrahat, kamzori into clinical language."),
    act.lesson("cs-2", "Case files: ward round", "Applying it to patients."),
  ],
  noteId: "eating",
};

export const text = part1 + part2 + part3 + qa + test;
