import type { LongQA } from "@/lib/prep/long-types";
import { anchored, chain, compare, vis } from "./visual";

export const PSYCHOPHARMACOLOGY_L07: LongQA[] = anchored([
  {
    id: "phar-l07-001",
    subject: "psychopharmacology",
    topic: "ect",
    marks: 15,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Discuss electroconvulsive therapy: history, mechanism, indications, procedure, adverse effects and legal safeguards in India.",
    plan: ["History", "Proposed mechanisms", "Indications and contraindications", "Pre ECT work up and procedure, including electrode placement and dosing", "Adverse effects", "Legal safeguards under the MHCA and conclusion"],
    answer: `## History
Ladislas Meduna induced seizures with camphor and later pentylenetetrazol in 1934, believing (wrongly) that epilepsy and schizophrenia were antagonistic. In 1938 Ugo Cerletti and Lucio Bini in Rome used electricity to induce seizures. The introduction of anaesthesia and muscle relaxants ("modified ECT") in the 1950s made it safe. Today ECT remains the most effective acute treatment for severe depression.

## Mechanisms
The therapeutic effect requires a generalised seizure, but its exact mechanism is unknown. Theories:
- Neurotransmitter changes: increased monoamine release, down regulation of beta adrenergic receptors, increased GABA.
- Neurotrophic and neuroplastic effects: increased BDNF, hippocampal neurogenesis and increased hippocampal and amygdala volume on MRI.
- Neuroendocrine effects: release of hypothalamic and pituitary hormones ("diencephalic" theory).
- Anticonvulsant theory: the rising seizure threshold over a course reflects inhibitory processes that may underlie benefit.
- Network effects: changes in connectivity of prefrontal and limbic networks.

## Indications
- Severe depression, especially with psychotic features, high suicide risk, refusal of food or fluids, stupor or when rapid response is essential; treatment resistant depression.
- Catatonia (including malignant catatonia) after or alongside lorazepam.
- Severe or resistant mania, mixed states and delirious mania.
- Treatment resistant schizophrenia (augmenting clozapine) and acute schizophrenia with catatonia or affective features.
- Neuroleptic malignant syndrome not responding to supportive care.
- Pregnancy and older age, where medicines are risky.
Remission rates in severe depression are about 60 to 80 percent.

## Contraindications
There are no absolute contraindications. High risk conditions include raised intracranial pressure, recent myocardial infarction or stroke, unstable cardiac disease, cerebral aneurysm, severe lung disease, and high anaesthetic risk.

## Pre ECT work up
History and examination, informed consent, blood count, electrolytes, renal and liver function, ECG, chest x ray if indicated, review of medicines (benzodiazepines and anticonvulsants raise the seizure threshold; lithium may increase confusion), dental check, and anaesthetic assessment. Fasting for about six hours.

## Procedure
- Anaesthesia with a short acting agent (propofol, thiopentone, methohexital or etomidate, sometimes ketamine) and a muscle relaxant (usually suxamethonium); oxygenation; bite block; monitoring of ECG, oxygen saturation, blood pressure and EEG.
- Brief pulse (and ultrabrief pulse for right unilateral ECT) square wave stimulation.
- Electrode placement:
| Placement | Features |
| Bitemporal | Most rapid and robust effect; more cognitive side effects |
| Bifrontal | Similar efficacy, possibly fewer memory effects |
| Right unilateral (d'Elia) | Fewer cognitive side effects; needs higher dose (about six times the seizure threshold) to be as effective |
- Dosing: the seizure threshold is found by titration at the first session; treatment is given at a multiple of the threshold (about 1.5 to 2.5 times for bilateral and about 6 times for right unilateral).
- An adequate seizure on EEG usually lasts more than about 15 to 25 seconds.
- Typically two to three sessions a week, six to twelve in total, guided by response.

## Adverse effects
- Short term: headache, muscle aches (from suxamethonium), nausea, confusion after treatment.
- Cognitive: anterograde amnesia (usually recovers within weeks) and retrograde amnesia for events around the treatment period, which may be patchy and occasionally persistent; less with right unilateral and ultrabrief pulse ECT.
- Cardiovascular: transient bradycardia then tachycardia and hypertension, arrhythmias.
- Prolonged seizures (treated with intravenous benzodiazepines).
- Mortality is very low, about 2 per 100,000 treatments, similar to minor anaesthesia.

## After the course
Relapse is common without continuation treatment. Continue antidepressants with lithium (which reduces relapse after ECT) or use continuation and maintenance ECT.

## Legal safeguards in India
- Section 95 of the MHCA 2017 prohibits ECT without anaesthesia and muscle relaxant ("direct" ECT).
- ECT for minors is prohibited except when the psychiatrist considers it necessary, with informed consent of the guardian and permission from the Mental Health Review Board.
- ECT is excluded from emergency treatment under section 94.
- Informed consent from the patient with capacity is required; if capacity is lacking, consent from the nominated representative applies, respecting any advance directive that refuses ECT, with Board review where needed.

## Conclusion
ECT is a safe and highly effective treatment for severe and resistant mood disorders, catatonia and some psychoses. Modern technique, careful placement and dosing reduce cognitive effects, and Indian law requires modified ECT with strong consent safeguards.`,
    keyPoints: ["Meduna 1934 and Cerletti and Bini 1938", "Mechanism theories including neurotrophic", "Indications with remission rates", "Relative contraindications", "Work up and drugs affecting seizure threshold", "Anaesthesia, relaxant and electrode placements with dosing multiples", "Cognitive and other adverse effects", "MHCA section 95, minors and section 94 exclusion"],
    pitfalls: ["Listing absolute contraindications", "Ignoring relapse prevention after ECT", "Forgetting that ECT without anaesthesia is banned in India"],
    visuals: [vis("brainslicer", { title: "Electrode placement", start: "ect", caption: "Compare bitemporal, bifrontal and right unilateral placements and their memory effects." })],
    module: "brain",
    ref: "UK ECT Review Group 2003 Lancet; Kellner 2006 CORE; Sackeim 2007 cognitive effects; RCPsych ECT Handbook; MHCA 2017 s94, s95; Andrade IPS ECT guidelines",
  },
  {
    id: "phar-l07-002",
    subject: "psychopharmacology",
    topic: "ect-law",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on the ethical and legal aspects of ECT in India.",
    plan: ["Historical concerns", "MHCA provisions", "Consent and capacity", "Good practice"],
    answer: `## Historical concerns
ECT was once given in India and elsewhere without anaesthesia ("unmodified" or "direct" ECT), sometimes without consent and occasionally as punishment, which created fear and stigma. Unmodified ECT continued in some hospitals into the 2000s.

## MHCA 2017 provisions
- Section 95 lists prohibited procedures, including ECT without muscle relaxants and anaesthesia.
- ECT for minors is prohibited unless, in the opinion of the psychiatrist in charge, it is necessary, with informed consent of the guardian and prior permission of the Mental Health Review Board.
- Section 94 (emergency treatment) does not allow ECT.
- Section 5 allows a person to refuse specific treatments, including ECT, in an advance directive.

## Consent and capacity
- A person with capacity must give informed consent after being told the nature of ECT, benefits, risks (especially memory effects), alternatives and the right to withdraw at any time.
- If capacity is lacking, the nominated representative gives consent on the person's behalf, considering the person's known wishes; an advance directive refusing ECT must be followed unless the Board decides otherwise on a challenge.
- Consent should be reviewed during the course.

## Good practice
Written information in the patient's language, involvement of family, documentation, audit of outcomes and cognitive effects, trained staff and accredited facilities, and respect for refusal.

## Conclusion
Indian law now ensures that ECT is always modified, consented and specially safeguarded for minors, turning an often feared treatment into a regulated one.`,
    keyPoints: ["History of unmodified ECT", "Section 95 prohibition", "Rules for minors with Board permission", "No ECT under section 94", "Advance directive refusal", "Informed consent elements and nominated representative"],
    module: "ethics-law",
    ref: "MHCA 2017 s5, s94, s95; Andrade 2012 IPS position on unmodified ECT; Ethics-law module",
  },
  {
    id: "phar-l07-003",
    subject: "psychopharmacology",
    topic: "rtms",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Describe repetitive transcranial magnetic stimulation: principle, protocols, indications, evidence and safety.",
    plan: ["Principle", "Protocols and targets", "Indications and evidence", "Safety and contraindications", "Comparison with ECT and conclusion"],
    answer: `## Principle
Transcranial magnetic stimulation uses a coil held against the scalp to produce brief, strong magnetic fields. By electromagnetic induction (Faraday's law), these create small electrical currents in the underlying cortex that depolarise neurons. Repeated pulses (rTMS) change cortical excitability beyond the session, an effect similar to long term potentiation or depression. Unlike ECT, it needs no anaesthesia and does not cause a seizure.

## Protocols and targets
- High frequency rTMS (about 10 Hz) over the left dorsolateral prefrontal cortex (DLPFC) increases excitability; this is the standard depression protocol, with about 3000 pulses a session, five days a week, for four to six weeks.
- Low frequency rTMS (1 Hz) over the right DLPFC decreases excitability and is an alternative.
- Intermittent theta burst stimulation (iTBS) delivers bursts of pulses in about three minutes and was found non inferior to standard 10 Hz rTMS.
- Accelerated, imaging guided iTBS (several sessions a day for five days, targeted with functional MRI connectivity to the subgenual cingulate) showed high remission rates in early studies and has US approval.
- Deep TMS with H coils reaches deeper targets.
- Targeting uses the "5 cm rule" from the motor hot spot, the Beam F3 method, or neuronavigation.

## Indications and evidence
- Major depression not responding to at least one antidepressant: response in about 30 to 50 percent and remission in about 20 to 30 percent in trials; better in less resistant patients.
- OCD: deep TMS of the medial prefrontal and anterior cingulate cortex has US approval.
- Smoking cessation: deep TMS has US approval.
- Others with mixed evidence: auditory hallucinations (low frequency over the left temporoparietal cortex), negative symptoms, PTSD, chronic pain and migraine.

## Safety and contraindications
- Common: scalp discomfort, headache, facial twitching.
- Rare: seizures (well under one in a thousand patients with modern protocols), syncope, hypomania.
- Hearing protection is needed because of the clicking sound.
- Contraindications: metal implants in or near the head (aneurysm clips, cochlear implants), implanted stimulators; caution with epilepsy and drugs lowering the seizure threshold.

## Comparison with ECT
| Feature | rTMS | ECT |
| Anaesthesia | Not needed | Needed |
| Seizure | Not induced | Required |
| Cognitive effects | Minimal | Memory effects |
| Efficacy | Moderate | Highest |
| Best use | Moderate, resistant depression; outpatients | Severe, psychotic, suicidal or catatonic depression |

## Indian context
rTMS is increasingly available in Indian cities and teaching hospitals, but cost and the need for daily visits limit access.

## Conclusion
rTMS is a safe, non invasive, outpatient treatment for depression and some other conditions, with moderate efficacy; newer accelerated and targeted protocols may increase its effect.`,
    keyPoints: ["Electromagnetic induction principle", "High frequency left DLPFC and low frequency right", "iTBS non inferiority", "Accelerated fMRI guided iTBS", "Response and remission rates", "Deep TMS approvals for OCD and smoking", "Safety and contraindications", "Comparison with ECT"],
    visuals: [vis("brainslicer", { title: "Protocols and targets", start: "tms", caption: "See the coil over the left dorsolateral prefrontal cortex and how the pulse reaches the deeper mood circuit." })],
    module: "brain",
    ref: "O'Reardon 2007; Blumberger 2018 Lancet THREE-D; Cole 2022 SNT Am J Psychiatry; Carmi 2019 deep TMS OCD; Rossi 2021 safety guidelines",
  },
  {
    id: "phar-l07-004",
    subject: "psychopharmacology",
    topic: "tdcs-dbs",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Write short notes on transcranial direct current stimulation and deep brain stimulation in psychiatry.",
    plan: ["tDCS principle and evidence", "DBS principle and targets", "Evidence and risks", "Ethics"],
    answer: `## Transcranial direct current stimulation (tDCS)
- A weak direct current (1 to 2 mA) is passed between scalp electrodes for 20 to 30 minutes. The anode tends to increase and the cathode to decrease cortical excitability, shifting resting membrane potentials rather than firing neurons.
- Evidence: modest benefit in depression (anode over the left DLPFC), with smaller effects than rTMS; studies in schizophrenia for auditory hallucinations (including work from NIMHANS) and in cognition and addiction.
- Advantages: cheap, portable, safe; possible home use with supervision.
- Side effects: tingling, itching, skin redness, rarely burns; occasional hypomania.

## Deep brain stimulation (DBS)
- Electrodes are implanted surgically into deep brain targets and connected to a pulse generator in the chest, delivering continuous high frequency stimulation that modulates circuit activity.
- Targets: ventral capsule and ventral striatum or the anteromedial subthalamic nucleus for OCD; subgenual cingulate (area 25), medial forebrain bundle and others for treatment resistant depression; nucleus accumbens for addiction in research.
- Evidence: in severe, resistant OCD, about half respond in open studies, and DBS has a humanitarian device exemption in the USA. Results in depression are mixed: early open studies were promising but larger sham controlled trials were negative, though recent studies with better targeting are more encouraging.
- Risks: surgical complications (haemorrhage, infection), hypomania, impulsivity, mood changes, device problems.

## Ethics
Both, and especially DBS, need careful selection, informed consent, independent review, and long term follow up. Under the MHCA 2017, psychosurgery requires informed consent and Board approval.

## Conclusion
tDCS is a simple, low risk technique with modest effects; DBS is an invasive, specialist option for the most severe resistant OCD and depression.`,
    keyPoints: ["tDCS weak current and polarity effects", "Modest depression evidence and safety", "DBS implantation and targets", "OCD response and HDE", "Mixed depression trials", "Surgical and psychiatric risks and ethics"],
    module: "brain",
    ref: "Brunoni 2017 NEJM ELECT-TDCS; Denys 2010 DBS OCD; Holtzheimer 2017 Lancet Psychiatry BROADEN; Mayberg 2005",
  },
  {
    id: "phar-l07-005",
    subject: "psychopharmacology",
    topic: "overdose",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Discuss the toxicity in overdose of common psychotropic drugs and the general principles of managing an overdose.",
    plan: ["General principles", "Toxicity of each class", "Specific antidotes and treatments", "Psychiatric aftercare and prevention"],
    answer: `## General principles
- Airway, breathing and circulation first; check glucose; Glasgow Coma Scale; ECG.
- History: what was taken, how much, when, with alcohol or other drugs; collateral information and pill counts.
- Investigations: paracetamol and salicylate levels in every intentional overdose (they are often co-ingested and silent), electrolytes, renal and liver function, blood gas, specific drug levels (lithium, valproate, carbamazepine).
- Decontamination: activated charcoal within about an hour for drugs it binds, if the airway is safe (not for lithium, iron or alcohol).
- Supportive care with cardiac monitoring; consult a poisons information service.

## Toxicity by class
| Drug | Main dangers in overdose |
| Tricyclics | Anticholinergic syndrome, QRS widening, arrhythmias, seizures, coma; very dangerous |
| SSRIs | Relatively safe; serotonin toxicity, seizures; QTc with citalopram and escitalopram |
| Venlafaxine | Seizures, serotonin toxicity, arrhythmias; more toxic than SSRIs |
| Mirtazapine | Sedation, mild tachycardia; relatively safe |
| Lithium | Gastrointestinal symptoms, tremor, ataxia, confusion, seizures, renal failure |
| Antipsychotics | Sedation, hypotension, QTc prolongation, arrhythmias, dystonia, anticholinergic effects (olanzapine, clozapine) |
| Valproate | Coma, hyperammonaemia, cerebral oedema, liver injury |
| Carbamazepine | Coma, ataxia, nystagmus, seizures, cardiac conduction problems; delayed peaks |
| Benzodiazepines | Sedation; dangerous mainly with alcohol, opioids or in older and lung disease patients |
| Paracetamol (often co-ingested) | Delayed liver failure |

## Specific treatments
- Tricyclics: intravenous sodium bicarbonate for QRS widening, arrhythmias or acidosis; benzodiazepines for seizures.
- Lithium: fluids; haemodialysis for severe toxicity.
- Benzodiazepines: flumazenil only in specific cases (risk of seizures in mixed overdoses and dependent patients).
- Opioids: naloxone.
- Paracetamol: acetylcysteine according to levels and time.
- Valproate: L carnitine for hyperammonaemia or severe toxicity; haemodialysis in severe cases.
- Carbamazepine: multiple dose activated charcoal; haemodialysis in severe cases.
- Serotonin toxicity: benzodiazepines, cyproheptadine, cooling.
- Dystonia: anticholinergics.

## Psychiatric aftercare and prevention
Psychiatric assessment of intent, mental state and risk once medically fit; safety planning; follow up. Prescribe safer drugs (SSRIs rather than tricyclics) and limited quantities to people at risk, and involve family in holding medicines.

## Conclusion
Overdose management relies on supportive care, checking for paracetamol, and specific treatments for dangerous drugs such as tricyclics and lithium; prevention through safe prescribing is as important.`,
    keyPoints: ["ABC, glucose and ECG", "Paracetamol and salicylate levels in all intentional overdoses", "Charcoal use and exceptions", "Toxicity table by class", "Tricyclics most dangerous antidepressants", "Bicarbonate, dialysis, naloxone, acetylcysteine, L carnitine", "Flumazenil cautions", "Aftercare and safe prescribing"],
    visuals: [chain("General principles", [["Resuscitate", "Airway, breathing, circulation, glucose"], ["Identify", "What, how much, when; collateral"], ["Investigate", "Paracetamol level, ECG, drug levels"], ["Treat", "Charcoal, antidotes, supportive care"], ["Assess", "Psychiatric review and safety plan"]])],
    module: "medicine-profiles",
    ref: "Maudsley overdose table; Toxbase; Isbister psychotropic overdose reviews",
  },
  {
    id: "phar-l07-006",
    subject: "psychopharmacology",
    topic: "clozapine-emergencies",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Write short notes on emergencies in patients taking clozapine.",
    plan: ["Haematological", "Cardiac", "Gastrointestinal and seizures", "Level changes and missed doses"],
    answer: `## Haematological
- Neutropenia and agranulocytosis (about 0.8 percent, mostly in the first 18 weeks). Any fever, sore throat or infection needs an urgent blood count. If neutrophils fall into the red range, stop clozapine, monitor daily, isolate and treat infection; granulocyte colony stimulating factor in agranulocytosis.

## Cardiac
- Myocarditis, usually in the first four to eight weeks: fever, tachycardia, chest pain, breathlessness, flu like illness, raised troponin and CRP. Stop clozapine and refer urgently to cardiology; rechallenge is usually avoided.
- Cardiomyopathy later in treatment: breathlessness and oedema; echocardiography.

## Gastrointestinal hypomotility
- Constipation affects most patients and can progress to ileus, bowel obstruction, perforation and death. Ask at every visit; prescribe laxatives (stimulant plus softener) early; avoid other anticholinergic drugs. Abdominal pain, vomiting or no bowel movement for several days is an emergency.

## Seizures
Dose and level related, more likely above about 600 mg a day or levels above 1000 ng per ml. Reduce the dose, check levels and consider an anticonvulsant such as valproate or lamotrigine.

## Neuroleptic malignant syndrome and fever
NMS can occur with clozapine, sometimes with less rigidity. Benign fever is common in the first weeks but must be distinguished from infection, myocarditis and NMS.

## Level changes and missed doses
- Stopping smoking raises levels sharply (loss of CYP1A2 induction), causing sedation, seizures and toxicity; reduce the dose by about a quarter to a half and check levels.
- Infection and inflammation raise levels; fluvoxamine and ciprofloxacin inhibit metabolism.
- If more than 48 hours of doses are missed, restart at 12.5 mg and titrate again because of the risk of hypotension and collapse.

## Conclusion
Clozapine emergencies are predictable: fever, chest pain, constipation, seizures, smoking changes and missed doses need prompt action.`,
    keyPoints: ["Neutropenia with fever as emergency", "Myocarditis timing and tests", "Constipation and fatal ileus", "Seizures with dose and level", "Smoking cessation raises levels", "Re-titrate after 48 hours missed"],
    visuals: [compare("Fever on clozapine", ["Benign fever", ["First few weeks", "No chest pain", "Normal troponin and neutrophils"], "Monitor"], ["Dangerous causes", ["Agranulocytosis with infection", "Myocarditis with raised troponin", "NMS with rigidity and raised CK"], "Stop clozapine and act urgently"], "Neuroleptic malignant syndrome and fever")],
    module: "antipsychotics",
    ref: "Maudsley clozapine adverse effects; Ronaldson 2011 myocarditis monitoring; Every-Palmer 2016 clozapine GI hypomotility",
  },
  {
    id: "phar-l07-007",
    subject: "psychopharmacology",
    topic: "anticholinergic-toxicity",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Write short notes on anticholinergic toxicity.",
    plan: ["Causes", "Features", "Differential", "Management"],
    answer: `## Causes
Overdose or accumulation of drugs that block muscarinic receptors: tricyclics, low potency antipsychotics, olanzapine and clozapine, antihistamines (diphenhydramine, promethazine), trihexyphenidyl and benztropine (also misused), antispasmodics, and plants such as datura (dhatura), which is a classic cause of poisoning in India, sometimes used to rob travellers.

## Features
Remembered as "hot as a hare, dry as a bone, red as a beet, blind as a bat, mad as a hatter, full as a flask":
- Peripheral: fever, dry hot flushed skin, dry mouth, dilated pupils with blurred vision, tachycardia, urinary retention, reduced bowel sounds.
- Central: agitation, delirium, visual hallucinations, picking at the air, mumbling speech, myoclonus, seizures and coma in severe cases.

## Differential
Serotonin syndrome (sweating, clonus, diarrhoea), NMS (rigidity, raised CK), sympathomimetic toxicity (sweating rather than dry skin), alcohol or benzodiazepine withdrawal (sweating, tremor), and infection.

## Management
- Stop the drug; supportive care; cooling; intravenous fluids; catheterise for retention.
- Benzodiazepines for agitation and seizures; avoid antipsychotics with anticholinergic effects.
- Physostigmine, a central cholinesterase inhibitor, reverses delirium in pure anticholinergic poisoning under monitoring in specialist settings; avoid it if tricyclic overdose with QRS widening is possible.
- Monitor ECG.

## Conclusion
Anticholinergic toxicity causes a recognisable hot, dry, delirious picture; supportive care and benzodiazepines are the mainstay, with physostigmine in selected cases.`,
    keyPoints: ["Drugs and datura as causes", "Peripheral features", "Central delirium features", "Mnemonic", "Differential with serotonin syndrome and NMS", "Supportive care, benzodiazepines, physostigmine with TCA caution"],
    module: "medicine-profiles",
    ref: "Toxbase anticholinergic syndrome; Dawson and Buckley 2016 physostigmine review",
  },
  {
    id: "phar-l07-008",
    subject: "psychopharmacology",
    topic: "psychedelics",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Critically evaluate the evidence for psychedelic assisted therapy in psychiatry.",
    plan: ["Background", "Pharmacology", "Evidence by drug and condition", "Methodological problems and risks", "Regulation including India and conclusion"],
    answer: `## Background
Psychedelics such as LSD and psilocybin were studied in the 1950s and 1960s for alcoholism and depression, then banned. Since the 2000s, controlled trials have revived interest in "psychedelic assisted therapy", where a drug session is combined with preparation and integration sessions with therapists.

## Pharmacology
- Classic psychedelics (psilocybin, LSD, DMT) are agonists at serotonin 5 HT2A receptors on cortical pyramidal neurons, producing altered perception, emotion and sense of self. They increase neuroplasticity and disrupt the default mode network, which may allow rigid patterns of thinking to change.
- MDMA releases serotonin, noradrenaline and dopamine and increases oxytocin; it is an "entactogen" rather than a classic psychedelic.

## Evidence
- Psilocybin in treatment resistant depression: a phase 2b trial found a single 25 mg dose with psychological support reduced depression more than 1 mg at three weeks, though effects faded by twelve weeks and some patients had suicidal behaviour.
- Psilocybin versus escitalopram in moderate to severe depression: no significant difference on the primary measure over six weeks, with some secondary measures favouring psilocybin.
- Psilocybin for depression and anxiety in cancer, and for alcohol and tobacco use disorders: small positive trials.
- MDMA assisted therapy for PTSD: two phase 3 trials showed large effects, but in 2024 the US regulator declined approval, citing problems with blinding, missing data, potential bias and safety recording.

## Methodological problems
- Blinding is nearly impossible because participants know whether they received an active drug; expectancy and enthusiasm inflate effects.
- Small samples, highly selected participants (often excluding people with suicide risk, psychosis or bipolar disorder) and short follow up.
- The relative roles of the drug and the therapy are unclear.

## Risks
Acute anxiety and panic ("bad trips"), transient increases in blood pressure and heart rate, risk of psychosis or mania in vulnerable people, hallucinogen persisting perception disorder, suggestibility with risk of boundary violations by therapists, and for MDMA, cardiovascular risk and misuse potential.

## Regulation
Australia allowed authorised psychiatrists to prescribe psilocybin for treatment resistant depression and MDMA for PTSD from 2023. In most countries they remain controlled drugs used only in research. In India, psilocybin, LSD and MDMA are prohibited under the NDPS Act, and their use outside approved research is illegal.

## Conclusion
Psychedelic assisted therapy is a promising research area with plausible mechanisms and early positive results, but the evidence is limited by blinding problems, selection and short follow up. It is not yet established practice, and in India it remains illegal outside research.`,
    keyPoints: ["Historical background", "5 HT2A agonism and default mode network", "MDMA as entactogen", "Psilocybin TRD trial and comparison with escitalopram", "MDMA PTSD trials and 2024 rejection", "Blinding and expectancy problems", "Risks", "Australia 2023 and NDPS in India"],
    visuals: [compare("Promise and problems", ["Promise", ["Rapid effects after one or two sessions", "Plausible plasticity mechanism", "Positive early trials"], "Worth studying"], ["Problems", ["Blinding almost impossible", "Selected samples and short follow up", "Psychosis and safety risks", "Not approved in most countries"], "Not routine care"], "Methodological problems")],
    module: "frontiers",
    ref: "Goodwin 2022 NEJM psilocybin TRD; Carhart-Harris 2021 NEJM psilocybin vs escitalopram; Mitchell 2021 Nat Med MDMA PTSD; FDA CRL Aug 2024; TGA Australia July 2023",
  },
  {
    id: "phar-l07-009",
    subject: "psychopharmacology",
    topic: "zuranolone",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Write short notes on neurosteroid antidepressants (brexanolone and zuranolone).",
    plan: ["Neurosteroids and depression", "Brexanolone", "Zuranolone", "Limitations"],
    answer: `## Neurosteroids and depression
Allopregnanolone, a metabolite of progesterone, is a positive allosteric modulator of GABA A receptors, including extrasynaptic receptors that control tonic inhibition. Levels rise in pregnancy and fall sharply after delivery; this rapid change, in women sensitive to it, is thought to contribute to postpartum depression. Restoring GABA A signalling is the rationale for neurosteroid antidepressants.

## Brexanolone
An intravenous formulation of allopregnanolone, approved in the USA in 2019 for postpartum depression. It is given as a continuous infusion over 60 hours in hospital, with monitoring for excessive sedation and loss of consciousness. Trials showed rapid improvement within 60 hours, sustained at 30 days. The infusion setting and cost limited its use.

## Zuranolone
An oral neuroactive steroid with similar GABA A modulation, approved in the USA in 2023 for postpartum depression, taken once daily in the evening for 14 days. Trials showed improvement from day 3, sustained at 45 days. Side effects include sleepiness, dizziness and sedation, so patients should not drive for at least 12 hours after a dose. It was not approved for major depressive disorder in general after mixed results.

## Limitations
- Short term trial data; long term outcomes and relapse rates are less clear.
- Sedation and misuse potential (controlled substances in the USA).
- Breastfeeding data are limited.
- Not available in India.

## Conclusion
Neurosteroid antidepressants are the first drugs designed specifically for postpartum depression, with rapid effects through GABA A modulation, but they need more long term evidence.`,
    keyPoints: ["Allopregnanolone and GABA A including extrasynaptic", "Postpartum fall in neurosteroids", "Brexanolone 60 hour infusion, 2019", "Zuranolone oral 14 days, 2023", "Sedation and driving warning", "Not approved for MDD; not in India"],
    module: "antidepressants",
    ref: "Meltzer-Brody 2018 Lancet brexanolone; Deligiannidis 2023 Am J Psychiatry zuranolone SKYLARK; FDA approvals 2019 and 2023",
  },
  {
    id: "phar-l07-010",
    subject: "psychopharmacology",
    topic: "maintenance-ect",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Write short notes on continuation and maintenance ECT.",
    plan: ["Definitions and rationale", "Indications", "Schedule and evidence", "Monitoring"],
    answer: `## Definitions and rationale
- Continuation ECT is given for about six months after a successful acute course, to prevent relapse of the same episode.
- Maintenance ECT is given beyond six months, to prevent recurrence of new episodes.
Relapse after a successful acute course of ECT is common (about half within six months without effective continuation treatment), especially in people who did not respond to medicines before ECT.

## Indications
- Recurrent depression or bipolar disorder with relapse despite good medication after ECT.
- Patients who responded well to ECT, prefer it, and cannot tolerate or did not respond to medicines.
- Treatment resistant schizophrenia responding to clozapine with ECT.
- Recurrent catatonia.
- Older adults and pregnant women where medicines are poorly tolerated.

## Schedule and evidence
Sessions are usually tapered: weekly for a month, then every two weeks, then monthly, adjusted to clinical state. The CORE group found continuation ECT and the combination of lithium and nortriptyline were similarly effective in preventing relapse; later work found that combining continuation ECT with medicines was better than medicines alone. Unilateral or ultrabrief placement is often preferred to limit memory effects.

## Monitoring
Regular review of mood, cognition (repeated cognitive tests), physical health and anaesthetic fitness; renewed informed consent; reassessment of the need every few months.

## Conclusion
Continuation and maintenance ECT are effective options for selected patients who relapse after successful ECT, usually alongside medicines.`,
    keyPoints: ["Definitions of continuation and maintenance", "High relapse rate after ECT", "Indications", "Tapering schedule", "CORE and combination evidence", "Cognitive monitoring and consent"],
    module: "brain",
    ref: "Kellner 2006 CORE continuation ECT; Kellner 2016 PRIDE; Sackeim 2001 JAMA relapse after ECT",
  },
]);
