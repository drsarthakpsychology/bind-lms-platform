import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./personality-theories-1";
import { exam, part2 } from "./personality-theories-2";
import { qa } from "./personality-theories-qa";

export const meta: ModuleMeta = {
  id: "personality-theories",
  num: 48,
  title: "Theories of personality",
  emoji: "🧩",
  tagline: "Types and traits, the humanists and existentialists, social-cognitive theory, biology, evolution, Indian views and the self",
  when: "Open to all levels",
  outcomes: [
    "Explain what a personality theory must do, and place each major theorist in the right approach",
    "Compare Allport, Cattell, Eysenck, the Big Five and HEXACO, including methods (lexical, factor-analytic) and evidence on stability, heritability and prediction",
    "Describe Rogers, Maslow, May and Frankl in depth, and judge how well their ideas have been tested",
    "Apply social-cognitive ideas (Bandura, Rotter, Mischel, Kelly) to explain behaviour that changes across situations",
    "Discuss biological and evolutionary accounts of personality, and the triguna and Vedantic views of the person, without overstating the evidence",
    "Explain self-concept, self-esteem, explanatory style and moral character, and link them to clinical work",
  ],
  writeTask:
    "On paper, from memory: Allport's three kinds of traits; Cattell's three data sources; Eysenck's three superfactors with their proposed biology; the Big Five with two facets each, and what HEXACO adds; Rogers' conditions of worth and the six therapeutic conditions; Maslow's hierarchy with D- and B-needs; Frankl's three sources of meaning; Bandura's four sources of self-efficacy; Rotter's formula; Mischel's five CAPS units; Kelly's fundamental postulate; the three gunas with two qualities each; Higgins' two discrepancies and their feelings; the three dimensions of explanatory style. Then check and correct in red.",
  activities: [
    act.coach("assessment", "Coach: assessment", "Personality tests, scales and their authors."),
    act.coach("therapy", "Coach: therapies", "Client-centred, existential and cognitive founders and techniques."),
    act.lesson("df-2", "Quiz: personality disorders", "Where normal traits end and disorders begin."),
  ],
};

export const text = part1 + part2 + qa + exam;
