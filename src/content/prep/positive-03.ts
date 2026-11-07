import type { PrepQuestion } from "@/lib/prep/types";
import { ALL, builder, CUET_NET_MA, MCP, NET_MA, NET_MCP, NET_MCP_MA } from "./_qb4";

const Q = builder("positive", "exam-prep");

/** Positive psychology part 3: measures, positive emotion and life outcomes, ageing, Indian concepts. */
export const PART: PrepQuestion[] = [
  Q({
    id: "pos-ms-0001",
    topic: "panas",
    exams: ALL,
    difficulty: 1,
    type: "mcq",
    stem: "The PANAS, a widely used questionnaire in well-being research, measures:",
    options: [
      "Personality disorders and their severity",
      "Intelligence across verbal and performance tasks",
      "Positive affect and negative affect",
      "Panic attacks and agoraphobic avoidance",
    ],
    answer: 2,
    explanation:
      "The Positive and Negative Affect Schedule has 10 positive words (such as interested, enthusiastic, inspired) and 10 negative words (such as distressed, afraid, irritable). Watson, Clark and Tellegen showed that positive and negative affect are fairly independent dimensions rather than opposite ends of one line. The PANAS measures the affective part of subjective well-being, not personality disorders, intelligence or panic.",
    ref: "Watson, Clark & Tellegen 1988",
  }),
  Q({
    id: "pos-ms-0002",
    topic: "maas",
    exams: NET_MA,
    difficulty: 2,
    type: "mcq",
    stem: "The Mindful Attention Awareness Scale asks how often people do things such as 'I rush through activities without being really attentive to them.' Higher mindfulness on this scale is linked to:",
    options: [
      "Lower well-being and more anxiety",
      "No relation with well-being at all",
      "Greater well-being and less distress",
      "Poorer attention in daily life",
    ],
    answer: 2,
    explanation:
      "Brown and Ryan developed the scale to measure open, receptive attention to the present. Items describe mindlessness and are reverse scored. Higher scores were linked to greater well-being, more positive affect and autonomy, and less anxiety and depression, and scores rose after mindfulness training in cancer patients. The other options state the opposite of these findings.",
    ref: "Brown & Ryan 2003",
  }),
  Q({
    id: "pos-pe-0008",
    topic: "nun-study",
    exams: NET_MCP,
    difficulty: 3,
    type: "passage",
    passage:
      "Researchers studied short autobiographies written by young Catholic nuns, at about age 22, when they entered their order. Decades later, they coded how much positive emotion each essay expressed. The nuns lived in very similar conditions all their lives, with the same diet, housing and medical care, and no smoking or alcohol. Those whose essays had the most positive emotion lived on average several years longer than those with the least.",
    stem: "Why is this study often seen as especially convincing?",
    options: [
      "It used random assignment of nuns to happy and unhappy groups",
      "It measured positive emotion only after the nuns became ill",
      "Their shared lifestyle removed many confounds of health studies",
      "It proved that positive emotion causes longevity in all people",
    ],
    answer: 2,
    explanation:
      "Danner, Snowdon and Friesen's study is persuasive because positive emotion was measured decades before death, and the nuns' identical lifestyles controlled for many factors that usually confound health research, such as income, diet, smoking and access to care. It is still observational, not randomised, so it cannot prove causation, and it cannot be generalised to everyone without further evidence. Emotion was measured in early adulthood, not after illness.",
    ref: "Danner, Snowdon & Friesen 2001",
  }),
  Q({
    id: "pos-pe-0009",
    topic: "happiness-success",
    exams: NET_MCP,
    difficulty: 3,
    type: "assertion-reason",
    stem: "Read the Assertion (A) and Reason (R) and choose the correct option.",
    statements: [
      "A: A large review concluded that happiness does not only follow success but can also come before it, predicting later income, good relationships and health.",
      "R: Longitudinal and experimental studies show that positive affect often precedes these outcomes, for example by fostering approach behaviour and social engagement.",
    ],
    answer: 0,
    explanation:
      "Both are true, and R explains A. Lyubomirsky, King and Diener reviewed cross-sectional, longitudinal and experimental studies and found that happy people are more successful in many areas, and that positive affect often comes first. Proposed mechanisms include greater sociability, energy, creativity and approach motivation. R gives the evidence and mechanism that support A.",
    ref: "Lyubomirsky, King & Diener 2005",
  }),
  Q({
    id: "pos-pe-0010",
    topic: "very-happy-people",
    exams: CUET_NET_MA,
    difficulty: 2,
    type: "mcq",
    stem: "Diener and Seligman compared the happiest 10 percent of students with average and very unhappy students. The feature shared by almost all the very happy students was:",
    options: [
      "Much higher family income",
      "More frequent religious practice",
      "Strong, satisfying social relationships",
      "Higher scores in academic examinations",
    ],
    answer: 2,
    explanation:
      "The very happy group spent the least time alone and had the strongest relationships, rated both by themselves and by friends. Good relationships seemed necessary but not sufficient for very high happiness. They did not differ much in income, religious activity or exam results. The finding fits wider evidence that social connection is one of the strongest correlates of well-being.",
    ref: "Diener & Seligman 2002 Psychological Science",
  }),
  Q({
    id: "pos-ag-0001",
    topic: "socioemotional-selectivity",
    exams: NET_MCP,
    difficulty: 3,
    type: "mcq",
    stem: "Older adults often pay more attention to, and remember better, positive information than negative information. Carstensen's socioemotional selectivity theory explains this 'positivity effect' as:",
    options: [
      "A result of memory decline that wipes out all negative memories",
      "Denial of the losses that come with ageing",
      "A shift towards emotionally meaningful goals as time feels limited",
      "A sign of early dementia in most older adults",
    ],
    answer: 2,
    explanation:
      "Carstensen proposed that when people see their future time as limited, as in old age or serious illness, they prioritise emotional meaning and satisfaction over gathering information and new contacts. They then keep smaller, closer social networks and attend more to positive information. Younger people with limited time horizons show the same pattern. Memory decline, denial and dementia do not explain it.",
    ref: "Carstensen, Isaacowitz & Charles 1999; Mather & Carstensen 2005",
  }),
  Q({
    id: "pos-ag-0002",
    topic: "u-curve",
    exams: MCP,
    difficulty: 4,
    type: "statement",
    stem: "Which statements about age and life satisfaction are accurate?",
    statements: [
      "1. Several large cross-sectional surveys report a U-shape, with life satisfaction lowest in middle age.",
      "2. Some longitudinal analyses find a weaker or different pattern, so the U-shape is debated.",
      "3. Emotional well-being often stays stable or improves into early old age, before declining near the end of life.",
      "4. All studies agree that happiness falls steadily from youth to old age.",
    ],
    options: ["1 and 2 only", "1, 2 and 3 only", "3 and 4 only", "1, 2, 3 and 4"],
    answer: 1,
    explanation:
      "Blanchflower and Oswald reported a U-shape across many countries (1), but critics note that results depend on which control variables are included and that panel data sometimes show a flatter pattern (2). Emotional well-being often holds up well into the sixties and seventies, with decline linked to ill health and approaching death (3). Statement 4 is false: no consistent steady decline from youth is found.",
    ref: "Blanchflower & Oswald 2008; Galambos et al. 2020; Gerstorf et al. 2008",
  }),
  Q({
    id: "pos-in-0005",
    topic: "anasakti",
    exams: NET_MA,
    difficulty: 3,
    type: "mcq",
    stem: "Indian psychologists Pande and Naidu developed the concept of 'anasakti', drawn from the Bhagavad Gita. It refers to:",
    options: [
      "Strong attachment to success and to the results of effort",
      "Withdrawal from all work and duties in daily life",
      "Effort without attachment to outcomes, with equanimity",
      "A state of trance that is achieved through fasting",
    ],
    answer: 2,
    explanation:
      "Anasakti means non-attachment: working with full effort and concern for others while staying unattached to the outcomes, and keeping balance in success and failure. Pande and Naidu found that higher anasakti was linked to less stress and strain, which made it an early Indian contribution to well-being research. It is not attachment, withdrawal from duty or a trance state.",
    ref: "Pande & Naidu 1992",
  }),
  Q({
    id: "pos-in-0006",
    topic: "triguna",
    exams: NET_MA,
    difficulty: 2,
    type: "match",
    stem: "In the Samkhya and Gita tradition, used by some Indian psychologists to study personality and well-being, match each guna (List I) with its typical qualities (List II).",
    lists: {
      left: ["A. Sattva", "B. Rajas", "C. Tamas"],
      right: [
        "1. Inertia, dullness and confusion",
        "2. Calm, clarity, balance and goodness",
        "3. Activity, passion, restlessness and desire",
      ],
    },
    options: ["A-3, B-2, C-1", "A-2, B-1, C-3", "A-2, B-3, C-1", "A-1, B-3, C-2"],
    answer: 2,
    explanation:
      "Sattva is linked with clarity, calm and harmony; rajas with activity, ambition and restlessness; tamas with inertia, heaviness and ignorance. Measures such as the Vedic Personality Inventory assess the gunas, and studies report that sattva relates to better well-being and tamas to poorer mental health. All three are present in everyone in varying proportions.",
    ref: "Wolf 1998; Vedic Personality Inventory",
  }),
  Q({
    id: "pos-in-0007",
    topic: "gene-expression-debate",
    exams: MCP,
    difficulty: 4,
    type: "passage",
    passage:
      "A study reported that people high in eudaimonic well-being (purpose and meaning) showed a healthier pattern of immune gene expression than people high in hedonic well-being, even though the two measures were strongly correlated. A re-analysis argued that, given the strong correlation and small sample, the analysis method could produce such results from random data.",
    stem: "What is the most appropriate conclusion?",
    options: [
      "Hedonic happiness has been shown to damage the immune system",
      "The claim of distinct effects is uncertain and needs replication",
      "Gene expression is unrelated to any psychological factor",
      "Eudaimonic well-being has been proven to cure disease",
    ],
    answer: 1,
    explanation:
      "The original study used a small sample and two highly overlapping predictors. The critics showed that their regression approach was vulnerable to producing apparent differences by chance, and later analyses have been mixed. The fair conclusion is uncertainty: the idea is interesting but needs larger, pre-registered studies. The data do not show hedonic happiness is harmful, do not exclude any link between psychology and gene expression, and certainly do not show a cure.",
    ref: "Fredrickson et al. 2013 PNAS; Brown et al. 2014 PNAS",
  }),
  Q({
    id: "pos-pe-0011",
    topic: "duchenne",
    exams: CUET_NET_MA,
    difficulty: 1,
    type: "mcq",
    stem: "A genuine smile of enjoyment involves both the muscles that raise the corners of the mouth and those around the eyes, creating 'crow's feet'. This is called a:",
    options: ["Duchenne smile", "Social smile", "Pan Am smile", "Reflex smile"],
    answer: 0,
    explanation:
      "The Duchenne smile, named after the French neurologist Guillaume Duchenne, involves the orbicularis oculi muscle around the eyes as well as the zygomatic major. A 'Pan Am' or polite social smile uses only the mouth. In one study, women whose college yearbook photos showed Duchenne smiles reported better well-being and marriages decades later. A reflex smile is seen in newborns during sleep.",
    ref: "Ekman, Davidson & Friesen 1990; Harker & Keltner 2001",
  }),
  Q({
    id: "pos-wb-0019",
    topic: "subjective-wellbeing-correlates",
    exams: NET_MCP_MA,
    difficulty: 2,
    type: "statement",
    stem: "Which of the following are reliable correlates of higher subjective well-being across many countries?",
    statements: [
      "1. Strong social relationships",
      "2. Good health, especially self-rated health",
      "3. Having enough income to meet basic needs",
      "4. Being of a particular gender, with large differences everywhere",
    ],
    options: ["1, 2 and 3 only", "1 and 2 only", "2 and 3 only", "1, 2, 3 and 4"],
    answer: 0,
    explanation:
      "Relationships (1), self-rated health (2) and meeting basic needs (3) are among the most consistent correlates of well-being, with income mattering more where people are poor. Statement 4 is false: average differences in life satisfaction between men and women are small and vary by country, although women report more negative affect and higher rates of depression in many places.",
    ref: "Diener et al. 1999; Diener, Oishi & Tay 2018",
  }),
];
