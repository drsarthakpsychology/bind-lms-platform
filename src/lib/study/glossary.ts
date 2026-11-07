/**
 * Word meanings for the Quick Reference page only. Owner decision
 * 2026-11-06: never shown inside lessons (no tappable or listed terms there).
 *
 * Every entry answers three things, in plain words:
 *  - means: what it is
 *  - why:   why clinicians use this word instead of an everyday one
 *  - mixup: the thing students most often confuse it with (optional)
 */
export type GlossaryEntry = { term: string; means: string; why: string; mixup?: string };

const G: Record<string, GlossaryEntry> = {
  anhedonia: {
    term: "Anhedonia",
    means: "Losing the ability to enjoy or look forward to things that used to feel good.",
    why: "It names a specific loss of *pleasure and interest*, not just low mood, so it counts as a core symptom on its own.",
    mixup: "Apathy (not caring or not starting things). A person can feel apathetic without losing pleasure.",
  },
  euthymia: {
    term: "Euthymia",
    means: "Normal, steady mood: neither depressed nor elevated.",
    why: "Clinicians need one word for 'mood is back to baseline' when tracking episodes over time.",
  },
  dysphoria: {
    term: "Dysphoria",
    means: "An unpleasant mood state: uneasy, irritable, low or dissatisfied.",
    why: "Broader than 'sad'. It covers the irritable, restless discomfort many patients describe.",
    mixup: "Gender dysphoria, which is a separate use of the word about gender identity distress.",
  },
  "psychomotor-retardation": {
    term: "Psychomotor retardation",
    means: "Visible slowing of movement, speech and thinking: long pauses, slow walk, few gestures.",
    why: "'Psychomotor' says the slowing is in both mind and movement, and it must be *observable by others*, not just felt.",
    mixup: "Fatigue (feeling tired). Fatigue is a feeling; retardation is something you can see.",
  },
  "psychomotor-agitation": {
    term: "Psychomotor agitation",
    means: "Restless, purposeless movement: pacing, hand-wringing, unable to sit still.",
    why: "Separates a depressive symptom from ordinary nervousness. Others must be able to see it.",
  },
  "melancholic-features": {
    term: "Melancholic features",
    means: "A severe, 'biological' pattern of depression: no pleasure at all, worse in the morning, early waking, weight loss, marked guilt.",
    why: "This pattern predicts a stronger response to medication and ECT, so naming it changes the plan.",
    mixup: "Atypical features, which is almost the opposite pattern.",
  },
  "atypical-features": {
    term: "Atypical features",
    means: "Mood lifts with good news, plus heavy sleep, big appetite, leaden heaviness in the limbs and hurt by rejection.",
    why: "Despite the name, it's common. It flags a pattern linked to earlier onset and bipolar risk.",
    mixup: "'Atypical' does not mean unusual or mild here. It's a defined specifier.",
  },
  hypomania: {
    term: "Hypomania",
    means: "A milder high: elevated or irritable mood with more energy, without the severe impairment, psychosis or hospital need of mania.",
    why: "'Hypo' means 'below': below mania. The line between them decides bipolar I vs bipolar II.",
    mixup: "Just being in a good mood. Hypomania is a clear *change* from the person's usual self that others notice.",
  },
  mania: {
    term: "Mania",
    means: "A distinct period of abnormally elevated, expansive or irritable mood with increased energy, causing marked impairment, psychosis or hospital admission.",
    why: "One episode of mania is enough to diagnose bipolar I. That's why clinicians ask about it in every depressed patient.",
  },
  "mixed-features": {
    term: "Mixed features",
    means: "Depression and mania symptoms at the same time, for example a low mood with racing thoughts and no need for sleep.",
    why: "It's a dangerous state (high risk of acting on suicidal thoughts) and changes treatment choices.",
  },
  "rapid-cycling": {
    term: "Rapid cycling",
    means: "Four or more mood episodes (depression, mania or hypomania) within one year.",
    why: "It predicts a harder course and affects which medicines are chosen.",
    mixup: "Mood changing within a day. That's lability, not rapid cycling.",
  },
  "flight-of-ideas": {
    term: "Flight of ideas",
    means: "Speech that jumps quickly from idea to idea, with links you can still follow (puns, rhymes, things in the room).",
    why: "It describes abnormal *linking* of thoughts, not just fast talking, and it points towards mania.",
    mixup: "Loosening of associations (in psychosis), where you can't follow the link at all.",
  },
  "pressured-speech": {
    term: "Pressured speech",
    means: "Rapid, loud, hard-to-interrupt talking, as if the words must get out.",
    why: "You record what you *observe* (rate, volume, interruptibility), not a guess about the cause.",
  },
  grandiosity: {
    term: "Grandiosity",
    means: "An inflated sense of one's importance, powers or talents, from overconfidence up to delusional beliefs.",
    why: "It's a range: clinicians note how far it goes, because at the extreme it becomes a delusion.",
  },
  "delusion-mood-congruent": {
    term: "Mood-congruent delusion",
    means: "A false fixed belief that fits the mood, such as guilt, ruin or illness in depression, or special powers in mania.",
    why: "Whether delusions fit the mood helps separate psychotic depression from schizophrenia-spectrum illness.",
  },
  "cotard-delusion": {
    term: "Cotard delusion",
    means: "The belief that one is dead, rotting or has lost organs: an extreme nihilistic delusion.",
    why: "It's rare but signals very severe psychotic depression, often needing urgent treatment such as ECT.",
  },
  "diurnal-variation": {
    term: "Diurnal variation",
    means: "Mood that follows a daily pattern. In melancholic depression it's worst in the morning and a little better by evening.",
    why: "It's a useful clue to the melancholic pattern and is easy to ask about.",
  },
  "early-morning-awakening": {
    term: "Early morning awakening",
    means: "Waking at least two hours earlier than usual and being unable to get back to sleep.",
    why: "More specific to melancholic depression than difficulty falling asleep, which is common in anxiety.",
  },
  ruminations: {
    term: "Rumination",
    means: "Going over the same negative thoughts again and again without reaching a solution.",
    why: "A process that keeps depression going, and a direct target in therapy (for example rumination-focused CBT).",
    mixup: "Obsessions, which are intrusive and unwanted. Rumination feels like one's own thinking.",
  },
  "cognitive-triad": {
    term: "Cognitive triad",
    means: "Beck's three-part negative view: of oneself ('I'm worthless'), the world ('everything is against me') and the future ('it will never change').",
    why: "It gives therapists a map of what to look for and challenge in CBT.",
  },
  "learned-helplessness": {
    term: "Learned helplessness",
    means: "Giving up trying after repeated experiences where nothing you did changed the outcome.",
    why: "A classic model of how depression can be learned. It explains passivity without calling it laziness.",
  },
  "monoamine-hypothesis": {
    term: "Monoamine hypothesis",
    means: "The older idea that depression comes from too little serotonin, noradrenaline or dopamine.",
    why: "It explains how the first antidepressants were found. Today it's seen as incomplete, because medicines change levels in hours but mood takes much longer.",
  },
  "hpa-axis": {
    term: "HPA axis",
    means: "The stress hormone chain: hypothalamus → pituitary → adrenal glands → cortisol.",
    why: "Many depressed people show an overactive stress system, which links life stress to biology.",
  },
  neuroplasticity: {
    term: "Neuroplasticity",
    means: "The brain's ability to change its connections, growing or pruning links between neurons.",
    why: "Current thinking says antidepressants work partly by helping the brain rebuild connections, which takes time.",
  },
  bdnf: {
    term: "BDNF",
    means: "Brain-derived neurotrophic factor: a protein that helps neurons survive and grow connections.",
    why: "It's often low in depression and rises with treatment, a key part of the neuroplasticity story.",
  },
  reuptake: {
    term: "Reuptake",
    means: "The 'recycling' step where a neuron pulls its released neurotransmitter back in to end the signal.",
    why: "Most antidepressants work by blocking this recycling pump, so the messenger stays in the gap longer.",
  },
  "synaptic-cleft": {
    term: "Synaptic cleft",
    means: "The tiny gap between two neurons where chemical messengers cross.",
    why: "Medicines that change how long messengers stay in this gap change the signal.",
  },
  "receptor-downregulation": {
    term: "Receptor downregulation",
    means: "When a neuron is flooded with a messenger, it slowly reduces the number of receptors for it.",
    why: "Part of why antidepressant effects build slowly while side effects can come early.",
  },
  "serotonin-syndrome": {
    term: "Serotonin syndrome",
    means: "A dangerous excess of serotonin: agitation, sweating, fever, tremor, twitching muscles, diarrhoea.",
    why: "It can follow combining serotonergic drugs (for example an SSRI with an MAOI or tramadol). Early recognition is lifesaving.",
    mixup: "Neuroleptic malignant syndrome (from antipsychotics), which has slow rigidity rather than twitching.",
  },
  "discontinuation-syndrome": {
    term: "Discontinuation syndrome",
    means: "Flu-like feelings, dizziness, 'electric shock' sensations, irritability and sleep upset after stopping an antidepressant suddenly.",
    why: "It isn't addiction, but it's a real effect. It's why doses are tapered.",
  },
  "treatment-resistant-depression": {
    term: "Treatment-resistant depression",
    means: "Depression that has not improved after adequate trials of at least two antidepressants (enough dose, enough time).",
    why: "The label opens up next-step options (augmentation, ECT, esketamine, rTMS), so 'adequate trial' must be checked first.",
  },
  ect: {
    term: "ECT",
    means: "Electroconvulsive therapy: a brief, controlled seizure under general anaesthesia and muscle relaxant.",
    why: "It's one of the most effective treatments for severe, psychotic or life-threatening depression. The modern procedure isn't what films show.",
  },
  euthymic: {
    term: "Euthymic",
    means: "In a normal, steady mood between episodes.",
    why: "Used to describe 'well' periods in bipolar disorder.",
  },
  cyclothymia: {
    term: "Cyclothymic disorder",
    means: "Years of mood ups and downs that never reach a full manic, hypomanic or major depressive episode.",
    why: "It captures chronic instability that would otherwise be missed or called 'personality'.",
  },
  "persistent-depressive-disorder": {
    term: "Persistent depressive disorder",
    means: "Long-lasting depression (most days for years) that may be milder than a major episode. It used to be called dysthymia.",
    why: "The length matters more than the severity. Chronic low mood is not 'just their nature'.",
  },
  pmdd: {
    term: "PMDD",
    means: "Premenstrual dysphoric disorder: severe mood symptoms in the week before periods that ease after they start.",
    why: "It separates a disabling, treatable condition from ordinary premenstrual changes.",
  },
  "bereavement-exclusion": {
    term: "Bereavement exclusion (removed)",
    means: "An old rule that stopped clinicians diagnosing depression soon after a death. DSM-5 removed it.",
    why: "Grief and depression can co-exist. Clinicians now judge the symptoms, not just the timing.",
    mixup: "Prolonged grief disorder, which is a separate diagnosis.",
  },
  "prolonged-grief-disorder": {
    term: "Prolonged grief disorder",
    means: "Intense yearning or preoccupation with the dead person, with distress and impairment, lasting well beyond cultural norms.",
    why: "Added in DSM-5-TR to name grief that has become stuck, as distinct from depression.",
  },
  lithium: {
    term: "Lithium",
    means: "A mood stabiliser: the oldest and still a first-line treatment for bipolar disorder.",
    why: "It reduces relapse and suicide risk, but the gap between a helpful and a toxic level is narrow, so blood levels are checked.",
  },
  "therapeutic-index": {
    term: "Therapeutic index",
    means: "How wide the gap is between a dose that works and a dose that harms.",
    why: "Narrow-index drugs like lithium need blood monitoring. Wide-index drugs are safer in overdose.",
  },
  "kindling-hypothesis": {
    term: "Kindling hypothesis",
    means: "The idea that each mood episode makes the next one easier to trigger, needing less stress each time.",
    why: "It explains why early, sustained treatment matters in recurrent mood disorders. It's a model, not a proven law.",
  },
  "social-rhythm": {
    term: "Social rhythm",
    means: "The daily timing of sleep, meals, work and social contact.",
    why: "In bipolar disorder, disrupted routines (for example all-nighters, travel) can trigger episodes. Therapy (IPSRT) stabilises them.",
  },
  "somatic-symptoms": {
    term: "Somatic presentation",
    means: "Depression showing mainly through body complaints: aches, tiredness, 'weakness', burning, sleep and appetite problems.",
    why: "Very common in Indian primary care, where depression is often described as 'body pain' or 'no strength' rather than sadness.",
  },
  "case-formulation": {
    term: "Case formulation",
    means: "A short explanation of *why this person, why now*: what made them vulnerable, what triggered it and what keeps it going.",
    why: "It turns a diagnosis into a plan that fits the individual.",
  },
  phq9: {
    term: "PHQ-9",
    means: "A 9-question self-report scale for depression, scored 0 to 27.",
    why: "Quick to screen and to track change. It does not diagnose on its own.",
  },
  hamd: {
    term: "HAM-D",
    means: "The Hamilton Depression Rating Scale: a clinician-rated depression severity scale.",
    why: "The standard in research trials, so you'll see it when reading treatment studies.",
  },
  ymrs: {
    term: "YMRS",
    means: "The Young Mania Rating Scale: a clinician-rated scale for manic symptoms.",
    why: "Used to measure mania severity and track response.",
  },
  ketamine: {
    term: "Ketamine / esketamine",
    means: "An anaesthetic that, at low doses, can lift depression within hours. Esketamine is a nasal form approved for treatment-resistant depression.",
    why: "It works through glutamate, not monoamines. That's why it's fast, and why it's changing ideas about depression.",
  },
  "number-needed-to-treat": {
    term: "NNT (number needed to treat)",
    means: "How many people need the treatment for one extra person to benefit, compared with placebo.",
    why: "A plain way to compare how strong treatments are. Lower is better.",
  },
};

export function glossary(id: string): GlossaryEntry | undefined {
  return G[id.toLowerCase().trim().replace(/\s+/g, "-")];
}

export const GLOSSARY_IDS = Object.keys(G);
export const GLOSSARY = G;
