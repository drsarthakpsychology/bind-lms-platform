import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./child-1";
import { part2 } from "./child-2";
import { part3 } from "./child-3";

export const meta: ModuleMeta = {
  id: "child",
  num: 18,
  title: "Child and adolescent mental health",
  emoji: "🧩",
  tagline: "From milestones and red flags to ADHD, autism, learning, tics, mood, behaviour, attachment and the Indian school",
  when: "Child and adolescent psychiatry",
  outcomes: [
    "Explain in plain words how child mental health differs from adult mental health, and spot developmental red flags",
    "State the criteria for intellectual disability, autism, ADHD, learning disorders, tics, ODD, conduct disorder, DMDD, attachment disorders and the elimination disorders",
    "Assess a child with many informants, choose and interpret Indian and international tools, and write a 4 Ps formulation",
    "Plan treatment: parent training, school support, CBT and family work, and safe prescribing of stimulants, SSRIs and antipsychotics with monitoring",
    "Recognise behavioural phenotypes of the main genetic syndromes",
    "Apply POCSO, the RPwD Act, the Mental Healthcare Act and school accommodations in practice",
  ],
  writeTask:
    "On paper, from memory: a milestone table with five red flags; the autism rule (three plus two of four); the ADHD rule with counts, age and settings; intellectual disability's three criteria and severity by adaptive function; Tourette's versus persistent tic disorder; ODD versus conduct disorder versus DMDD; RAD versus DSED; the enuresis and encopresis rules with treatment; the six steps after a child discloses abuse; and a methylphenidate titration plan with monitoring. Then check and correct in red.",
  activities: [
    act.lesson("ls-1", "Quiz: childhood", "Neurodevelopmental and behaviour disorders."),
    act.coach("disorders", "Coach: disorders", "The diagnoses you mix up."),
    act.coach("law", "Coach: law", "POCSO, RPwD and consent."),
  ],
  noteId: "child",
};

export const text = part1 + part2 + part3;
