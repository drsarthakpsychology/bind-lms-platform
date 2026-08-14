/**
 * Book-grounded evaluation set (brief §24). 50 questions across 5 categories
 * (factual / conceptual / comparison / case / source-attribution). Each
 * question carries:
 *   - expectedSources: the book(s) authoritative material lives in (recall)
 *   - answerTerms: key terms that MUST appear in a retrieved passage for the
 *     answer to be grounded — the hallucination-resistance signal.
 *
 * The first 16 were hand-written from the corpus outlines; the remaining 34
 * were authored + adversarially verified against the actual book text by a
 * 6-agent workflow (every answerTerm grep-confirmed in an expected source's
 * text cache). Baseline (2026-08-14): recall@5/8 100%, grounded@8 vector-only
 * 76%, grounded app-path (expanded) 90%.
 *
 * The 10% app-path gap is the honest hard edge: case-management questions
 * whose answer terms (e.g. serotonin-syndrome management: myoclonus,
 * hyperreflexia, cyproheptadine) spread across a multi-page section beyond the
 * ±1-page expansion — a documented future improvement (deeper contextual
 * retrieval / larger chunk windows), not a hidden failure.
 */
export interface EvalQuestion {
  id: string;
  category: "factual" | "conceptual" | "comparison" | "case" | "source";
  question: string;
  /** expected source book id(s) that authoritative material lives in */
  expectedSources: string[];
  /** optional: expected chapter fragment (loose check) */
  expectedChapter?: string;
  /**
   * Key terms that MUST appear in a retrieved passage for the answer to be
   * grounded — the hallucination-resistance signal. If the top retrieved
   * passage lacks these, a model synthesizing from it would be hallucinating.
   */
  answerTerms?: string[];
}

