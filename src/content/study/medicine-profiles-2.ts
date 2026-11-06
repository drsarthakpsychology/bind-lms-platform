/* Module · Medicines one by one, Part II (Beginner level). Original text written for VIBHA School of Psychology. */
export const part2 = String.raw`
# Part II · Beginner: profiles, class by class

## 2.1 SSRIs and SNRIs, profile by profile [core][beginner]
You met the idea of reuptake at the Starting level. Here each medicine gets its own profile: what makes it different from its neighbours, at the receptor level and at the bedside.

:::widget synapse
{"drug": "ssri", "caption": "An SSRI blocks the serotonin transporter (SERT). Serotonin stays longer in the synapse. Press 'time passes' to see why the mood benefit lags behind the chemical change: autoreceptors on the sending neuron gradually desensitise, so serotonin release rises, and downstream gene changes build up over the following weeks."}
:::

### What all SSRIs share
- **Target**: the serotonin transporter, blocked within hours of the first dose.
- **Uses**: depression, panic disorder, generalised and social anxiety, OCD (usually at higher doses), PTSD, bulimia (fluoxetine), premenstrual dysphoric disorder.
- **Early side effects**: nausea, loose stools, headache, jitteriness, sleep change. Most settle within the first couple of weeks.
- **Lasting side effects**: sexual problems (delayed orgasm, low desire), sweating, emotional blunting in some.
- **Serious but uncommon**: low sodium in older people, bleeding (especially with NSAIDs or anticoagulants, because platelets need serotonin to clump), serotonin toxicity with other serotonergic drugs, switch to mania in bipolar disorder, increased suicidal thinking early in treatment in people under about 25.

### What makes each one different
| Medicine | Its distinctive point | Clinical consequence |
|---|---|---|
| **Sertraline** | Weak dopamine reuptake blockade at higher doses; few interactions | First choice in heart disease; well studied in pregnancy and breastfeeding; loose stools common |
| **Escitalopram** | The most selective; also binds an allosteric site on SERT | Usually well tolerated; dose-related QT prolongation, so respect the maximum, lower in older adults |
| **Fluoxetine** | Very long half-life (active metabolite norfluoxetine); strong CYP2D6 inhibition; mild 5-HT2C antagonism | Few discontinuation symptoms; can be activating; many interactions; first choice in young people; bulimia at 60 mg |
| **Paroxetine** | Anticholinergic; strong CYP2D6 inhibitor; short half-life | Worst discontinuation symptoms; more weight gain and sedation; avoided in pregnancy |
| **Fluvoxamine** | Strong CYP1A2 and CYP2C19 inhibition; sigma-1 binding | OCD; raises clozapine, olanzapine, theophylline and caffeine levels dangerously |
| **Citalopram** | Racemic mixture; dose-related QT prolongation | Maximum doses lowered, especially in older adults |

### SNRIs: adding noradrenaline
**Venlafaxine** blocks serotonin reuptake at low doses and adds noradrenaline reuptake as the dose rises. **Duloxetine** blocks both from the start. **Desvenlafaxine** is venlafaxine's active metabolite. The noradrenaline action helps some people with pain, fatigue and severe depression, and brings **sweating, raised blood pressure and pulse**, and (for venlafaxine) severe discontinuation symptoms.

:::widget synapse
{"drug": "snri", "caption": "An SNRI blocks both the serotonin and the noradrenaline transporters. In the prefrontal cortex, dopamine is also cleared by the noradrenaline transporter, so SNRIs raise prefrontal dopamine too. Watch blood pressure, especially with venlafaxine at higher doses."}
:::

:::widget sort
{"prompt": "Which SSRI or SNRI fits each patient best?", "buckets": ["Sertraline", "Fluoxetine", "Fluvoxamine is a problem here", "Duloxetine"], "items": [{"text": "A 58-year-old man with depression six months after a heart attack", "bucket": 0}, {"text": "A 15-year-old with moderate to severe depression after psychological therapy alone has not helped", "bucket": 1}, {"text": "A man stable on clozapine who now needs an SSRI for OCD symptoms", "bucket": 2, "why": "Fluvoxamine can raise clozapine levels several-fold through CYP1A2 inhibition; choose another SSRI or monitor levels very closely."}, {"text": "A woman with depression and painful diabetic neuropathy, normal liver tests, no heavy drinking", "bucket": 3}, {"text": "A woman who keeps forgetting doses and gets dizzy and irritable when she misses one", "bucket": 1, "why": "The long half-life protects against discontinuation symptoms."}, {"text": "A breastfeeding mother with postnatal depression", "bucket": 0}]}
:::

:::widget decide
{"scene": "Mrs Pillai, 79, from Thrissur, recently started escitalopram 20 mg for depression. She also takes a thiazide diuretic for blood pressure. Her daughter says she has become confused, unsteady and nauseated over the past few days.", "ask": "What is the most important first step?", "choices": [{"label": "Increase escitalopram because the depression is not yet better", "verdict": "harm", "outcome": "She has a seizure that night. Her sodium is found to be 118 mmol/L.", "why": "Confusion, unsteadiness and nausea in an older woman on an SSRI and a thiazide suggest hyponatraemia from SIADH. The dose is also above the usual maximum for her age."}, {"label": "Check her sodium urgently, stop or reduce the SSRI depending on the result, review the diuretic, and remember that 10 mg is the usual maximum for escitalopram over 65", "verdict": "best", "outcome": "Her sodium is 122 mmol/L. With fluid restriction, stopping escitalopram and changing her diuretic, she recovers. Mirtazapine is later chosen for her depression.", "why": "SSRI-related hyponatraemia is most common in older women, in the first weeks, and with diuretics. Check sodium before and within the first month in at-risk people."}, {"label": "Add a sleeping tablet for her confusion", "verdict": "harm", "outcome": "She falls and fractures her wrist.", "why": "Sedatives worsen confusion and falls; the cause must be found."}]}
:::

:::clinician
### Profiles in depth
- **Sertraline** (Serta, Daxid): 50 mg start (25 mg in panic and older adults), 50 to 200 mg. Half-life about 26 hours; weak CYP2D6 inhibition above 150 mg. Studied after myocardial infarction and in acute coronary syndromes (no excess cardiac events); low infant serum levels in breastfeeding.
- **Escitalopram** (Nexito, Stalopam): 10 mg (5 mg in panic or over 65); maximum 20 mg (10 mg over 65 or in hepatic impairment). QTc rises about 4 to 7 milliseconds at 20 mg. Substrate of CYP2C19 (poor metabolisers have higher levels; omeprazole raises levels).
- **Fluoxetine** (Fludac, Prodep): 20 mg (10 mg in youth or anxiety), up to 60 mg (bulimia 60 mg). Fluoxetine half-life 1 to 4 days, norfluoxetine 4 to 16 days; non-linear kinetics; potent CYP2D6 and moderate CYP2C19 and 3A4 inhibition (raises tricyclics, risperidone, aripiprazole, beta-blockers, codeine and tamoxifen activation is reduced). 5-week washout before an MAOI.
- **Paroxetine** (Pexep): 20 mg, up to 50 mg; strongest SERT affinity; M1 antagonism; mechanism-based CYP2D6 inhibition; SERT and also nitric oxide synthase inhibition (sexual dysfunction). Association with cardiac malformations in first-trimester exposure led to advice to avoid in pregnancy.
- **Fluvoxamine** (Fluvoxin): 50 mg at night, up to 300 mg (doses above 150 mg divided); potent CYP1A2 inhibitor (clozapine levels can rise 5 to 10-fold), also 2C19 and 3A4.
- **Venlafaxine XR** (Venlor XR, Veniz XR): 75 mg, up to 225 mg (375 mg specialist); serotonin reuptake dominant below about 150 mg, noradrenaline added above; dose-dependent hypertension (check blood pressure); toxic in overdose (more than SSRIs); worst discontinuation of the class. Substrate of CYP2D6.
- **Duloxetine** (Duvanta, Dulane): 60 mg (30 mg start), up to 120 mg; licensed for diabetic neuropathic pain, fibromyalgia and stress urinary incontinence in some countries; avoid in hepatic impairment and heavy alcohol use (hepatotoxicity); moderate CYP2D6 inhibitor; substrate of CYP1A2 (fluvoxamine contraindicated).
- **Desvenlafaxine** (Desvenlor): 50 mg daily; little CYP metabolism; renal dose adjustment.
- **Class pharmacology**: SERT occupancy reaches about 80% at minimum effective doses of all SSRIs, which explains the flat dose-response for depression beyond the starting dose in most trials; anxiety disorders and OCD may benefit from higher doses.
:::

:::recall
1. Which SSRI is often chosen after a heart attack? || Sertraline.
2. Which SSRI has the longest half-life, and what does that mean clinically? || Fluoxetine; fewer discontinuation symptoms but long washout and lasting interactions.
3. Which SSRI has the worst discontinuation symptoms? || Paroxetine.
4. Why is fluvoxamine dangerous with clozapine? || It strongly inhibits CYP1A2 and can raise clozapine levels several-fold.
5. What extra side effects come with the noradrenaline action of SNRIs? || Sweating, raised blood pressure and pulse.
:::

:::mcq
Q: An older woman on an SSRI and a thiazide becomes confused and nauseated. The first test should be:
- Thyroid function
- *Serum sodium
- Brain MRI
- Liver biopsy
> SIADH-related hyponatraemia.

Q: Which SSRI is the strongest CYP2D6 inhibitor along with fluoxetine?
- Sertraline
- Escitalopram
- *Paroxetine
- Citalopram
> Paroxetine and fluoxetine raise 2D6 substrates.
:::

## 2.2 The other antidepressants [core][beginner]
Not every antidepressant works by blocking reuptake. Several act on receptors, which gives them different side effects and makes them useful when SSRIs fail or do not suit.

:::widget flow
{"title": "How the antidepressant classes differ in their first action", "layout": "tree", "nodes": [{"id": "root", "label": "Antidepressants", "detail": "Grouped by their first action in the brain."}, {"id": "reup", "label": "Block reuptake", "detail": "Keep the messenger in the synapse longer.", "parent": "root"}, {"id": "ssri", "label": "SSRIs", "detail": "Serotonin transporter only: sertraline, escitalopram, fluoxetine, paroxetine, fluvoxamine.", "parent": "reup"}, {"id": "snri", "label": "SNRIs", "detail": "Serotonin and noradrenaline transporters: venlafaxine, duloxetine, desvenlafaxine.", "parent": "reup"}, {"id": "ndri", "label": "NDRI", "detail": "Noradrenaline and dopamine transporters: bupropion. No serotonin action, so no sexual side effects.", "parent": "reup"}, {"id": "tca", "label": "Tricyclics", "detail": "Serotonin and noradrenaline reuptake plus many receptor blocks (H1, M1, alpha-1) and sodium channel block: amitriptyline, imipramine, clomipramine, nortriptyline.", "parent": "reup"}, {"id": "rec", "label": "Act on receptors", "detail": "Block or stimulate receptors rather than pumps.", "parent": "root"}, {"id": "mirt", "label": "Mirtazapine", "detail": "Blocks alpha-2 brakes (more serotonin and noradrenaline released), and 5-HT2A, 5-HT2C, 5-HT3 and H1 receptors.", "parent": "rec"}, {"id": "traz", "label": "Trazodone", "detail": "Blocks 5-HT2A strongly, with weak reuptake block, H1 and alpha-1 blockade; sedating.", "parent": "rec"}, {"id": "ago", "label": "Agomelatine", "detail": "Stimulates melatonin MT1 and MT2 receptors and blocks 5-HT2C.", "parent": "rec"}, {"id": "vort", "label": "Vortioxetine", "detail": "Blocks SERT and acts on several serotonin receptors (multimodal).", "parent": "rec"}, {"id": "enz", "label": "Block an enzyme", "detail": "Stop monoamines being broken down.", "parent": "root"}, {"id": "maoi", "label": "MAOIs", "detail": "Monoamine oxidase inhibitors: phenelzine, tranylcypromine (irreversible), moclobemide (reversible, MAO-A).", "parent": "enz"}, {"id": "glu", "label": "Glutamate and GABA", "detail": "Fast-acting newer agents: esketamine (NMDA antagonist), zuranolone and brexanolone (GABA-A neurosteroids). See the Advanced level.", "parent": "root"}], "caption": "Tap each box. Classes that share a first action share most side effects."}
:::

### Profiles
- **Mirtazapine**: sedating and appetite-raising at lower doses (H1 blockade dominates); little nausea or sexual dysfunction (5-HT2 and 5-HT3 blockade). Useful in older adults, poor sleep, weight loss, and in people who cannot tolerate SSRI sexual effects. Drawbacks: weight gain, daytime sleepiness.
- **Bupropion**: increases noradrenaline and dopamine; activating; **no sexual dysfunction, no weight gain**; also helps smoking cessation. Lowers the seizure threshold (avoid in epilepsy, eating disorders with purging, alcohol or benzodiazepine withdrawal).
- **Trazodone**: mainly used at low doses for sleep; at higher doses an antidepressant. Can cause dizziness on standing and, rarely, priapism.
- **Vortioxetine**: SSRI-like with additional receptor effects; nausea early; low sexual dysfunction compared with SSRIs; may help cognitive symptoms of depression.
- **Agomelatine**: resets the body clock; good for sleep; no sexual dysfunction; needs **liver tests**.
- **Tricyclics** (amitriptyline, imipramine, clomipramine, nortriptyline): effective, especially in severe and melancholic depression and for pain, but anticholinergic, sedating, cause postural low blood pressure, and are **dangerous in overdose** because they block cardiac sodium channels.
- **MAOIs**: powerful for some atypical and resistant depressions, but need a **low-tyramine diet** (aged cheese, cured meats, soy sauce, some fermented foods) and careful avoidance of many medicines, because of the risk of hypertensive crisis and serotonin toxicity. Moclobemide is reversible and much safer.

:::widget synapse
{"drug": "maoi", "caption": "An MAOI blocks monoamine oxidase, the enzyme that breaks down serotonin, noradrenaline and dopamine inside nerve endings. Levels of all three rise. MAO in the gut also breaks down dietary tyramine; blocking it lets tyramine reach the blood and release noradrenaline, which can push blood pressure dangerously high."}
:::

:::widget sort
{"prompt": "Which antidepressant suits each person best?", "buckets": ["Mirtazapine", "Bupropion", "Avoid tricyclics here"], "items": [{"text": "A thin 80-year-old with depression, poor sleep and loss of appetite", "bucket": 0}, {"text": "A man who stopped two SSRIs because of sexual side effects and wants to quit smoking; no seizures", "bucket": 1}, {"text": "A 19-year-old student with depression and a recent paracetamol overdose", "bucket": 2, "why": "Tricyclics are lethal in overdose; choose a safer option and limit supplies."}, {"text": "A woman with depression and obesity who fears weight gain; no eating disorder or seizures", "bucket": 1}, {"text": "A man with depression and a recent heart attack with conduction problems", "bucket": 2, "why": "Tricyclics slow cardiac conduction and are risky after a heart attack."}, {"text": "A woman with depression and insomnia who cannot tolerate SSRI nausea", "bucket": 0}]}
:::

:::widget decide
{"scene": "Mr Shah, 45, from Surat, is on phenelzine (an MAOI) for resistant depression, prescribed by a specialist. He has a cold and asks a chemist for a 'strong cough syrup'. The chemist gives him a syrup containing dextromethorphan and a decongestant.", "ask": "What is the danger, and what should have happened?", "choices": [{"label": "No danger; cough syrups are safe with antidepressants", "verdict": "harm", "outcome": "Within hours he becomes agitated, sweaty, feverish, with jerking muscles and a very high blood pressure. He is admitted to intensive care.", "why": "Dextromethorphan (serotonergic) with an MAOI can cause serotonin toxicity, and decongestants (sympathomimetics) can cause a hypertensive crisis."}, {"label": "He should have carried an MAOI warning card, checked every new medicine with a pharmacist or doctor, and used safe alternatives such as steam, saline and paracetamol", "verdict": "best", "outcome": "With the card, the chemist recognises the risk and offers safe symptomatic care.", "why": "People on MAOIs need written lists of forbidden foods and medicines (including many cough and cold remedies, tramadol, pethidine, triptans, other antidepressants and stimulants)."}, {"label": "Halve the cough syrup dose", "verdict": "harm", "outcome": "The reaction still occurs.", "why": "The combination is contraindicated, not dose-dependent in a safe way."}]}
:::

:::clinician
### Dosing and depth (Indian brands as examples)
| Medicine | Dose | Receptor point | Watch |
|---|---|---|---|
| Mirtazapine (Mirtaz, Mirnite) | 7.5 to 15 mg at night, up to 45 mg | Alpha-2 antagonism disinhibits noradrenaline and serotonin release; H1 dominates at low doses, so lower doses can be more sedating | Weight, lipids, rare neutropenia, restless legs |
| Bupropion SR or XL (Bupron SR) | 150 mg in the morning, up to 300 mg (SR 150 mg twice daily) | NET and DAT inhibition (weak, metabolite hydroxybupropion important); strong CYP2D6 inhibitor | Seizure risk about 0.1% at 300 mg, higher above 450 mg; insomnia; raised blood pressure |
| Trazodone (Trazonil) | 25 to 100 mg for sleep; 150 to 300 mg (up to 400 mg) for depression | 5-HT2A antagonism at low doses; SERT block at higher doses (SARI) | Orthostasis, priapism (seek help if erection lasts over 4 hours), QT in overdose |
| Vortioxetine | 10 mg (5 mg over 65), up to 20 mg | SERT block, 5-HT3, 5-HT7 and 5-HT1D antagonism, 5-HT1B partial agonism, 5-HT1A agonism | Nausea; CYP2D6 substrate |
| Agomelatine | 25 mg at bedtime, up to 50 mg | MT1 and MT2 agonism, 5-HT2C antagonism | Liver tests at baseline, 3, 6, 12 and 24 weeks and after dose rises; avoid with fluvoxamine (CYP1A2) |
| Amitriptyline (Tryptomer) | 25 mg at night, 75 to 150 mg for depression; 10 to 50 mg for pain | SERT and NET block; H1, M1, alpha-1 antagonism; sodium channel block | ECG if cardiac risk or over 50; overdose of about 10 to 20 times the daily dose can be fatal |
| Clomipramine (Clonil) | 25 mg, up to 150 to 250 mg | Most serotonergic tricyclic | OCD; seizures at high dose; anticholinergic |
| Nortriptyline (Sensival) | 25 to 50 mg, up to 150 mg | More noradrenergic; fewer anticholinergic effects | Plasma level window about 50 to 150 ng/mL |
| Moclobemide (Rimoc) | 150 mg twice daily, up to 600 mg | Reversible MAO-A inhibitor; tyramine is displaced from the enzyme | Fewer dietary restrictions at usual doses |
| Phenelzine, tranylcypromine | Specialist use | Irreversible; MAO-A and MAO-B | Strict diet and drug lists; 2-week washout after stopping before other antidepressants |

**Tricyclic overdose**: QRS widening above 100 milliseconds predicts seizures and above 160 predicts ventricular arrhythmia; treat with sodium bicarbonate, airway support and seizure control; avoid physostigmine and class Ia antiarrhythmics.
:::

:::recall
1. Why does mirtazapine cause little sexual dysfunction or nausea? || It blocks 5-HT2 and 5-HT3 receptors rather than flooding them.
2. Which antidepressant has no sexual side effects but lowers the seizure threshold? || Bupropion.
3. Why are tricyclics dangerous in overdose? || They block cardiac sodium channels, causing arrhythmias and seizures.
4. What diet is needed with irreversible MAOIs, and why? || A low-tyramine diet, to avoid hypertensive crisis.
5. Which antidepressant needs regular liver tests? || Agomelatine (also duloxetine caution in liver disease).
:::

:::mcq
Q: A patient on an irreversible MAOI eats a large amount of aged cheese and develops a pounding headache and very high blood pressure. The cause is:
- Serotonin syndrome
- *Tyramine-induced hypertensive crisis
- Neuroleptic malignant syndrome
- Hyponatraemia
> Gut MAO normally breaks down tyramine.

Q: Which antidepressant is most suitable for an underweight older adult with insomnia?
- Bupropion
- Fluoxetine
- *Mirtazapine
- Venlafaxine
> Sedation and appetite gain help here.
:::

## 2.3 Antipsychotics: pathways and profiles [core][beginner]
Antipsychotics all block, or partly stimulate, **dopamine D2 receptors**. The brain has several dopamine pathways, and what happens in each explains both the benefits and the side effects.

:::widget brainmap
{"title": "Four dopamine pathways and what D2 blockade does in each", "focus": ["basal-ganglia", "prefrontal", "hypothalamus", "amygdala"], "notes": {"amygdala": "Mesolimbic pathway (from the midbrain to the nucleus accumbens and limbic areas): overactivity is linked with hallucinations and delusions. Blocking D2 here treats positive symptoms, and can flatten reward and motivation.", "prefrontal": "Mesocortical pathway: dopamine here is thought to be low in schizophrenia, linked with negative and cognitive symptoms. Blocking D2 here may worsen them; 5-HT2A blockade may release some dopamine.", "basal-ganglia": "Nigrostriatal pathway (substantia nigra to striatum): controls movement. Blocking D2 here causes stiffness, tremor, akathisia, dystonia and, long term, tardive dyskinesia.", "hypothalamus": "Tuberoinfundibular pathway (hypothalamus to pituitary): dopamine normally stops prolactin release. Blocking D2 raises prolactin: breast changes, stopped periods, sexual problems, bone loss."}, "caption": "Tap each highlighted area. One action, D2 blockade, gives very different effects depending on where it happens."}
:::

:::widget pathways
{"system": "dopamine", "title": "What D2 blockade does in each pathway, and what 5-HT2A blockade adds", "caption": "Turn on the D2 blocker and see the effect in each of the four pathways. Then add serotonin 2A blockade, as most second-generation drugs do, and watch which unwanted effects ease."}
:::

### First-generation and second-generation

:::widget journey
{"drug": "paliperidone palmitate", "target": "dopamine D2 and serotonin 2A receptors in the striatum, limbic system and cortex", "routes": ["depot", "oral"], "notes": {"slow": "The palmitate ester dissolves slowly from the muscle over weeks, so one injection lasts a month (longer forms last three or six months).", "out": "Paliperidone is cleared mostly by the kidneys, so doses are reduced in kidney disease."}, "caption": "Compare the depot route with the tablet route. The depot gives steady levels without daily tablets, but side effects also fade slowly."}
:::

- **First-generation** (typical): haloperidol, chlorpromazine, fluphenazine, trifluoperazine, zuclopenthixol, flupentixol. Strong D2 blockade, more movement side effects and prolactin rise.
- **Second-generation** (atypical): risperidone, paliperidone, olanzapine, quetiapine, aripiprazole, ziprasidone, lurasidone, amisulpride, asenapine, cariprazine, brexpiprazole, and clozapine. Most add **5-HT2A blockade** or are **partial agonists**, giving fewer movement side effects at usual doses, but some cause more **weight gain and metabolic problems**.

The labels hide large differences **within** each group. It is more useful to know each medicine's profile.

| Medicine | Most notable for | Main problem |
|---|---|---|
| Haloperidol | Strong, quick, little sedation | Movement side effects, prolactin |
| Chlorpromazine | Very sedating | Low blood pressure, anticholinergic, sun sensitivity |
| Risperidone | Effective, inexpensive, also a long-acting injection | Prolactin rise, movement effects above moderate doses |
| Paliperidone | Risperidone's active metabolite; monthly to six-monthly injections | Prolactin |
| Olanzapine | Very effective, sedating | Weight gain, diabetes, lipids |
| Quetiapine | Sedating, few movement effects, used in bipolar depression | Sedation, low blood pressure, weight |
| Aripiprazole | Partial agonist; little weight gain or prolactin | Restlessness (akathisia), nausea |
| Amisulpride | Selective D2 and D3 blocker; little sedation | Very high prolactin; renal dose adjustment |
| Lurasidone | Little weight gain; bipolar depression | Must be taken with food; akathisia |
| Clozapine | The only proven medicine for treatment-resistant schizophrenia | Low white cells, myocarditis, seizures, constipation (section 2.4) |

:::widget curve
{"kind": "dose-response", "title": "Full agonist, partial agonist and antagonist at the same receptor", "caption": "Slide the dose. A full agonist rises to the top; a partial agonist plateaus partway (its ceiling); an antagonist produces no response on its own but shifts the agonist's curve to the right. Aripiprazole and buprenorphine are partial agonists: there is a built-in ceiling on how much they can stimulate."}
:::

:::widget sort
{"prompt": "Which antipsychotic suits each person best?", "buckets": ["Aripiprazole", "Olanzapine is a poor choice here", "Quetiapine", "Avoid typicals here"], "items": [{"text": "A 24-year-old woman with first-episode psychosis, obese, with a family history of diabetes", "bucket": 1, "why": "Olanzapine has the highest metabolic risk; aripiprazole or lurasidone are better choices."}, {"text": "A woman on risperidone whose periods have stopped and who wants to conceive", "bucket": 0, "why": "Aripiprazole lowers prolactin and is a useful switch or add-on."}, {"text": "A man with Parkinson's disease who has developed hallucinations", "bucket": 2, "why": "Low-dose quetiapine (or clozapine, or pimavanserin where available) causes little worsening of parkinsonism."}, {"text": "An older man with Lewy body dementia and frightening hallucinations", "bucket": 3, "why": "Severe neuroleptic sensitivity; cholinesterase inhibitors first, then very cautious quetiapine if unavoidable."}, {"text": "A woman with bipolar depression and insomnia", "bucket": 2}, {"text": "A young man with schizophrenia who has gained 15 kg on olanzapine", "bucket": 0}]}
:::

:::widget decide
{"scene": "Ravi, 19, from Pune, was given haloperidol 10 mg yesterday for acute psychosis. Today his neck has twisted to one side, his eyes are rolling upwards and he is frightened and in pain.", "ask": "What is happening and what do you do?", "choices": [{"label": "Acute dystonia: give an anticholinergic (for example procyclidine or promethazine IM, or benztropine), reassure him, and lower the haloperidol dose or switch to an antipsychotic with lower movement risk", "verdict": "best", "outcome": "Within twenty minutes of the injection the spasm eases. He is switched to a lower dose of a second-generation antipsychotic and does not have another episode.", "why": "Acute dystonia is common in young men starting high-potency antipsychotics, usually within the first days. It responds quickly to anticholinergics."}, {"label": "He is pretending; ignore it", "verdict": "harm", "outcome": "The spasm continues for hours; he refuses all future medicine.", "why": "Dystonia is a real, painful and frightening reaction; laryngeal dystonia can threaten breathing."}, {"label": "Increase haloperidol because he is distressed", "verdict": "harm", "outcome": "The dystonia worsens.", "why": "The medicine is causing the problem."}]}
:::

:::clinician
### Profiles and dosing (Indian brands as examples)
| Medicine | Usual adult dose | Notes |
|---|---|---|
| Haloperidol (Serenace) | 2 to 10 mg (first episode often 2 to 5 mg) | D2 occupancy about 75% at 2 to 5 mg; higher doses mostly add EPS |
| Risperidone (Risdone, Sizodon) | 2 to 6 mg (first episode 2 to 4 mg) | EPS dose-related above about 6 mg; LAI microspheres every 2 weeks |
| Paliperidone (Invega) | 3 to 12 mg oral; palmitate 150 mg day 1 and 100 mg day 8 (deltoid), then monthly 50 to 150 mg | Renal excretion; 3-monthly and 6-monthly forms |
| Olanzapine (Oleanz, Oliza) | 5 to 20 mg | Weight gain largest in first months; metformin can attenuate; pamoate LAI has post-injection delirium sedation syndrome (observe 3 hours) |
| Quetiapine (Qutipin, Seroquel) | 300 to 750 mg (schizophrenia); 300 mg (bipolar depression) | Sedation from H1 at low doses; norquetiapine has NET inhibition |
| Aripiprazole (Arip MT, Aripra) | 10 to 30 mg; 2.5 to 5 mg add-on for prolactin | Partial agonist (intrinsic activity about 25% to 30% of dopamine); monthly LAI 400 mg |
| Amisulpride (Sulpitac, Amazeo) | 400 to 800 mg (positive symptoms); 50 to 300 mg (negative) | Low doses block presynaptic D2 and D3 autoreceptors |
| Lurasidone (Lurasid, Latuda) | 40 to 160 mg with at least 350 kcal of food | CYP3A4 substrate (contraindicated with strong inhibitors and inducers) |
| Ziprasidone | 40 to 80 mg twice daily with food | QTc prolongation |
| Cariprazine | 1.5 to 6 mg | D3-preferring partial agonist; long-lived active metabolites (weeks) |
| Fluphenazine decanoate (Prolinate) | 12.5 to 50 mg every 2 to 4 weeks | Test dose; EPS |
| Zuclopenthixol decanoate (Clopixol) | 200 to 400 mg every 2 to 4 weeks | Acuphase (acetate) for acute disturbance in specialist settings |

**Movement side effects**: acute dystonia (hours to days; anticholinergic IM: promethazine 25 to 50 mg or procyclidine 5 to 10 mg), akathisia (days to weeks; reduce dose, propranolol 10 to 30 mg two or three times daily, mirtazapine 15 mg, benzodiazepine short term), parkinsonism (weeks; reduce dose or switch; trihexyphenidyl 2 to 6 mg, Pacitane, if needed), tardive dyskinesia (months to years; switch to clozapine or quetiapine; valbenazine and deutetrabenazine are approved in the US). Rate with Simpson-Angus, Barnes Akathisia and AIMS scales.

**Metabolic monitoring**: weight, BMI and waist at baseline, weekly for 6 weeks, at 12 weeks, then 6-monthly to yearly; blood pressure; fasting glucose or HbA1c and lipids at baseline, 12 weeks and yearly; prolactin if symptoms; ECG for QT drugs and cardiac risk.
:::

:::recall
1. Name the four dopamine pathways and the effect of D2 blockade in each. || Mesolimbic (treats positive symptoms), mesocortical (may worsen negative and cognitive symptoms), nigrostriatal (movement side effects), tuberoinfundibular (raised prolactin).
2. Which antipsychotic causes the most weight gain after clozapine? || Olanzapine.
3. Which antipsychotics raise prolactin most? || Amisulpride, risperidone, paliperidone, first-generation drugs.
4. What is acute dystonia and how is it treated? || A painful muscle spasm early in treatment; anticholinergic injection.
5. Which antipsychotic is a partial agonist and lowers prolactin? || Aripiprazole.
:::

:::mcq
Q: Raised prolactin from antipsychotics results from D2 blockade in which pathway?
- Mesolimbic
- Mesocortical
- Nigrostriatal
- *Tuberoinfundibular
> Hypothalamus to pituitary.

Q: A man on haloperidol cannot sit still, paces, and feels inner restlessness. This is:
- Acute dystonia
- *Akathisia
- Tardive dyskinesia
- Neuroleptic malignant syndrome
> Treat by lowering the dose or with propranolol.
:::

## 2.4 Clozapine in depth [core][beginner]
Clozapine is the only antipsychotic proven to work when two others have failed (**treatment-resistant schizophrenia**). It also reduces suicidal behaviour in schizophrenia and helps severe aggression. It is under-used, often because of fear of its side effects, which can be managed with careful monitoring.

:::widget flow
{"title": "Starting clozapine safely", "layout": "chain", "nodes": [{"id": "a", "label": "Confirm treatment resistance", "detail": "Two adequate trials of different antipsychotics (adequate dose, duration and adherence), with persisting symptoms."}, {"id": "b", "label": "Baseline checks", "detail": "Full blood count with neutrophils, weight, BMI, blood pressure, pulse, temperature, glucose or HbA1c, lipids, ECG; troponin and CRP baseline; bowel habit; smoking status."}, {"id": "c", "label": "Register and consent", "detail": "Register with the blood monitoring service; explain side effects, blood tests and what to report (fever, sore throat, chest pain, constipation)."}, {"id": "d", "label": "Titrate slowly", "detail": "Start with 12.5 mg once or twice on day 1, increase gradually towards a target, often 300 to 450 mg, watching pulse, blood pressure and temperature."}, {"id": "e", "label": "Monitor blood counts", "detail": "Weekly at first, then fortnightly, then monthly, according to the monitoring schedule."}, {"id": "f", "label": "Watch for myocarditis", "detail": "Mostly in the first four weeks: fever, chest pain, fast pulse, breathlessness, raised troponin or CRP. Stop and refer urgently."}, {"id": "g", "label": "Check the level", "detail": "Plasma level after a week at a steady dose if response is poor or side effects appear; usual target about 350 micrograms per litre or above."}, {"id": "h", "label": "Prevent constipation", "detail": "Ask at every visit; prescribe laxatives early. Clozapine-induced gut hypomotility can be fatal."}], "caption": "Press Play to step through. Most serious problems happen early, so the first weeks are the most closely watched."}
:::

### The serious risks
- **Neutropenia and agranulocytosis**: a fall in the white cells that fight infection, most often in the first months. Regular blood counts catch it early.
- **Myocarditis and cardiomyopathy**: heart muscle inflammation, mostly in the first weeks.
- **Constipation and bowel obstruction**: common, under-recognised, and sometimes fatal.
- **Seizures**: more likely at higher doses and levels.
- **Others**: excess saliva at night, sedation, weight gain and diabetes, fast heart rate, low blood pressure on standing, fever early on, night-time bedwetting.

:::widget decide
{"scene": "Mrs Dsouza, 36, in Mangaluru, has treatment-resistant schizophrenia. In the third week of clozapine titration she develops a fever of 38.4 degrees, a pulse of 128 and mild chest discomfort. Her neutrophil count is normal.", "ask": "What do you do?", "choices": [{"label": "Assume it is the common benign clozapine fever and continue titration", "verdict": "harm", "outcome": "Two days later she is breathless and hypotensive with heart failure from myocarditis.", "why": "Fever is common early on, but fever with tachycardia and chest symptoms in the first weeks must be treated as possible myocarditis until proven otherwise."}, {"label": "Pause clozapine, check troponin, CRP and ECG urgently, and get a medical or cardiology opinion; restart only if myocarditis is excluded", "verdict": "best", "outcome": "Her troponin and CRP are raised. Clozapine is stopped and she recovers with cardiology care. A careful later rechallenge is discussed in a specialist setting.", "why": "Early recognition of clozapine myocarditis saves lives. Baseline and weekly troponin and CRP in the first month help detect it."}, {"label": "Add paracetamol and increase clozapine faster to finish titration", "verdict": "harm", "outcome": "Her condition worsens.", "why": "Faster titration increases myocarditis risk."}]}
:::

:::clinician
### Clozapine pharmacology and practice
- **Receptor profile**: low D2 occupancy (about 40% to 60%) with fast dissociation, high 5-HT2A, H1, M1 and alpha-1 antagonism, M4 agonism (hypersalivation), 5-HT2C antagonism, and actions of its metabolite norclozapine (M1 agonism). No single receptor explains its superior efficacy.
- **Dosing** (Sizopin, Skizoril): 12.5 mg on day 1 (once or twice), increasing by 12.5 to 25 mg a day, to about 300 mg by day 14 to 21 in inpatients, slower in outpatients; usual range 300 to 600 mg; maximum 900 mg. Restart from 12.5 mg if more than 48 hours of doses are missed.
- **Levels**: target plasma clozapine at least 350 micrograms per litre (some benefit from 250); seizure risk rises above about 600 to 1,000; levels are about 30% to 50% lower in smokers; fluvoxamine, ciprofloxacin and oral contraceptives raise levels; infection and inflammation raise levels (reduce dose during fever).
- **Haematology**: thresholds and schedules follow the registry (for example in the UK, weekly for 18 weeks, fortnightly to one year, then monthly). **Benign ethnic neutropenia** (common in people of African and some Middle Eastern ancestry, related to the Duffy-null phenotype) needs adjusted thresholds. Agranulocytosis risk about 0.8%, mostly in the first 18 weeks.
- **Myocarditis**: incidence about 1% or less in most countries (higher in Australia), typically days 14 to 21; monitor troponin and CRP weekly for 4 weeks.
- **Gastrointestinal hypomotility**: mortality from ileus exceeds that from agranulocytosis in some series; prescribe stimulant and osmotic laxatives proactively; avoid other anticholinergics.
- **Hypersalivation**: hyoscine 300 micrograms sucked at night, glycopyrrolate, sublingual atropine drops, or amisulpride add-on.
- **Seizures**: dose-related (about 1% to 2% at under 300 mg, up to 5% at over 600 mg); add valproate or lamotrigine if needed (avoid carbamazepine, which also suppresses the marrow).
- **Augmentation** for partial response: amisulpride or aripiprazole add-on; ECT augmentation has evidence.
:::

:::recall
1. What is clozapine's unique indication? || Treatment-resistant schizophrenia (two failed adequate trials).
2. Name four serious clozapine risks. || Agranulocytosis, myocarditis, constipation and ileus, seizures.
3. When is myocarditis most likely? || In the first weeks, especially weeks two to four.
4. Why do clozapine levels rise when someone stops smoking? || Tobacco smoke induces CYP1A2; stopping removes the induction.
5. How is clozapine hypersalivation treated? || Hyoscine at night, glycopyrrolate, atropine drops or amisulpride add-on.
:::

:::mcq
Q: A patient on clozapine has had no bowel movement for five days and has abdominal pain. The correct action is:
- Reassure; constipation is harmless
- *Treat as possible clozapine-induced gut hypomotility: urgent assessment and laxatives, and medical review
- Increase clozapine
- Add an anticholinergic
> Ileus can be fatal.

Q: Clozapine levels are typically lower in:
- Non-smokers
- *Smokers
- People taking fluvoxamine
- People with infections
> Smoking induces CYP1A2.
:::

## 2.5 Mood stabilisers, profile by profile [core][beginner]
"Mood stabiliser" covers medicines that treat or prevent mania and depression in bipolar disorder. They work in very different ways.

### Lithium

:::widget journey
{"drug": "lithium carbonate", "target": "enzymes inside neurons such as inositol monophosphatase and GSK-3, changing second messenger signalling", "routes": ["oral"], "notes": {"liver": "Lithium is not broken down by the liver at all. Liver enzyme interactions do not matter; kidney interactions matter a great deal.", "blood": "Lithium is not bound to proteins and spreads through body water, so dehydration concentrates it.", "out": "Removed almost entirely by the kidneys, handled like sodium. Anything that makes the kidneys hold on to salt raises the level."}, "caption": "Follow lithium's route and notice where the danger points are: the kidney, not the liver."}
:::

- **Uses**: preventing manic and depressive relapse in bipolar disorder; acute mania; augmenting antidepressants in resistant depression. **Reduces suicide** more than any other mood stabiliser.
- **Narrow therapeutic index**: regular blood levels are essential.
- **Long-term effects**: **kidney** (reduced concentrating ability with thirst and passing much urine; slow decline in function in some), **thyroid** (underactivity), **parathyroid** (raised calcium), weight gain, tremor, acne and psoriasis flare.
- **Toxicity** is pushed up by **dehydration, vomiting and diarrhoea, low-salt diets**, and medicines that reduce lithium excretion: **NSAIDs (ibuprofen, diclofenac), ACE inhibitors, angiotensin receptor blockers and thiazide diuretics**.

:::widget flow
{"title": "How lithium toxicity builds up", "layout": "chain", "nodes": [{"id": "a", "label": "A trigger", "detail": "Vomiting and diarrhoea, a heatwave or fever, a new NSAID painkiller, an ACE inhibitor or thiazide, or a crash diet."}, {"id": "b", "label": "Less lithium leaves the body", "detail": "The kidney handles lithium like sodium. When the body is short of salt or water, it holds on to both."}, {"id": "c", "label": "Level rises", "detail": "Even on an unchanged dose, the blood level climbs above the safe range."}, {"id": "d", "label": "Early signs", "detail": "Coarse tremor, nausea, vomiting, diarrhoea, unsteadiness, slurred speech."}, {"id": "e", "label": "Severe toxicity", "detail": "Confusion, muscle jerks, seizures, heart rhythm problems, kidney failure."}, {"id": "f", "label": "Act", "detail": "Stop lithium, check the level and kidneys urgently, give fluids, treat in hospital; dialysis for severe cases."}], "caption": "Press Play. Teach patients the triggers and the early signs, and to stop lithium and seek help if they become unwell."}
:::

### Valproate
Effective in mania and mixed states, and for prevention; available as a fast loading treatment. Side effects: weight gain, tremor, hair loss, raised liver enzymes, low platelets, polycystic ovaries. **Highly harmful in pregnancy** (birth defects and lower IQ in exposed children), so it should be avoided in girls and women who could become pregnant unless there is no alternative and effective contraception is in place.

### Carbamazepine and oxcarbazepine
Second-line for mania and prevention. Carbamazepine **speeds up the breakdown of many medicines** (including contraceptive pills, many antipsychotics and itself), lowers sodium, can lower white cells, and can cause serious skin reactions, especially in people of South and Southeast Asian ancestry who carry a particular gene variant (HLA-B*15:02).

### Lamotrigine
Best for **preventing bipolar depression**; little effect on mania. Weight-neutral and well tolerated. The main danger is a **serious rash** (Stevens-Johnson syndrome), reduced by **slow titration**. Valproate doubles lamotrigine levels; carbamazepine and some contraceptives lower them.

:::widget sort
{"prompt": "Which mood stabiliser fits each person best?", "buckets": ["Lithium", "Valproate", "Lamotrigine", "Avoid valproate"], "items": [{"text": "A 40-year-old man with bipolar I disorder, frequent manic relapses and a past suicide attempt, normal kidneys", "bucket": 0}, {"text": "A 23-year-old woman with bipolar disorder planning pregnancy next year", "bucket": 3, "why": "Valproate is highly teratogenic; consider lithium, some antipsychotics or lamotrigine depending on her pattern."}, {"text": "A woman whose bipolar disorder is mostly depressive episodes with rare mild hypomania", "bucket": 2}, {"text": "A man with acute mixed mania who needs a rapid effect, no pregnancy risk, normal liver", "bucket": 1}, {"text": "A 30-year-old woman with mania who will not use contraception", "bucket": 3}, {"text": "A man with bipolar disorder who takes daily ibuprofen for arthritis", "bucket": 1, "why": "NSAIDs raise lithium levels; if lithium is chosen, the painkiller plan must change and levels must be watched."}]}
:::

:::widget curve
{"kind": "half-life", "title": "Repeated doses build towards a steady state", "caption": "Change the half-life and the dosing interval. Each dose adds to what is left of the last, until intake and elimination balance after about four to five half-lives. This is why lithium levels are checked about five days after a dose change, and why long half-life drugs take longer to settle and to clear."}
:::

:::clinician
### Dosing and monitoring (Indian brands as examples)
| Medicine | Dose | Before | During |
|---|---|---|---|
| Lithium carbonate (Licab, Lithosun SR) | 400 mg at night (200 to 400 mg in older adults), adjust by level; usual 600 to 1,200 mg | Kidney function (eGFR), thyroid, calcium, weight, ECG if cardiac risk, pregnancy test | Level 5 to 7 days after each change, then every 3 months in the first year, then 6-monthly; kidney and thyroid 6-monthly; calcium yearly |
| Valproate (Valparin, Encorate Chrono) | 500 mg, increase to 1,000 to 2,000 mg; loading 20 to 30 mg/kg in acute mania | Liver function, full blood count, weight, pregnancy status | Liver and blood count in the first 6 months; level (50 to 125 mg/L) if needed |
| Carbamazepine (Tegretol, Mazetol) | 200 mg, increase to 400 to 1,200 mg | Full blood count, liver, sodium; **HLA-B*15:02 test in people of South and Southeast Asian ancestry** | Blood count, sodium, liver; level (4 to 12 mg/L); re-check after auto-induction at 2 to 4 weeks |
| Oxcarbazepine (Oxetol) | 300 mg, up to 1,200 to 2,400 mg | Sodium | Sodium (hyponatraemia more common than carbamazepine) |
| Lamotrigine (Lametec, Lamitor) | 25 mg daily for 2 weeks, 50 mg for 2 weeks, 100 mg, then 200 mg (halve the schedule with valproate; double with carbamazepine) | Rash history | Stop at any new rash; restart from scratch if more than 5 half-lives missed |

**Lithium practice points**: prescribe by brand (bioavailability differs); levels 12 hours post dose; about 0.6 to 0.8 mmol/L maintenance; nephrogenic diabetes insipidus (amiloride can help); hypothyroidism in about 10% to 20% (treat with levothyroxine, continue lithium); hyperparathyroidism; avoid NSAIDs, ACE inhibitors, ARBs and thiazides or monitor closely; toxicity management includes stopping lithium, fluids, and haemodialysis for severe neurotoxicity or levels above about 4.0 (or above 2.5 with renal impairment or severe symptoms). Ebstein's anomaly risk with first-trimester exposure is lower than once thought (absolute risk well under 1 in 100 in recent studies); fetal echocardiography is offered.

**Valproate**: in women and girls of childbearing potential, use only under a pregnancy prevention programme; in pregnancy, about 10% major malformations (neural tube defects, cardiac, facial clefts) and neurodevelopmental problems in up to 30% to 40%. Hyperammonaemic encephalopathy can occur with normal liver tests (check ammonia if confused). Men: some regulators advise caution around conception because of possible paternal risks.

**Carbamazepine and HLA-B*15:02**: the allele is common in Han Chinese, Thai, Malaysian and some Indian populations; carriers have markedly higher risk of Stevens-Johnson syndrome and toxic epidermal necrolysis; test before starting where available; HLA-A*31:01 is linked with DRESS in Europeans and Japanese.
:::

:::recall
1. Name four medicines that raise lithium levels. || NSAIDs, ACE inhibitors, angiotensin receptor blockers, thiazide diuretics.
2. Give four signs of lithium toxicity. || Coarse tremor, vomiting and diarrhoea, unsteadiness, slurred speech, confusion, seizures.
3. Why should valproate be avoided in women who could become pregnant? || High rates of birth defects and neurodevelopmental harm.
4. Which mood stabiliser is best for preventing bipolar depression? || Lamotrigine.
5. Which gene test should be done before carbamazepine in people of South or Southeast Asian ancestry? || HLA-B*15:02.
:::

:::mcq
Q: A woman on lithium starts diclofenac for back pain and develops coarse tremor and vomiting. The most likely cause is:
- Viral gastroenteritis
- *Lithium toxicity from reduced lithium excretion
- Hypothyroidism
- Serotonin syndrome
> NSAIDs reduce renal lithium clearance.

Q: Lamotrigine must be titrated slowly mainly to reduce the risk of:
- Weight gain
- *Serious rash such as Stevens-Johnson syndrome
- Kidney damage
- Hypothyroidism
> Risk rises with fast titration and valproate co-prescription.
:::

## 2.6 Calming, sleep and side-effect medicines [core][beginner]
### Benzodiazepines

:::widget receptor
{"receptor": "GABA-A", "title": "Benzodiazepines are not agonists", "caption": "Benzodiazepines bind beside the GABA site and make GABA work better (positive allosteric modulation); on their own they open the channel very little. Use the receptor model to compare a full agonist with this kind of booster, and see why flumazenil, an antagonist at the benzodiazepine site, reverses them."}
:::

They enhance **GABA**, the brain's main calming messenger, by making the GABA-A receptor respond more strongly. They work fast for anxiety, agitation, insomnia, alcohol withdrawal, seizures and catatonia. The price: **sedation, unsteadiness, memory problems, falls**, **dependence** with regular use over more than a few weeks, **withdrawal** (including seizures) if stopped suddenly, and **dangerous breathing suppression** when combined with alcohol or opioids.

:::widget flow
{"title": "How regular benzodiazepine use becomes dependence", "layout": "cycle", "nodes": [{"id": "a", "label": "Anxiety or insomnia", "detail": "A real problem, often at a stressful time."}, {"id": "b", "label": "Benzodiazepine taken", "detail": "Quick relief; the person feels calm or sleeps."}, {"id": "c", "label": "Brain adapts", "detail": "GABA-A receptors adapt (tolerance). The same dose works less well."}, {"id": "d", "label": "Between-dose rebound", "detail": "As the dose wears off, anxiety and wakefulness return, sometimes worse than before."}, {"id": "e", "label": "Another dose, or a higher one", "detail": "Taken to relieve the rebound, which teaches the brain that the tablet is needed."}], "caption": "Press Play. The cycle explains why short courses are preferred, and why stopping must be slow."}
:::

| Medicine | Speed and length | Typical use |
|---|---|---|
| Alprazolam | Fast, short | Panic (but high dependence and severe withdrawal) |
| Lorazepam | Intermediate, no active metabolites | Acute agitation, catatonia, liver disease |
| Clonazepam | Slower, long | Panic, akathisia, some sleep disorders |
| Diazepam | Fast onset, very long acting | Alcohol withdrawal, tapering other benzodiazepines |
| Chlordiazepoxide | Long acting | Alcohol withdrawal |

### Other calming and sleep medicines
- **Z-drugs** (zolpidem, zopiclone): short-term insomnia; similar risks to benzodiazepines.
- **Pregabalin and gabapentin**: used for anxiety and pain; misuse potential, especially with opioids.
- **Buspirone**: slow-acting anxiolytic for generalised anxiety; no dependence or sedation.
- **Hydroxyzine** and **promethazine**: sedating antihistamines; anticholinergic.
- **Propranolol**: reduces physical anxiety (tremor, palpitations) and treats akathisia and lithium tremor; avoid in asthma; very dangerous in overdose.
- **Melatonin**: modest sleep benefit, mainly for body clock problems and in older adults.

### Medicines for side effects
- **Trihexyphenidyl** (and procyclidine, benztropine): anticholinergics for drug-induced parkinsonism and dystonia. Misused for a "high" in some settings, worsen memory and tardive dyskinesia, and should not be given routinely to everyone on an antipsychotic.
- **Propranolol** for akathisia and tremor.
- **Metformin** for antipsychotic weight gain.
- **Aripiprazole** add-on for raised prolactin.

:::widget sort
{"prompt": "Good use or poor use? Place each prescription.", "buckets": ["Good use", "Poor use"], "items": [{"text": "Lorazepam IM for a man with catatonia", "bucket": 0}, {"text": "Alprazolam nightly for two years for mild insomnia in a 75-year-old", "bucket": 1}, {"text": "Trihexyphenidyl automatically added for everyone starting risperidone", "bucket": 1, "why": "Use anticholinergics only when movement side effects occur."}, {"text": "Propranolol for akathisia in a man with no asthma", "bucket": 0}, {"text": "Diazepam reducing course for alcohol withdrawal", "bucket": 0}, {"text": "Pregabalin and a benzodiazepine for a man on methadone who also drinks", "bucket": 1, "why": "Combining sedatives with opioids and alcohol risks fatal breathing suppression."}, {"text": "Metformin for a young man who gained weight on olanzapine", "bucket": 0}]}
:::

:::clinician
### Doses and equivalents (Indian brands as examples)
| Medicine | Dose | Approximate equivalence to diazepam 10 mg |
|---|---|---|
| Alprazolam (Alprax, Restyl) | 0.25 to 0.5 mg up to three times daily | 0.5 to 1 mg |
| Lorazepam (Ativan, Larpose) | 0.5 to 2 mg; 2 to 4 mg IM for catatonia (lorazepam challenge) | 1 mg |
| Clonazepam (Rivotril, Lonazep, Clonotril) | 0.25 to 2 mg | 0.5 to 1 mg |
| Diazepam (Calmpose, Valium) | 2 to 10 mg | 10 mg |
| Chlordiazepoxide (Librium) | 10 to 25 mg; higher in withdrawal | 25 mg |
| Zolpidem (Zolfresh) | 5 to 10 mg | 20 mg |

- **GABA-A pharmacology**: benzodiazepines bind between alpha and gamma subunits; alpha-1 subunits mediate sedation and amnesia, alpha-2 and alpha-3 anxiolysis; Z-drugs prefer alpha-1. Flumazenil reverses benzodiazepine sedation but can precipitate seizures in dependent patients and in mixed tricyclic overdose.
- **Pregabalin** (Pregeb, Lyrica) 75 mg twice daily, up to 600 mg; binds the alpha-2-delta subunit of voltage-gated calcium channels; controlled in the UK since 2019 because of misuse and opioid co-deaths; renal dose adjustment.
- **Buspirone** (Buspin) 5 mg two or three times daily, up to 60 mg; 5-HT1A partial agonist; takes 2 to 4 weeks.
- **Propranolol** (Ciplar, Inderal) 10 to 40 mg two or three times daily; avoid in asthma and heart block; highly toxic in overdose (seizures, bradycardia); not for people at risk of overdose.
- **Trihexyphenidyl** (Pacitane) 2 mg, up to 6 mg; review need every few months; taper rather than stop suddenly (cholinergic rebound).
- **Metformin** 500 mg, up to 1,000 mg twice daily, reduces antipsychotic weight gain by about 3 kg on average; check renal function and B12.
:::

:::recall
1. How do benzodiazepines work? || They enhance GABA at GABA-A receptors (positive allosteric modulation).
2. Name four risks of benzodiazepines. || Sedation and falls, memory problems, dependence and withdrawal seizures, respiratory depression with alcohol or opioids.
3. Which benzodiazepine is preferred in liver disease? || Lorazepam.
4. Why should trihexyphenidyl not be given routinely? || It worsens memory, can be misused and may worsen tardive dyskinesia; use only when movement side effects occur.
5. Which non-sedating anxiolytic has no dependence risk? || Buspirone.
:::

:::mcq
Q: Which combination carries the greatest risk of fatal respiratory depression?
- Sertraline and propranolol
- *Methadone, a benzodiazepine and alcohol
- Lithium and quetiapine
- Mirtazapine and melatonin
> Combined CNS depressants with opioids.

Q: Propranolol should be avoided in a patient with:
- Akathisia
- Lithium tremor
- *Asthma
- Performance anxiety
> Non-selective beta-blockade causes bronchospasm.
:::

## 2.7 Level check · Beginner [core][beginner]
Twelve or more right out of fifteen opens the Advanced level.

:::mcq
Q: Which SSRI is often preferred after a heart attack?
- Paroxetine
- *Sertraline
- Fluvoxamine
- Citalopram at high dose
> Well studied in cardiac disease.

Q: Which SSRI has the longest-acting active metabolite?
- Escitalopram
- *Fluoxetine
- Paroxetine
- Sertraline
> Norfluoxetine.

Q: Which antidepressant blocks alpha-2 receptors and causes sedation and appetite gain?
- Bupropion
- *Mirtazapine
- Vortioxetine
- Duloxetine
> Alpha-2 and H1 antagonism.

Q: Which antidepressant should be avoided in a person with a seizure disorder?
- Sertraline
- *Bupropion
- Mirtazapine
- Escitalopram
> Lowers seizure threshold.

Q: Tyramine-rich foods are dangerous with:
- SSRIs
- *Irreversible MAOIs
- Mirtazapine
- Bupropion
> Hypertensive crisis.

Q: D2 blockade in the nigrostriatal pathway causes:
- Raised prolactin
- *Movement side effects
- Improved negative symptoms
- Weight loss
> Extrapyramidal effects.

Q: Which antipsychotic has the strongest evidence in treatment-resistant schizophrenia?
- Haloperidol
- Aripiprazole
- *Clozapine
- Quetiapine
> After two failed adequate trials.

Q: Fever, fast pulse and chest pain in the third week of clozapine suggest:
- Benign fever only
- *Myocarditis until proven otherwise
- Agranulocytosis
- Akathisia
> Check troponin and CRP.

Q: Which antipsychotic lowers prolactin?
- Risperidone
- Amisulpride
- *Aripiprazole
- Haloperidol
> Partial agonism.

Q: Lithium levels rise with:
- Paracetamol
- *NSAIDs and thiazide diuretics
- Caffeine
- Theophylline
> Reduced renal clearance.

Q: Valproate should be avoided in women of childbearing potential because of:
- Weight loss
- *Teratogenicity and neurodevelopmental harm
- Kidney stones
- Hypothyroidism
> Pregnancy prevention programme required.

Q: Lamotrigine's main danger is:
- Weight gain
- *Serious rash
- Hyponatraemia
- QT prolongation
> Slow titration reduces risk.

Q: Benzodiazepines act by:
- Blocking dopamine
- *Enhancing GABA at GABA-A receptors
- Blocking serotonin reuptake
- Blocking NMDA receptors
> Positive allosteric modulation.

Q: Acute dystonia is best treated with:
- More haloperidol
- *An anticholinergic injection
- A benzodiazepine taper
- Lithium
> Rapid relief.

Q: A gene test advised before carbamazepine in people of South Asian ancestry is:
- CYP2D6
- *HLA-B*15:02
- APOE
- MTHFR
> Stevens-Johnson risk.
:::
`;
