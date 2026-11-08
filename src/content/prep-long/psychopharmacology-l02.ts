import type { LongQA } from "@/lib/prep/long-types";
import { anchored, chain, compare, tree, vis } from "./visual";

export const PSYCHOPHARMACOLOGY_L02: LongQA[] = anchored([
  {
    id: "phar-l02-001",
    subject: "psychopharmacology",
    topic: "antidepressant-classes",
    marks: 15,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Classify antidepressants. Describe their mechanisms of action and compare their side effect profiles.",
    plan: ["Historical introduction", "Classification by mechanism", "Mechanism of each class", "Side effect comparison table", "Choosing between classes and conclusion"],
    answer: `## Introduction
Modern antidepressants began by chance in the 1950s: iproniazid, an anti tuberculosis drug, lifted mood (the first MAOI), and imipramine, tested as an antipsychotic, relieved depression (the first tricyclic). These discoveries led to the monoamine hypothesis and to newer, safer drugs.

## Classification
| Class | Examples |
| Selective serotonin reuptake inhibitors (SSRIs) | Fluoxetine, sertraline, paroxetine, citalopram, escitalopram, fluvoxamine |
| Serotonin and noradrenaline reuptake inhibitors (SNRIs) | Venlafaxine, desvenlafaxine, duloxetine, milnacipran |
| Tricyclic antidepressants (TCAs) | Amitriptyline, imipramine, clomipramine, nortriptyline, dothiepin |
| Monoamine oxidase inhibitors (MAOIs) | Phenelzine, tranylcypromine (irreversible); moclobemide (reversible MAO A) |
| Noradrenergic and specific serotonergic antidepressant | Mirtazapine |
| Noradrenaline and dopamine reuptake inhibitor | Bupropion |
| Serotonin antagonist and reuptake inhibitors | Trazodone, nefazodone |
| Multimodal | Vortioxetine |
| Melatonergic | Agomelatine |
| Noradrenaline reuptake inhibitor | Reboxetine |
| Rapid acting glutamate and GABA agents | Esketamine, ketamine; zuranolone and brexanolone for postpartum depression |

## Mechanisms
- SSRIs block the serotonin transporter (SERT), raising synaptic serotonin; over weeks, somatodendritic 5 HT1A autoreceptors desensitise, so raphe neurons fire more and release more serotonin.
- SNRIs block SERT and the noradrenaline transporter (NET); venlafaxine acts mainly on serotonin at low doses and adds noradrenaline at higher doses (above about 150 mg).
- TCAs block SERT and NET and also block muscarinic, histamine H1 and alpha 1 receptors and sodium channels, which explains their side effects and toxicity.
- MAOIs inhibit monoamine oxidase, the enzyme that breaks down serotonin, noradrenaline and dopamine.
- Mirtazapine blocks alpha 2 adrenergic autoreceptors and heteroreceptors (increasing noradrenaline and serotonin release) and blocks 5 HT2A, 5 HT2C, 5 HT3 and H1 receptors.
- Bupropion blocks dopamine and noradrenaline reuptake; no serotonergic action.
- Trazodone blocks 5 HT2A receptors and weakly inhibits SERT; at low doses it is mainly an H1 and alpha 1 blocker used for sleep.
- Vortioxetine inhibits SERT and acts on several serotonin receptors (5 HT3, 5 HT7 and 5 HT1D antagonist; 5 HT1B partial agonist; 5 HT1A agonist).
- Agomelatine is an MT1 and MT2 melatonin agonist and 5 HT2C antagonist.
- Ketamine and esketamine block NMDA receptors, causing a glutamate surge, AMPA activation, BDNF release and rapid synapse formation.

## Side effect comparison
| Class | Main side effects | Overdose |
| SSRIs | Nausea, headache, insomnia or sedation, sexual dysfunction, hyponatraemia, bleeding risk, early agitation | Relatively safe (citalopram and escitalopram prolong QTc) |
| SNRIs | As SSRIs plus sweating, raised blood pressure (venlafaxine), discontinuation symptoms | Venlafaxine more toxic than SSRIs |
| TCAs | Dry mouth, constipation, urinary retention, blurred vision, sedation, weight gain, postural hypotension, arrhythmias | Highly dangerous: seizures, wide QRS, arrhythmias, coma |
| MAOIs | Postural hypotension, insomnia, weight gain, sexual dysfunction; hypertensive crisis with tyramine | Dangerous |
| Mirtazapine | Sedation, increased appetite, weight gain; little sexual dysfunction | Relatively safe |
| Bupropion | Insomnia, agitation, dry mouth; seizure risk at high doses; no sexual dysfunction or weight gain | Seizures |
| Vortioxetine | Nausea; less sexual dysfunction | Relatively safe |
| Agomelatine | Liver enzyme rise, needs liver tests | Relatively safe |
| Trazodone | Sedation, dizziness, priapism (rare) | Relatively safe |

## Choosing between classes
Efficacy differences between antidepressants are small; a large network meta analysis of 21 antidepressants found all better than placebo, with escitalopram, sertraline, vortioxetine, mirtazapine and agomelatine combining good efficacy and acceptability. Choice depends on side effect profile, safety in overdose, interactions, comorbidity (pain favours duloxetine or amitriptyline; insomnia and weight loss favour mirtazapine; fatigue or sexual concerns favour bupropion), previous response, cost and patient preference. SSRIs such as sertraline and escitalopram are usual first choices in India and are inexpensive.

## Conclusion
Antidepressants are classified by mechanism, mostly acting on monoamine reuptake, receptors or metabolism, with newer agents acting on glutamate, melatonin and GABA systems. Side effect profiles and safety, rather than efficacy, guide most choices.`,
    keyPoints: ["Historical serendipity", "Classification table with examples", "SSRI mechanism with autoreceptor desensitisation", "TCA receptor actions explaining side effects", "Mirtazapine alpha 2 mechanism", "Vortioxetine, agomelatine and ketamine mechanisms", "Side effect and overdose comparison", "Network meta analysis and choice factors"],
    pitfalls: ["Listing drugs without mechanisms", "Ignoring overdose safety", "Calling mirtazapine an SSRI"],
    visuals: [
      vis("release", { transmitter: "serotonin" }, "Mechanisms: pick SSRI and MAOI to see where each acts at the synapse."),
      tree("Antidepressant classes", [["Antidepressants", "", -1], ["Reuptake inhibitors", "", 0], ["SSRIs", "", 1], ["SNRIs", "", 1], ["TCAs", "Plus many receptor blocks", 1], ["Bupropion", "Dopamine and noradrenaline", 1], ["Enzyme inhibitors", "", 0], ["MAOIs", "", 6], ["Receptor based", "", 0], ["Mirtazapine, trazodone, agomelatine, vortioxetine", "", 8], ["Glutamate and GABA", "", 0], ["Esketamine, zuranolone", "", 10]], "Classification"),
    ],
    module: "antidepressants",
    ref: "Stahl Essential Psychopharmacology ch 7; Cipriani 2018 Lancet NMA; Maudsley antidepressant tables",
  },
  {
    id: "phar-l02-002",
    subject: "psychopharmacology",
    topic: "ssri",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Describe the pharmacology, uses and adverse effects of selective serotonin reuptake inhibitors.",
    plan: ["Mechanism and differences within the class", "Indications", "Adverse effects by system", "Interactions and special cautions", "Conclusion"],
    answer: `## Mechanism
SSRIs selectively block the serotonin transporter, increasing serotonin in the synapse. Over two to six weeks, 5 HT1A autoreceptors desensitise and downstream changes (receptor regulation, BDNF, neuroplasticity) develop, which correlate with clinical response.

## Differences within the class
| Drug | Half life | Notes |
| Fluoxetine | Long (with norfluoxetine, up to two weeks) | Activating; strong CYP2D6 inhibitor; few discontinuation symptoms; useful in adolescents and bulimia |
| Sertraline | About one day | Few interactions; preferred in heart disease and breastfeeding |
| Paroxetine | About one day | Most anticholinergic and sedating; weight gain; severe discontinuation; strong CYP2D6 inhibitor; avoid in pregnancy (cardiac defects) |
| Citalopram, escitalopram | About 1.5 days | Few interactions; dose related QTc prolongation (citalopram maximum 40 mg, 20 mg in older adults) |
| Fluvoxamine | Short | Strong CYP1A2 and 2C19 inhibitor; mainly OCD |

## Indications
Depression, generalised anxiety disorder, panic disorder, social anxiety disorder, OCD and body dysmorphic disorder (often at higher doses), PTSD, bulimia nervosa (fluoxetine), premenstrual dysphoric disorder, and premature ejaculation (dapoxetine and daily SSRIs).

## Adverse effects
- Gastrointestinal: nausea, diarrhoea or constipation, especially early (5 HT3 stimulation).
- Neurological: headache, tremor, dizziness; rarely seizures.
- Sleep: insomnia or sedation; vivid dreams.
- Early anxiety and agitation ("jitteriness"), so start low in panic disorder.
- Sexual dysfunction: reduced libido, delayed orgasm or ejaculation, in up to half of patients.
- Hyponatraemia (SIADH), especially in older adults in the first weeks.
- Bleeding risk, because platelets need serotonin; higher with NSAIDs, aspirin and anticoagulants.
- Weight changes, sweating, apathy or emotional blunting.
- Switching into mania in bipolar disorder.
- Increased suicidal thinking in people under 25 in the first weeks.
- Discontinuation symptoms, especially with paroxetine.
- Serotonin syndrome in combination with other serotonergic drugs.

## Interactions and cautions
CYP2D6 inhibition by fluoxetine and paroxetine (tamoxifen, codeine, TCAs, risperidone); CYP1A2 inhibition by fluvoxamine (clozapine, olanzapine, caffeine); serotonergic combinations (MAOIs, tramadol, linezolid); avoid MAOIs within two weeks (five weeks after fluoxetine). In pregnancy, sertraline is commonly used; there is a small risk of persistent pulmonary hypertension of the newborn and neonatal adaptation symptoms.

## Conclusion
SSRIs are first line for depression and most anxiety disorders because they are effective, safe in overdose and inexpensive. Their differences in half life, interactions and specific risks guide the choice of a particular drug.`,
    keyPoints: ["Mechanism and delayed adaptation", "Table of differences within the class", "Indications including OCD at higher doses", "Common early and sexual side effects", "Hyponatraemia and bleeding", "Under 25 suicidality warning and mania switch", "CYP2D6 and 1A2 interactions", "Pregnancy points"],
    visuals: [vis("synapse", { drug: "ssri", caption: "Mechanism: block reuptake, then let time pass to see the adaptive changes." })],
    module: "antidepressants",
    ref: "Stahl prescriber's guide SSRI monographs; Maudsley SSRIs; FDA citalopram QT 2011; MHRA",
  },
  {
    id: "phar-l02-003",
    subject: "psychopharmacology",
    topic: "tca",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Discuss the pharmacology, uses, adverse effects and management of overdose of tricyclic antidepressants.",
    plan: ["Examples and structure", "Mechanism and receptor profile", "Uses beyond depression", "Adverse effects", "Overdose features and management", "Conclusion"],
    answer: `## Examples
Tertiary amines: amitriptyline, imipramine, clomipramine, dothiepin (dosulepin), doxepin. Secondary amines (metabolites with fewer side effects): nortriptyline, desipramine. They have a three ring structure, hence "tricyclic".

## Mechanism and receptor profile
- Block serotonin and noradrenaline reuptake (clomipramine is the most serotonergic; desipramine and nortriptyline more noradrenergic).
- Block muscarinic M1 receptors (anticholinergic effects), histamine H1 (sedation and weight gain), alpha 1 adrenergic receptors (postural hypotension) and fast sodium channels in the heart and brain (arrhythmias and seizures, especially in overdose).

## Uses
- Depression, including severe and melancholic depression (efficacy similar to or slightly greater than SSRIs in inpatients).
- OCD (clomipramine).
- Neuropathic pain, migraine prophylaxis, fibromyalgia and tension headache (low dose amitriptyline or nortriptyline).
- Nocturnal enuresis (imipramine, third line).
- Insomnia (low dose doxepin).
- Cataplexy in narcolepsy (clomipramine).

## Adverse effects
- Anticholinergic: dry mouth, constipation, urinary retention, blurred vision, tachycardia, confusion and delirium in older people, worsening of narrow angle glaucoma.
- Antihistaminic: sedation and weight gain.
- Anti adrenergic: postural hypotension and falls.
- Cardiac: conduction delay (prolonged PR, QRS, QTc), arrhythmias; avoid after recent myocardial infarction.
- Neurological: tremor, lowered seizure threshold.
- Sexual dysfunction, sweating, switch to mania, discontinuation symptoms (cholinergic rebound).

## Overdose
TCAs are among the most dangerous drugs in overdose; a week's supply can be fatal. Features begin within a few hours:
- Anticholinergic syndrome: dry hot skin, dilated pupils, urinary retention, agitation, delirium.
- Cardiac: sinus tachycardia, QRS widening (above 100 milliseconds predicts seizures; above 160 predicts arrhythmias), hypotension, ventricular arrhythmias.
- Neurological: seizures, coma, respiratory depression.
Management:
- Airway, breathing and circulation; cardiac monitoring with serial ECGs.
- Activated charcoal if within about an hour and the airway is protected.
- Intravenous sodium bicarbonate for QRS widening, arrhythmias, hypotension or acidosis (alkalinisation and sodium load overcome sodium channel block).
- Benzodiazepines for seizures; avoid physostigmine and class 1a antiarrhythmics; avoid flumazenil in mixed overdoses.
- Psychiatric assessment once stable.

## Conclusion
TCAs remain useful, inexpensive drugs for severe depression, OCD and pain, but their receptor profile causes many side effects and they are highly toxic in overdose. Prescribe limited quantities to patients at risk of suicide.`,
    keyPoints: ["Examples of tertiary and secondary amines", "Reuptake block plus M1, H1, alpha 1 and sodium channel block", "Uses including pain and clomipramine in OCD", "Anticholinergic, cardiac and hypotensive effects", "Overdose features including QRS widening", "Sodium bicarbonate and supportive management", "Limit quantities in suicide risk"],
    visuals: [tree("Why TCAs have so many side effects", [["Tricyclic", "", -1], ["Reuptake block", "Antidepressant effect", 0], ["Muscarinic block", "Dry mouth, constipation, confusion", 0], ["H1 block", "Sedation, weight gain", 0], ["Alpha 1 block", "Postural hypotension", 0], ["Sodium channel block", "Arrhythmia, seizures in overdose", 0]], "Mechanism and receptor profile")],
    module: "antidepressants",
    ref: "Stahl ch 7 TCAs; Maudsley TCA overdose; Toxbase TCA guidance; Boehnert and Lovejoy 1985 QRS",
  },
  {
    id: "phar-l02-004",
    subject: "psychopharmacology",
    topic: "maoi",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on monoamine oxidase inhibitors and the cheese reaction.",
    plan: ["MAO enzymes and drugs", "Uses", "The cheese reaction", "Other interactions and precautions"],
    answer: `## MAO enzymes and drugs
Monoamine oxidase exists as MAO A (breaks down serotonin, noradrenaline and tyramine; mainly in the gut and liver) and MAO B (breaks down dopamine and phenylethylamine; mainly in the brain and platelets).
- Irreversible, non selective MAOIs: phenelzine, tranylcypromine, isocarboxazid.
- Reversible inhibitor of MAO A (RIMA): moclobemide.
- Selective MAO B inhibitors: selegiline (used in Parkinson disease; as a skin patch for depression in the USA), rasagiline.

## Uses
Treatment resistant depression and atypical depression (historically better than TCAs), social anxiety and panic disorder. They are now rarely used because of dietary and drug restrictions.

## The cheese reaction
Tyramine in food is normally broken down by MAO A in the gut and liver. With MAO A inhibited, tyramine enters the blood and releases noradrenaline from nerve endings, causing a sudden rise in blood pressure: severe occipital headache, palpitations, sweating, neck stiffness, nausea, and risk of stroke. Foods rich in tyramine include aged cheese, cured and fermented meats and fish, soy sauce and fermented soy products, yeast extracts, broad bean pods, tap beer and spoiled food. Treatment: stop the drug, and lower blood pressure with an alpha blocker such as phentolamine, or a calcium channel blocker in emergency care. Moclobemide carries much less risk because tyramine can displace it from the enzyme.

## Other interactions and precautions
- Serotonin syndrome with SSRIs, SNRIs, clomipramine, tramadol, pethidine, dextromethorphan, linezolid and methylene blue.
- Hypertensive reactions with sympathomimetics (pseudoephedrine in cold remedies, amphetamines).
- Washout: two weeks after stopping an irreversible MAOI before starting another antidepressant; five weeks after fluoxetine before starting an MAOI.
- Common side effects: postural hypotension, insomnia, weight gain, sexual dysfunction, oedema.

## Conclusion
MAOIs are effective but need careful dietary and drug precautions because of the tyramine reaction and serotonin syndrome.`,
    keyPoints: ["MAO A and B substrates", "Irreversible, reversible and MAO B drugs", "Uses in resistant and atypical depression", "Mechanism of tyramine reaction", "Food list and treatment", "Washout periods and serotonin syndrome"],
    module: "antidepressants",
    ref: "Stahl MAOIs; Maudsley MAOI diet; Gillman 2018 MAOI review",
  },
  {
    id: "phar-l02-005",
    subject: "psychopharmacology",
    topic: "newer-antidepressants",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Write a comparative account of mirtazapine, bupropion, vortioxetine and agomelatine.",
    plan: ["Why newer antidepressants were developed", "Each drug: mechanism, dose, advantages, disadvantages", "Comparison table", "Clinical choice and conclusion"],
    answer: `## Background
Newer antidepressants were developed to keep the effectiveness of older drugs while avoiding common problems such as sexual dysfunction, sedation, weight gain or insomnia. Each has a distinct mechanism.

## Mirtazapine
- Mechanism: blocks alpha 2 adrenergic autoreceptors and heteroreceptors, increasing noradrenaline and serotonin release; blocks 5 HT2A, 5 HT2C and 5 HT3 (so less nausea, insomnia and sexual dysfunction) and H1 receptors.
- Dose: 15 to 45 mg at night; lower doses are paradoxically more sedating.
- Advantages: improves sleep and appetite, little sexual dysfunction, few interactions, safe in overdose; useful in older adults, cancer and with SSRIs as a combination.
- Disadvantages: sedation, weight gain, raised lipids; rarely neutropenia.

## Bupropion
- Mechanism: inhibits dopamine and noradrenaline reuptake; no serotonin action.
- Dose: 150 to 300 mg (sustained or extended release).
- Advantages: no sexual dysfunction or weight gain, activating, helps smoking cessation; useful for fatigue and hypersomnia; lower switch risk in bipolar depression.
- Disadvantages: insomnia, anxiety, dose related seizure risk (avoid in epilepsy, eating disorders and alcohol withdrawal); strong CYP2D6 inhibitor.

## Vortioxetine
- Mechanism: multimodal: SERT inhibition plus 5 HT3, 5 HT7 and 5 HT1D antagonism, 5 HT1B partial agonism and 5 HT1A agonism.
- Dose: 10 to 20 mg (5 mg in older adults).
- Advantages: may improve cognitive symptoms of depression (processing speed, executive function), less sexual dysfunction than SSRIs, few discontinuation symptoms, weight neutral.
- Disadvantages: nausea, cost; CYP2D6 substrate.

## Agomelatine
- Mechanism: agonist at melatonin MT1 and MT2 receptors and antagonist at 5 HT2C receptors (which disinhibits dopamine and noradrenaline in the prefrontal cortex).
- Dose: 25 to 50 mg at bedtime.
- Advantages: resynchronises circadian rhythms and improves sleep without sedation the next day, little sexual dysfunction or weight gain, no discontinuation syndrome.
- Disadvantages: risk of raised liver enzymes and rare hepatotoxicity, so liver tests are needed at baseline and at 3, 6, 12 and 24 weeks; avoid in liver disease; CYP1A2 substrate (avoid fluvoxamine). Approved in Europe and India, not in the USA.

## Comparison
| Feature | Mirtazapine | Bupropion | Vortioxetine | Agomelatine |
| Main mechanism | Alpha 2 block | DA and NA reuptake block | Multimodal serotonin | MT1 and MT2 agonist, 5 HT2C block |
| Sleep | Sedating | May cause insomnia | Neutral | Improves sleep |
| Weight | Gain | Neutral or loss | Neutral | Neutral |
| Sexual dysfunction | Low | None | Low | Low |
| Special caution | Weight, sedation | Seizures | Nausea | Liver tests |

## Clinical choice
Choose mirtazapine for poor sleep and appetite, bupropion for fatigue, sexual concerns or smoking, vortioxetine for cognitive complaints or SSRI sexual side effects, and agomelatine for circadian disturbance when liver function is normal.

## Conclusion
These drugs widen the options for matching an antidepressant to a patient's symptoms and side effect concerns; efficacy is broadly similar to SSRIs.`,
    keyPoints: ["Rationale for newer drugs", "Mirtazapine alpha 2 mechanism and sedation and weight", "Bupropion mechanism and seizure risk", "Vortioxetine multimodal and cognition", "Agomelatine mechanism and liver monitoring schedule", "Comparison table", "Matching drugs to patients"],
    visuals: [compare("Mirtazapine and bupropion", ["Mirtazapine", ["Sedating", "Weight gain", "No sexual dysfunction", "Good for poor sleep and appetite"], "Calming"], ["Bupropion", ["Activating", "Weight neutral", "No sexual dysfunction", "Helps smoking cessation; seizure caution"], "Energising"], "Comparison")],
    module: "antidepressants",
    ref: "Stahl prescriber's guide monographs; Maudsley; McIntyre 2014 vortioxetine cognition; EMA agomelatine liver monitoring",
  },
  {
    id: "phar-l02-006",
    subject: "psychopharmacology",
    topic: "ketamine",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Discuss the use of ketamine and esketamine in depression.",
    plan: ["Background and discovery", "Mechanism", "Evidence and approvals", "Administration and monitoring", "Adverse effects, misuse and limits", "Conclusion"],
    answer: `## Background
Ketamine is an anaesthetic and NMDA receptor antagonist. In 2000, a small trial showed that a single intravenous infusion at a sub anaesthetic dose produced rapid antidepressant effects within hours. Later studies showed rapid reduction of suicidal ideation, which led to great interest in glutamate based treatments.

## Mechanism
- Ketamine blocks NMDA receptors on GABA interneurons, disinhibiting glutamate release.
- The glutamate surge activates AMPA receptors, triggering BDNF release and the mTOR pathway, leading to rapid growth of dendritic spines and synapses in the prefrontal cortex.
- Metabolites (such as hydroxynorketamine) and opioid system effects may also contribute.
- Esketamine is the S enantiomer, with higher NMDA affinity.

## Evidence and approvals
- Intravenous ketamine (0.5 mg per kg over 40 minutes) produces response within 24 hours in about half to two thirds of people with treatment resistant depression, but effects fade within a week or two unless repeated.
- Esketamine nasal spray was approved in the USA in 2019 for treatment resistant depression with an oral antidepressant, and later for depression with acute suicidal ideation or behaviour; in 2025 it was approved as monotherapy in the USA. It is approved in several other countries.
- In a large trial, esketamine was more effective than quetiapine augmentation in treatment resistant depression.
- Evidence for long term use and relapse prevention is limited, and trials are hard to blind because of dissociation.

## Administration and monitoring
- Esketamine: 56 or 84 mg intranasally, twice weekly for four weeks, then weekly or every two weeks; given in a clinic with observation for at least two hours.
- Monitor blood pressure before and after dosing, dissociation and sedation; patients must not drive until the next day.
- Ketamine infusions need an anaesthesia or monitored setting.

## Adverse effects and misuse
- Dissociation, perceptual changes, dizziness, nausea, sedation, transient rise in blood pressure.
- Misuse potential: ketamine is used recreationally; long term heavy use causes bladder damage (ulcerative cystitis) and cognitive problems.
- Contraindications: uncontrolled hypertension, aneurysms, recent stroke, active psychosis, substance use disorder (relative).
- In India, ketamine is a controlled substance and its use in depression is largely in specialist and research settings.

## Conclusion
Ketamine and esketamine offer rapid relief in treatment resistant depression and suicidality through a glutamate mechanism. Their benefits are real but often short lived, and they require monitoring, careful selection and attention to misuse.`,
    keyPoints: ["Discovery of rapid effect", "NMDA block, glutamate surge, AMPA, BDNF, mTOR", "Esketamine as S enantiomer", "Response rates and short duration", "Approvals including 2019 and suicidal ideation", "Dosing and two hour observation", "Dissociation, blood pressure, misuse, bladder damage", "Contraindications"],
    visuals: [chain("Mechanism", [["NMDA block on interneurons", "Ketamine"], ["Glutamate surge", ""], ["AMPA activation", ""], ["BDNF and mTOR", ""], ["New synapses in prefrontal cortex", "Within hours"]], "How ketamine lifts mood within hours.")],
    module: "antidepressants",
    ref: "Berman 2000; Zarate 2006; Popova 2019 TRANSFORM-2; Reif 2023 ESCAPE-TRD NEJM; FDA esketamine 2019, 2020, 2025 monotherapy",
  },
  {
    id: "phar-l02-007",
    subject: "psychopharmacology",
    topic: "antidepressant-suicidality",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on antidepressants and suicidality in young people.",
    plan: ["The warning and its basis", "Age pattern", "Why it may happen", "Clinical practice"],
    answer: `## The warning
In 2004 the US Food and Drug Administration added a "black box" warning to all antidepressants after pooled analyses of trials in children and adolescents showed an increase in suicidal thoughts and behaviour (about 4 percent on drugs versus 2 percent on placebo). No suicides occurred in these trials. The warning was extended in 2007 to young adults up to age 24.

## Age pattern
Analyses of adult trials found increased risk under 25, no change between 25 and 64, and a reduced risk in people over 65. This suggests an age related effect.

## Why it may happen
Early activation (agitation, akathisia, insomnia) before mood improves, energy returning before hopelessness lifts, emerging mixed states or bipolarity, and better reporting in trials.

## Effects of the warning
After the warning, prescriptions for young people fell in several countries, and some studies reported increases in suicide attempts, suggesting that undertreatment of depression is itself dangerous. Untreated depression remains the main suicide risk.

## Clinical practice
- Use psychological therapy first for mild depression in young people; fluoxetine has the best evidence in adolescents (the TADS study), with escitalopram as an alternative.
- Explain the risk to patient and family, and ask them to report agitation or new suicidal thoughts.
- Review within one week of starting and frequently during the first months and after dose changes.
- Dispense limited quantities.
- Screen for bipolar disorder.

## Conclusion
Antidepressants carry a small increase in suicidal thinking in people under 25, but untreated depression is the larger risk; close monitoring allows safe use.`,
    keyPoints: ["2004 warning and 2007 extension to 24", "About 4 versus 2 percent in trials, no suicides", "Age pattern including reduced risk over 65", "Activation and mixed state explanations", "Unintended effects of the warning", "Fluoxetine and TADS; close monitoring"],
    module: "antidepressants",
    ref: "Hammad 2006 FDA pooled analysis; Stone 2009 BMJ age analysis; TADS 2004; Lu 2014 BMJ after warning",
  },
  {
    id: "phar-l02-008",
    subject: "psychopharmacology",
    topic: "hyponatraemia-bleeding",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Write short notes on hyponatraemia and bleeding risk with antidepressants.",
    plan: ["Hyponatraemia mechanism and risk factors", "Features and management", "Bleeding mechanism and risk", "Prevention"],
    answer: `## Hyponatraemia
- Mechanism: antidepressants, especially SSRIs and SNRIs, can cause the syndrome of inappropriate antidiuretic hormone secretion (SIADH), with water retention and dilution of sodium. It also occurs with carbamazepine, oxcarbazepine and some antipsychotics.
- Timing: usually in the first two to four weeks.
- Risk factors: older age, female sex, low body weight, diuretics (thiazides), low baseline sodium, and other drugs (proton pump inhibitors, NSAIDs).
- Features: nausea, headache, fatigue, confusion, falls, and in severe cases seizures and coma. Mild cases are often missed.
- Management: check sodium if symptoms appear; in older adults check at baseline and after two to four weeks. If mild, stop or switch the drug and restrict fluids; if severe (below about 125 mmol per litre or symptomatic), stop the drug and refer for medical management. Mirtazapine, agomelatine and bupropion carry lower risk.

## Bleeding
- Mechanism: platelets take up serotonin through SERT and need it for aggregation. SSRIs deplete platelet serotonin, impairing clotting.
- Risk: gastrointestinal bleeding is the main concern, and the risk rises several fold when SSRIs are combined with NSAIDs, aspirin, anticoagulants or antiplatelet drugs. There may be a small increase in bleeding after surgery and in postpartum haemorrhage.
- Prevention: avoid SSRIs with NSAIDs where possible, add a proton pump inhibitor if the combination is needed, consider mirtazapine in high risk patients, and inform surgeons.

## Conclusion
Hyponatraemia and bleeding are uncommon but serious side effects of serotonergic antidepressants, mostly in older adults and those taking interacting drugs; simple monitoring and choice of drug prevent most harm.`,
    keyPoints: ["SIADH mechanism", "Timing in first weeks", "Risk factors including older age and diuretics", "Features and management with sodium threshold", "Platelet serotonin depletion", "NSAID combination risk and PPI protection"],
    module: "antidepressants",
    ref: "Maudsley hyponatraemia and bleeding sections; de Abajo 2008 SSRI NSAID GI bleeding",
  },
  {
    id: "phar-l02-009",
    subject: "psychopharmacology",
    topic: "antidepressant-sexual",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Write short notes on antidepressant induced sexual dysfunction and its management.",
    plan: ["Frequency and features", "Mechanism", "Assessment", "Management strategies"],
    answer: `## Frequency and features
Sexual dysfunction affects up to half of people taking SSRIs and SNRIs, though it is often not reported unless asked. Features include reduced libido, delayed or absent orgasm, delayed ejaculation, erectile difficulties and genital numbness. It is a major cause of stopping treatment, especially in young adults. Some people report persisting symptoms after stopping (post SSRI sexual dysfunction).

## Mechanism
Increased serotonin acting at 5 HT2 receptors reduces dopamine and noradrenaline activity in reward and sexual pathways; spinal serotonin delays ejaculation. Raised prolactin (with some antipsychotics) adds to it.

## Assessment
Ask routinely before and during treatment, using simple questions or a scale such as the Arizona Sexual Experience Scale. Separate it from sexual problems due to depression itself, physical illness (diabetes, hypertension), other drugs, and relationship issues.

## Management
- Wait: some improvement may occur over a few months.
- Reduce the dose if the depression is in remission.
- Switch to an antidepressant with lower risk: bupropion, mirtazapine, vortioxetine, agomelatine or moclobemide.
- Add an antidote: bupropion as augmentation; PDE5 inhibitors (sildenafil, tadalafil) for erectile and possibly orgasmic difficulties in men and some women.
- "Drug holidays" over a weekend for short half life drugs (risky for discontinuation symptoms and not for fluoxetine).
- Psychosexual counselling for the couple.

## Conclusion
Sexual dysfunction is common and underreported with serotonergic antidepressants; routine asking and practical strategies improve adherence and quality of life.`,
    keyPoints: ["Up to half affected and underreported", "Types of dysfunction", "Serotonin and dopamine mechanism", "Routine assessment and other causes", "Switch options", "Bupropion or PDE5 inhibitor augmentation"],
    module: "antidepressants",
    ref: "Serretti 2009 meta-analysis; Maudsley sexual dysfunction; Taylor 2013 Cochrane management",
  },
  {
    id: "phar-l02-010",
    subject: "psychopharmacology",
    topic: "antidepressant-delay",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Viva: Why do antidepressants take weeks to work when they change monoamine levels within hours?",
    plan: ["State the paradox", "Receptor adaptation theory", "Neuroplasticity and neurogenesis theory", "Cognitive emotional processing theory", "What this means clinically"],
    answer: `## The paradox
SSRIs block serotonin reuptake within hours of the first dose, yet clinical improvement usually takes two to six weeks. This delay argues against a simple "low serotonin" model.

## Receptor adaptation
At first, extra serotonin around the cell bodies in the raphe stimulates 5 HT1A autoreceptors, which slow firing and limit release. Over two to three weeks these autoreceptors desensitise, firing recovers, and serotonin release in the cortex and limbic areas rises. Postsynaptic receptors (beta adrenergic, 5 HT2) are also down regulated over weeks. This was the classical explanation.

## Neuroplasticity
Antidepressants gradually increase BDNF and other growth factors through changes in gene expression (CREB), promote neurogenesis in the hippocampus and restore dendritic spines lost under chronic stress. These structural changes take weeks. Rapid acting drugs such as ketamine trigger synaptogenesis within hours, which supports the idea that plasticity is the final common pathway.

## Cognitive and emotional processing
Catherine Harmer and colleagues showed that a single dose of an antidepressant shifts emotional processing towards positive information (for example recognising happy faces) within hours, before mood changes. The person then needs time to experience the world differently and relearn, so mood improves gradually.

## Clinical meaning
- Explain to patients that side effects come first and benefits later.
- Early partial improvement in the first two weeks predicts later response; no improvement at all after three to four weeks at an adequate dose suggests changing strategy.
- Continue for long enough before judging failure.

## Conclusion
The delay reflects slow adaptive changes in receptors, plasticity and emotional learning rather than immediate changes in transmitter levels.`,
    keyPoints: ["The paradox", "5 HT1A autoreceptor desensitisation", "Postsynaptic down regulation", "BDNF, CREB and neurogenesis", "Ketamine supports plasticity view", "Harmer's emotional processing theory", "Clinical implications on early response"],
    visuals: [vis("synapse", { drug: "ssri", caption: "Receptor adaptation: press time passes to see autoreceptors desensitise." })],
    module: "antidepressants",
    ref: "Blier and de Montigny 1994; Duman neurotrophic hypothesis; Harmer 2009 cognitive neuropsychological model; Szegedi 2009 early improvement",
  },
]);
