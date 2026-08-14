/**
 * Book-grounded evaluation set (brief §24). Each question carries the expected
 * source book(s) that authoritative material lives in — a source-attribution
 * recall check. The runner embeds the question, retrieves top-k via the same
 * match_corpus_chunks path the app uses, and scores whether the expected book
 * appears in the top-k with a relevant passage.
 *
 * These are hand-written from the actual corpus structure (verified against the
 * outlines), NOT generated or fabricated. Page numbers are PDF indexes.
 */
export interface EvalQuestion {
  id: string;
  category: "factual" | "conceptual" | "comparison" | "case" | "source";
  question: string;
  /** expected source book id(s) that authoritative material lives in */
  expectedSources: string[];
  /** optional: expected chapter fragment (loose check) */
  expectedChapter?: string;
}

export const EVAL_SET: EvalQuestion[] = [
  // --- factual ---
  {
    id: "f1",
    category: "factual",
    question: "What are the diagnostic criteria for major depressive disorder?",
    expectedSources: ["dsm5tr", "ahuja_psychiatry", "kaplan_sadock"],
    expectedChapter: "Depressive",
  },
  {
    id: "f2",
    category: "factual",
    question: "What is the mechanism of action of selective serotonin reuptake inhibitors?",
    expectedSources: ["stahl_essential_5th", "stahl_pg_7th", "maudsley_2021"],
    expectedChapter: "SSRI",
  },
  {
    id: "f3",
    category: "factual",
    question: "What are the core features of alcohol withdrawal syndrome?",
    expectedSources: ["ahuja_psychiatry", "dsm5tr", "maudsley_2021"],
  },
  {
    id: "f4",
    category: "factual",
    question: "What is the diagnostic criteria for obsessive compulsive disorder?",
    expectedSources: ["dsm5tr", "kaplan_sadock"],
    expectedChapter: "Obsessive-Compulsive",
  },
  {
    id: "f5",
    category: "factual",
    question: "Describe the positive and negative symptoms of schizophrenia.",
    expectedSources: ["dsm5tr", "kaplan_sadock", "stahl_essential_5th"],
    expectedChapter: "Schizophrenia",
  },

  // --- conceptual ---
  {
    id: "c1",
    category: "conceptual",
    question: "Explain the dopamine hypothesis of schizophrenia.",
    expectedSources: ["stahl_essential_5th", "kaplan_sadock"],
  },
  {
    id: "c2",
    category: "conceptual",
    question: "How does the 5-HT (serotonin) system relate to depression and anxiety?",
    expectedSources: ["stahl_essential_5th"],
  },
  {
    id: "c3",
    category: "conceptual",
    question: "What is the concept of insight in psychosis and how is it assessed?",
    expectedSources: ["fish_psychopath", "kaplan_sadock"],
  },

  // --- comparison ---
  {
    id: "m1",
    category: "comparison",
    question: "What is the difference between schizophrenia and bipolar disorder with psychotic features?",
    expectedSources: ["dsm5tr", "stahl_essential_5th", "kaplan_sadock"],
    expectedChapter: "Schizophrenia",
  },
  {
    id: "m2",
    category: "comparison",
    question: "Compare typical versus atypical antipsychotics regarding extrapyramidal side effects.",
    expectedSources: ["kaplan_sadock", "maudsley_2021", "stahl_pg_7th"],
  },
  {
    id: "m3",
    category: "comparison",
    question: "What is the difference between a delusion and an obsession?",
    expectedSources: ["fish_psychopath", "kaplan_sadock"],
  },

  // --- case (clinical scenario → retrieval of the right clinical guidance) ---
  {
    id: "k1",
    category: "case",
    question: "A patient on clozapine develops fever and sore throat. What monitoring is required?",
    expectedSources: ["maudsley_2021", "stahl_pg_7th"],
  },
  {
    id: "k2",
    category: "case",
    question: "Managing a patient who is pregnant and needs an antidepressant — what are the considerations?",
    expectedSources: ["maudsley_2021"],
  },
  {
    id: "k3",
    category: "case",
    question: "How is catatonia diagnosed and what features are assessed?",
    expectedSources: ["dsm5tr", "kaplan_sadock"],
  },

  // --- source attribution ---
  {
    id: "s1",
    category: "source",
    question: "Which reference describes the psychiatric interview and mental status examination?",
    expectedSources: ["ahuja_psychiatry", "kaplan_sadock", "fish_psychopath"],
  },
  {
    id: "s2",
    category: "source",
    question: "Where is the classification of mental and behavioural disorders defined for coding purposes?",
    expectedSources: ["icd11", "dsm5tr"],
  },
];