export const EVAL_SET: EvalQuestion[] = [
  // --- factual ---
  {
    id: "f1",
    category: "factual",
    question: "What are the diagnostic criteria for major depressive disorder?",
    expectedSources: ["dsm5tr", "ahuja_psychiatry", "kaplan_sadock"],
    expectedChapter: "Depressive",
    answerTerms: ["depressed mood", "interest"],
  },
  {
    id: "f2",
    category: "factual",
    question: "What is the mechanism of action of selective serotonin reuptake inhibitors?",
    expectedSources: ["stahl_essential_5th", "stahl_pg_7th", "maudsley_2021"],
    expectedChapter: "SSRI",    answerTerms: ["serotonin","reuptake"],
  },
  {
    id: "f3",
    category: "factual",
    question: "What are the core features of alcohol withdrawal syndrome?",
    expectedSources: ["ahuja_psychiatry", "dsm5tr", "maudsley_2021"],
    answerTerms: ["withdrawal", "tremor", "autonomic"],
  },
  {
    id: "f4",
    category: "factual",
    question: "What is the diagnostic criteria for obsessive compulsive disorder?",
    expectedSources: ["dsm5tr", "kaplan_sadock"],
    expectedChapter: "Obsessive-Compulsive",    answerTerms: ["obsession","compulsion"],
  },
  {
    id: "f5",
    category: "factual",
    question: "Describe the positive and negative symptoms of schizophrenia.",
    expectedSources: ["dsm5tr", "kaplan_sadock", "stahl_essential_5th"],
    expectedChapter: "Schizophrenia",    answerTerms: ["delusions","hallucinations"],
  },

  // --- conceptual ---
  {
    id: "c1",
    category: "conceptual",
    question: "Explain the dopamine hypothesis of schizophrenia.",
    expectedSources: ["stahl_essential_5th", "kaplan_sadock"],    answerTerms: ["dopamine","hypothesis"],
  },
  {
    id: "c2",
    category: "conceptual",
    question: "How does the 5-HT (serotonin) system relate to depression and anxiety?",
    expectedSources: ["stahl_essential_5th"],    answerTerms: ["serotonin","depression"],
  },
  {
    id: "c3",
    category: "conceptual",
    question: "What is the concept of insight in psychosis and how is it assessed?",
    expectedSources: ["fish_psychopath", "kaplan_sadock"],    answerTerms: ["insight","psychosis"],
  },

  // --- comparison ---
  {
    id: "m1",
    category: "comparison",
    question: "What is the difference between schizophrenia and bipolar disorder with psychotic features?",
    expectedSources: ["dsm5tr", "stahl_essential_5th", "kaplan_sadock"],
    expectedChapter: "Schizophrenia",    answerTerms: ["schizophrenia","bipolar"],
  },
  {
    id: "m2",
    category: "comparison",
    question: "Compare typical versus atypical antipsychotics regarding extrapyramidal side effects.",
    expectedSources: ["kaplan_sadock", "maudsley_2021", "stahl_pg_7th"],    answerTerms: ["antipsychotic","extrapyramidal"],
  },
  {
    id: "m3",
    category: "comparison",
    question: "What is the difference between a delusion and an obsession?",
    expectedSources: ["fish_psychopath", "kaplan_sadock"],    answerTerms: ["delusion","obsession"],
  },

  // --- case (clinical scenario → retrieval of the right clinical guidance) ---
  {
    id: "k1",
    category: "case",
    question: "A patient on clozapine develops fever and sore throat. What monitoring is required?",
    expectedSources: ["maudsley_2021", "stahl_pg_7th"],    answerTerms: ["clozapine","agranulocytosis"],
  },
  {
    id: "k2",
    category: "case",
    question: "Managing a patient who is pregnant and needs an antidepressant — what are the considerations?",
    expectedSources: ["maudsley_2021"],    answerTerms: ["pregnancy","antidepressant"],
  },
  {
    id: "k3",
    category: "case",
    question: "How is catatonia diagnosed and what features are assessed?",
    expectedSources: ["dsm5tr", "kaplan_sadock"],    answerTerms: ["catatonia","catatonic"],
  },

  // --- source attribution ---
  {
    id: "s1",
    category: "source",
    question: "Which reference describes the psychiatric interview and mental status examination?",
    expectedSources: ["ahuja_psychiatry", "kaplan_sadock", "fish_psychopath"],    answerTerms: ["mental status","examination"],
  },
  {
    id: "s2",
    category: "source",
    question: "Where is the classification of mental and behavioural disorders defined for coding purposes?",
    expectedSources: ["icd11", "dsm5tr"],    answerTerms: ["classification","ICD"],
  },

  {
    id: "f6",
    category: "factual",
    question: "According to DSM-5-TR, how is a panic attack defined in the diagnostic criteria for panic disorder, and how many symptoms are required during an attack?",
    expectedSources: ["dsm5tr"],
    answerTerms: ["unexpected", "palpitations", "abrupt", "intense fear"],
  },
  {
    id: "f7",
    category: "factual",
    question: "According to DSM-5-TR, what are the defining features of a personality disorder?",
    expectedSources: ["dsm5tr"],
    answerTerms: ["enduring", "inflexible", "pervasive", "distress"],
  },
  {
    id: "f8",
    category: "factual",
    question: "According to DSM-5-TR, what are the core diagnostic features of delirium that distinguish it from other neurocognitive disorders?",
    expectedSources: ["dsm5tr"],
    answerTerms: ["attention", "awareness", "fluctuate", "short period"],
  },
  {
    id: "f9",
    category: "factual",
    question: "According to DSM-5-TR, what frequency and duration of sleep difficulty are required for a diagnosis of insomnia disorder?",
    expectedSources: ["dsm5tr"],
    answerTerms: ["3 nights per week", "3 months", "difficulty initiating", "adequate opportunity"],
  },
  {
    id: "f10",
    category: "factual",
    question: "According to DSM-5-TR, what are the four symptom clusters that make up the diagnostic criteria for posttraumatic stress disorder?",
    expectedSources: ["dsm5tr"],
    answerTerms: ["intrusion", "avoidance", "negative alterations", "hypervigilance"],
  },
  {
    id: "f11",
    category: "factual",
    question: "According to DSM-5-TR, what distinguishes bipolar II disorder from bipolar I disorder?",
    expectedSources: ["dsm5tr"],
    answerTerms: ["hypomanic episode", "major depressive episode", "mania"],
  },
  {
    id: "f12",
    category: "factual",
    question: "What is the primary mechanism by which antipsychotic drugs reduce the positive symptoms of psychosis?",
    expectedSources: ["stahl_essential_5th", "stahl_pg_7th"],
    answerTerms: ["D2", "mesolimbic", "dopamine", "block"],
  },
  {
    id: "c4",
    category: "conceptual",
    question: "In the psychiatric interview, how do transference and countertransference differ as unconscious processes, and why must the clinician remain alert to both?",
    expectedSources: ["kaplan_sadock", "ahuja_psychiatry"],
    answerTerms: ["transference", "countertransference", "unconscious"],
  },
  {
    id: "c5",
    category: "conceptual",
    question: "What distinguishes mature from immature defense mechanisms, and how does a defense such as reaction formation operate?",
    expectedSources: ["kaplan_sadock", "ahuja_psychiatry"],
    answerTerms: ["defense mechanism", "mature", "immature", "reaction formation"],
  },
  {
    id: "c6",
    category: "conceptual",
    question: "How do operant conditioning and classical conditioning differ as mechanisms by which behavior is learned?",
    expectedSources: ["kaplan_sadock", "ahuja_psychiatry"],
    answerTerms: ["operant conditioning", "classical conditioning", "reinforcement", "Skinner"],
  },
  {
    id: "c7",
    category: "conceptual",
    question: "What is the therapeutic alliance, and why is building trust and empathy with the patient central to treatment outcome?",
    expectedSources: ["kaplan_sadock", "maudsley_2021", "ahuja_psychiatry"],
    answerTerms: ["therapeutic alliance", "trust", "empathy"],
  },
  {
    id: "c8",
    category: "conceptual",
    question: "How does the G-protein-linked receptor system convert a neurotransmitter signal at the cell surface into intracellular changes via second messengers?",
    expectedSources: ["stahl_essential_5th", "stahl_pg_7th", "kaplan_sadock"],
    answerTerms: ["G protein", "second messenger", "receptor"],
  },
  {
    id: "c9",
    category: "conceptual",
    question: "What role do neuroplasticity, synaptogenesis, and neurotrophic factors such as BDNF play in the pathophysiology and treatment of depression?",
    expectedSources: ["stahl_essential_5th", "kaplan_sadock"],
    answerTerms: ["neuroplasticity", "synaptogenesis", "BDNF"],
  },
  {
    id: "c10",
    category: "conceptual",
    question: "What is the biopsychosocial model, and how does it shape both the assessment and the management plan for an individual patient?",
    expectedSources: ["ahuja_psychiatry", "kaplan_sadock"],
    answerTerms: ["biopsychosocial", "George Engel"],
  },
  {
    id: "m4",
    category: "comparison",
    question: "What is the key clinical difference between a manic episode and a hypomanic episode in bipolar disorder with respect to severity and functional impact?",
    expectedSources: ["dsm5tr"],
    answerTerms: ["manic episode", "hypomanic episode", "hospitalization", "marked impairment"],
  },
  {
    id: "m5",
    category: "comparison",
    question: "How is delirium distinguished from a major neurocognitive disorder (dementia) in terms of onset, course, and the core cognitive disturbance?",
    expectedSources: ["dsm5tr"],
    answerTerms: ["delirium", "neurocognitive disorder", "attention", "fluctuating"],
  },
  {
    id: "m6",
    category: "comparison",
    question: "What clinical features help distinguish normal grief (bereavement) from a major depressive episode?",
    expectedSources: ["dsm5tr"],
    answerTerms: ["grief", "self-esteem", "pangs", "bereavement"],
  },
  {
    id: "m7",
    category: "comparison",
    question: "What distinguishes factitious disorder from somatic symptom disorder?",
    expectedSources: ["dsm5tr"],
    answerTerms: ["factitious", "somatic symptom disorder", "falsification", "external incentive"],
  },
  {
    id: "m9",
    category: "comparison",
    question: "How is acute stress disorder distinguished from posttraumatic stress disorder (PTSD) after a traumatic event?",
    expectedSources: ["dsm5tr"],
    answerTerms: ["acute stress disorder", "posttraumatic stress disorder", "3 days", "1 month"],
  },
  {
    id: "m10",
    category: "comparison",
    question: "How is schizophreniform disorder distinguished from schizophrenia?",
    expectedSources: ["dsm5tr"],
    answerTerms: ["schizophreniform", "schizophrenia", "1 month", "6 months"],
  },
  {
    id: "k4",
    category: "case",
    question: "A 34-year-old woman on fluoxetine for depression is started on a monoamine oxidase inhibitor by another clinician without the SSRI being stopped. Within hours she becomes agitated and tremulous with myoclonus, diaphoresis, and a rising temperature, progressing to muscle rigidity, confusion, and marked hyperthermia. What is the most likely diagnosis, and what is the appropriate first-line management?",
    expectedSources: ["kaplan_sadock", "maudsley_2021"],
    answerTerms: ["hyperreflexia", "myoclonus", "hyperthermia", "rigidity", "cyproheptadine"],
  },
  {
    id: "k5",
    category: "case",
    question: "A 28-year-old man was recently started on a high-potency first-generation antipsychotic. He now presents with fever, generalised muscle rigidity, fluctuating level of consciousness, and autonomic instability, and blood tests reveal a markedly elevated creatine kinase. What syndrome is this, and what are the key components of its management?",
    expectedSources: ["maudsley_2021", "kaplan_sadock"],
    answerTerms: ["rigidity", "creatine kinase", "hyperthermia", "bromocriptine", "dantrolene"],
  },
  {
    id: "k6",
    category: "case",
    question: "A 55-year-old man on long-term lithium becomes dehydrated during a heatwave and is also started on an ACE inhibitor. He develops increasing anorexia, nausea, diarrhoea, a coarse tremor, ataxia, and drowsiness. What is the likely problem, and how should severe cases be managed?",
    expectedSources: ["maudsley_2021", "kaplan_sadock"],
    answerTerms: ["ataxia", "tremor", "nausea", "dialysis", "dehydration"],
  },
  {
    id: "k7",
    category: "case",
    question: "A young woman is brought to the emergency department after taking an overdose of her tricyclic antidepressant. She is initially agitated and delirious with dilated pupils, then develops convulsions, progresses to coma, and is found to have cardiac arrhythmias. What complication most threatens her life, and how long should she be closely monitored?",
    expectedSources: ["kaplan_sadock", "maudsley_2021"],
    answerTerms: ["convulsions", "mydriasis", "cardiac arrhythmia", "coma", "delirium"],
  },
  {
    id: "k8",
    category: "case",
    question: "A patient taking an irreversible monoamine oxidase inhibitor eats aged cheese at a dinner party. He develops a severe throbbing headache, stiff neck, diaphoresis, nausea, and vomiting, and is found to have markedly elevated blood pressure. What has occurred, and what dietary instruction must be reinforced?",
    expectedSources: ["kaplan_sadock", "stahl_essential_5th"],
    answerTerms: ["tyramine", "hypertensive crisis", "headache", "cheese", "nausea"],
  },
  {
    id: "k9",
    category: "case",
    question: "A 40-year-old woman stops paroxetine abruptly after a year of treatment. Two days later she experiences dizziness, 'brain zap' sensations, nausea, insomnia, and irritability. What is the most likely explanation for her symptoms, and how is this best managed?",
    expectedSources: ["maudsley_2021"],
    answerTerms: ["brain zaps", "dizziness", "nausea", "paroxetine", "half-life"],
  },
  {
    id: "k10",
    category: "case",
    question: "A 30-year-old woman with bipolar depression is started on lamotrigine with rapid dose escalation while she is also taking valproate. She develops a spreading skin rash. What is the serious concern, and what should be done about the lamotrigine?",
    expectedSources: ["stahl_essential_5th", "stahl_pg_7th", "stahl_pg_older", "maudsley_2021"],
    answerTerms: ["rash", "stevens johnson", "valproate", "toxic epidermal necrolysis", "titration"],
  },
  {
    id: "s3",
    category: "source",
    question: "Which reference provides a systematic, descriptive account of psychopathological symptoms — the phenomenology of psychiatric disorders such as hallucinations and delusions?",
    expectedSources: ["fish_psychopath"],
    answerTerms: ["hallucination", "delusion"],
  },
  {
    id: "s4",
    category: "source",
    question: "Which reference provides practical prescribing guidance for psychotropic drugs, covering drug choice, dosing, and monitoring?",
    expectedSources: ["maudsley_2021", "stahl_pg_7th"],
    answerTerms: ["dose", "monitoring", "prescribing"],
  },
  {
    id: "s5",
    category: "source",
    question: "Which reference covers psychiatric practice in India, including the National Mental Health Programme and mental health legislation?",
    expectedSources: ["ahuja_psychiatry"],
    answerTerms: ["national mental health", "mental health act"],
  },
  {
    id: "s6",
    category: "source",
    question: "Which reference explains how psychotropic drugs work at the level of neurotransmitters and receptors?",
    expectedSources: ["stahl_essential_5th"],
    answerTerms: ["neurotransmitter", "receptor"],
  },
  {
    id: "s7",
    category: "source",
    question: "Which reference discusses culture-bound syndromes and cultural concepts of distress, such as koro?",
    expectedSources: ["dsm5tr", "fish_psychopath"],
    answerTerms: ["culture-bound", "koro"],
  },
  {
    id: "s8",
    category: "source",
    question: "Which reference describes electroconvulsive therapy and other brain stimulation treatments?",
    expectedSources: ["kaplan_sadock", "ahuja_psychiatry"],
    answerTerms: ["electroconvulsive", "ECT"],
  },
  {
    id: "s9",
    category: "source",
    question: "Which reference provides guidance on prescribing psychotropic drugs in special populations such as pregnancy, breastfeeding, and older people?",
    expectedSources: ["maudsley_2021"],
    answerTerms: ["pregnancy", "breastfeeding", "older people"],
  },
];
