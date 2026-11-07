import type { LongQA } from "@/lib/prep/long-types";
import { chain, compare, layers, tree } from "./visual";

export const PSYCHOPATHOLOGY_L01: LongQA[] = [
  {
    id: "psyp-l01-001",
    subject: "psychopathology",
    topic: "abnormality",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "mcp-entrance", "ugc-net"],
    question: "Discuss the criteria used to define abnormal behaviour. Which definition of mental disorder is most useful in clinical practice, and why?",
    plan: [
      "Open with why defining abnormality is hard: no single criterion is enough",
      "Explain each classical criterion with an example and its main weakness",
      "Describe Wakefield's harmful dysfunction idea and the DSM-5-TR definition",
      "Add the MHCA 2017 legal definition for Indian context",
      "Conclude that a combined, clinically anchored definition works best",
    ],
    answer: `## Introduction
Abnormal behaviour is behaviour that is unusual, distressing, harmful or poorly adapted, but no single one of these features is enough. Every definition is a compromise between science, values and culture.

## Classical criteria
- Statistical deviation: behaviour far from the average is abnormal. It is objective and fits traits like intelligence, but it calls rare and desirable traits (high IQ) abnormal and misses common disorders such as depression.
- Violation of social norms: behaviour that breaks the rules of a society. It captures what people notice, but norms change with time and culture (homosexuality was once classified as a disorder) and it can be used to label dissent.
- Personal distress: suffering felt by the person. It is central in anxiety and depression, but a person in mania or with antisocial personality may feel no distress, and distress after a death is normal.
- Maladaptiveness or dysfunction: behaviour that stops a person working, studying, caring for self or relating to others. This is the most practical criterion, but "adequate functioning" also depends on context.
- Deviation from ideal mental health: Marie Jahoda listed positive self attitude, growth, integration, autonomy, accurate perception of reality and environmental mastery. Few people meet all six, so the standard is too high.
- Danger: risk to self or others. Important for law and emergency care, but most people with mental illness are not dangerous.

These are often remembered as the four Ds: deviance, distress, dysfunction and danger.

## Harmful dysfunction
Jerome Wakefield proposed that a disorder is a harmful dysfunction. "Dysfunction" is a scientific term: an internal mechanism fails to do what it was designed (by evolution) to do. "Harmful" is a value term: the failure causes harm judged by social standards. The idea separates disorder from both normal suffering (grief, where nothing is broken) and mere social disapproval.

## DSM-5-TR and legal definitions
DSM-5-TR defines a mental disorder as a clinically significant disturbance in cognition, emotion regulation or behaviour that reflects a dysfunction in psychological, biological or developmental processes, usually with distress or disability. Expectable, culturally approved responses (grief after a loss) and socially deviant behaviour alone are excluded. ICD-11 uses a similar idea.

In India, the Mental Healthcare Act 2017 defines mental illness as a substantial disorder of thinking, mood, perception, orientation or memory that grossly impairs judgement, behaviour, capacity to recognise reality or ability to meet the ordinary demands of life. It includes conditions related to alcohol and drugs and excludes intellectual disability.

| Criterion | Strength | Weakness |
| Statistical | Objective | Rare is not always ill |
| Norms | Matches social reality | Changes with culture and time |
| Distress | Captures suffering | Absent in mania and some PDs |
| Dysfunction | Practical | Depends on context |
| Harmful dysfunction | Separates disorder from normal suffering | Hard to prove "designed function" |

## Conclusion
In practice, clinicians combine criteria: a pattern counts as a disorder when there is clinically significant distress or impairment that is not an expectable response to events and that reflects an internal dysfunction. The harmful dysfunction idea and the DSM-5-TR definition are the most useful because they hold both science and values in view.`,
    keyPoints: [
      "At least five classical criteria explained with examples",
      "A weakness given for each criterion",
      "Four Ds named",
      "Wakefield's harmful dysfunction with its fact and value parts",
      "DSM-5-TR definition including exclusion of expectable responses",
      "MHCA 2017 definition of mental illness",
      "A reasoned conclusion on which definition is most useful",
    ],
    pitfalls: [
      "Listing criteria without any critique",
      "Forgetting that grief and cultural responses are excluded",
      "Calling the MHCA definition a DSM definition",
    ],
    visuals: [
      compare(
        "Normal suffering or disorder?",
        ["Grief after a death", ["Distress is present", "An expectable response to loss", "Nothing internal has broken", "Function recovers with time"], "Distress without dysfunction: not a disorder"],
        ["Major depressive episode", ["Distress is present", "Out of proportion or persisting", "Mechanisms of mood and reward fail", "Work and self care break down"], "Harmful dysfunction: a disorder"],
      ),
    ],
    module: "exam-prep",
    ref: "DSM-5-TR introduction, definition of a mental disorder; Wakefield 1992 harmful dysfunction; MHCA 2017 s2(s); Jahoda 1958",
  },
  {
    id: "psyp-l01-002",
    subject: "psychopathology",
    topic: "icd11-vs-dsm",
    marks: 15,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Compare and contrast DSM-5-TR and ICD-11. Illustrate with examples from psychotic, mood, personality and stress-related disorders.",
    plan: [
      "Introduce both systems: who publishes, when, purpose",
      "Compare structure, philosophy and use with a table",
      "Give disorder level differences in four areas",
      "Note shared features and remaining problems",
      "Conclude on relevance for Indian clinicians",
    ],
    answer: `## Introduction
DSM-5-TR (American Psychiatric Association, text revision published in 2022) and ICD-11 (World Health Organization, adopted in 2019 and in use from January 2022) are the two main classifications of mental disorders. They were harmonised in many places, but they still differ in purpose, style and detail.

## Overall comparison
| Feature | DSM-5-TR | ICD-11 |
| Publisher | American Psychiatric Association | World Health Organization |
| Scope | Mental disorders only | All diseases; mental disorders in chapter 6 |
| Purpose | Clinical and research use, mainly in the USA | Global health statistics, clinical use, low resource settings |
| Style | Operational criteria with symptom counts and durations | Essential features described as a prototype, with clinical judgement |
| Cost and access | Commercial manual | Free online |
| Number of categories | Larger | Fewer, simpler, aimed at primary care too |
| Sleep and sexual problems | Inside the manual | Separate chapters (sleep wake chapter 7, sexual health chapter 17) |

## Psychotic disorders
Both removed the classical subtypes of schizophrenia (paranoid, hebephrenic, catatonic). DSM-5-TR needs six months of disturbance including one month of active symptoms. ICD-11 needs only one month of symptoms and uses symptom specifiers (positive, negative, depressive, manic, psychomotor, cognitive) and course specifiers (first episode, multiple episodes, continuous). ICD-11 keeps acute and transient psychotic disorder, important in India where acute psychoses with sudden onset and good recovery are common; DSM-5-TR uses brief psychotic disorder (less than one month). Catatonia is a separate grouping in ICD-11 and a specifier as well as a category in DSM-5-TR.

## Mood disorders
DSM-5-TR separates bipolar and depressive disorders into two chapters; ICD-11 keeps one mood disorders grouping. Both now include bipolar type II. DSM-5-TR has disruptive mood dysregulation disorder and premenstrual dysphoric disorder as depressive disorders; ICD-11 places premenstrual dysphoric disorder in both the mental and genitourinary chapters. ICD-11 keeps mixed depressive and anxiety disorder, useful in primary care, while DSM-5-TR has the "with anxious distress" specifier instead.

## Personality disorders
This is the largest difference. DSM-5-TR keeps ten categorical personality disorders in Section II, with the alternative dimensional model in Section III. ICD-11 abolished the categories: the clinician rates severity (personality difficulty, mild, moderate, severe) and may add trait domain qualifiers (negative affectivity, detachment, dissociality, disinhibition, anankastia) and a borderline pattern qualifier.

## Stress-related disorders
ICD-11 defines PTSD narrowly by three core elements (re-experiencing in the present, avoidance, sense of current threat) and adds complex PTSD, which also needs disturbances in self organisation (affect dysregulation, negative self concept, relationship difficulty). DSM-5-TR has a broader PTSD with 20 symptoms in four clusters and no complex PTSD. Both now include prolonged grief disorder: ICD-11 after six months, DSM-5-TR after twelve months.

## Other notable differences
- ICD-11 has bodily distress disorder; DSM-5-TR has somatic symptom disorder.
- ICD-11 added gaming disorder and compulsive sexual behaviour disorder; DSM-5-TR lists internet gaming disorder only for further study.
- Gender incongruence moved out of the mental disorders chapter in ICD-11; DSM-5-TR keeps gender dysphoria.

## Common ground and critique
Both remain mainly categorical, both use a lifespan order of chapters, and both added dimensional elements. Both face the same criticism: categories with high comorbidity and modest reliability for some diagnoses, and limited link to biology. Dimensional frameworks such as HiTOP and RDoC are proposed answers.

## Conclusion
DSM-5-TR is precise and research friendly; ICD-11 is simpler, global and free. In India, ICD codes are used for official reporting and most training programmes teach both, so a student must know the key differences, especially in psychosis, personality and trauma.`,
    keyPoints: [
      "Publisher, year and purpose of each system",
      "Operational criteria versus prototype descriptions",
      "Schizophrenia duration: six months versus one month",
      "ICD-11 dimensional personality disorder model with severity and trait domains",
      "Complex PTSD only in ICD-11",
      "Prolonged grief disorder durations",
      "At least two other differences (bodily distress, gaming, gender incongruence)",
      "Conclusion with Indian relevance",
    ],
    pitfalls: [
      "Saying ICD-11 still has schizophrenia subtypes",
      "Mixing up prolonged grief durations",
      "Writing only a table with no explanation",
    ],
    visuals: [
      compare(
        "Personality disorder in the two systems",
        ["DSM-5-TR Section II", ["Ten named categories", "Three clusters A, B and C", "Present or absent", "Dimensional model kept in Section III"], "Categories"],
        ["ICD-11", ["One personality disorder", "Severity: mild, moderate, severe", "Five trait domains", "Optional borderline pattern"], "Severity plus traits"],
      ),
    ],
    module: "exam-prep",
    ref: "DSM-5-TR (2022); ICD-11 CDDR (WHO 2024); Reed et al 2019 World Psychiatry on ICD-11 changes",
  },
  {
    id: "psyp-l01-003",
    subject: "psychopathology",
    topic: "diathesis-stress",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "mcp-entrance", "ugc-net"],
    question: "Write short notes on the diathesis-stress model.",
    plan: ["Define diathesis and stress", "Name originators and forms of the model", "Give an example", "Critique and update with differential susceptibility"],
    answer: `## Definition
The diathesis-stress model says that a disorder develops when a vulnerability (the diathesis) meets a stressor of enough strength. Neither alone is usually enough.

## Parts of the model
- Diathesis: a predisposition, which may be genetic (family loading), biological (early brain injury), psychological (negative cognitive style, low self esteem) or social (poverty, early neglect).
- Stress: a later trigger such as loss, trauma, migration, substance use or physical illness.
- The greater the vulnerability, the smaller the stress needed, and the reverse.

## History and examples
Paul Meehl described an inherited "schizotaxia" that turns into schizophrenia only in certain environments. Zubin and Spring developed the stress vulnerability model of schizophrenia, in which episodes come and go when stress crosses a person's threshold. Beck's cognitive model of depression is also diathesis-stress: dormant negative schemas are activated by matching life events.

## Critique
- It is hard to measure the diathesis before the illness appears.
- Early gene by environment findings (such as the serotonin transporter gene and life events) did not replicate well in large samples.
- Jay Belsky's differential susceptibility idea adds that some "vulnerable" people are simply more sensitive: they do worse in harsh settings but better in supportive ones.

## Conclusion
The model remains the basic frame for biopsychosocial formulation and for prevention, such as reducing stress and building coping in high risk youth.`,
    keyPoints: ["Clear definition of diathesis and stress", "Inverse relationship between vulnerability and stress", "Meehl and Zubin and Spring named", "One worked example", "Critique including replication and differential susceptibility"],
    visuals: [chain("Diathesis meets stress", [["Diathesis", "Genes, early adversity, cognitive style"], ["Stressor", "Loss, trauma, drugs, illness"], ["Threshold crossed", "Vulnerability plus stress exceed the person's limit"], ["Episode", "Symptoms appear; buffers can raise the threshold"]])],
    module: "exam-prep",
    ref: "Zubin and Spring 1977; Meehl 1962; Belsky and Pluess 2009",
  },
  {
    id: "psyp-l01-004",
    subject: "psychopathology",
    topic: "dimensional",
    marks: 15,
    difficulty: 4,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Critically evaluate the categorical and dimensional approaches to the classification of mental disorders, with reference to HiTOP and RDoC.",
    plan: [
      "Define both approaches",
      "Arguments for and against categories",
      "Arguments for and against dimensions",
      "Describe HiTOP and RDoC, with their limits",
      "Conclude with a hybrid view",
    ],
    answer: `## Introduction
A categorical system places a person in or out of a diagnostic box. A dimensional system places the person on one or more continua, for example a score for anxiety or for detachment. The debate is not only technical: it decides how we think about the boundary between health and illness.

## The categorical approach
Strengths:
- Simple to communicate and use in a busy clinic.
- Matches treatment decisions, which are usually yes or no (start lithium or not).
- Needed for law, insurance, disability certification and statistics.
- Has a long research base: most trials recruit by category.

Weaknesses:
- Arbitrary thresholds: five depressive symptoms make a disorder but four do not, although the person with four may be just as impaired.
- High comorbidity: many patients meet criteria for several disorders, which suggests the boxes do not "carve nature at its joints".
- Within category heterogeneity: two people with major depression may share only one symptom.
- Large "not otherwise specified" or "other specified" groups.
- Modest reliability for some diagnoses: in the DSM-5 field trials kappa was about 0.28 for major depression and 0.20 for generalised anxiety disorder.
- Loss of information when a continuous trait is reduced to yes or no.

## The dimensional approach
Strengths:
- Most psychopathology is distributed continuously in the population, as shown by taxometric studies.
- Better reliability and statistical power.
- Captures subthreshold but impairing problems.
- Explains comorbidity as shared underlying dimensions.

Weaknesses:
- Harder to use clinically; clinicians still need cut points to act.
- Little agreement about which dimensions and how many.
- Less familiar, with less treatment research.

## HiTOP
The Hierarchical Taxonomy of Psychopathology is built from factor analysis of how symptoms co-occur. At the bottom are symptoms and traits; above them syndromes; then subfactors (for example distress and fear within internalising); then spectra: internalising, thought disorder, detachment, disinhibited externalising, antagonistic externalising and somatoform; at the top a general factor of psychopathology, the p factor. Strength: it explains comorbidity and predicts outcomes well. Limits: it describes but does not explain cause, and it depends on the measures and samples used.

## RDoC
The Research Domain Criteria of the US National Institute of Mental Health are a research framework, not a clinical manual. They study functional domains (negative valence, positive valence, cognitive systems, social processes, arousal and regulatory systems, sensorimotor systems) across units of analysis from genes and circuits to behaviour and self report. Strength: it links psychopathology to neuroscience. Limits: it is not usable in clinics, it can be reductionist, and it has so far produced few clinical tools.

| | Categories | HiTOP | RDoC |
| Basis | Expert consensus | Statistics of co-occurrence | Neuroscience of functions |
| Use | Clinic, law | Research, emerging clinic | Research only |
| Main gain | Communication | Explains comorbidity | Links to biology |

## Moves towards hybrids
DSM-5-TR includes cross cutting symptom measures, severity specifiers and the alternative model for personality disorders. ICD-11 replaced personality disorder categories with severity and trait domains, and uses symptom specifiers for schizophrenia. These show the field moving to categories built on dimensions.

## Conclusion
Neither approach is complete. Categories are necessary for decisions; dimensions are closer to how psychopathology actually varies. The likely future is a hybrid: dimensional assessment with clinically useful cut points, informed by HiTOP for structure and RDoC for mechanism.`,
    keyPoints: [
      "Definitions of categorical and dimensional",
      "Comorbidity, thresholds and heterogeneity as weaknesses of categories",
      "Practical need for categories in decisions and law",
      "HiTOP levels and spectra with the p factor",
      "RDoC domains and units of analysis",
      "Critique of HiTOP and RDoC",
      "Examples of hybrids in DSM-5-TR and ICD-11",
      "Balanced conclusion",
    ],
    pitfalls: ["Treating RDoC as a clinical diagnostic manual", "Describing without evaluating", "Forgetting that ICD-11 personality is already dimensional"],
    visuals: [
      layers("HiTOP from top to bottom", "stack", [
        ["General factor (p)", "Shared liability to all psychopathology"],
        ["Spectra", "Internalising, thought disorder, detachment, disinhibited and antagonistic externalising, somatoform"],
        ["Subfactors", "For example distress and fear within internalising"],
        ["Syndromes", "Close to familiar diagnoses"],
        ["Symptoms and traits", "The building blocks"],
      ]),
    ],
    module: "exam-prep",
    ref: "Kotov et al 2017 HiTOP; Insel et al 2010 RDoC; DSM-5 field trials Regier 2013; Caspi 2014 p factor",
  },
  {
    id: "psyp-l01-005",
    subject: "psychopathology",
    topic: "delusion",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Define delusion. Describe the classification of delusions with examples and discuss primary delusions.",
    plan: ["Definition with Jaspers' criteria", "Primary versus secondary", "Types of primary delusional experience", "Classification by content", "Other features: systematisation, mood congruence, bizarre", "Clinical relevance"],
    answer: `## Definition
A delusion is a false, unshakeable belief, held with complete conviction, that is out of keeping with the person's educational, cultural and social background and is not corrected by evidence or reasoning. Karl Jaspers gave three external features: extraordinary conviction (subjective certainty), imperviousness to other experiences and counter argument (incorrigibility), and impossibility or falsity of content. Jaspers stressed that the falsity is the least important: a jealous delusion can be true by chance.

## Primary and secondary delusions
- Secondary delusions are understandable as arising from another experience: a depressed person concludes he has sinned and deserves punishment; a person hearing voices concludes he is being watched.
- Primary delusions cannot be understood from anything that came before. For Jaspers they were "un-understandable" and arose from a change in the person's experience of meaning. They are strongly suggestive of schizophrenia.

## Forms of primary delusional experience
- Delusional mood (Wahnstimmung): a sense that something strange and threatening is going on, often relieved when a full delusion crystallises.
- Delusional perception: a normal perception given a sudden, private and unrelated meaning ("the traffic light turned green and I knew I was the chosen one"). It is a two stage process and one of Schneider's first rank symptoms.
- Delusional memory: a real memory given a new delusional meaning.
- Autochthonous delusion or delusional intuition: an idea that arrives fully formed, "out of the blue".

## Classification by content
| Type | Example |
| Persecutory | Neighbours are poisoning my food |
| Reference | The news anchor is speaking about me |
| Grandiose | I am an avatar of a god |
| Nihilistic (Cotard) | My intestines have rotted; I am dead |
| Guilt and poverty | I have ruined my family; we will starve |
| Hypochondriacal or somatic | A snake lives in my belly |
| Jealousy (Othello syndrome) | My wife is unfaithful, despite no evidence |
| Erotomanic (de Clerambault) | A film star is secretly in love with me |
| Misidentification | My father has been replaced by an impostor (Capgras) |
| Control, passivity | My actions are controlled by a machine |

## Other descriptions
- Systematised (one theme, logically developed, as in delusional disorder) versus unsystematised (fragmented, as in schizophrenia).
- Mood congruent (guilt in depression, grandiosity in mania) versus mood incongruent, which suggests a worse outcome.
- Bizarre delusions: clearly impossible and not from ordinary life. DSM-5-TR no longer gives them special weight, but notes them as a specifier in delusional disorder.
- Shared delusions (folie a deux).

## Clinical relevance
A delusion is assessed for conviction, preoccupation, distress, action (risk), and insight. Persecutory and jealous delusions carry risk of violence. In India, content often reflects culture, such as black magic or possession, so the clinician must ask whether the belief is shared by the family and community before calling it delusional.

## Conclusion
A delusion is defined by the way it is held, not only its content. The primary and secondary distinction remains clinically useful, and cultural understanding is essential before diagnosis.`,
    keyPoints: ["Definition with cultural qualifier", "Jaspers' three criteria", "Primary versus secondary with examples", "Four forms of primary delusional experience", "At least six content types", "Mood congruence and bizarre delusions", "Cultural check before calling a belief delusional"],
    pitfalls: ["Saying falsity is the defining feature", "Confusing delusional perception with a hallucination", "No cultural qualifier in the definition"],
    visuals: [
      chain("Delusional perception: two stages", [["Normal perception", "A real event, such as a dog raising its paw"], ["Sudden private meaning", "Not linked to the event in any understandable way"], ["Full conviction", "I am to be crowned king"]], "The perception is normal; the meaning is delusional."),
      tree("Delusions: a classification", [
        ["Delusions", "Fixed false beliefs", -1],
        ["By origin", "Understandable or not", 0],
        ["Primary", "Mood, perception, memory, intuition", 1],
        ["Secondary", "From mood, hallucination or other belief", 1],
        ["By content", "Theme of the belief", 0],
        ["Persecutory and reference", "Most common", 4],
        ["Grandiose, guilt, nihilistic", "Often mood related", 4],
        ["Jealousy, erotomanic, misidentification", "Named syndromes", 4],
      ]),
    ],
    module: "mse-deep",
    ref: "Fish's Clinical Psychopathology ch 4 delusions; Jaspers General Psychopathology; DSM-5-TR glossary",
  },
  {
    id: "psyp-l01-006",
    subject: "psychopathology",
    topic: "pseudohallucination",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on pseudohallucinations.",
    plan: ["Two definitions and their authors", "Contrast with true hallucination and imagery", "Where they occur", "Clinical significance and critique"],
    answer: `## Meaning
The term has two different uses, and a good answer gives both.
- In the Jaspers and Kandinsky sense, a pseudohallucination is a vivid perception located in inner, subjective space ("in my mind's eye" or "inside my head"), lacking the concrete, objective quality of a real perception, but not under voluntary control.
- In the later British usage associated with Hare, it is any hallucination that the person recognises as not real, that is, a hallucination with insight.

## Comparison
| Feature | True hallucination | Pseudohallucination (Jaspers) | Vivid imagery |
| Location | Outer objective space | Inner subjective space | Inner space |
| Quality | Concrete, like a real perception | Figurative, less substantial | Figurative |
| Control | Not voluntary | Not voluntary | Voluntary |

## Where they occur
Grief (seeing or hearing the dead person), post traumatic flashbacks, dissociative disorders, borderline personality disorder, severe stress and sleep deprivation, and also early psychosis. Voices "inside the head" occur in schizophrenia too.

## Clinical significance
They suggest, but do not prove, a non psychotic cause. Studies of voice hearers show that location inside or outside the head does not reliably separate psychotic from non psychotic voices, so many authors advise describing the experience exactly rather than relying on the label.

## Conclusion
Pseudohallucination is a useful descriptive term if the user states which definition is meant; diagnosis should rest on the whole clinical picture.`,
    keyPoints: ["Jaspers and Kandinsky definition", "Hare's insight based definition", "Table contrasting with true hallucination and imagery", "Conditions where they occur", "Critique of diagnostic value"],
    module: "mse-deep",
    ref: "Fish ch 3 disorders of perception; Kandinsky 1885; Hare 1973",
  },
  {
    id: "psyp-l01-007",
    subject: "psychopathology",
    topic: "first-rank",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "What are Schneider's first rank symptoms? Discuss their diagnostic significance in the light of current classifications.",
    plan: ["Who Schneider was and why he listed them", "List the symptoms in groups with examples", "Evidence on specificity and prevalence", "Status in DSM-5-TR and ICD-11", "Conclusion"],
    answer: `## Background
Kurt Schneider, a German psychiatrist, proposed in the 1930s and 1950s a list of symptoms which, in the absence of organic brain disease, he considered strongly suggestive of schizophrenia. He called them symptoms of the first rank, not because they were the most basic but because they were easy to identify and pointed to the diagnosis.

## The symptoms
Auditory hallucinations of three kinds:
- Audible thoughts: hearing one's own thoughts spoken aloud (thought echo).
- Voices arguing or discussing the patient in the third person.
- Voices giving a running commentary on the patient's actions.

Thought alienation (disorders of thought possession):
- Thought insertion: thoughts placed in the mind from outside.
- Thought withdrawal: thoughts taken out of the mind.
- Thought broadcasting: thoughts spreading out so others know them.

Passivity (made) experiences:
- Made feelings, made impulses and made volitional acts: emotions, drives or actions experienced as controlled by an outside agency.
- Somatic passivity: bodily sensations imposed from outside.

Delusional perception: a normal perception given a sudden delusional meaning.

The usual count is eleven. Their shared theme is a loss of the boundary between self and world: what is mine is experienced as not mine.

## Diagnostic significance
- Schneider never claimed they were necessary. Many people with schizophrenia never have them.
- They are not specific. They occur in about 10 to 20 percent of people with mania and psychotic depression, and in dissociative disorders and borderline personality disorder.
- They do not predict outcome or treatment response better than other symptoms.
- Large studies (such as the WHO International Pilot Study of Schizophrenia) found them common in schizophrenia across cultures, which supports their descriptive value.
- Reviews estimate sensitivity around 60 percent and specificity around 75 percent.

## Current classifications
DSM-5 removed the rule that one first rank symptom (or one bizarre delusion) alone could satisfy criterion A. ICD-10 gave them weight; ICD-11 still lists persistent delusions, persistent hallucinations, thought disorder and experiences of influence, passivity or control among the core symptoms, but no single symptom is decisive.

## Clinical use
They remain an excellent structure for the mental status examination: asking about each one systematically ensures that experiences of control and thought alienation are not missed. Accurate phenomenology matters because patients often describe ordinary worries in similar words ("people can read my mind" may simply mean they feel transparent).

## Conclusion
First rank symptoms are useful descriptive markers of psychosis with a self boundary disturbance, but not pathognomonic of schizophrenia. Modern systems treat them as one part of a wider picture.`,
    keyPoints: ["All eleven symptoms listed in groups", "Correct description of each", "Schneider's own claim and that they are not necessary", "Non specificity: mania, depression, dissociation", "DSM-5 removed special weight", "ICD-11 position", "Clinical use in MSE"],
    pitfalls: ["Calling them pathognomonic", "Missing delusional perception or somatic passivity", "Describing second person voices as first rank"],
    visuals: [
      tree("Schneider's first rank symptoms", [
        ["First rank symptoms", "Self boundary loss", -1],
        ["Voices", "Three kinds", 0],
        ["Audible thoughts", "", 1],
        ["Arguing or discussing", "Third person", 1],
        ["Running commentary", "", 1],
        ["Thought alienation", "", 0],
        ["Insertion, withdrawal, broadcast", "", 5],
        ["Passivity", "Made acts", 0],
        ["Feelings, impulses, acts, somatic", "", 7],
        ["Delusional perception", "", 0],
      ]),
    ],
    module: "psychosis",
    ref: "Schneider Clinical Psychopathology 1959; Fish ch 4 and 5; Soares-Weiser 2015 Cochrane on FRS accuracy; DSM-5 changes",
  },
  {
    id: "psyp-l01-008",
    subject: "psychopathology",
    topic: "formal-thought-disorder",
    marks: 15,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Discuss the classification of disorders of thought and the psychological theories of formal thought disorder.",
    plan: ["Introduce four areas: stream, form, possession, content", "Describe stream and possession briefly", "Describe formal thought disorder: positive and negative signs", "Explain at least four theories", "Clinical significance in schizophrenia and mania", "Conclusion"],
    answer: `## Introduction
Thought is assessed through speech and writing. Classical psychopathology divides disorders of thought into disorders of stream (tempo and continuity), form (how ideas link), possession (who owns the thought) and content (what is thought, such as delusions and obsessions). Formal thought disorder means disordered linking of ideas, seen as disorganised speech.

## Disorders of stream
- Pressure of thought and flight of ideas: rapid thought with ideas linked by chance associations, rhymes or puns, typical of mania. The goal can usually be followed.
- Poverty of thought: few thoughts, as in depression or negative schizophrenia.
- Thought block: sudden stopping of thought with an empty mind, then a new topic. Suggestive of schizophrenia when the patient reports the thought was taken away.
- Circumstantiality: slow, over detailed speech that finally reaches the goal (epilepsy, obsessional personality, intellectual disability).

## Disorders of possession
Obsessions (own thoughts, resisted) and thought alienation (insertion, withdrawal, broadcasting), which belong to the first rank symptoms.

## Formal thought disorder
Nancy Andreasen's Thought, Language and Communication scale defined 18 signs. Useful groups:
| Positive signs | Negative signs |
| Derailment (loosening of associations): ideas slip onto unrelated tracks | Poverty of speech: very little speech |
| Tangentiality: replies miss the point of the question | Poverty of content: adequate amount, little information |
| Incoherence or word salad: breakdown within the sentence | |
| Neologisms and word approximations | |
| Illogicality, clanging, echolalia, perseveration | |

Older terms include Bleuler's loosening of associations, Schneider's derailment, substitution, omission, fusion and drivelling, and Kleist's paralogia.

## Psychological theories
- Bleuler: loosening of associations was a fundamental symptom of schizophrenia, one of his "four As" with affect, ambivalence and autism.
- Goldstein: concrete thinking; inability to take the abstract attitude, seen when patients interpret proverbs literally. Not specific: also in brain damage and low education.
- Cameron: over-inclusion; the boundaries of concepts become too wide, so irrelevant ideas are included. Payne tested this with object sorting tasks.
- Bannister: personal construct theory; loosened links between constructs in the repertory grid, perhaps because repeated invalidation of one's predictions weakens the construct system.
- Chapman: patients respond to the dominant, strongest meaning of a word even when the context calls for the weaker one.
- Semantic network theories (Spitzer): excessive spread of activation in semantic memory (hyperpriming), so distant associations intrude.
- Cognitive neuropsychology (Frith): a failure to monitor one's own speech plans and to take account of the listener's knowledge, linked to theory of mind deficits.
- Executive and working memory deficits: inability to keep the goal of discourse in mind, linked to prefrontal dysfunction.

## Clinical significance
- Positive formal thought disorder occurs in both schizophrenia and mania; Andreasen showed that mania may show even more derailment and tangentiality, but mania has more pressure and the speech is often playful.
- Negative thought disorder (poverty of speech and content) is more typical of schizophrenia and predicts poorer outcome.
- In the Liddle model, formal thought disorder forms part of the disorganisation syndrome, linked to prefrontal and anterior cingulate dysfunction.
- Cultural and educational background, second language use and intellectual disability must be considered before calling speech disordered.

## Conclusion
Disorders of thought are classified by stream, form, possession and content. Formal thought disorder is a set of observable speech signs, best rated with defined terms. No single theory explains it fully; cognitive and semantic memory models are the most researched today.`,
    keyPoints: ["Stream, form, possession and content distinguished", "Flight of ideas versus derailment", "Andreasen's positive and negative signs", "At least four named theories with explanation", "Mania versus schizophrenia differences", "Liddle's disorganisation syndrome", "Cultural and educational caution"],
    pitfalls: ["Treating circumstantiality as thought disorder of schizophrenia", "Listing terms without definitions", "No theories, only description"],
    visuals: [
      compare(
        "Flight of ideas or derailment?",
        ["Flight of ideas (mania)", ["Speech is fast and pressured", "Links by rhyme, pun or sound", "Listener can follow each jump", "Often playful and witty"], "Rapid but connected"],
        ["Derailment (schizophrenia)", ["Rate may be normal", "Links are missing or private", "Listener cannot follow the jump", "Flat or puzzled delivery"], "Connections lost"],
      ),
    ],
    module: "mse-deep",
    ref: "Fish ch 5 disorders of thought and speech; Andreasen 1979 TLC; Cameron 1938; Bannister 1960s; Chapman; Spitzer hyperpriming",
  },
  {
    id: "psyp-l01-009",
    subject: "psychopathology",
    topic: "overvalued-ideas",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Write short notes on overvalued ideas, and how they differ from delusions and obsessions.",
    plan: ["Define with Wernicke", "Key features", "Comparison table", "Examples and clinical relevance"],
    answer: `## Definition
An overvalued idea, a term from Carl Wernicke, is a solitary, abnormal belief that is neither delusional nor obsessional, but which comes to dominate a person's life. It is held with strong feeling and is understandable given the person's background and personality.

## Features
- Usually a single theme, held with intense emotional investment.
- Plausible or socially shared in part (thinness is valued; semen is precious in many traditions).
- The person accepts it as his or her own and does not resist it.
- It drives behaviour: dieting, checking the mirror, seeking doctors.

## Comparison
| Feature | Overvalued idea | Delusion | Obsession |
| Conviction | Strong but not absolute | Absolute, incorrigible | Recognised as senseless or excessive |
| Ownership | Own idea | Own idea | Own idea, intrusive |
| Resistance | None | None | Resisted |
| Understandability | Understandable from background | Often not | Out of character |
| Cultural sharing | Partly shared | Not shared | Not shared |

## Examples
The fear of fatness in anorexia nervosa, the belief of an ugly feature in body dysmorphic disorder, morbid jealousy without delusional certainty, the belief of semen loss in Dhat syndrome, and hypochondriacal ideas.

## Clinical relevance
Overvalued ideas respond to psychological treatment, but they shift along a continuum, and DSM-5-TR uses insight specifiers (good or fair, poor, absent or delusional) in OCD and body dysmorphic disorder to capture this.

## Conclusion
Overvalued ideas sit between normal strong beliefs and delusions; the degree of conviction and its effect on life are what matter clinically.`,
    keyPoints: ["Wernicke's definition", "Single theme with strong affect", "Three way comparison", "At least three examples including an Indian one", "Insight specifiers as a continuum"],
    module: "mse-deep",
    ref: "Fish ch 4; McKenna 1984 on overvalued ideas; DSM-5-TR OCD insight specifier",
  },
  {
    id: "psyp-l01-010",
    subject: "psychopathology",
    topic: "catatonia",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Describe the clinical features, causes, assessment and management of catatonia.",
    plan: ["Definition and current classification", "Signs grouped and defined", "Causes: psychiatric and medical", "Assessment with Bush-Francis and lorazepam challenge", "Management and malignant catatonia", "Conclusion"],
    answer: `## Definition and classification
Catatonia is a syndrome of marked psychomotor disturbance, described by Kahlbaum in 1874. It was long tied to schizophrenia but is now known to occur most often in mood disorders and medical illness. DSM-5-TR allows catatonia as a specifier of other disorders, as catatonic disorder due to another medical condition, and as unspecified catatonia; ICD-11 has a separate catatonia grouping. Both need three or more catatonic signs.

## Clinical features
The twelve DSM-5-TR signs:
- Stupor: no psychomotor activity, not relating to the environment.
- Catalepsy: passively placed postures are held against gravity.
- Waxy flexibility: slight, even resistance to being positioned.
- Mutism, and negativism: opposing or not responding to instructions.
- Posturing: spontaneous maintenance of a posture.
- Mannerisms: odd caricatures of normal actions.
- Stereotypies: repetitive, non goal directed movements.
- Agitation not influenced by external stimuli.
- Grimacing, echolalia and echopraxia.
Other signs include automatic obedience, mitgehen, gegenhalten, ambitendency and withdrawal from food and drink.

## Causes
- Psychiatric: bipolar disorder and depression (the most common), schizophrenia, autism, severe stress and conversion.
- Medical: encephalitis (especially anti NMDA receptor encephalitis), epilepsy including non convulsive status, stroke, metabolic causes (hyponatraemia, hepatic, renal), lupus, and drugs (antipsychotics, withdrawal of benzodiazepines or clozapine).
- Neuroleptic malignant syndrome is regarded by many as a drug induced form of malignant catatonia.

## Assessment
- Bush-Francis Catatonia Rating Scale: 23 items; the first 14 are used for screening.
- Physical examination including temperature, pulse, blood pressure and hydration.
- Investigations: blood counts, electrolytes, creatine kinase, renal and liver tests, iron, EEG, and brain imaging or lumbar puncture if an organic cause is suspected.
- Lorazepam challenge: 1 to 2 mg intravenously or intramuscularly, with re-rating after 15 to 30 minutes. A clear improvement supports the diagnosis.

## Management
- Treat the cause and stop antipsychotics while catatonia is active, as they may precipitate neuroleptic malignant syndrome.
- Lorazepam is first line, often 6 to 16 mg a day in divided doses, titrated to response; about 70 to 80 percent respond.
- Electroconvulsive therapy is the definitive treatment when benzodiazepines fail, in malignant catatonia, and when life is at risk. Under the MHCA 2017, modified ECT with anaesthesia and muscle relaxant must be used.
- Supportive care: fluids, nutrition, nasogastric feeding if needed, prevention of deep vein thrombosis, pressure sores and contractures.

## Malignant catatonia
Catatonia with fever and autonomic instability is an emergency with high mortality. It needs intensive care, lorazepam and early ECT.

## Conclusion
Catatonia is a common, treatable and often missed syndrome. It must be looked for in any mute or immobile patient, a medical cause must be excluded, and response to lorazepam or ECT is usually good.`,
    keyPoints: ["Kahlbaum and current status in DSM-5-TR and ICD-11", "At least eight signs defined", "Mood disorders as commonest cause", "Medical causes including NMDA receptor encephalitis", "Bush-Francis and lorazepam challenge", "Lorazepam then ECT", "Avoid antipsychotics; malignant catatonia", "Supportive care"],
    pitfalls: ["Saying catatonia means schizophrenia", "Starting high potency antipsychotics in active catatonia", "Not mentioning medical work up"],
    visuals: [
      chain("Managing catatonia", [["Recognise", "Three or more signs; rate with Bush-Francis"], ["Exclude medical causes", "Vitals, CK, electrolytes, EEG, imaging"], ["Lorazepam challenge", "1 to 2 mg, re-rate"], ["Lorazepam course", "Titrate up; stop antipsychotics"], ["ECT", "If no response or malignant features"]]),
    ],
    module: "mse-deep",
    ref: "DSM-5-TR catatonia; Bush et al 1996 BFCRS; Maudsley Prescribing Guidelines catatonia section; Fink and Taylor",
  },
];
