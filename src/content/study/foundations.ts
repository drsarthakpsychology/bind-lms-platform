import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./foundations-1";
import { part2 } from "./foundations-2";

export const meta: ModuleMeta = {
  id: "foundations",
  num: 47,
  title: "Foundations: history, schools and Indian psychology",
  emoji: "🏛️",
  tagline: "Where psychology came from: its methods, its schools, the Indian systems of thought, the pioneers and the debates about what kind of science it is",
  when: "Open to all levels",
  outcomes: [
    "Define psychology across eras, state its goals and perspectives, and choose the right method for a question",
    "Trace psychology from Greek philosophy and physiology to Wundt, and compare the schools from structuralism to the cognitive revolution",
    "Explain the psychology of Vedanta, the Gita, Samkhya-Yoga, Buddhism, Sufism, Integral Yoga and the Nyaya pramanas, including triguna and panchakosha",
    "Describe how psychology developed in India, its phases and institutions, and the work of Sengupta, Bose, Durganand Sinha, J. B. P. Sinha and other pioneers",
    "Discuss indigenous psychology, its methods and its critics, with Indian and Asian examples",
    "Compare paradigms by ontology, epistemology and methodology, and argue a balanced position on science, spirituality and self-knowledge",
  ],
  writeTask:
    "On paper, from memory: a table of nine schools with founder, subject matter, method and one criticism; ten dated milestones from Fechner to Neisser; the six darshanas in pairs; the five koshas, three gunas, five vrittis, five kleshas and eight limbs; the pramanas accepted by six schools; ten Indian milestones from 1905 to 2020; six Indian pioneers with one contribution each; and the six paradigms with their ontology. Then check and correct in red.",
  activities: [
    act.lesson("df-1", "Quiz: defence mechanisms", "Freud's school in practice."),
    act.coach("therapy", "Coach: therapies", "Schools of therapy and their founders."),
    act.coach("assessment", "Coach: assessment", "Methods, tests and Indian scales."),
    act.coach("ethics", "Coach: ethics", "Research ethics and professional roles."),
  ],
};

export const text = part1 + part2;
