import type { Assessment, Source } from "../types";

/**
 * Assessment notes (30 to 33). Rating scales: what each measures, who fills
 * it and the score bands. Never the questions themselves (MMSE and MoCA are
 * owned and licensed; PHQ-9 and GAD-7 are free, but items are not needed here).
 */
const SRC: Source = { basis: ["Scale manual", "NICE", "Kaplan", "MHCA 2017"], checkedBy: "Quick Notes builder, against named sources", checkedOn: "2026-11-22", clinician: "pending" };

export const ASSESSMENTS: Assessment[] = [
  {
    id: "assess-mse",
    type: "assessment",
    title: "Mental status examination: domains and the right words",
    aka: ["MSE", "Mental state examination", "Mental status exam"],
    topic: "assessment",
    oneLine: "What you see and hear in the room, now, in a fixed order: appearance to insight.",
    measures: "The person's mental state at the time of the interview",
    whoFills: "clinician",
    tables: [
      {
        title: "Domain by domain",
        table: {
          head: ["Domain", "Look at", "Words to use"],
          rows: [
            ["Appearance and behaviour", "Dress, hygiene, eye contact, movements, rapport", "Kempt, unkempt; psychomotor slowing or agitation; guarded"],
            ["Speech", "Rate, volume, amount, flow", "Pressured, slowed, poverty of speech, mute"],
            ["Mood and affect", "Mood in their words; affect as you see it", "Euthymic, depressed, elated; affect restricted, blunted, labile, incongruent"],
            ["Thought form", "How thoughts link", "Circumstantial, tangential, flight of ideas, loosening of associations"],
            ["Thought content", "What they think about", "Delusions (persecutory, grandiose), obsessions, overvalued ideas, suicidal thoughts"],
            ["Perception", "Hallucinations and illusions", "Auditory hallucinations, second or third person; visual; illusions"],
            ["Cognition", "Alertness, orientation, attention, memory", "Oriented to time, place, person; serial sevens; recall"],
            ["Insight and judgement", "Do they see a problem and accept help?", "Full, partial, absent insight; judgement intact or impaired"],
          ],
        },
      },
    ],
    sections: [
      { title: "Write it well", points: ["Write what you saw, not the diagnosis", "Quote the patient's own words for mood and beliefs", "Always record risk: to self, to others, from others"] },
    ],
    useWhen: ["Every assessment, and every review to see change", "Before calling something a delusion: check culture and the family's view"],
    cautions: ["Mood is what the person says; affect is what you observe", "A belief shared by the person's culture or religion is not a delusion"],
    links: { moduleId: "interview-mse", summaryId: "mse", related: ["assess-suicide-risk", "assess-scales"], practice: ["mse"] },
    source: SRC,
    keywords: ["appearance", "affect", "mood", "thought form", "delusion", "hallucination", "insight", "orientation"],
  },
  {
    id: "assess-scales",
    type: "assessment",
    title: "Rating scales at a glance",
    aka: ["PHQ-9", "GAD-7", "HAM-D", "Hamilton depression scale", "YMRS", "Y-BOCS", "PANSS", "AUDIT", "CIWA-Ar", "MMSE", "MoCA", "Rating scales"],
    topic: "assessment",
    oneLine: "What each common scale measures, who fills it in, and what the score bands mean.",
    measures: "Severity and change over time; screening, not diagnosis",
    whoFills: "mixed",
    tables: [
      {
        title: "Mood and anxiety",
        table: {
          head: ["Scale", "Measures", "Who fills", "Score bands"],
          rows: [
            ["PHQ-9", "Depression", "Self", "Out of 27: 5 mild, 10 moderate, 15 moderately severe, 20 severe"],
            ["GAD-7", "Anxiety", "Self", "Out of 21: 5 mild, 10 moderate, 15 severe"],
            ["HAM-D (17 item)", "Depression severity", "Clinician", "Bands differ by source; about 7 or less often means remission"],
            ["YMRS", "Mania", "Clinician", "Out of 60; about 12 or less often means remission"],
          ],
        },
      },
      {
        title: "OCD, psychosis and alcohol",
        table: {
          head: ["Scale", "Measures", "Who fills", "Score bands"],
          rows: [
            ["Y-BOCS", "OCD severity", "Clinician", "Out of 40: 8 mild, 16 moderate, 24 severe, 32 extreme"],
            ["PANSS", "Schizophrenia symptoms", "Clinician", "30 items, positive, negative and general; total 30 to 210"],
            ["AUDIT", "Risky drinking", "Self or clinician", "Out of 40: 8 increasing risk, 16 higher risk, 20 possible dependence"],
            ["CIWA-Ar", "Alcohol withdrawal now", "Clinician", "Out of 67; higher scores mean more medicine and closer watch; local protocols set the cut-offs"],
          ],
        },
      },
      {
        title: "Memory and thinking",
        table: {
          head: ["Scale", "Measures", "Who fills", "Score bands"],
          rows: [
            ["MMSE", "Overall cognition", "Clinician", "Out of 30; lower scores mean more impairment; adjust for schooling"],
            ["MoCA", "Mild impairment, planning", "Clinician", "Out of 30; 26 or more usually normal; extra point for low schooling"],
          ],
        },
      },
    ],
    sections: [{ title: "Reading the bands", points: ["Each number is where a band starts (PHQ-9: 10 to 14 is moderate)", "A score supports judgement; it never makes the diagnosis", "Always read the self-harm item on the PHQ-9 and ask about it"] }],
    useWhen: ["To measure severity at the start and track change", "To screen in busy clinics"],
    cautions: ["MMSE and MoCA are owned: use licensed forms, and MoCA needs training", "Low schooling and a test in a second language lower scores", "Use versions translated and checked for Indian languages where they exist"],
    links: { moduleId: "assessment", summaryId: "assessment", related: ["assess-mse", "assess-iq-personality", "criteria-mdd"] },
    source: SRC,
    keywords: ["PHQ", "GAD", "Hamilton", "YMRS", "YBOCS", "PANSS", "AUDIT", "CIWA", "MMSE", "MoCA", "cut-off", "score"],
  },
  {
    id: "assess-suicide-risk",
    type: "assessment",
    title: "Suicide risk: questions, factors and a safety plan",
    aka: ["Suicide assessment", "Self-harm", "Risk assessment", "Safety plan"],
    topic: "assessment",
    oneLine: "Ask directly, step by step, then build a safety plan together; asking does not put the idea in the head.",
    measures: "How close the person is to acting on thoughts of suicide, and what keeps them safe",
    whoFills: "clinician",
    sections: [
      { title: "Questions in order", steps: true, points: ["Do you feel life is not worth living?", "Have you thought of ending your life?", "Have you thought how you would do it?", "Do you have the means (pills, pesticide, a rope)?", "Have you decided when? Do you intend to act?", "Have you tried before? What stopped you?", "What keeps you going?"] },
      { title: "Raise the risk", points: ["Past attempt: the strongest single sign", "Depression, psychosis, alcohol or drug use", "A plan, access to means, hopelessness", "Recent loss, debt, exam failure, abuse, chronic pain", "Male, older, living alone; family history of suicide"] },
      { title: "Lower the risk", points: ["Family support and reasons to live (children, faith)", "Engaged in care, hope for the future", "No easy access to means"] },
      { title: "Safety plan, made together", steps: true, points: ["My warning signs", "What I can do on my own to cope", "People and places that distract me", "People I can ask for help", "Professionals and helplines: Tele MANAS 14416", "Making my place safe: remove or lock away the means"] },
    ],
    useWhen: ["Every new assessment, and every visit when mood is low", "After any self-harm, however small it looks"],
    cautions: ["No score predicts suicide: judge the whole picture", "Pesticides and hoarded tablets: ask about them by name", "Mental Healthcare Act 2017: a person who attempts suicide is presumed to be under severe stress, and must get care, not punishment"],
    links: { moduleId: "suicide", summaryId: "suicide", related: ["criteria-mdd", "criteria-bpd", "diff-low-mood"] },
    source: SRC,
    keywords: ["suicide", "self-harm", "risk", "plan", "intent", "means", "pesticide", "helpline", "Tele MANAS", "section 115"],
  },
  {
    id: "assess-iq-personality",
    type: "assessment",
    title: "Intelligence and personality testing",
    aka: ["IQ", "Intelligence quotient", "Normal curve", "Projective tests", "Objective tests", "Intellectual disability"],
    topic: "assessment",
    oneLine: "IQ has a mean of 100 and a standard deviation of 15; personality tests are objective (questionnaires) or projective (open responses).",
    measures: "Thinking ability compared with people of the same age, and lasting personality traits",
    whoFills: "mixed",
    facts: [
      { label: "IQ mean", value: "100" },
      { label: "Standard deviation", value: "15" },
      { label: "About 68 percent", value: "Score 85 to 115" },
      { label: "About 95 percent", value: "Score 70 to 130" },
    ],
    tables: [
      {
        title: "Intellectual disability, by IQ (older ICD bands)",
        table: {
          head: ["Level", "IQ, roughly", "Daily life"],
          rows: [
            ["Mild", "50 to 69", "Learns daily skills, can often work with support"],
            ["Moderate", "35 to 49", "Simple self-care, needs supervision"],
            ["Severe", "20 to 34", "Needs much help"],
            ["Profound", "Below 20", "Needs constant care"],
          ],
        },
      },
      {
        title: "Personality tests",
        table: {
          head: ["Kind", "How it works", "Examples"],
          rows: [
            ["Objective", "Fixed questions, scored against norms", "MMPI, 16PF, EPQ, NEO"],
            ["Projective", "Open response to unclear pictures or prompts", "Rorschach inkblots, TAT, sentence completion, draw a person"],
          ],
        },
      },
    ],
    sections: [{ title: "Tests used in India", points: ["Intelligence: Binet-Kamat Test, Malin's scale for children (MISIC), Wechsler scales", "Social and daily skills: Vineland Social Maturity Scale (Indian adaptation)", "Disability certificates use an IQ test with a daily-skills scale"] }],
    useWhen: ["Learning or school difficulty, suspected intellectual disability, before certification", "Personality testing to help understand a complex picture, not to label"],
    cautions: ["Diagnosis of intellectual disability rests on daily-life (adaptive) skills as well as IQ; severity is set by daily skills", "Use tests normed for the child's language and background", "Test materials are licensed: never copy items"],
    links: { moduleId: "assessment", summaryId: "assessment", related: ["assess-scales", "criteria-adhd"] },
    source: SRC,
    keywords: ["IQ", "bell curve", "standard deviation", "Rorschach", "TAT", "MMPI", "Binet", "Wechsler", "VSMS"],
  },
];
