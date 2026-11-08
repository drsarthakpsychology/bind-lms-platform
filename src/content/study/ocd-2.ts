/* Module · OCD and related disorders, Parts II and III (related disorders, Beginner level check, Advanced). Original text written for VIBHA School of Psychology. */
export const part2 = String.raw`
# Part II · Related disorders

## 2.1 Body dysmorphic disorder [core][beginner]
:::define DSM-5-TR body dysmorphic disorder (summary)
A. Preoccupation with one or more perceived defects or flaws in physical appearance that are **not observable or appear slight to others**.
B. At some point, **repetitive behaviours** (mirror checking, excessive grooming, skin picking, reassurance seeking) or **mental acts** (comparing one's appearance with others) in response to the concern.
C. Clinically significant distress or impairment.
D. Not better explained by concerns about body fat or weight in someone who meets criteria for an eating disorder.
Specify **with muscle dysmorphia** (belief that one's build is too small or not muscular enough) and the **insight** level (good or fair, poor, absent or delusional).
:::

### What it looks like
- Common concerns: skin (acne, scars, colour), hair (thinning, too much body hair), nose, teeth, eyes, genitals, overall build.
- Hours a day of checking, camouflage (make-up, caps, hair over the face), comparing, and avoiding mirrors or photos.
- Many seek dermatology, dentistry or cosmetic surgery. Procedures rarely relieve BDD; the concern often moves to another feature, or the person is dissatisfied with the result.
- **Skin colour** worries can be prominent in South Asia, shaped by pressures towards fairness.
- **Muscle dysmorphia**, mostly in men, involves excessive gym training, diets and sometimes anabolic steroid misuse.

:::widget guess
{"prompt": "Compared with healthy people and those with OCD, anxiety or eating disorders, how many times more likely are people with BDD to have had suicidal thoughts?", "min": 1, "max": 10, "step": 0.5, "unit": "times", "answer": [3.5, 4.5], "reveal": "About four times. Suicide attempts are about two and a half times more likely. BDD is often dismissed as vanity, but it is one of the most suicidal conditions in this chapter, so risk must always be asked about.", "clinician": "A meta-analysis of 17 studies found pooled odds ratios of about 3.9 for suicidal thoughts and 2.6 for suicide attempts compared with healthy controls and people with eating disorders, OCD or anxiety disorders."}
:::

:::widget flow
{"title": "The BDD loop", "layout": "cycle", "nodes": [{"id": "trig", "label": "Trigger", "detail": "Catching sight of herself in a shop window."}, {"id": "focus", "label": "Zooming in", "detail": "Attention narrows onto her nose; she stops seeing her face as a whole."}, {"id": "belief", "label": "Belief", "detail": "'My nose is hideous and everyone notices.'"}, {"id": "ritual", "label": "Rituals", "detail": "Mirror checking for an hour, applying make-up, comparing with photos, asking 'Does it look bad?'"}, {"id": "relief", "label": "Brief relief, then worse", "detail": "Checking calms for a moment, but close inspection makes the flaw seem bigger."}], "edgeLabels": {"relief>trig": "the loop restarts"}, "caption": "CBT for BDD targets the zoomed-in attention and the rituals. Cosmetic surgery rarely helps and often shifts the worry to another feature."}
:::

### Treatment
- **CBT for BDD**: psychoeducation, exposure (for example going out without camouflage), response prevention (reducing checking and grooming), perceptual retraining (looking at the whole body in the mirror neutrally), and work on beliefs about appearance and worth.
- **SSRIs**, often at high doses, including when insight is absent or delusional. Antipsychotics alone do not help delusional BDD.
- Advise against cosmetic procedures while BDD is active.

:::widget decide
{"scene": "Varun, 23, a gym trainer in Chandigarh, is referred by a cosmetic surgeon. He has had one rhinoplasty, wants a second, says his nose is 'grotesque', checks mirrors for three hours a day and has not left home without a cap for a year. The surgeon sees a normal nose.", "ask": "What is the best response?", "choices": [{"label": "Support the second operation, since he is so distressed", "verdict": "harm", "outcome": "After surgery he is more distressed, now about his jaw, and talks of ending his life.", "why": "Cosmetic procedures rarely help BDD and can worsen it; the preoccupation shifts."}, {"label": "Tell him firmly his nose is normal and he is imagining it", "verdict": "ok", "outcome": "He leaves angry, feeling disbelieved.", "why": "Arguing about the feature does not work. Focus on the preoccupation and its cost instead."}, {"label": "Acknowledge his distress, focus on how much the preoccupation costs him, assess suicide risk, and offer CBT for BDD and an SSRI", "verdict": "best", "outcome": "He agrees to try treatment 'to feel less tortured'. Over months his checking falls and he stops wearing the cap.", "why": "Engaging around suffering rather than the feature, with risk assessment and evidence-based treatment, is effective."}]}
:::

:::recall
1. State the core BDD criteria. || Preoccupation with perceived flaws invisible or slight to others; repetitive behaviours or mental acts; distress or impairment; not explained by eating disorder concerns.
2. What is muscle dysmorphia? || A BDD specifier: belief that one's build is too small or insufficiently muscular.
3. Do cosmetic procedures help BDD? || Rarely; the concern often shifts or worsens.
:::

:::mcq
Q: Which statement about BDD is correct?
- It is a form of vanity and needs no treatment
- *It carries a high risk of suicidal thoughts and attempts
- Antipsychotics alone treat delusional BDD
- Surgery is the treatment of choice
> Risk assessment is essential; SSRIs and CBT are first-line.
:::

## 2.2 Hoarding disorder [core][beginner]
:::define DSM-5-TR hoarding disorder (summary)
A. Persistent **difficulty discarding** possessions, regardless of actual value.
B. Due to a perceived **need to save** items and distress at discarding.
C. Accumulation that **congests active living areas** and substantially compromises their use (if areas are clear, it is only because others intervened).
D. Distress or impairment, including in maintaining a safe environment.
E. Not due to a medical condition (brain injury, cerebrovascular disease, Prader-Willi syndrome).
F. Not better explained by another disorder (OCD obsessions, low energy in depression, delusions, cognitive deficits in dementia, restricted interests in autism).
Specify **with excessive acquisition** (buying, collecting free items or stealing beyond need or space) and the **insight** level.
:::

### Hoarding versus collecting
| Hoarding | Collecting |
|---|---|
| Items have little value or are unrelated (newspapers, bags, containers) | Items are organised around a theme (coins, stamps) |
| Disorganised piles; rooms cannot be used | Displayed, catalogued; rooms still usable |
| Distress or conflict; risks of fire, falls, pests | Pleasure and pride |

### Features
- Prevalence of clinically significant hoarding is about 1.5 to 6% in community surveys; around 2.5% in a meta-analysis. It is about three times more common in older than younger adults.
- Usually begins in adolescence and worsens with each decade.
- Insight is often poor; families are frequently more distressed than the person.
- Indecision, perfectionism, avoidance and strong emotional attachment to objects are common.
- **Animal hoarding** is a severe variant with serious welfare and health risks.

### Treatment
CBT for hoarding: motivational work, skills in sorting and decision-making, practice in discarding without "rescuing", and exposure to not acquiring. Home visits matter. Harm reduction (clear exits, fire safety, working kitchen) is a realistic first goal. Medicines have weak evidence.

:::widget sort
{"prompt": "Hoarding disorder, or something else?", "buckets": ["Hoarding disorder", "Not hoarding disorder"], "items": [{"text": "A retired teacher whose flat is full of newspapers; she cannot use her kitchen and panics if her son tries to clear it", "bucket": 0}, {"text": "A man with an organised coin collection in labelled albums", "bucket": 1}, {"text": "A woman with severe depression who has no energy to clear the clutter but feels nothing about the objects", "bucket": 1, "why": "Clutter from low energy, without a need to save, is explained by depression."}, {"text": "A man with dementia who stores rotting food because he forgets what it is", "bucket": 1, "why": "Cognitive deficits explain this; exclusion criterion F."}, {"text": "A woman who brings home every free pamphlet and plastic bag 'in case', with rooms piled to the ceiling", "bucket": 0, "why": "With excessive acquisition."}]}
:::

:::widget flow
{"title": "Hoarding disorder or something else?", "layout": "tree", "nodes": [{"id": "root", "label": "Many possessions and clutter", "detail": "Start here."}, {"id": "discard", "label": "Difficulty discarding from a need to save?", "detail": "Distress at throwing things away.", "parent": "root"}, {"id": "hd", "label": "Hoarding disorder", "detail": "If living areas are congested and life is impaired.", "parent": "discard"}, {"id": "collect", "label": "Organised, themed, rooms usable?", "detail": "Pleasure and pride.", "parent": "root"}, {"id": "hobby", "label": "Collecting (a hobby)", "detail": "Not a disorder.", "parent": "collect"}, {"id": "other", "label": "Explained by something else?", "detail": "Obsessions, low energy in depression, dementia, psychosis, autism.", "parent": "root"}, {"id": "treat", "label": "Treat that condition", "detail": "Hoarding is then a feature, not the diagnosis.", "parent": "other"}]}
:::

:::recall
1. What is the core of hoarding disorder? || Persistent difficulty discarding due to a perceived need to save, causing clutter that compromises living areas.
2. Give two differences between hoarding and collecting. || Value and theme; organisation and usable rooms; distress versus pleasure.
3. What is the excessive acquisition specifier? || Acquiring unneeded items or items without space, alongside difficulty discarding.
:::

:::mcq
Q: Which feature most strongly separates hoarding disorder from OCD with hoarding-like behaviour?
- The amount of clutter
- *In hoarding disorder, saving is due to a perceived need to keep items, not to obsessions like fear of harm
- Age of the person
- Gender
> In OCD, saving may follow obsessions (for example fear of throwing away something with a name that will cause harm).
:::

## 2.3 Trichotillomania and excoriation [core][beginner]
These are **body-focused repetitive behaviours** (BFRBs).

:::define Trichotillomania (DSM-5-TR summary)
A. Recurrent pulling out of one's hair, resulting in hair loss.
B. Repeated attempts to decrease or stop.
C. Distress or impairment.
D. Not due to a medical (for example dermatological) condition.
E. Not better explained by another disorder (for example improving a perceived defect in BDD).
:::

:::define Excoriation (skin-picking) disorder (DSM-5-TR summary)
A. Recurrent skin picking resulting in skin lesions.
B. Repeated attempts to decrease or stop.
C. Distress or impairment.
D. Not due to a substance (for example cocaine) or medical condition (for example scabies).
E. Not better explained by another disorder (delusions or tactile hallucinations in psychosis, BDD, stereotypies, self-harm intent).
:::

### Features
- Trichotillomania: about 1 to 2% in a year; mostly women in clinical samples. Scalp, eyebrows and eyelashes are common sites. Some people chew or swallow hair (trichophagia), which can form a hairball in the stomach (trichobezoar), a surgical emergency.
- Excoriation: about 2% current in a large online survey; mostly women. Face, arms and hands are common.
- Pulling or picking may be **focused** (deliberate, often to relieve tension or an urge) or **automatic** (while reading, watching TV, studying). Many people do both.
- Unlike OCD, these behaviours are often preceded by tension or an urge and followed by relief or even pleasure, without an obsession.

### Treatment
- **Habit reversal training (HRT)**: awareness training (noticing when and how it happens), a **competing response** (for example clenching fists for a minute), stimulus control (gloves, short nails, covering mirrors), and social support. HRT has the best evidence.
- **Comprehensive behavioural (ComB)** models extend HRT to sensory, cognitive and emotional triggers.
- **N-acetylcysteine** has some evidence in trichotillomania; SSRIs are less clearly effective than in OCD.

:::widget worked
{"title": "Habit reversal for hair pulling", "steps": [{"q": "Awareness: when does Pooja, 19, pull?", "a": "While studying late at night, alone, with her left hand, mostly from the crown, often without noticing until she sees hair on the desk."}, {"q": "Warning signs?", "a": "Hand drifting to her head, touching and stroking hair first, feeling tense or bored."}, {"q": "Competing response?", "a": "When her hand rises: make a fist and press it into her lap for 60 seconds, or hold a stress ball."}, {"q": "Stimulus control?", "a": "Study at the dining table, not in bed; wear a cap; keep a fidget toy; finger tape on the left hand."}, {"q": "Support?", "a": "Her sister praises her when she uses the competing response and gently reminds her if she sees her hand drift."}]}
:::

:::widget flow
{"title": "Habit reversal training", "layout": "chain", "nodes": [{"id": "aware", "label": "Awareness training", "detail": "When, where and how pulling happens; early warning signs."}, {"id": "compete", "label": "Competing response", "detail": "A response that makes pulling impossible, held for a minute."}, {"id": "stim", "label": "Stimulus control", "detail": "Change places, hands and objects that trigger pulling."}, {"id": "support", "label": "Social support", "detail": "Someone who praises progress and gently reminds."}, {"id": "relapse", "label": "Relapse plan", "detail": "What to do during stressful periods."}]}
:::

:::recall
1. What are body-focused repetitive behaviours? || Repetitive self-grooming behaviours such as hair pulling and skin picking.
2. Distinguish focused from automatic pulling. || Focused: deliberate, urge- or tension-driven. Automatic: outside awareness during other activities.
3. Name the main parts of habit reversal training. || Awareness training, competing response, stimulus control, social support.
4. What is a trichobezoar? || A hairball in the stomach from swallowing hair.
:::

:::mcq
Q: The best-supported psychological treatment for trichotillomania is:
- Psychoanalysis
- *Habit reversal training
- Exposure and response prevention alone
- Relaxation alone
> HRT, often in a comprehensive behavioural model.
:::

## 2.4 Telling the spectrum apart [core][beginner]
### The deciding questions
1. **What triggers the behaviour?** An obsession (OCD), an appearance concern (BDD), a need to save (hoarding), an urge or tension (BFRBs), a physical premonitory urge (tics).
2. **What is the goal?** To prevent harm or reduce distress (OCD), to fix or hide a flaw (BDD), to keep things (hoarding), to relieve tension or get gratification (BFRBs).
3. **Is it unwanted?** Ego-dystonic in OCD; often mixed in hoarding; ego-syntonic in OCPD.

| Repetitive behaviour | Most likely |
|---|---|
| Washing after touching a "contaminated" object, to prevent illness | OCD |
| Checking the mirror for hours to see if one's skin looks bad | BDD |
| Picking at skin to make it smooth, with no appearance belief | Excoriation disorder |
| Picking to remove "insects" felt under the skin | Psychosis or substance (formication) |
| Sudden blinking and sniffing preceded by an urge in the face | Tic disorder |
| Rocking and hand-flapping that feel good, since early childhood | Stereotypy (for example in autism) |
| Lining up toys for enjoyment, distressed by change | Autism |

:::widget sort
{"prompt": "Which diagnosis fits each repetitive behaviour best?", "buckets": ["OCD", "BDD", "Excoriation", "Tic disorder", "Psychosis or substance"], "items": [{"text": "Picks at acne for hours to make her face look 'less ugly'", "bucket": 1, "why": "Picking aimed at fixing a perceived appearance flaw is BDD."}, {"text": "Picks at the skin of his fingers while studying, almost without noticing, and wants to stop", "bucket": 2}, {"text": "Digs at his arms to get out 'bugs' after using methamphetamine", "bucket": 4}, {"text": "Repeats prayers until they feel 'right' because otherwise God will punish her family", "bucket": 0}, {"text": "Shrugs his shoulder and grunts, preceded by a tight feeling in the neck", "bucket": 3}]}
:::

:::note ICD-11 says
ICD-11 groups **obsessive-compulsive or related disorders** as: OCD, body dysmorphic disorder, **olfactory reference disorder** (a persistent belief that one gives off a foul body odour, with checking and avoidance), **hypochondriasis** (health anxiety), hoarding disorder, and **body-focused repetitive behaviour disorders** (trichotillomania and excoriation). Tourette syndrome is cross-listed. Insight is specified as "fair to good" or "poor to absent".
:::

:::widget flow
{"title": "What drives the repetitive behaviour?", "layout": "tree", "nodes": [{"id": "root", "label": "Repetitive behaviour", "detail": "Ask what triggers it and what it is for."}, {"id": "obs", "label": "Triggered by an obsession, to prevent harm", "detail": "OCD.", "parent": "root"}, {"id": "app", "label": "To fix or hide a perceived flaw", "detail": "Body dysmorphic disorder.", "parent": "root"}, {"id": "save", "label": "A need to keep things", "detail": "Hoarding disorder.", "parent": "root"}, {"id": "tension", "label": "Tension or urge relief, no obsession", "detail": "Trichotillomania or excoriation.", "parent": "root"}, {"id": "urge", "label": "A physical premonitory urge, sudden and brief", "detail": "Tic disorder.", "parent": "root"}, {"id": "bugs", "label": "To remove 'insects' felt under the skin", "detail": "Psychosis or substance-induced formication.", "parent": "root"}]}
:::

:::recall
1. Name the three deciding questions. || What triggers it? What is its goal? Is it unwanted?
2. Which disorders does ICD-11 add to the grouping that DSM-5-TR does not? || Olfactory reference disorder and hypochondriasis.
:::

:::mcq
Q: A man constantly smells his armpits, showers four times a day and avoids buses, convinced others notice his foul body odour, though no one does. ICD-11 would call this:
- OCD
- *Olfactory reference disorder
- Social anxiety disorder
- Schizophrenia
> A named ICD-11 disorder; in DSM-5-TR it is an "other specified" OCRD.
:::

## 2.5 Level check · Beginner [beginner]
Twelve or more right out of fifteen opens the Advanced level.

:::mcq
Q: DSM-5-TR criterion B for OCD gives what example of "time-consuming"?
- More than 10 minutes a day
- *More than 1 hour a day
- More than 4 hours a day
- More than 1 day a week
> Or distress or impairment.

Q: A woman fully believes that if she does not wash 50 times her child will die. There are no other psychotic features. The diagnosis is:
- Delusional disorder
- *OCD with absent insight or delusional beliefs
- Schizophrenia
- BDD
> The insight specifier covers delusional conviction about OCD beliefs.

Q: Tic-related OCD is typically:
- More common in women, with late onset
- *More common in males, with earlier onset and symmetry symptoms
- Unresponsive to any treatment
- Always psychotic
> And responds better to antipsychotic augmentation.

Q: The mean age of onset of OCD is about:
- 8 years
- *19 to 20 years
- 35 years
- 50 years
> A quarter start by age 14.

Q: The belief that thinking something makes it more likely to happen is called:
- Magical thinking in psychosis
- *Thought-action fusion
- Overvalued idea
- Thought insertion
> A key cognitive factor in OCD.

Q: Which is ego-syntonic?
- OCD checking
- *OCPD perfectionism
- Harm obsessions
- Contamination fears
> OCPD traits feel right to the person.

Q: The active ingredient of ERP is:
- Relaxation
- *Response prevention
- Insight into childhood
- Distraction
> Not performing the ritual.

Q: An adequate SSRI trial in OCD usually means:
- 2 weeks at a starting dose
- 4 weeks at any dose
- *At least 8 to 12 weeks, with several weeks at the top tolerated dose
- 1 week at a high dose
> OCD responds slowly and often needs higher doses.

Q: Which augmenting drug has the best evidence in SSRI-resistant OCD?
- Alprazolam
- *Low-dose risperidone or aripiprazole
- Lithium
- Propranolol
> About a third respond.

Q: A new mother has horrifying, unwanted thoughts of harming her baby and avoids being alone with him. The most important point is:
- She will likely act on them
- *Such ego-dystonic obsessions are not linked to increased risk; assess and treat
- She has postpartum psychosis
- The baby must be removed
> Distinguish from psychosis.

Q: BDD carries a markedly raised risk of:
- Dementia
- *Suicidal thoughts and attempts
- Mania
- Seizures
> Always assess risk.

Q: A coin collector with organised, catalogued albums and usable rooms has:
- Hoarding disorder
- *A hobby, not hoarding disorder
- OCD
- BDD
> Collecting is organised and pleasurable.

Q: The best-supported treatment for trichotillomania is:
- ERP alone
- *Habit reversal training
- Antipsychotics
- Cosmetic treatment
> Awareness, competing response, stimulus control, support.

Q: Picking at the skin to remove "insects" after using methamphetamine suggests:
- Excoriation disorder
- *A substance-induced tactile hallucination (formication)
- OCD
- BDD
> Exclusion criterion D and E.

Q: Which disorder is grouped with OCD-related disorders in ICD-11 but with somatic symptom disorders in DSM-5-TR?
- Panic disorder
- *Hypochondriasis (illness anxiety)
- Trichotillomania
- Hoarding disorder
> ICD-11 emphasises its checking and reassurance-seeking.
:::

# Part III · Advanced: mechanisms, treatment resistance and frontiers

## 3.1 Circuits, habits and genes [core][advanced]
### The cortico-striato-thalamo-cortical loops
Parallel loops run from frontal cortex to the striatum, then through the globus pallidus and substantia nigra to the thalamus, and back to cortex. In OCD the loops most involved start in the **orbitofrontal cortex** (OFC, valuing outcomes and detecting threat) and **anterior cingulate cortex** (ACC, error and conflict monitoring), passing through the **caudate** and ventral striatum.

- The **direct pathway** (striatum to internal globus pallidus) releases the thalamus and amplifies the loop: "go".
- The **indirect pathway** (via the external globus pallidus and subthalamic nucleus) inhibits it: "stop".
- A model proposes that an imbalance favouring the direct pathway keeps a "something is wrong" signal looping, so the person cannot get the feeling of completion.

Imaging shows **hyperactivity of the OFC, ACC and caudate** at rest and on symptom provocation, which partly **normalises after successful treatment with either an SSRI or behaviour therapy**. Two different treatments produce similar circuit changes.

### Habit and goal-directed control
Claire Gillan's experiments showed that people with OCD rely more on **habits** and less on **goal-directed** control. In outcome-devaluation tests, they kept responding for rewards that were no longer valuable. One view is that compulsions start as habits, and obsessions come later as a way of explaining them ("I must be washing because I'm contaminated"). In large online samples, a transdiagnostic **"compulsive behaviour and intrusive thought"** dimension, cutting across OCD, eating disorders and addiction, tracks reduced goal-directed control better than diagnosis does.

### Error signals
The **error-related negativity**, an EEG wave over the ACC after a mistake, is enlarged in OCD and in unaffected relatives: a candidate marker of an overactive "something is wrong" signal.

### Genes and neurochemistry
- A large genome-wide study published in 2025 identified **30 genetic loci** associated with OCD, with genetic overlap with anxiety, depression, anorexia nervosa and Tourette syndrome.
- **Glutamate**: raised glutamate in cerebrospinal fluid in some studies, and variants in glutamate transporter genes (for example SLC1A1), motivate trials of glutamate-modulating drugs.
- **Serotonin** modulates the OFC; **dopamine** in the striatum may matter more in tic-related OCD, consistent with the benefit of antipsychotic augmentation there.

:::widget sort
{"prompt": "Which mechanism does each finding support?", "buckets": ["CSTC hyperactivity", "Habit over goal-directed control", "Error monitoring", "Genetics"], "items": [{"text": "OFC and caudate metabolism fall after successful ERP", "bucket": 0}, {"text": "Patients keep pressing for a reward that has been devalued", "bucket": 1}, {"text": "Enlarged EEG wave after mistakes, also in unaffected siblings", "bucket": 2}, {"text": "30 risk loci, overlapping with Tourette syndrome and anorexia", "bucket": 3}]}
:::

:::widget brainmap
{"title": "The OCD circuit", "focus": ["prefrontal", "basal-ganglia", "thalamus"], "notes": {"prefrontal": "Orbitofrontal and anterior cingulate cortex: valuing outcomes, detecting errors and threat; overactive in OCD.", "basal-ganglia": "Caudate and ventral striatum: selecting and stopping actions; direct and indirect pathways.", "thalamus": "Relays the loop back to cortex; if not damped, the 'something is wrong' signal keeps cycling."}, "caption": "Activity in this loop partly normalises after successful SSRI treatment or ERP."}
:::

:::widget flow
{"title": "The cortico-striato-thalamo-cortical loop", "layout": "cycle", "nodes": [{"id": "ofc", "label": "Orbitofrontal and cingulate cortex", "detail": "Signal: 'something is wrong'."}, {"id": "str", "label": "Caudate and ventral striatum", "detail": "Direct pathway amplifies; indirect pathway brakes."}, {"id": "gp", "label": "Globus pallidus and substantia nigra", "detail": "Output gate of the basal ganglia."}, {"id": "thal", "label": "Thalamus", "detail": "Released from inhibition, it excites cortex again."}], "caption": "An imbalance favouring the direct pathway may keep the loop running, so the feeling of completion never arrives."}
:::

:::widget neuron
{"title": "Error signals and repeated firing", "myelinated": true, "caption": "A neuron fires when input crosses threshold. In OCD, error-monitoring circuits in the cingulate cortex appear to cross threshold too easily, producing a strong 'something is wrong' signal even when nothing is wrong."}
:::

:::widget compare
{"title": "Goal-directed control and habit", "a": {"label": "Goal-directed", "points": ["Action chosen for its result: 'I wash because my hands are dirty'", "Stops when the goal no longer matters", "Relies more on the prefrontal cortex and caudate", "Flexible and effortful"], "summary": "Goal-directed: you do it because of what it achieves."}, "b": {"label": "Habit", "points": ["Action triggered by a cue: 'I see the tap, I wash'", "Continues even when the result is no longer wanted", "Relies more on the putamen and its loops", "Fast, automatic and hard to stop"], "summary": "Habit: the cue drives the act, whatever the result."}, "caption": "Experiments in which a reward is made worthless show that people with OCD keep responding more than controls. One view is that compulsions may begin as goal-directed acts and harden into habits, with the fear explanation added afterwards."}
:::

:::recall
1. Which cortical regions and which part of the striatum are most implicated in OCD? || Orbitofrontal and anterior cingulate cortex; caudate and ventral striatum.
2. What happens to these circuits after successful treatment? || Hyperactivity partly normalises, with both SSRIs and behaviour therapy.
3. What did habit studies show? || People with OCD rely more on habits and less on goal-directed control.
4. How many loci did the 2025 OCD GWAS identify? || 30.
:::

:::mcq
Q: Which finding supports the idea that CBT and medicines act on a common circuit in OCD?
- Both increase dopamine in the occipital cortex
- *Both reduce orbitofrontal and caudate hyperactivity in responders
- Both act on GABA-A receptors
- Neither changes brain activity
> Imaging shows similar normalisation.
:::

## 3.2 Medicines at depth, and the resistant patient [core][advanced]

:::widget figure
{"id": "ssri-synapse"}
:::
### Why higher doses and more time?
Animal work suggests that in the **orbitofrontal cortex**, serotonin terminal autoreceptors desensitise only after longer exposure to higher doses than in other regions. That may explain the slow response and dose-response relationship of SSRIs in OCD. Clomipramine's benefit comes from the parent drug's strong serotonin reuptake block; its metabolite, desmethylclomipramine, mainly blocks noradrenaline reuptake.

### Defining resistance
- **Treatment-resistant**: failure of at least two adequate SSRI trials (adequate dose for at least 8 to 12 weeks) and, ideally, adequate ERP.
- **Refractory**: failure of multiple SSRIs, clomipramine, antipsychotic augmentation and intensive CBT.
- Response is often defined as a Y-BOCS reduction of at least 35% with a clinical global improvement; partial response 25 to 35%.

### Evidence by option
| Option | Evidence |
|---|---|
| SSRI dose above licensed maximum (for example sertraline up to 400 mg) | Some evidence; specialist only, with monitoring |
| Clomipramine (oral; intravenous in specialist centres) | Effective; intravenous may help oral non-responders |
| Antipsychotic augmentation (risperidone, aripiprazole) | Best evidence; about one in three respond; better with tics |
| Haloperidol augmentation | Effective in tic-related OCD; more side effects |
| Memantine, N-acetylcysteine, topiramate, lamotrigine | Small or mixed trials |
| Ondansetron | Small trials; low dose |
| Ketamine | One small trial showed rapid but brief benefit |
| Troriluzole (glutamate modulator) | Large Phase 3 adjunctive trials completed; not approved as of November 2026 |

:::clinician
### Practical points for the resistant case
- Confirm adherence (pill counts, levels for clomipramine), substances, and that ERP was real (response prevention, homework, enough sessions).
- Check for comorbid depression, bipolar disorder (SSRIs at high dose may destabilise), autism and tics.
- High-dose SSRIs: monitor sodium in the elderly, QT with citalopram and escitalopram, and bleeding risk with anticoagulants.
- Clomipramine combined with fluvoxamine raises clomipramine and lowers desmethylclomipramine: sometimes used deliberately in specialist care, with ECG and levels.
- Antipsychotic augmentation can worsen obsessions in some people (clozapine and olanzapine have been linked to emergent OCD symptoms in schizophrenia).
:::

:::widget decide
{"scene": "Ms Banerjee, 38, from Kolkata, has contamination OCD. Fluoxetine 80 mg for 14 weeks and sertraline 200 mg for 12 weeks each gave partial benefit (Y-BOCS 32 to 26). She completed 20 sessions of ERP with homework. She has no tics.", "ask": "What is the most reasonable next step?", "choices": [{"label": "Add clonazepam for her anxiety", "verdict": "harm", "outcome": "She feels calmer for a while; the OCD is unchanged and she now struggles to taper the clonazepam.", "why": "Benzodiazepines do not treat core OCD symptoms."}, {"label": "Augment sertraline with low-dose aripiprazole or risperidone for 6 to 8 weeks with metabolic monitoring, or switch to clomipramine; continue ERP", "verdict": "best", "outcome": "With aripiprazole 5 mg her Y-BOCS falls to 17; she resumes cooking for her family.", "why": "After two adequate SSRI trials and ERP, augmentation or clomipramine are the evidence-based next steps."}, {"label": "Refer immediately for neurosurgery", "verdict": "harm", "outcome": "She is not eligible; augmentation and clomipramine have not been tried.", "why": "Surgery is reserved for refractory, long-standing, severe OCD."}]}
:::

:::widget receptor
{"receptor": "D2", "title": "Why low-dose aripiprazole can augment an SSRI", "caption": "Aripiprazole is a partial agonist at D2 receptors: it lowers dopamine signalling where it is high and supports it where it is low. Compare it with a full antagonist such as risperidone at higher doses."}
:::

:::recall
1. Why may OCD need higher SSRI doses for longer? || OFC serotonin autoreceptors seem to desensitise only with higher, longer exposure.
2. Define treatment-resistant OCD. || Failure of at least two adequate SSRI trials (and ideally adequate ERP).
3. Which augmentation has the best evidence, and in whom is it better? || Low-dose risperidone or aripiprazole; better with tics.
:::

:::mcq
Q: Which statement about benzodiazepines in OCD is accurate?
- They are first-line
- *They do not treat core obsessions and compulsions and may hinder ERP
- They work better than SSRIs
- They are needed in all cases
> They have no role in core OCD treatment.
:::

## 3.3 Neuromodulation and neurosurgery [core][advanced]
For a small group with severe, disabling OCD despite everything, brain-based treatments are options.

:::widget figure
{"id": "horizontal-section", "focus": ["alic"]}
:::

:::widget figure
{"id": "tms"}
:::

| Treatment | What it is | Evidence and status |
|---|---|---|
| Deep TMS | Magnetic pulses through a special H-coil over the medial prefrontal cortex and ACC, often during symptom provocation | FDA-cleared for OCD in 2018 after a sham-controlled trial; modest benefit; widely available in Indian centres |
| rTMS (figure-of-eight coil) | Targets supplementary motor area or OFC | Mixed results across trials |
| Deep brain stimulation (DBS) | Implanted electrodes, usually in the ventral capsule and ventral striatum or nearby targets; adjustable and reversible | About half to two-thirds respond in open studies; FDA humanitarian device exemption since 2009 |
| Ablative surgery | Small lesions: anterior capsulotomy (radiofrequency or gamma knife), anterior cingulotomy | About half respond in long-term series; irreversible; risks include apathy and cognitive change |
| ECT | Electroconvulsive therapy | Not effective for core OCD; may help comorbid severe depression |

:::widget brainmap
{"title": "Where brain treatments for OCD are aimed", "focus": ["prefrontal", "basal-ganglia", "thalamus", "frontal"], "notes": {"prefrontal": "Deep TMS is aimed at the medial prefrontal cortex and anterior cingulate, usually while symptoms are provoked.", "basal-ganglia": "DBS electrodes sit in the ventral capsule and ventral striatum, a hub in the loop between cortex, striatum and thalamus.", "thalamus": "The loop returns through the thalamus to the cortex. Treatments try to quieten this overactive circuit.", "frontal": "The orbitofrontal cortex is overactive at rest and during symptoms, and settles with successful treatment."}, "caption": "All these treatments aim at one overactive loop: orbitofrontal and cingulate cortex, striatum, thalamus, and back to cortex."}
:::

### Who is considered for surgery
Typical criteria: severe OCD (for example Y-BOCS 28 or more) for at least five years; failure of several SSRIs including clomipramine, antipsychotic augmentation and adequate intensive CBT; capacity to consent; no active substance misuse or severe personality disorder that would prevent follow-up; and review by a multidisciplinary panel.

:::note The law in India
Under the Mental Healthcare Act 2017, psychosurgery may be performed only with the person's informed consent and the approval of the Mental Health Review Board (section 96).
:::

:::widget reveal
{"prompt": "Why is DBS often preferred over ablative surgery when both are possible?", "answer": "DBS is adjustable and reversible: settings can be tuned, and the device can be turned off or removed if it causes harm. A lesion is permanent. DBS, however, needs ongoing programming, battery changes and specialist follow-up, which are costly and not available everywhere, so ablation remains an option, especially where follow-up is hard."}
:::

:::recall
1. Which neuromodulation treatment received FDA clearance for OCD in 2018? || Deep TMS with an H-coil.
2. Where are DBS electrodes usually placed for OCD? || Ventral capsule and ventral striatum (or nearby targets).
3. Give three typical criteria for OCD neurosurgery. || Severe (Y-BOCS around 28 or more), long duration (around 5 years), failure of medicines including clomipramine and augmentation, failure of adequate CBT, informed consent.
4. What does the Mental Healthcare Act 2017 require for psychosurgery? || Informed consent and Mental Health Review Board approval.
:::

:::mcq
Q: ECT in OCD is best described as:
- First-line for severe OCD
- *Not effective for core OCD, though it may help severe comorbid depression
- The treatment of choice for contamination OCD
- Better than ERP
> Neuromodulation for OCD means TMS, DBS or ablation, not ECT.
:::

## 3.4 New lenses and research frontiers [core][advanced]
### Dimensions, not only categories
- OCD symptoms cluster into **dimensions** (contamination and cleaning, harm and checking, symmetry and ordering, unacceptable thoughts, hoarding). A person can be high on several. Dimensions differ in heritability, imaging correlates and treatment response (hoarding responds least to standard OCD treatment, which is one reason it became its own disorder).
- **HiTOP** places OCD within internalising, near the fear subfactor, with some links to the thought disorder spectrum, especially at poor insight.
- **RDoC** frames OCD through **cognitive systems** (cognitive control, habit) and **negative valence** (potential threat), consistent with habit and error-monitoring research.

### Beliefs that matter
The Obsessive Compulsive Cognitions Working Group identified six belief domains: inflated responsibility, overestimation of threat, overimportance of thoughts, need to control thoughts, perfectionism, and intolerance of uncertainty. Not all people with OCD hold them strongly, and some subgroups are driven more by incompleteness than by fear.

:::widget sort
{"prompt": "Which belief domain does each thought show?", "buckets": ["Responsibility or threat", "Importance or control of thoughts", "Perfectionism or uncertainty"], "items": [{"text": "'If I don't check the gas, a fire will be my fault.'", "bucket": 0}, {"text": "'Having a thought about hitting someone means I might do it.'", "bucket": 1, "why": "Thought-action fusion: treating a thought as morally equal to, or likely to cause, the act."}, {"text": "'I must get rid of this thought or I'll go mad.'", "bucket": 1}, {"text": "'The books must line up exactly, or it feels wrong.'", "bucket": 2}, {"text": "'Germs on the bus will almost certainly make me ill.'", "bucket": 0, "why": "Overestimation of threat."}, {"text": "'I can't rest until I'm 100 percent sure I locked the door.'", "bucket": 2, "why": "Intolerance of uncertainty."}]}
:::

### Culture-bound and related presentations
- **Koro** (fear that the genitals are retracting into the body and will cause death) has occurred in epidemics in Assam and West Bengal, and in South-East Asia. DSM-5-TR lists it under other specified obsessive-compulsive and related disorders.
- **Jikoshu-kyofu** (Japan), a fear of having an offensive body odour, overlaps with olfactory reference disorder.
- **Dhat**-related concerns (loss of semen causing weakness) are better seen as a cultural concept of distress; they may sit alongside depression, anxiety or obsessional doubts.

### Research frontiers as of November 2026
| Area | Status |
|---|---|
| Psilocybin | A small randomised trial (15 adults with treatment-resistant OCD, reported 2026) found weekly high doses reduced Y-BOCS more than an active placebo over four weeks; numbers are far too small to guide practice |
| Glutamate modulators | Troriluzole completed large Phase 3 adjunctive trials; no glutamate drug is approved for OCD |
| Digital and remote ERP | Video-delivered and app-supported ERP show outcomes close to in-person ERP; useful where specialists are scarce |
| Intensive and concentrated ERP | Four-day concentrated treatment (the Bergen model) shows high response rates in Norwegian and international studies |
| Closed-loop DBS | Devices that sense brain activity and stimulate only when needed are in early trials |
| Genetics | 30 loci (2025); polygenic scores are not clinically useful yet |

:::widget decide
{"scene": "A parent in Bengaluru reads that 'magic mushrooms cure OCD' and asks whether her 22-year-old son, who has had partial benefit from sertraline and some ERP, should try them.", "ask": "What is the most accurate advice?", "choices": [{"label": "'Yes, the research proves it works.'", "verdict": "harm", "outcome": "He buys mushrooms online, takes an unknown dose, panics and is brought to emergency.", "why": "The evidence comes from tiny, carefully monitored trials; it is not proven, not approved, and illegal in India."}, {"label": "Explain that early trials are small and promising but unproven, that psilocybin is illegal and unregulated outside research, and discuss proven next steps: optimising the SSRI dose, intensive ERP, and augmentation", "verdict": "best", "outcome": "They choose intensive ERP and a higher sertraline dose; his Y-BOCS falls meaningfully.", "why": "Honest weighing of evidence, with a clear path to effective treatment now."}, {"label": "'Never ask about such things.'", "verdict": "ok", "outcome": "She stops asking you and relies on social media.", "why": "Dismissal loses trust and leaves her without accurate information."}]}
:::

:::recall
1. Name four OCD symptom dimensions. || Contamination and cleaning; harm and checking; symmetry and ordering; unacceptable thoughts (also hoarding).
2. Name the six belief domains of the OCCWG. || Responsibility, threat, importance of thoughts, control of thoughts, perfectionism, intolerance of uncertainty.
3. What is koro? || Fear of genital retraction leading to death; culture-bound; epidemics in Assam and West Bengal.
4. What is the evidence status of psilocybin for OCD as of late 2026? || Very small trials; promising but unproven; not approved.
:::

:::mcq
Q: Which OCD symptom dimension responds least to standard SSRI and ERP treatment, supporting its separate classification?
- Contamination
- Checking
- *Hoarding
- Symmetry
> Hoarding became a separate disorder in DSM-5.
:::
`;
