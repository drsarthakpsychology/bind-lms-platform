import type { PrepQuestion } from "@/lib/prep/types";
import { builder, CUET_MA, CUET_NET_MA, MCP, NET_MCP } from "./_qb4";

const Q = builder("clinical-therapies", "therapies");

/** Clinical therapies part 15: closing set spanning foundations to research level. */
export const PART: PrepQuestion[] = [
  Q({
    id: "ther-cl-0001",
    topic: "therapy-basics",
    exams: CUET_MA,
    difficulty: 1,
    type: "mcq",
    stem: "Which therapy is best known for using the 'hierarchy' of feared situations, from least to most frightening?",
    options: ["Free association", "Dream analysis", "Psychodrama", "Systematic desensitisation"],
    answer: 3,
    explanation:
      "Systematic desensitisation asks the client to rank feared situations from least to most anxiety-provoking (often on a 0 to 100 SUDS scale) and then works up the list while relaxed. Graded exposure in CBT uses the same kind of hierarchy without relaxation. Free association and dream analysis are psychoanalytic, and psychodrama uses enactment of scenes.",
    ref: "Wolpe 1958",
  }),
  Q({
    id: "ther-cl-0002",
    topic: "therapy-basics",
    exams: CUET_MA,
    difficulty: 1,
    type: "mcq",
    stem: "A child earns a star each time she brushes her teeth without being reminded, and five stars buy a trip to the park. This is an example of:",
    options: ["A star chart using positive reinforcement", "Punishment for forgetting to brush her teeth", "Classical conditioning with a bell signal", "Extinction of the tooth-brushing habit"],
    answer: 0,
    explanation:
      "The stars are secondary reinforcers given after the target behaviour and exchanged for a back-up reward, so the behaviour becomes more likely. This is a simple token system based on positive reinforcement. Punishment reduces behaviour, classical conditioning pairs stimuli, and extinction removes reinforcement.",
    module: "child",
    ref: "Behaviour modification basics",
  }),
  Q({
    id: "ther-cl-0003",
    topic: "cbt-basics",
    exams: CUET_NET_MA,
    difficulty: 1,
    type: "mcq",
    stem: "'Automatic thoughts' in Beck's model are:",
    options: ["Deep unconscious wishes revealed only through dreams", "Thoughts that the person deliberately chooses to think", "Rules learned in early childhood about how the world must be", "Quick, situation-specific thoughts that are accepted as true"],
    answer: 3,
    explanation:
      "Automatic thoughts are brief, spontaneous thoughts or images in specific situations ('I'll mess this up'), which people tend to accept without questioning. They are close to awareness, so they can be caught and examined. Deep unconscious wishes belong to psychoanalysis. Deliberate thoughts are not automatic. Long-standing rules are intermediate beliefs.",
    ref: "J. Beck",
  }),
  Q({
    id: "ther-cl-0004",
    topic: "therapy-basics",
    exams: CUET_NET_MA,
    difficulty: 1,
    type: "mcq",
    stem: "Which approach to psychotherapy is most associated with the phrase 'the client knows best'?",
    options: ["Person-centred therapy", "Token economy", "Aversion therapy", "Strategic family therapy"],
    answer: 0,
    explanation:
      "Rogers held that clients have their own capacity for growth and understand their own experience best, so the therapist follows rather than directs. Token economies, aversion therapy and strategic family therapy are therapist-directed approaches in which the therapist designs the intervention.",
    ref: "Rogers 1951",
  }),
  Q({
    id: "ther-cl-0005",
    topic: "therapy-selection",
    exams: CUET_NET_MA,
    difficulty: 2,
    type: "match",
    stem: "Match the disorder (List I) with a first-line psychological treatment (List II).",
    lists: {
      left: ["A. OCD", "B. Borderline personality disorder with self-harm", "C. Adolescent anorexia nervosa", "D. Chronic insomnia"],
      right: ["1. CBT for insomnia", "2. Family-based treatment", "3. Exposure and response prevention", "4. Dialectical behaviour therapy"],
    },
    options: ["A-3, B-2, C-4, D-1", "A-4, B-3, C-2, D-1", "A-3, B-4, C-1, D-2", "A-3, B-4, C-2, D-1"],
    answer: 3,
    explanation:
      "ERP-based CBT is first-line for OCD. DBT has the strongest evidence for reducing self-harm in BPD. Family-based treatment is first-line for adolescent anorexia. CBT-I is first-line for chronic insomnia. Matching treatments to disorders like this is the basis of stepped, evidence-based care.",
    ref: "NICE guidance across disorders",
  }),
  Q({
    id: "ther-cl-0006",
    topic: "therapy-ethics",
    exams: CUET_NET_MA,
    difficulty: 2,
    type: "mcq",
    stem: "A therapist begins a business partnership with a current client. This is best described as:",
    options: ["A dual relationship that risks exploitation", "Acceptable as long as the client agrees to it", "A healthy form of positive transference", "A recommended way to build the alliance"],
    answer: 0,
    explanation:
      "Entering a business, social or romantic relationship with a client creates a dual (multiple) relationship. The power imbalance of therapy makes exploitation likely and the therapist's judgement less objective, so professional codes prohibit or strongly restrict such relationships. Client agreement does not remove the risk. It is not transference, and it does not build a healthy alliance.",
    module: "ethics-law",
    ref: "RCI and APA ethics codes",
  }),
  Q({
    id: "ther-cl-0007",
    topic: "cbt-depression",
    exams: CUET_NET_MA,
    difficulty: 2,
    type: "assertion-reason",
    stem: "Read the Assertion (A) and Reason (R) and choose the correct option.",
    statements: [
      "A: In CBT for depression, patients are encouraged to schedule activities even when they do not feel like doing them.",
      "R: Activity scheduling was an early part of Lewinsohn's behavioural approach to depression.",
    ],
    answer: 1,
    explanation:
      "Both are true, but R does not explain A. A is true: activity scheduling asks patients to act according to a plan rather than waiting for motivation, because low mood and low activity feed each other. R is true historically, since Lewinsohn's work on response-contingent reinforcement introduced pleasant-activity scheduling. Where the technique came from does not explain why patients are asked to act before they feel like it, so R is not the explanation of A.",
    module: "depression",
    ref: "Beck et al.; Martell et al.",
  }),
  Q({
    id: "ther-cl-0008",
    topic: "mechanisms",
    exams: NET_MCP,
    difficulty: 3,
    type: "mcq",
    stem: "Which statement best describes the 'common factors versus specific factors' debate in psychotherapy?",
    options: ["Whether therapy should be offered free of charge to all patients", "Whether outcomes depend on common factors or on specific techniques", "Whether medication or psychotherapy came first in the history of care", "Whether therapists should be trained as psychologists or psychiatrists"],
    answer: 1,
    explanation:
      "Common-factor theorists (Frank, Wampold) argue that the alliance, empathy, expectations and a credible rationale explain most of the benefit, which is why different bona fide therapies often do equally well. Specific-factor theorists point to treatments that clearly beat others for particular problems, such as exposure for OCD. Most researchers now see both as important. Fees, the historical order of medication and psychotherapy, and the profession of the therapist are separate questions that have nothing to do with what makes therapy work.",
    ref: "Wampold & Imel 2015",
  }),
  Q({
    id: "ther-cl-0009",
    topic: "cbt-ocd",
    exams: MCP,
    difficulty: 3,
    type: "mcq",
    stem: "In treating OCD with mental rituals (for example, silently repeating a 'good' phrase after a bad thought), exposure and response prevention needs to:",
    options: ["Ignore mental rituals, since only visible rituals matter", "Find the mental rituals and help the person stop or delay them", "Encourage more mental rituals to replace the physical ones", "Use thought stopping to suppress each intrusive thought"],
    answer: 1,
    explanation:
      "Mental rituals work just like physical compulsions: they neutralise anxiety and stop the person learning that the thought is harmless. ERP for 'pure O' presentations therefore exposes the person to the thoughts (for example, through scripts or recordings) while blocking or postponing mental neutralising. Ignoring or encouraging mental rituals keeps OCD going, and thought stopping increases intrusions.",
    module: "ocd",
    ref: "Abramowitz; Foa",
  }),
  Q({
    id: "ther-cl-0010",
    topic: "network-meta",
    exams: MCP,
    difficulty: 4,
    type: "mcq",
    stem: "A network meta-analysis of psychotherapies for adult depression ranks treatments by combining direct comparisons (A versus B) with indirect comparisons (A versus C and B versus C). What is the main assumption that must hold for its indirect estimates to be trusted?",
    options: ["All the trials in the network used the same therapist", "Only trials with waiting-list controls are included", "Transitivity: trials are similar enough for fair indirect comparison", "All of the therapies compared have identical effect sizes"],
    answer: 2,
    explanation:
      "Network meta-analysis relies on transitivity (also called similarity): if A versus C trials and B versus C trials differ greatly in severity, setting or type of control, the indirect A versus B estimate may be biased. Consistency between direct and indirect evidence is checked statistically. Same-therapist trials and identical effects are not required. Waiting-list controls are in fact a known problem, because they can inflate effects compared with usual care.",
    module: "depression",
    ref: "Cuijpers et al. 2021 World Psychiatry",
  }),
  Q({
    id: "ther-cl-0011",
    topic: "waitlist",
    exams: MCP,
    difficulty: 4,
    type: "assertion-reason",
    stem: "Read the Assertion (A) and Reason (R) and choose the correct option.",
    statements: [
      "A: Psychotherapy effects tend to look larger when compared with a waiting-list control than with usual care.",
      "R: People on a waiting list may put off trying other ways of improving, because they expect help to start later, a so-called 'nocebo' effect of waiting.",
    ],
    answer: 0,
    explanation:
      "Both are true, and R explains A. Meta-analyses of depression trials found that waiting-list groups often improve less than people given no treatment or usual care, possibly because they postpone their own coping and help-seeking. This makes active treatments look more effective than they would against a fairer comparison, so effect sizes from waiting-list trials should be read cautiously.",
    ref: "Furukawa et al. 2014; Cuijpers et al.",
  }),
  Q({
    id: "ther-cl-0012",
    topic: "implementation",
    exams: MCP,
    difficulty: 4,
    type: "passage",
    passage:
      "A district mental health programme in India trains 40 lay counsellors in a brief behavioural treatment for depression. A year later, an audit finds that only a third of patients received the full course, sessions often skipped key components, and outcomes were weaker than in the original trial.",
    stem: "Which concept and solution best fit this problem?",
    options: ["The original trial was flawed; the programme should be stopped", "The counsellors should switch to long-term psychoanalysis", "Patients in rural districts do not benefit from brief therapy", "A 'voltage drop' at scale; strengthen supervision and fidelity checks"],
    answer: 3,
    explanation:
      "Implementation science describes a 'voltage drop' when interventions move from trials to routine services, often because of weaker training, supervision and fidelity, and lower patient reach. Remedies include structured supervision (peer and expert), fidelity monitoring with session recordings, refresher training and outreach to improve attendance. The trial's results are not disproved, psychoanalysis would be impractical here, and the problem is delivery, not the patients.",
    ref: "Kilbourne et al.; Patel et al. PREMIUM",
  }),
];
