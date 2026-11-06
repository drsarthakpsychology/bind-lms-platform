/* Module · Psychodynamics, Parts III and IV (Advanced level and exam zone). Original text written for VIBHA School of Psychology. */
export const part2 = String.raw`
# Part III · Advanced: formulation, brief therapy and the evidence

## 3.1 The psychodynamic formulation [core][advanced]
A **formulation** is a short, testable story that explains **why this person has this problem now**, and what is likely to happen in treatment. The descriptive diagnosis says *what*; the formulation says *why* and *what next*. (The general 5P formulation is in the case-sheet module; this is the psychodynamic version.)

### The five parts of a psychodynamic formulation
Perry, Cooper and Michels' classic scheme gives a good formulation five parts. Tap through the tree, then read each part below.

:::widget flow
{
  "title": "The five-part psychodynamic formulation",
  "layout": "tree",
  "nodes": [
    { "id": "f", "label": "Formulation", "detail": "A short, testable story: why this person, this problem, now, and what will happen in treatment." },
    { "id": "sum", "label": "1 · Summary", "parent": "f", "detail": "Who, what problem, what trigger, in two or three lines." },
    { "id": "non", "label": "2 · Non-dynamic factors", "parent": "f", "detail": "Biology, illness, substances, temperament, poverty or ongoing abuse. Named so the dynamic story does not over-explain." },
    { "id": "core", "label": "3 · Core explanation", "parent": "f", "detail": "The central conflict or deficit, how it developed, how the trigger set it off." },
    { "id": "tri", "label": "Triangles", "parent": "core", "detail": "Malan: feeling, anxiety, defence; and current, past, therapist." },
    { "id": "ccrt", "label": "CCRT", "parent": "core", "detail": "Luborsky: Wish, Response of Other, Response of Self." },
    { "id": "cd", "label": "Conflict or deficit", "parent": "core", "detail": "Two wishes clashing, or a capacity never built, or both." },
    { "id": "tr", "label": "4 · Predicted transference", "parent": "f", "detail": "How the pattern will show with the therapist, and which resistances to expect." },
    { "id": "tx", "label": "5 · Treatment implications", "parent": "f", "detail": "Expressive or supportive, brief or long, the focus, and what to watch for." }
  ],
  "caption": "Tap each branch. Part 4 makes the formulation testable: if the predicted transference never appears, revise it."
}
:::

In words:

1. **Summary statement**: who the person is, the problem, and the trigger, in two or three lines.
2. **Non-dynamic factors**: biology, medical illness, substances, social stress, temperament. Name them so the dynamic story does not try to explain everything.
3. **Core psychodynamic explanation**: the central conflict or deficit, how it developed, and how the current trigger set it off.
4. **Predicted transference and resistance**: how the pattern will show up with the therapist.
5. **Treatment implications**: what kind of therapy, what focus, what to watch for.

### Three tools for the core explanation
**Malan's two triangles**
- **Triangle of conflict**: a hidden **feeling or impulse** (anger, grief, longing) triggers **anxiety**, which triggers a **defence**. Work starts at the defence and moves to the feeling.
- **Triangle of person**: the same pattern appears with **current people**, **past people** (parents) and the **therapist**. An interpretation that links all three corners is the most powerful.

:::widget flow
{
  "title": "Malan's triangle of conflict",
  "layout": "cycle",
  "nodes": [
    { "id": "feel", "label": "Hidden feeling", "detail": "The true feeling or impulse: grief, anger, longing for closeness. It is what the work aims to reach." },
    { "id": "anx", "label": "Anxiety", "detail": "As the feeling rises, so does fear: of falling apart, of hurting someone, of being rejected." },
    { "id": "def", "label": "Defence", "detail": "Joking, changing the subject, intellectualising, smiling. It brings relief and keeps the feeling out." }
  ],
  "edgeLabels": { "feel>anx": "stirs", "anx>def": "triggers", "def>feel": "blocks" },
  "caption": "Work starts at the defence corner, eases the anxiety, and only then reaches the feeling."
}
:::

:::widget flow
{
  "title": "Malan's triangle of person",
  "layout": "cycle",
  "nodes": [
    { "id": "c", "label": "Current people", "detail": "Partner, boss, friends: 'I never ask my husband for help.'" },
    { "id": "p", "label": "Past people", "detail": "Parents and siblings: 'Mother was always ill, so I looked after everyone.'" },
    { "id": "t", "label": "Therapist", "detail": "In the room: 'She apologises for taking up my time.'" }
  ],
  "caption": "The same pattern in all three corners. An interpretation that links all three carries the most weight."
}
:::

**Luborsky's Core Conflictual Relationship Theme (CCRT)**: in the stories a person tells about relationships, find:
- the **Wish** (W): what I want from others ("to be cared for"),
- the expected **Response of Other** (RO): what I expect they will do ("they'll find me a burden"),
- the **Response of Self** (RS): how I then feel and act ("I go quiet and do everything myself, then feel bitter").

:::widget flow
{
  "title": "The CCRT as a self-fulfilling loop",
  "layout": "cycle",
  "nodes": [
    { "id": "w", "label": "Wish", "detail": "'I want to be cared for.'" },
    { "id": "ro", "label": "Expected Response of Other", "detail": "'They will find me a burden.'" },
    { "id": "rs", "label": "Response of Self", "detail": "'So I go quiet, do everything myself, and feel bitter.'" },
    { "id": "real", "label": "Others' actual response", "detail": "Seeing her cope alone, others do not offer help. The expectation seems confirmed." }
  ],
  "caption": "Change in therapy usually shows first in RO and RS: the wish stays, but the expected and actual responses soften."
}
:::

**Conflict versus deficit**: some problems are best explained by **conflict** (two wishes clashing), others by **deficit** (a capacity that never developed, such as self-soothing). Kohut and attachment thinking emphasise deficit; classical and ego psychology emphasise conflict. Good formulations often need both.

:::widget sort
{
  "prompt": "Meera says: “I'd love my husband to ask how my day was. But he'd only be bored, so I keep quiet, cook, and feel resentful all evening.” Sort each part into the CCRT.",
  "buckets": ["Wish", "Response of Other (expected)", "Response of Self"],
  "items": [
    { "text": "To be asked about and taken interest in", "bucket": 0 },
    { "text": "He would be bored by her", "bucket": 1 },
    { "text": "Keeps quiet and busies herself", "bucket": 2 },
    { "text": "Feels resentful all evening", "bucket": 2 }
  ]
}
:::

:::trap Pitfalls in psychodynamic formulation
- **Wild analysis**: confident deep interpretations from thin evidence ("Your headache is your hatred of your mother").
- **Explaining everything**: ignoring biology, medicines, poverty or abuse that is still happening.
- **Culture-blind norms**: calling close family ties in an Indian joint family "enmeshment" without asking how the person experiences them.
- **Untestable stories**: a formulation should predict something (how the person will react to breaks, to the therapist's gender, to ending) so it can be revised.
:::

:::clinician
Structured approaches make dynamic formulation more reliable. The CCRT method shows reasonable inter-rater reliability for wish, RO and RS categories, and changes in RO and RS (more than in W) track improvement in supportive-expressive therapy, the treatment Luborsky and Crits-Christoph built around the CCRT. The Operationalized Psychodynamic Diagnosis system (OPD-2; OPD Task Force) rates five axes: experience of illness and prerequisites for treatment, interpersonal relations, conflict (seven conflicts such as individuation versus dependency, submission versus control, desire for care versus autarky), structure (level of integration), and the descriptive diagnosis. The Psychodynamic Diagnostic Manual (PDM-2, 2017) adds personality syndromes and levels of organisation alongside symptom patterns. Use the predicted transference as a live hypothesis: if it does not appear, revise the formulation.
:::

:::recall
1. Name the five parts of a psychodynamic formulation. || Summary, non-dynamic factors, core psychodynamic explanation, predicted transference and resistance, treatment implications.
2. Draw Malan's triangle of conflict in words. || Hidden feeling, then anxiety, then defence.
3. Name the three corners of the triangle of person. || Current people, past people, the therapist.
4. Expand CCRT and its three parts. || Core Conflictual Relationship Theme: Wish, Response of Other, Response of Self.
5. Give three pitfalls in psychodynamic formulation. || Wild analysis, explaining everything (ignoring biology and social factors), culture-blind norms, untestable stories.
:::

:::mcq
Q: In Malan's triangle of conflict, a man who smiles and jokes (A) whenever grief about his father (B) approaches, because he fears breaking down (C), shows A, B and C as:
- Feeling, defence, anxiety
- *Defence, feeling, anxiety
- Anxiety, feeling, defence
- Defence, anxiety, feeling
> Joking is the defence, grief the hidden feeling, fear of breaking down the anxiety.

Q: Which component of a psychodynamic formulation guards against explaining everything psychologically?
- Predicted transference
- *Non-dynamic factors
- Summary statement
- Treatment implications
> Naming biology, illness, substances and social stress keeps the dynamic story honest.
:::

## 3.2 Worked formulations: Indian and global cases [core][advanced]
Each case shows the same steps. Try to answer each step before you reveal it.

:::widget worked
{
  "title": "Case 1 · Meera, 29, Pune: depression after a promotion",
  "steps": [
    { "q": "Summary: Meera, an IT team lead, developed low mood, poor sleep and self-criticism soon after being promoted. She says, “I don't deserve it, they'll find out I'm a fraud.” What is striking about the trigger?", "a": "It is a success, not a loss. Depression after success suggests that achievement itself carries danger for her." },
    { "q": "Non-dynamic factors?", "a": "Family history of depression in her mother; hypothyroidism ruled out; long working hours with little sleep; she lives away from family. These raise vulnerability and are treated in their own right." },
    { "q": "History: the eldest daughter; her mother was often ill and Meera ran the household from age ten. Her younger brother's needs came first. What conflict might success stir?", "a": "Guilt about surpassing others (her mother, her brother) and a belief that her own needs are selfish. Success threatens her role as the one who gives, not the one who gets. Superego anxiety: 'Who am I to have this?'" },
    { "q": "Triangle of person: where does the pattern appear now?", "a": "With her team (she takes on everyone's work), with her husband (she never asks for help), and her mother (still the carer)." },
    { "q": "Predicted transference and resistance?", "a": "She will be a 'good patient', apologise for taking time, avoid expressing needs or anger to the therapist, and may want to end early when she starts feeling better, to avoid feeling she is taking too much." },
    { "q": "Treatment implications?", "a": "Time-limited dynamic therapy focused on her conflict about deserving, alongside behavioural steps for sleep. Watch for her caretaking of the therapist; welcome any criticism she voices. Consider medication if severe." }
  ],
  "yourTurn": [
    { "q": "Write the core psychodynamic explanation for Meera in two sentences.", "a": "Meera learned early that she was valued for looking after others and that her own needs were selfish; success activates guilt about surpassing her mother and brother and a fear of being exposed as undeserving. Unable to enjoy or claim the promotion, she turns the conflict against herself as self-criticism and depression." }
  ]
}
:::

:::widget worked
{
  "title": "Case 2 · Daniel, 41, London: panic after his father's death",
  "steps": [
    { "q": "Summary: Daniel, a solicitor, began having panic attacks four months after his father died. He insists, “I wasn't close to Dad. It's just stress at work.” What do you note?", "a": "The timing links the panic to the loss, while he denies emotional connection. Minimising attachment is a dismissing style." },
    { "q": "Non-dynamic factors?", "a": "Increased caffeine and alcohol since the death; no thyroid or cardiac cause found on work-up; heavy workload. Reduce caffeine and alcohol; consider CBT for panic as an equally evidence-based option." },
    { "q": "History: his father was distant and often away; his mother told him to 'be the man of the house' at age eight. What feelings may be warded off?", "a": "Grief and longing for a father he never had, and anger at being left. Showing need was not allowed." },
    { "q": "Triangle of conflict?", "a": "Feeling: grief, longing and anger. Anxiety: fear of being overwhelmed or seen as weak. Defence: intellectualising, minimising, working harder. When the defence fails, panic breaks through." },
    { "q": "Predicted transference?", "a": "He will present as self-sufficient, treat therapy as a work task, and may dismiss breaks ('Holidays don't bother me') while getting more anxious around them." }
  ],
  "yourTurn": [
    { "q": "Write one interpretation that links all three corners of the triangle of person for Daniel.", "a": "Something like: 'You've told me you didn't need your father, and you hardly mention missing your wife when she travels. I wonder whether, as with your dad, it feels safer not to need me either, and the panic is what happens when that need has nowhere to go.' Offer it tentatively and watch his response." }
  ]
}
:::

:::widget worked
{
  "title": "Case 3 · Arjun, 22, Lucknow: storms in relationships",
  "steps": [
    { "q": "Summary: Arjun, a law student, is referred after cutting his arm when his girlfriend did not reply for a day. He swings between adoring and despising his friends and teachers. Which level of personality organisation does this suggest?", "a": "Borderline organisation: identity diffusion, splitting, intact reality testing between crises." },
    { "q": "Non-dynamic factors?", "a": "Possible ADHD (school reports of impulsivity); cannabis use most weekends; financial strain at home. Assess and treat these; check suicide risk fully." },
    { "q": "History: father alcoholic and violent at night, affectionate in the mornings. Mother fearful and unpredictable. What does this suggest about his inner relationships?", "a": "An inner world of a needy self with an alternately loving and attacking other, kept apart by splitting. Closeness itself feels dangerous because the loved person may suddenly turn." },
    { "q": "Is this conflict, deficit or both?", "a": "Both: conflict (love and hate for the same people, split apart) and deficit (poor capacity to regulate feelings and to mentalise others' minds under stress)." },
    { "q": "Predicted transference?", "a": "Early idealisation of the therapist, then rage at small disappointments such as a cancelled session. The therapist may feel pulled to rescue or to retaliate." },
    { "q": "Treatment implications?", "a": "A structured, evidence-based approach for borderline patterns (MBT, TFP or DBT), a clear frame and crisis plan, attention to substances and ADHD, and supervision for the therapist's countertransference." }
  ],
  "yourTurn": [
    { "q": "Why would a classic unstructured, interpretive approach be risky here?", "a": "Deep interpretations without structure can overwhelm a fragile self, increase regression and self-harm, and feel like attacks. Models built for this group add a clear frame, focus on present feelings and mentalising, and a crisis plan." }
  ]
}
:::

:::clinician
When presenting a formulation in a case conference or exam, state the level of inference: observation ("he smiled when describing the death"), low-level inference ("he seems to keep sadness out of view"), and high-level inference ("he defends against grief for a father he longed for"). Examiners and supervisors trust formulations that show their evidence and include what would disconfirm them. For Arjun, check for complex PTSD (ICD-11) given chronic exposure to violence; trauma formulations and object-relations formulations are complementary, not rival.
:::

:::recall
1. Why is depression after a success a clue in Meera's case? || It suggests that achievement itself carries danger, here guilt about surpassing others and not deserving.
2. In Daniel's case, which defence fails when panic appears? || Intellectualising and minimising of grief and need.
3. Why is a structured approach preferred for Arjun? || Borderline organisation with self-harm; unstructured deep interpretation can overwhelm and increase regression.
:::

:::mcq
Q: In Case 2, Daniel says breaks in therapy "don't bother me" while becoming more anxious before each one. This best illustrates:
- Concordant countertransference
- *A predicted dismissing transference, with the need hidden
- Primary process thinking
- Sublimation
> His minimising style appears with the therapist as predicted.

Q: When formulating, which statement shows the highest level of inference?
- "She cried when talking about her mother"
- "She seems to avoid talking about her mother"
- *"She defends against rage at a mother who abandoned her"
- "She is 34 and works as a nurse"
> High-level inference should be marked as a hypothesis and backed by evidence.
:::

## 3.3 Short-term psychodynamic therapies [core][advanced]
Long, open-ended therapy is not the only psychodynamic option. From the 1960s onwards, clinicians developed **brief** models that keep the core ideas but add a **focus**, a **time limit** and a **more active therapist**.

### What brief models share
- A clear **focus** agreed early (a conflict, a relationship pattern, a loss).
- A **time limit** set at the start, often with a planned ending used as part of the work.
- An **active therapist** who keeps returning to the focus.
- Early work on the **alliance**.
- **Careful selection**: motivation, some psychological mindedness, at least one meaningful past relationship, ability to tolerate feelings, and a focus that can be found quickly.

:::widget flow
{
  "title": "The arc of a brief dynamic therapy",
  "layout": "chain",
  "nodes": [
    { "id": "sel", "label": "Assessment and selection", "detail": "Is there motivation, a meaningful relationship, tolerance of feeling, and a response to a trial interpretation?" },
    { "id": "foc", "label": "Agree the focus", "detail": "One conflict, one relationship pattern or one loss, put into words both people accept." },
    { "id": "all", "label": "Build the alliance", "detail": "Agreement on goals and tasks, and a bond. Ruptures are noticed early." },
    { "id": "work", "label": "Active work on the focus", "detail": "The therapist keeps returning to the focus, works with defences and links the triangles." },
    { "id": "end", "label": "Ending as part of the work", "detail": "The known end date stirs feelings about loss and separation, which are worked with, not avoided." },
    { "id": "fu", "label": "Follow-up", "detail": "A review months later checks whether change has held and grown." }
  ],
  "caption": "Press Play. Brief models keep the core ideas but add a focus, a limit and a more active therapist."
}
:::

### The main models
| Model | Founder | Key idea |
|---|---|---|
| **Brief focal psychotherapy** | David Malan (Tavistock) | A focus on one core conflict; triangles of conflict and person |
| **Short-term anxiety-provoking psychotherapy (STAPP)** | Peter Sifneos | For well-functioning patients with an Oedipal focus; active confrontation |
| **Time-limited psychotherapy (TLP)** | James Mann | A fixed number of sessions; the central issue is separation and the time limit itself |
| **Intensive short-term dynamic psychotherapy (ISTDP)** | Habib Davanloo | Relentless challenge of defences to unlock buried feelings ("the unlocking of the unconscious") |
| **Supportive-expressive therapy** | Lester Luborsky | Mix of support and interpretation, guided by the CCRT |
| **Time-limited dynamic psychotherapy (TLDP)** | Hans Strupp and Jeffrey Binder | Interpersonal focus on the cyclical maladaptive pattern |
| **Dynamic interpersonal therapy (DIT)** | Alessandra Lemma, Mary Target, Peter Fonagy | Brief, manualised, for depression; focus on an interpersonal affective pattern and mentalising |
| **Panic-focused psychodynamic psychotherapy (PFPP)** | Barbara Milrod and colleagues | Panic linked to conflicts about separation, autonomy and anger |
| **Mentalization-based treatment (MBT)** | Anthony Bateman and Peter Fonagy | Strengthen the capacity to understand minds; developed for borderline personality disorder |
| **Transference-focused psychotherapy (TFP)** | Otto Kernberg and colleagues | Work with split object relations in the transference; for borderline organisation |

:::widget guess
{
  "prompt": "James Mann's time-limited psychotherapy uses a fixed number of sessions, set at the start. How many?",
  "min": 4,
  "max": 40,
  "unit": "sessions",
  "answer": [12, 12],
  "reveal": "Twelve. Mann chose a fixed, small number on purpose: the approaching end stirs up the person's lifelong feelings about separation and loss, which then become the work.",
  "clinician": "Mann's TLP: twelve sessions, with a 'central issue' framed as a chronically endured pain, and termination deliberately used to work through separation-individuation. Other brief models usually run from about 12 to 40 sessions; DIT is typically 16 sessions, and PFPP was tested as 24 twice-weekly sessions."
}
:::

:::widget decide
{
  "scene": "You are screening for a brief dynamic therapy of a fixed number of sessions. Three referrals arrive: (A) Farah, 35, grieving her father, functioning at work, has close friends, and can name what she feels. (B) Mr Iyer, 45, chronically suicidal, repeated admissions, uses heroin daily. (C) Lucy, 28, depressed after a break-up, curious about why she picks unavailable partners, one stable friendship since school.",
  "ask": "Who are the best candidates for a brief, interpretive dynamic therapy?",
  "choices": [
    { "label": "Farah and Lucy", "verdict": "best", "outcome": "Both engage, find a focus quickly and finish with measurable improvement.", "why": "Both show motivation, an identifiable focus, ability to tolerate feeling and at least one meaningful relationship: the classic selection criteria." },
    { "label": "All three, since everyone deserves therapy", "verdict": "harm", "outcome": "Mr Iyer becomes more unsettled as defences are challenged, and is admitted after an overdose.", "why": "Everyone deserves care, but not the same care. Active suicidality and severe substance use call for stabilisation and a structured, supportive or specialist approach first." },
    { "label": "Only Mr Iyer, because he is the most unwell", "verdict": "ok", "outcome": "He needs help urgently, but an anxiety-provoking brief model is the wrong tool.", "why": "Severity is a reason for help, not for this kind of help. Farah and Lucy would also be left without a good-fit option." }
  ]
}
:::

:::clinician
Exclusion criteria common to brief expressive models: active psychosis, severe substance dependence, high and current suicide risk, severe antisocial traits, and inability to form a working alliance quickly. These patients may still benefit from supportive dynamic therapy, longer structured models (TFP, MBT) or other evidence-based treatments. ISTDP and related experiential dynamic therapies have a growing trial base but from a small number of research groups, so allegiance effects are hard to rule out (as a 2016 meta-analysis noted). DIT has early randomised evidence from small pilot work in depression; larger, independent trials are still needed before strong claims are made.
:::

:::recall
1. Name four features shared by brief dynamic therapies. || Focus, time limit, active therapist, early alliance work (and careful selection).
2. Give five selection criteria for brief expressive therapy. || Motivation, psychological mindedness, at least one meaningful relationship, tolerance of feeling, a focus found quickly.
3. Match: Mann, Davanloo, Luborsky, Sifneos. || Time-limited psychotherapy; ISTDP; supportive-expressive (CCRT); STAPP.
4. Which two dynamic models were built for borderline personality? || MBT (Bateman and Fonagy) and TFP (Kernberg).
:::

:::mcq
Q: A brief therapy model where the approaching end of treatment is deliberately used to work on lifelong feelings about separation is:
- ISTDP
- *Mann's time-limited psychotherapy
- MBT
- Supportive-expressive therapy
> Mann's TLP makes the fixed end part of the work.

Q: Which patient is least suitable for a brief anxiety-provoking dynamic therapy?
- A motivated student with exam anxiety and good friendships
- A widower who can name his grief and has a supportive family
- *A man with daily heroin use and a recent serious suicide attempt
- A nurse who repeats a pattern with controlling partners and is curious why
> Severe substance use and acute risk need stabilisation and a different approach first.
:::

## 3.4 The evidence, and the debate about it [core][advanced]
Psychodynamic therapy is often called "unscientific". Others claim it is "as good as CBT". Both slogans are too simple. Here is what a careful reader can say.

### What the trials show (in plain words)
- **Short-term psychodynamic therapy works better than no treatment or waiting** for depression, anxiety disorders, somatic symptom problems and some personality difficulties.
- In head-to-head trials with **CBT and other established therapies**, differences are **usually small**, and often not significant.
- For **borderline personality disorder**, structured dynamic models (MBT, TFP) have randomised evidence, as does DBT.
- **Longer-term** dynamic therapy may help people with complex, chronic or personality problems, but the evidence is thinner and disputed.
- **Fewer and smaller trials** exist for psychodynamic therapy than for CBT, so confidence is lower for many conditions.

### Why people argue
| Argument for | Argument against |
|---|---|
| Meta-analyses find effects similar in size to other therapies | Many trials are small, with high risk of bias |
| Some studies show gains keep growing after therapy ends | "Growing gains" findings come from few studies and are sensitive to method |
| Equivalence trials show no clear difference from CBT | Equivalence needs large samples; small trials "find no difference" by default |
| The common factors (alliance, empathy) are what heal | That argument helps all therapies, not this one specially |
| Psychodynamic therapy targets personality, not just symptoms | Personality outcomes are harder to measure and less often measured |
| | **Researcher allegiance**: trials often favour the therapy the authors prefer, in every school |

:::widget layers
{
  "title": "How confident can we be? Psychodynamic therapy by claim",
  "shape": "stack",
  "layers": [
    { "label": "Fairly confident", "detail": "Short-term psychodynamic therapy beats waiting list or minimal treatment for depression and several anxiety and somatic presentations." },
    { "label": "Fairly confident", "detail": "Structured dynamic treatments (MBT, TFP) help borderline personality disorder, alongside DBT and other specialist models." },
    { "label": "Moderately confident", "detail": "In head-to-head trials, results are broadly similar to CBT and other bona fide therapies for depression. True equivalence needs larger trials." },
    { "label": "Uncertain", "detail": "Gains keep growing after therapy ends. Suggested by some studies, sensitive to method and few in number." },
    { "label": "Uncertain", "detail": "Long-term therapy is better than shorter therapy for complex, chronic problems. Meta-analyses disagree." },
    { "label": "Not supported", "detail": "Psychoanalysis is the only route to lasting change; every symptom has an Oedipal cause." }
  ],
  "caption": "Tap each level. Confidence depends on the number, size and quality of trials, not on how persuasive the theory sounds."
}
:::

:::widget sort
{
  "prompt": "How strong is each claim, as of the current evidence?",
  "buckets": ["Reasonably well supported", "Mixed or disputed", "Not supported"],
  "items": [
    { "text": "Short-term psychodynamic therapy is better than waiting list for depression", "bucket": 0 },
    { "text": "Long-term psychodynamic therapy is clearly superior to shorter therapies for complex problems", "bucket": 1, "why": "Early meta-analyses suggested this; later re-analyses and critiques found the comparisons weak." },
    { "text": "Psychoanalysis is the only therapy that produces lasting change", "bucket": 2 },
    { "text": "Structured dynamic therapies (MBT, TFP) help borderline personality disorder", "bucket": 0 },
    { "text": "Psychodynamic therapy and CBT give broadly similar results for depression in head-to-head trials", "bucket": 1, "why": "Largely true in existing trials, but few are large enough to prove true equivalence." },
    { "text": "Every psychological symptom has an Oedipal cause", "bucket": 2 }
  ]
}
:::

:::analogy The dodo bird verdict
In Lewis Carroll's story of Alice, the dodo declares, "Everybody has won and all must have prizes." Saul Rosenzweig used this in 1936 to describe the finding that different bona fide therapies tend to produce similar results. It is still debated: some specific therapies do better for specific problems (exposure for OCD and phobias, for example), so "all must have prizes" is not the whole truth.
:::

:::clinician
Key reviews to know (and how to read them):
- **A 2008 meta-analysis of long-term psychodynamic psychotherapy (LTPP)** for complex disorders reported large within-group effects and superiority over shorter therapies. It drew sharp methodological criticism in 2010 (on effect-size calculation and comparators), and a **2012 meta-analysis** found LTPP not superior to control treatments when trials were pooled differently.
- **An influential 2010 narrative review** of the efficacy of psychodynamic psychotherapy argued that effect sizes are comparable with other therapies; critics noted selective emphasis on within-group effects.
- **A 2014 systematic review update**: short-term psychodynamic psychotherapies for common mental disorders were better than minimal or waitlist controls, with gains maintained at medium-term follow-up; many trials at risk of bias.
- **A 2015 meta-analysis**: short-term psychodynamic therapy for depression is effective versus control, comparable to other therapies at post-treatment.
- **A 2017 equivalence meta-analysis** of psychodynamic versus other established treatments, concluding equivalence within a pre-set margin. Equivalence margins and trial quality remain points of debate.
- **Multiple meta-analyses of psychotherapies for depression** (for example in 2020 and 2021): most bona fide therapies have similar effects; effects shrink markedly when only low-risk-of-bias trials are included; psychodynamic therapy has fewer high-quality trials.
- **A 2023 umbrella review** argued that psychodynamic therapy meets criteria as an empirically supported treatment for several common mental disorders.
- **The Tavistock Adult Depression Study (2015)**: 18 months of LTPP for treatment-resistant depression; no difference at end of treatment, but advantages emerged at follow-up. A single trial; promising, not decisive.
An honest summary for teaching: short-term dynamic therapy is an evidence-based option for depression and several anxiety and personality presentations, comparable on available evidence to other bona fide therapies; the evidence base is smaller and more allegiance-prone than CBT's; claims of LTPP superiority are unresolved. NICE (UK) guidance generally positions short-term dynamic therapy as an option for depression when CBT, IPT or behavioural activation are declined or unsuitable, which reflects quantity and quality of evidence more than proven inferiority.
:::

:::recall
1. Summarise the evidence for short-term psychodynamic therapy in one line. || Better than no treatment for depression and several anxiety and personality problems; usually similar to other bona fide therapies; fewer and smaller trials.
2. What is researcher allegiance? || The tendency of trials to favour the therapy the researchers prefer.
3. What is the dodo bird verdict? || The finding that different bona fide therapies tend to produce similar outcomes ("all must have prizes").
4. Why can't a small trial prove two therapies are equivalent? || Equivalence needs large samples; small trials often show "no difference" simply because they lack power.
:::

:::mcq
Q: A small trial finds no significant difference between psychodynamic therapy and CBT for anxiety. The most accurate conclusion is:
- The two therapies are proven equivalent
- Psychodynamic therapy is superior
- *The trial cannot rule out a meaningful difference; larger studies are needed
- CBT is useless
> Absence of a significant difference in a small sample is not proof of equivalence.

Q: Which statement about long-term psychodynamic psychotherapy (LTPP) is fairest?
- It is proven superior to all shorter treatments
- It has no evidence at all
- *Some meta-analyses support it for complex problems, but their methods were disputed and the question remains open
- It is recommended first line for all depression
> The LTPP debate is unresolved.
:::

## 3.5 Indian perspectives: Bose, the family and the self [core][advanced]
Psychoanalysis reached India early and was changed by it.

### Girindrasekhar Bose (1887 to 1953)
- A Calcutta doctor and psychologist who developed his own analytic method **independently of Freud**, then wrote to him in 1920. They corresponded for years, often disagreeing politely.
- His **1921 doctoral thesis on repression** combined Freudian ideas with Indian philosophical thought.
- He founded the **Indian Psychoanalytic Society in Calcutta in 1922** and led it until his death. The society began publishing its own journal in 1947.
- He taught psychology at the **University of Calcutta**, home to India's first university psychology department, and is credited with starting an early general-hospital psychiatry clinic in Calcutta.
- **Theory of the opposite wish**: every wish is paired with an opposite wish (to be active and to be passive, to be male and to be female, to hurt and to be hurt). Repression keeps one side out of awareness; the other side is expressed. He argued this, rather than castration fear, was central to how conflicts are resolved.
- He **questioned the universality of the Oedipus complex** in its Viennese form, describing Indian men's wishes to identify with the mother and to be like her, which Freud did not accept.

### The Indian self and the family
- **Sudhir Kakar** (writing in 1978) described a Hindu childhood marked by a long, intense bond with the mother, a later and more distant entry of the father, and the extended family's many caregivers. His views are influential and also criticised as over-generalising from particular communities.
- **Alan Roland** (1988), comparing patients in India and Japan, described a **"familial self"**: a self experienced through relationships, hierarchy and family honour, alongside a private inner self, in contrast to the Western "individualised self".
- **J. S. Neki** described the guru-chela model of the therapeutic relationship (see 2.5).

:::trap Avoid the stereotype
India is not one culture. A Bengali professional family, an Adivasi village in Jharkhand, and a Mumbai startup founder raised in Dubai will have very different selves and families. Use these writers as **questions to ask**, not conclusions to apply.
:::

### Family systems: a bridge to family therapy
Psychodynamic ideas about inner relationships connect to **systems** ideas about the family as a whole.
| Idea | Founder | In plain words |
|---|---|---|
| **Differentiation of self** | Murray Bowen | Being able to stay yourself, thinking and feeling, while emotionally close to family |
| **Triangulation** | Bowen | Two people in tension pull in a third (often a child) to lower the anxiety |
| **Multigenerational transmission** | Bowen | Patterns of anxiety and relating passed down through generations |
| **Boundaries, enmeshment, disengagement** | Salvador Minuchin (structural) | How close or distant family sub-systems are; too blurred or too rigid |
| **Family as a system** | General systems thinking | A symptom in one person may keep the family's balance (homeostasis) |

:::widget flow
{
  "title": "How triangulation keeps a problem going",
  "layout": "cycle",
  "nodes": [
    { "id": "t", "label": "Tension between two", "detail": "Parents disagree about money, in-laws or the father's absence." },
    { "id": "a", "label": "Anxiety rises", "detail": "Neither can bear the conflict directly." },
    { "id": "pull", "label": "A third is pulled in", "detail": "A child becomes confidant, messenger or the 'problem' everyone worries about." },
    { "id": "calm", "label": "Pair calms for now", "detail": "Talking about the child's headaches is easier than talking about the marriage." },
    { "id": "stuck", "label": "Conflict never resolved", "detail": "The real issue stays untouched, so tension builds again and the child's role hardens." }
  ],
  "caption": "Systems work aims to take the child out of the triangle and help the pair talk directly."
}
:::

:::widget decide
{
  "scene": "Ananya, 17, in Jaipur, has severe headaches with no medical cause, worst on days her parents argue. Her mother tells you, in front of her, “She is my only friend. She understands me, not her father.” Her father works away and visits on weekends.",
  "ask": "What is the most useful systems-informed reading, without imposing a Western ideal?",
  "choices": [
    { "label": "Label the family as enmeshed and advise Ananya to move to a hostel to become independent", "verdict": "harm", "outcome": "The family feels judged; the mother becomes more anxious and Ananya's headaches worsen.", "why": "Closeness is not a disorder, and advice that ignores the family's values and Ananya's wishes damages the alliance." },
    { "label": "Notice possible triangulation: marital tension is being carried by Ananya, perhaps as her symptom. Explore with the family, including the father, how roles have shifted", "verdict": "best", "outcome": "In a joint session the parents speak directly to each other for the first time in months. Ananya's headaches ease.", "why": "Triangulation is a useful hypothesis; testing it in a family meeting respects Indian family structure while relieving the child of an adult role." },
    { "label": "Focus only on Ananya's headaches with relaxation training", "verdict": "ok", "outcome": "Relaxation helps a little, but the pattern at home continues.", "why": "Symptom-focused help is reasonable, but it misses the relationship context driving the symptom." }
  ]
}
:::

:::clinician
History: Bose's correspondence with Freud and the early Indian Psychoanalytic Society have been studied by the historian Christiane Hartnack and by Ashis Nandy, who argued that Bose's psychoanalysis was a culturally rooted alternative rather than a derivative. In Indian practice, psychodynamic therapy is less widely available than CBT and family interventions, and is mainly offered in a few metropolitan centres and training institutes; family-based interventions have deep roots, from family wards and the involvement of relatives in care (notably the Vidyasagar family-ward experiment at Amritsar) to manualised family psychoeducation in schizophrenia. Adaptations commonly reported include a more active and explanatory therapist stance, greater flexibility about family involvement, attention to somatic idioms of distress, and respect for hierarchy while gradually supporting the patient's own voice. Rigorous Indian trials of psychodynamic therapy are scarce; this is an evidence gap, not evidence of ineffectiveness.
:::

:::recall
1. When and where did Bose found the Indian Psychoanalytic Society? || Calcutta, 1922.
2. State Bose's theory of the opposite wish. || Every wish is paired with its opposite; repression hides one side while the other is expressed.
3. How did Bose disagree with Freud about the Oedipus complex? || He questioned its universality in Freud's form and emphasised Indian men's wish to identify with the mother.
4. What is Roland's "familial self"? || A self experienced through family relationships, hierarchy and honour, alongside a private inner self.
5. Define triangulation and differentiation of self. || Two people in tension pull in a third to lower anxiety; staying oneself while emotionally close to family (Bowen).
:::

:::mcq
Q: Which statement about Girindrasekhar Bose is correct?
- He trained in Vienna under Freud
- *He developed an analytic method independently and founded the Indian Psychoanalytic Society in 1922
- He rejected the idea of the unconscious
- He founded behaviour therapy in India
> Bose worked independently, then corresponded with Freud.

Q: A couple in conflict both confide in their son and use him as a messenger. In Bowen's terms this is:
- Differentiation
- *Triangulation
- Disengagement
- Sublimation
> A third person is pulled in to lower tension between two.
:::

# Part IV · Exam zone

## 4.1 Long answers, short notes and viva [core]
### Long answer skeletons
**Q1. Describe object relations theory with reference to Klein and Winnicott. Add its clinical relevance. (15 marks)**
1. Define "object" and object relations (one paragraph).
2. Klein: unconscious phantasy; paranoid-schizoid and depressive positions (table); splitting, projective identification (three uses), reparation; envy.
3. Winnicott: good-enough mother, holding, transitional object, true and false self, capacity to be alone.
4. Bion's containment and Kernberg's levels of organisation (table).
5. Clinical relevance: understanding splitting in borderline patterns, countertransference as data, the therapy as a holding environment, TFP and MBT.
6. Critique: untestable infant claims; strong clinical utility; Indian caveats.

**Q2. Write a psychodynamic formulation for a given case. (15 marks)**
Use the five parts (summary, non-dynamic factors, core explanation with a triangle or CCRT, predicted transference and resistance, treatment). Mark your inferences. End with what would make you revise it.

**Q3. Critically evaluate the evidence for psychodynamic psychotherapy. (15 marks)**
Define the family of therapies; summarise meta-analytic findings by condition; head-to-head comparisons; the LTPP debate; methodological issues (risk of bias, allegiance, equivalence); balanced conclusion.

### Short notes (5 marks each)
Transference and countertransference · Resistance · Selfobjects · Adult Attachment Interview · Malan's triangles · Brief dynamic therapy selection criteria · Girindrasekhar Bose · Projective identification.

:::viva
What is the difference between a stage and a Kleinian position? :: A position is a mode of experiencing that adults move in and out of throughout life; a stage is passed through once.
Name three uses of projective identification. :: Communication, evacuation, control.
What does the Adult Attachment Interview score? :: Coherence of the narrative, not the events.
What is the transmission gap? :: The part of parent to infant attachment transmission not explained by sensitivity.
Kohut's three selfobject needs? :: Mirroring, idealising, twinship.
How does Kernberg separate borderline from psychotic organisation? :: Reality testing is preserved in borderline, lost in psychotic.
Concordant versus complementary countertransference? :: Feeling with the patient versus feeling like the patient's important other.
Five sources of resistance according to Freud? :: Repression, transference, secondary gain, id, superego.
What is the CCRT? :: Luborsky's Core Conflictual Relationship Theme: Wish, Response of Other, Response of Self.
Who described the guru-chela relationship in therapy? :: J. S. Neki.
What is Bose's key theory? :: The theory of the opposite wish.
What does "flight into health" mean? :: A sudden improvement as painful material approaches, a form of resistance.
:::

## 4.2 Module test [core]
:::mcq
Q: Which of the following is NOT one of the distinctive features of psychodynamic sessions identified in process research?
- Focus on affect
- Exploring avoidance
- Focus on the therapy relationship
- *Setting graded homework tasks
> Homework and graded tasks are characteristic of CBT.

Q: In Freud's structural model, the agency that works on the reality principle is the:
- Id
- *Ego
- Superego
- Unconscious
> The ego mediates between wishes, conscience and reality.

Q: A student's dream of falling from a high building merges her fears about exams, her parents' expectations and a recent breakup into one scene. This illustrates:
- Secondary revision
- *Condensation
- Reaction formation
- Repression
> Many ideas in one image.

Q: According to signal anxiety theory, what does anxiety do?
- Causes psychosis directly
- *Warns the ego and triggers defences
- Is always caused by physical illness
- Replaces the superego
> Anxiety as a signal.

Q: Which caregiving feature did Ainsworth find most linked to secure attachment?
- Strict discipline
- *Sensitive, prompt and fitting responses to the infant's signals
- Constant physical holding
- Early independence training
> Sensitivity.

Q: Hartmann's "conflict-free sphere" refers to:
- The superego's ideals
- *Ego functions such as perception, memory and language that develop without conflict
- Dreams without wishes
- The latency stage
> Ego psychology's adaptive view.

Q: Which defence belongs to the highest adaptive level?
- Splitting
- Denial
- *Anticipation
- Acting out
> Anticipation is a high adaptive defence.

Q: In Klein's theory, reparation belongs to:
- The paranoid-schizoid position
- *The depressive position
- The oral stage
- The latency period
> Guilt and the wish to repair arise when the whole object is recognised.

Q: A patient fills the therapist with despair she cannot express, and the therapist feels it strongly. This is projective identification used for:
- Control
- Evacuation
- *Communication
- Sublimation
> The feeling is transmitted so it can be understood.

Q: Winnicott's "good-enough mother":
- Never fails her infant
- *Adapts closely at first, then fails in bearable ways that help the child grow
- Is emotionally distant
- Always uses strict routines
> Manageable failures support growth.

Q: Kernberg's borderline personality organisation includes all EXCEPT:
- Identity diffusion
- Primitive defences such as splitting
- *Loss of reality testing
- Unstable relationships
> Reality testing is broadly intact in borderline organisation.

Q: Kohut's "transmuting internalisation" follows:
- Severe trauma
- *Small, repaired failures by selfobjects
- Interpretation of envy
- Behavioural conditioning
> Small failures, repaired, let the self take over the function.

Q: The infant attachment pattern most associated with later dissociation is:
- Secure
- Avoidant
- Ambivalent
- *Disorganised
> Disorganised attachment links to dissociation.

Q: On the AAI, a long, angry account that drifts into current grievances with the mother suggests:
- Dismissing
- *Preoccupied
- Secure-autonomous
- Unresolved
> Entangled, angry discourse is preoccupied.

Q: In Bartholomew's model, positive self and negative other is:
- Secure
- Preoccupied
- *Dismissing
- Fearful
> Self-reliant, avoids closeness.

Q: Feelings of romantic attraction a patient develops towards the therapist should be:
- Reciprocated if genuine
- Ignored completely
- *Explored with care within firm boundaries, never acted on
- Treated as a reason to end therapy immediately
> Erotic transference is material for the work, within strict boundaries.

Q: Winnicott's paper "Hate in the countertransference" describes:
- Concordant countertransference
- *Objective countertransference: reactions most people would have to the patient
- Transference neurosis
- Superego resistance
> Objective countertransference.

Q: "When you say you were 'fine', what did that feel like in your body?" is an example of:
- *Clarification
- Confrontation
- Interpretation
- Working through
> Gathering and sharpening what was said.

Q: In the CCRT, "I expect people will find me boring" is the:
- Wish
- *Response of Other
- Response of Self
- Defence
> Expected response from others.

Q: Which brief model relentlessly challenges defences to unlock feelings?
- Mann's TLP
- *Davanloo's ISTDP
- DIT
- Supportive-expressive therapy
> ISTDP.

Q: Which statement about the evidence base is most accurate?
- Psychodynamic therapy has more high-quality trials than CBT
- *Short-term psychodynamic therapy beats no treatment for several disorders and is broadly comparable to other therapies in available trials
- No randomised trials of psychodynamic therapy exist
- Long-term therapy has been proven superior to all brief therapies
> Fair summary of current evidence.

Q: Researcher allegiance means:
- Patients prefer one therapy
- *Results tend to favour the therapy the researchers prefer
- Therapists follow manuals strictly
- Funding comes from government
> A bias affecting all schools.

Q: Bose's "theory of the opposite wish" states that:
- All wishes are sexual
- *Each wish has an opposite; one side is repressed while the other is expressed
- Wishes are learned through conditioning
- Only the superego has wishes
> Bose's central idea.

Q: Roland's term for an Indian self experienced through family relationships and hierarchy is:
- False self
- *Familial self
- Grandiose self
- Collective unconscious
> Alan Roland's term, from his work with patients in India and Japan.

Q: A mother and daughter are so close the daughter cannot make any decision without her, and the father is left out. Minuchin's term for the mother-daughter relationship is:
- Disengaged
- *Enmeshed
- Differentiated
- Triangulated only by the father
> Blurred boundaries. Check how the family experiences it before treating it as a problem.
:::
`;
