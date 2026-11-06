import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./psychodynamics-1";
import { part2 } from "./psychodynamics-2";

export const meta: ModuleMeta = {
  id: "psychodynamics",
  num: 30,
  title: "Psychodynamics in depth",
  emoji: "🪞",
  tagline: "From Freud to attachment: conflict, inner relationships, the therapy room, formulation and the evidence",
  when: "Open to all levels",
  outcomes: [
    "Explain Freud's maps of the mind, signal anxiety and compromise formation, and what has survived scrutiny",
    "Compare ego psychology, object relations (Klein, Winnicott, Kernberg), self psychology (Kohut) and attachment theory",
    "Recognise transference, countertransference and resistance in the room and respond helpfully",
    "Write a five-part psychodynamic formulation using Malan's triangles or the CCRT",
    "Describe the main brief dynamic therapies and weigh the evidence for them honestly",
    "Discuss Girindrasekhar Bose, the Indian self and family systems without stereotyping",
  ],
  writeTask:
    "On paper, from memory: the seven-level defence ladder with two examples each; Klein's two positions; Winnicott's five key ideas; Kohut's three selfobject needs; the four AAI categories with the infant pattern each predicts; the five parts of a psychodynamic formulation; and a formulation for Meera or Daniel using the triangle of conflict. Then check and correct in red.",
  activities: [
    act.lesson("df-1", "Quiz: defence mechanisms", "Name the defence from the example."),
    act.coach("therapy", "Coach: therapies", "Founders, models and techniques."),
    act.coach("counselling", "Coach: counselling", "Tricky moments in the room."),
    act.lesson("cs-1", "Case files: clinic morning", "Short cases to formulate."),
  ],
};

export const text = part1 + part2;
