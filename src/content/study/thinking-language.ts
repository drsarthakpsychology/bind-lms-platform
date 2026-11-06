import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./thinking-language-1";
import { part2 } from "./thinking-language-2";
import { part3 } from "./thinking-language-3";
import { part4 } from "./thinking-language-4";

export const meta: ModuleMeta = {
  id: "thinking-language",
  num: 45,
  title: "Thinking, language, intelligence and creativity",
  emoji: "💡",
  tagline: "Concepts, reasoning, problem solving, heuristics, language and thought, intelligence from Spearman to PASS, and creativity",
  when: "Cognitive psychology · open to all levels",
  outcomes: [
    "Compare classical, prototype, exemplar and theory-based views of concepts, and the strategies of concept attainment",
    "Evaluate deductive and inductive reasoning, the Wason tasks and mental models, and spot invalid conditional arguments",
    "Explain Gestalt and information-processing accounts of problem solving and the obstacles of mental set and functional fixedness",
    "Apply Tversky and Kahneman's heuristics, prospect theory and bounded rationality to clinical and everyday decisions",
    "Discuss language acquisition and the relation of language and thought (Whorf, Piaget, Vygotsky, Chomsky)",
    "Compare Spearman, Thurstone, Guilford, Vernon, Cattell-Horn-Carroll, Gardner, Sternberg, PASS and emotional intelligence",
    "Explain heritability, the Flynn effect, intellectual disability, giftedness, creativity theories and their clinical links",
  ],
  writeTask:
    "On paper, from memory: the four views of concepts in a table; the four conditional argument forms with which are valid; Newell and Simon's problem space and three heuristics; Tversky and Kahneman's three heuristics with one example each and the four principles of prospect theory; strong versus weak Sapir-Whorf with two studies each; Chomsky's arguments against Skinner; a table of intelligence theories from Spearman to PASS with one criticism each; Luria's three units mapped to PASS; DSM-5-TR criteria for intellectual disability; and Wallas's stages with the four divergent thinking scores. Then check and correct in red.",
  activities: [
    act.coach("psychopathology", "Coach: psychology terms", "Reasoning, language and intelligence terms you mix up."),
    act.coach("assessment", "Coach: assessment", "Intelligence and creativity tests you confuse."),
    act.lesson("ls-1", "Quiz: childhood", "Intellectual disability and learning disorders."),
  ],
};

export const text = part1 + part2 + part3 + part4;
