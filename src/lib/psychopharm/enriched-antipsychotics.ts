/**
 * Enriched student + clinical content for antipsychotics (atypical + typical)
 * and mood stabilizers / anticonvulsants.
 *
 * Schema is intentionally lighter than DrugDraft — plain-language summaries
 * for students alongside concise clinical bullets (mechanism, common uses,
 * key side effects, monitoring). Every fact is cross-referenced against
 * Stahl's Prescriber's Guide (7th ed.) monograph extraction
 * (docs/psychopharm/extracted_mono_stahl7.json + KNOWLEDGE_BASE.json) and
 * authoritative web sources (FDA labels, PubMed). No invented medical facts;
 * regional-availability limitations are flagged inline.
 */

export interface EnrichedDrug {
  generic_name: string;
  drug_class: string;
  /** Student-friendly plain-language summary. */
  plain_language: string;
  /** Clinical mechanism summary. */
  mechanism: string;
  common_uses: string[];
  side_effects: string[];
  monitoring: string[];
}

export const ENRICHED_ANTIPSYCHOTICS: EnrichedDrug[] = [
  // ===========================================================================
  // ATYPICAL (SECOND-GENERATION) ANTIPSYCHOTICS
  // ===========================================================================

  {
    generic_name: "Aripiprazole",
    drug_class: "Atypical antipsychotic (D2 partial agonist)",
    plain_language:
      "A 'balancer' antipsychotic — it dials dopamine down where it's too high (helping psychosis) and up where it's too low (helping mood and motivation). Used for schizophrenia, bipolar disorder, and added onto antidepressants for depression.",
    mechanism:
      "Dopamine D2 partial agonist plus 5-HT1A partial agonist and 5-HT2A antagonist; modulates dopamine signaling rather than fully blocking it. Available oral, IM, and long-acting injectable (Maintena, Aristada).",
    common_uses: [
      "Schizophrenia (oral + long-acting injectable)",
      "Bipolar mania and maintenance",
      "Adjunct to antidepressants in major depression",
      "Autism-related irritability (ages 6–17)",
      "Tourette disorder (ages 6–18)",
      "Acute agitation (IM)",
    ],
    side_effects: [
      "Akathisia (restlessness)",
      "Insomnia / activation",
      "Nausea",
      "Headache",
      "Impulse-control problems (gambling, binge eating) — rare but important",
      "Lower weight/metabolic risk than most atypicals",
    ],
    monitoring: [
      "Weight, BMI, waist circumference",
      "Fasting glucose and lipids (baseline + periodic)",
      "AIMS for movement disorders",
      "Watch for compulsive behaviors",
    ],
  },

  {
    generic_name: "Olanzapine",
    drug_class: "Atypical antipsychotic",
    plain_language:
      "A very effective antipsychotic and mood stabilizer, but it commonly causes significant weight gain and raises blood sugar and cholesterol. Combined with fluoxetine (Symbyax) for bipolar and treatment-resistant depression.",
    mechanism:
      "D2 and 5-HT2A antagonist with broad receptor binding (H1, M1, 5-HT2C); high efficacy but a high metabolic burden.",
    common_uses: [
      "Schizophrenia (incl. long-acting injectable)",
      "Bipolar mania and maintenance",
      "Bipolar depression (with fluoxetine = Symbyax)",
      "Treatment-resistant depression (with fluoxetine)",
      "Acute agitation (IM)",
    ],
    side_effects: [
      "Marked weight gain",
      "Sedation",
      "Increased appetite",
      "Dyslipidemia and hyperglycemia",
      "Dry mouth, constipation",
      "Orthostatic hypotension",
      "DRESS (rare)",
    ],
    monitoring: [
      "Weight, BMI, waist circumference",
      "Fasting glucose + lipids (baseline + periodic)",
      "AIMS for movement disorders",
      "Blood pressure / heart rate",
    ],
  },

  {
    generic_name: "Quetiapine",
    drug_class: "Atypical antipsychotic",
    plain_language:
      "An antipsychotic also approved for bipolar depression and as an add-on for depression. Low doses are sedating; higher doses treat mania and psychosis. Causes weight gain and metabolic changes.",
    mechanism:
      "D2 and 5-HT2A antagonist with strong H1 (sedation) and noradrenergic/serotonergic actions; receptor profile shifts with dose.",
    common_uses: [
      "Schizophrenia",
      "Bipolar mania, depression, and maintenance",
      "Adjunct in major depression (XR)",
      "Off-label: low-dose for sleep; Parkinson's psychosis",
    ],
    side_effects: [
      "Sedation",
      "Dose-dependent weight gain",
      "Dry mouth, constipation",
      "Orthostatic hypotension",
      "Metabolic syndrome risk",
      "Cataract risk (long-term)",
    ],
    monitoring: [
      "Weight, BMI, glucose, lipids",
      "Eye exam for cataracts",
      "Blood pressure / heart rate",
    ],
  },

  {
    generic_name: "Risperidone",
    drug_class: "Atypical antipsychotic",
    plain_language:
      "A widely used antipsychotic. Higher doses can cause movement side effects and raise prolactin (affecting periods, libido, milk production). Lower doses are used in children for autism-related irritability.",
    mechanism:
      "Potent D2 and 5-HT2A antagonist; dose-dependent extrapyramidal symptoms (EPS) and prolactin elevation.",
    common_uses: [
      "Schizophrenia (oral; LAI Consta / Perseris)",
      "Bipolar mania and maintenance",
      "Autism-related irritability (ages 5–16)",
      "Adjunct in depression (low dose)",
    ],
    side_effects: [
      "Dose-dependent EPS / parkinsonism",
      "Hyperprolactinemia (galactorrhea, amenorrhea)",
      "Weight gain",
      "Sedation, dizziness",
      "Sexual dysfunction",
    ],
    monitoring: [
      "Weight, BMI, glucose, lipids",
      "Prolactin (if symptomatic)",
      "EPS exam / AIMS",
    ],
  },

  {
    generic_name: "Paliperidone",
    drug_class: "Atypical antipsychotic",
    plain_language:
      "The active form of risperidone, given as a daily pill or a long-acting injection (monthly or 3-monthly). Similar to risperidone: movement effects and raised prolactin are possible.",
    mechanism:
      "D2 and 5-HT2A antagonist; 9-hydroxyrisperidone (active metabolite of risperidone) with minimal hepatic metabolism (largely renally cleared).",
    common_uses: [
      "Schizophrenia (oral + monthly / 3-monthly LAI)",
      "Schizoaffective disorder",
      "Bipolar mania / maintenance (off-label)",
    ],
    side_effects: [
      "Dose-dependent EPS",
      "Hyperprolactinemia",
      "Sedation",
      "Tachycardia, orthostatic hypotension",
      "Injection-site reactions (LAI)",
      "Weight gain / metabolic risk",
    ],
    monitoring: [
      "Weight, BMI, glucose, lipids",
      "Renal function (dose adjust in renal impairment)",
      "Prolactin / EPS",
    ],
  },

  {
    generic_name: "Clozapine",
    drug_class: "Atypical antipsychotic",
    plain_language:
      "The strongest antipsychotic, reserved for schizophrenia that has not responded to others, and to reduce suicide risk. Requires regular blood tests because it can lower infection-fighting white cells.",
    mechanism:
      "Broad multi-receptor antagonist (D2, 5-HT2A, D4, M1, H1, alpha); unique efficacy in treatment-resistant schizophrenia; requires REMS-mandated blood monitoring.",
    common_uses: [
      "Treatment-resistant schizophrenia",
      "Reducing recurrent suicidal behavior in schizophrenia / schizoaffective",
      "Treatment-resistant bipolar disorder (off-label)",
    ],
    side_effects: [
      "Severe neutropenia / agranulocytosis (needs CBC monitoring)",
      "Sialorrhea (excess saliva)",
      "Sedation",
      "Constipation (risk of ileus)",
      "Myocarditis (first ~6 weeks)",
      "Seizures (dose-related)",
      "Weight gain and metabolic changes",
      "Orthostatic hypotension",
    ],
    monitoring: [
      "ANC / CBC (weekly → monthly per REMS)",
      "Fasting glucose + lipids",
      "Troponin / CRP for myocarditis early on",
      "Bowel function (constipation)",
      "Weight / BMI",
    ],
  },

  {
    generic_name: "Ziprasidone",
    drug_class: "Atypical antipsychotic",
    plain_language:
      "An antipsychotic that is weight-neutral but can affect the heart's electrical rhythm (QTc), so it is taken with food and may need an ECG check. Causes less weight gain than many others.",
    mechanism:
      "D2 and 5-HT2A antagonist with 5-HT1A agonism and monoamine reuptake inhibition; QTc prolongation more than most atypicals; absorption doubled with food.",
    common_uses: [
      "Schizophrenia",
      "Bipolar mania and maintenance",
      "Acute agitation (IM)",
    ],
    side_effects: [
      "QTc prolongation",
      "Akathisia / activation at low doses",
      "Sedation and EPS at high doses",
      "Nausea, dry mouth",
      "DRESS (rare)",
      "Low metabolic / weight burden",
    ],
    monitoring: [
      "ECG (QTc) if risk factors",
      "Electrolytes (potassium, magnesium)",
      "Weight, glucose, lipids",
    ],
  },

  {
    generic_name: "Lurasidone",
    drug_class: "Atypical antipsychotic",
    plain_language:
      "A weight-neutral antipsychotic for schizophrenia and bipolar depression. Must be taken with a meal (at least 350 calories) or it is not absorbed well. Can cause restlessness (akathisia).",
    mechanism:
      "D2 and 5-HT2A antagonist with 5-HT7 antagonism and 5-HT1A partial agonism; low metabolic burden; CYP3A4 substrate with food-dependent absorption.",
    common_uses: [
      "Schizophrenia",
      "Bipolar depression (monotherapy + adjunct)",
      "Mania (off-label)",
    ],
    side_effects: [
      "Akathisia",
      "Sedation",
      "Nausea",
      "Dose-dependent hyperprolactinemia (mild)",
      "Low weight gain",
    ],
    monitoring: [
      "Weight, glucose, lipids (periodic)",
      "Renal / hepatic (dose adjust)",
      "EPS / akathisia",
    ],
  },

  {
    generic_name: "Asenapine",
    drug_class: "Atypical antipsychotic",
    plain_language:
      "An antipsychotic that dissolves under the tongue (sublingual) or comes as a skin patch. Numbness or a bitter taste in the mouth is common. Used for schizophrenia and bipolar mania.",
    mechanism:
      "D2 and 5-HT2A antagonist with 5-HT1A partial agonism; sublingual (do not swallow; avoid food/drink 10 min) or transdermal delivery.",
    common_uses: [
      "Schizophrenia (sublingual, transdermal)",
      "Bipolar mania and maintenance",
    ],
    side_effects: [
      "Oral hypoesthesia (numb mouth)",
      "Dysgeusia (taste disturbance)",
      "EPS / akathisia",
      "Sedation",
      "Orthostatic hypotension",
      "Hypersensitivity reactions (rare)",
      "Weight gain / metabolic risk",
    ],
    monitoring: [
      "Weight, glucose, lipids",
      "EPS exam",
      "Blood pressure (orthostasis)",
    ],
  },

  {
    generic_name: "Iloperidone",
    drug_class: "Atypical antipsychotic",
    plain_language:
      "An antipsychotic that needs slow titration to avoid low blood pressure on standing. Causes less weight gain and movement effects than some others, but can affect heart rhythm (QTc).",
    mechanism:
      "D2 and 5-HT2A antagonist with strong alpha-1 blockade (orthostasis) and QTc prolongation; CYP2D6/3A4 substrate requiring dose adjustment with inhibitors.",
    common_uses: ["Schizophrenia", "Bipolar mania (off-label)"],
    side_effects: [
      "Orthostatic hypotension",
      "Dizziness, sedation",
      "Dry mouth, nasal congestion",
      "Tachycardia",
      "Modest weight gain",
      "QTc prolongation",
    ],
    monitoring: [
      "ECG (QTc) at baseline / dose changes",
      "Blood pressure (orthostasis)",
      "Weight, glucose, lipids",
    ],
  },

  {
    generic_name: "Lumateperone",
    drug_class: "Atypical antipsychotic",
    plain_language:
      "A newer antipsychotic for schizophrenia and bipolar depression. Single 42 mg dose, low risk of movement or metabolic side effects, but can be sedating.",
    mechanism:
      "5-HT2A antagonist plus D2 presynaptic partial agonist / postsynaptic antagonist; modulates glutamate via D1. Low EPS/metabolic burden; avoid strong CYP3A4 inhibitors/inducers and valproate (UGT inhibition).",
    common_uses: [
      "Schizophrenia (adults)",
      "Bipolar depression (type I and II)",
    ],
    side_effects: [
      "Somnolence / sedation",
      "Dry mouth",
      "Nausea",
      "Dizziness",
      "Low EPS / weight / metabolic risk",
    ],
    monitoring: [
      "Weight, glucose, lipids (routine)",
      "Sedation / fall risk",
      "Avoid strong CYP3A4 modulators + valproate",
    ],
  },

  {
    generic_name: "Cariprazine",
    drug_class: "Atypical antipsychotic (D3/D2 partial agonist)",
    plain_language:
      "A partial dopamine agonist (like aripiprazole but more D3-selective) for schizophrenia, bipolar mania, and bipolar depression. Stays in the body for weeks. Can cause restlessness and stomach upset.",
    mechanism:
      "D3/D2 partial agonist (preferentially D3) plus 5-HT1A partial agonist; long-lasting active metabolites (weeks); may improve negative symptoms.",
    common_uses: [
      "Schizophrenia (acute + maintenance)",
      "Bipolar mania / mixed",
      "Bipolar depression",
      "Adjunct in major depression (off-label)",
    ],
    side_effects: [
      "Akathisia",
      "EPS",
      "Nausea / GI upset",
      "Sedation",
      "Delayed effects (long half-life)",
    ],
    monitoring: [
      "Weight, glucose, lipids",
      "EPS / akathisia (AIMS)",
      "CYP3A4 interactions",
    ],
  },

  {
    generic_name: "Brexpiprazole",
    drug_class: "Atypical antipsychotic (D2 partial agonist)",
    plain_language:
      "A partial dopamine agonist used for schizophrenia and added to antidepressants for depression. Less activation/restlessness than aripiprazole; can cause weight gain.",
    mechanism:
      "D2 partial agonist (lower intrinsic activity than aripiprazole) plus 5-HT1A partial agonist and 5-HT2A antagonist; used adjunctively for major depression.",
    common_uses: [
      "Schizophrenia",
      "Adjunct in major depression",
      "Agitation in Alzheimer's dementia (off-label)",
    ],
    side_effects: [
      "Weight gain",
      "Dose-dependent akathisia",
      "Sedation",
      "Headache",
      "Impulse-control problems (rare)",
    ],
    monitoring: [
      "Weight, glucose, lipids",
      "AIMS",
      "CYP2D6/3A4 interactions",
    ],
  },

  {
    generic_name: "Blonanserin",
    drug_class: "Atypical antipsychotic (not US-approved)",
    plain_language:
      "An antipsychotic approved in Japan and parts of Asia (not the US). Blocks dopamine and serotonin; low weight gain but can cause movement side effects and insomnia.",
    mechanism:
      "D2 and 5-HT2A antagonist (relatively high D2 affinity); available in Japan, Korea, China.",
    common_uses: ["Schizophrenia (Japan / Korea / China)"],
    side_effects: [
      "Akathisia",
      "EPS / parkinsonism",
      "Insomnia, anxiety",
      "Sedation",
      "Urinary retention",
      "Low weight gain",
    ],
    monitoring: ["EPS (AIMS)", "Weight, glucose, lipids (class monitoring)", "QTc if risk factors"],
  },

  {
    generic_name: "Perospirone",
    drug_class: "Atypical antipsychotic (Japan-only)",
    plain_language:
      "An antipsychotic used only in Japan. Similar to risperidone; can cause movement side effects, insomnia, and elevated creatine kinase.",
    mechanism: "D2 and 5-HT2A antagonist with 5-HT1A partial agonism; Japan-only.",
    common_uses: ["Schizophrenia (Japan)"],
    side_effects: [
      "EPS / akathisia",
      "Insomnia",
      "Sedation, anxiety",
      "Elevated creatine kinase",
      "Low weight gain",
    ],
    monitoring: ["EPS (AIMS)", "Creatine kinase if symptomatic", "Weight, glucose, lipids (class)"],
  },

  {
    generic_name: "Sertindole",
    drug_class: "Atypical antipsychotic (EU; not US-approved)",
    plain_language:
      "An antipsychotic used in Europe only, for patients who cannot tolerate others. Requires ECG monitoring because it can prolong the heart's QTc interval.",
    mechanism:
      "D2 and 5-HT2A antagonist with strong alpha-1 blockade; marked QTc prolongation makes ECG monitoring mandatory.",
    common_uses: ["Schizophrenia (EU; intolerant to ≥1 other antipsychotic)"],
    side_effects: [
      "QTc prolongation",
      "Orthostatic hypotension",
      "Dizziness",
      "Weight gain, peripheral edema",
      "Nasal congestion, dry mouth",
      "Decreased ejaculate volume",
    ],
    monitoring: [
      "ECG at baseline + steady state + every 3 months",
      "Potassium and magnesium",
      "Weight, glucose, lipids",
    ],
  },

  {
    generic_name: "Zotepine",
    drug_class: "Atypical antipsychotic (not US-approved)",
    plain_language:
      "An antipsychotic used in Japan and parts of Europe. Can be sedating and cause weight gain; at higher doses it raises seizure risk and can affect heart rhythm.",
    mechanism:
      "D2 and 5-HT2A antagonist with norepinephrine reuptake inhibition; QTc prolongation and dose-related seizure risk.",
    common_uses: ["Schizophrenia (Japan, some EU countries)"],
    side_effects: [
      "Sedation",
      "Weight gain",
      "Dry mouth, constipation",
      "Tachycardia, hypotension",
      "Dose-dependent QTc prolongation",
      "Seizures (>300 mg/day)",
    ],
    monitoring: ["ECG (QTc)", "Weight, glucose, lipids (class)", "Seizure precautions at high dose"],
  },

  // ===========================================================================
  // TYPICAL (FIRST-GENERATION) ANTIPSYCHOTICS
  // ===========================================================================

  {
    generic_name: "Haloperidol",
    drug_class: "Typical (first-generation) antipsychotic",
    plain_language:
      "A powerful older antipsychotic. Very effective for psychosis and agitation, but commonly causes muscle stiffness, restlessness, and tremor; long-term use risks tardive dyskinesia.",
    mechanism:
      "Potent D2 antagonist (high-potency typical); strong EPS risk; available oral, IM, and long-acting decanoate.",
    common_uses: [
      "Schizophrenia / psychotic disorders (oral, IM, LAI)",
      "Tourette disorder (tics)",
      "Acute agitation / delirium (often with lorazepam)",
    ],
    side_effects: [
      "Akathisia",
      "Drug-induced parkinsonism",
      "Tardive dyskinesia / dystonia",
      "Prolactin elevation (galactorrhea, amenorrhea)",
      "Sedation",
      "QTc prolongation (esp. IV)",
      "Neuroleptic malignant syndrome (rare)",
    ],
    monitoring: ["AIMS (tardive dyskinesia)", "ECG if QTc risk", "EPS exam", "Weight / metabolic (class)"],
  },

  {
    generic_name: "Chlorpromazine",
    drug_class: "Typical (first-generation) antipsychotic",
    plain_language:
      "The first antipsychotic, still used today. Low potency: very sedating and can lower blood pressure, with anticholinergic effects. Also used for hiccups and nausea.",
    mechanism:
      "Low-potency D2 antagonist with strong H1, M1, and alpha-1 blockade (sedation, anticholinergic, hypotension).",
    common_uses: [
      "Schizophrenia",
      "Severe agitation (IM)",
      "Nausea / vomiting",
      "Intractable hiccups",
      "Acute intermittent porphyria",
    ],
    side_effects: [
      "Sedation",
      "Orthostatic hypotension",
      "Anticholinergic effects (dry mouth, constipation, blurred vision)",
      "EPS / akathisia",
      "Photosensitivity",
      "Weight gain",
      "Priapism (rare)",
    ],
    monitoring: ["Blood pressure (orthostasis)", "AIMS", "Weight / metabolic", "ECG (QTc) if risk"],
  },

  {
    generic_name: "Fluphenazine",
    drug_class: "Typical (first-generation) antipsychotic",
    plain_language:
      "A high-potency first-generation antipsychotic, often given as a long-acting injection (decanoate) every 2 weeks. More movement side effects, less sedation than low-potency drugs.",
    mechanism: "High-potency D2 antagonist (piperazine phenothiazine); available oral and decanoate LAI.",
    common_uses: [
      "Schizophrenia / psychotic disorders",
      "Bipolar disorder (off-label)",
      "Maintenance via decanoate LAI",
    ],
    side_effects: [
      "EPS (akathisia, parkinsonism)",
      "Tardive dyskinesia",
      "Prolactin elevation",
      "Sedation (less than low-potency)",
      "Anticholinergic effects",
      "Depression",
    ],
    monitoring: ["AIMS", "EPS exam", "Weight / metabolic", "Injection-site (LAI)"],
  },

  {
    generic_name: "Flupenthixol",
    drug_class: "Typical (first-generation) antipsychotic (not US-approved)",
    plain_language:
      "A first-generation antipsychotic used mainly in Europe, as a pill or long-acting injection. Low doses are sometimes used for depression; can cause movement side effects.",
    mechanism:
      "D2 antagonist (thioxanthene); oral + decanoate LAI; low-dose activating / antidepressant properties.",
    common_uses: [
      "Schizophrenia (oral + depot LAI)",
      "Depression (low dose, off-label)",
    ],
    side_effects: [
      "EPS / parkinsonism",
      "Insomnia, restlessness",
      "Tardive dyskinesia",
      "Prolactin elevation",
      "Weight gain",
      "Hypomania (rare)",
    ],
    monitoring: ["AIMS", "EPS exam", "Weight / metabolic"],
  },

  {
    generic_name: "Zuclopenthixol",
    drug_class: "Typical (first-generation) antipsychotic (not US-approved)",
    plain_language:
      "A first-generation antipsychotic used in Europe; the acetate injection calms acute agitation quickly, and the decanoate injection is a long-acting maintenance form.",
    mechanism: "D2 antagonist (thioxanthene); oral, acetate (acute, 2–3 day duration), decanoate (2–4 week LAI).",
    common_uses: [
      "Schizophrenia (acute + maintenance)",
      "Aggression",
      "Bipolar disorder (off-label)",
    ],
    side_effects: [
      "EPS / parkinsonism",
      "Tardive dyskinesia",
      "Sedation (esp. acetate)",
      "Prolactin elevation",
      "Weight gain",
      "Priapism (rare)",
    ],
    monitoring: ["AIMS", "EPS exam", "Sedation / respiratory (acetate)", "Weight / metabolic"],
  },

  {
    generic_name: "Trifluoperazine",
    drug_class: "Typical (first-generation) antipsychotic",
    plain_language:
      "A high-potency first-generation antipsychotic. Mainly movement side effects; short-term low doses were once used for anxiety. Less sedation than chlorpromazine.",
    mechanism: "High-potency D2 antagonist (piperazine phenothiazine).",
    common_uses: [
      "Schizophrenia",
      "Nonpsychotic anxiety (short-term, second-line)",
    ],
    side_effects: [
      "EPS (akathisia, parkinsonism)",
      "Tardive dyskinesia",
      "Prolactin elevation",
      "Transient sedation",
      "Dry mouth, constipation",
      "Hypotension",
    ],
    monitoring: ["AIMS", "EPS exam", "Weight / metabolic"],
  },

  {
    generic_name: "Thioridazine",
    drug_class: "Typical (first-generation) antipsychotic",
    plain_language:
      "An older low-potency antipsychotic now rarely used because at high doses it can cause dangerous heart rhythm problems and eye damage (retinopathy). Reserved for patients failing other drugs.",
    mechanism:
      "Low-potency D2 antagonist with marked QTc prolongation and pigmentary retinopathy at high dose; CYP2D6 inhibition interactions can raise levels dangerously.",
    common_uses: ["Schizophrenia refractory to other antipsychotics"],
    side_effects: [
      "QTc prolongation / arrhythmia",
      "Pigmentary retinopathy (high dose)",
      "Sedation",
      "Anticholinergic effects",
      "EPS / akathisia",
      "Sexual dysfunction",
    ],
    monitoring: [
      "ECG + serum potassium (baseline + periodic)",
      "Eye exam",
      "AIMS",
      "Avoid CYP2D6 inhibitors",
    ],
  },

  {
    generic_name: "Loxapine",
    drug_class: "Typical (first-generation) antipsychotic",
    plain_language:
      "An older antipsychotic also available as an inhaled powder for rapid control of agitation. More sedating; can cause movement effects and, rarely, breathing problems when inhaled.",
    mechanism:
      "D2 antagonist (dibenzoxazepine) with notable 5-HT2A antagonism; oral + inhaled (Adasuve) forms; N-desmethyl metabolite is amoxapine.",
    common_uses: ["Schizophrenia", "Acute agitation (inhaled)"],
    side_effects: [
      "Sedation",
      "EPS / akathisia",
      "Tardive dyskinesia",
      "Bronchospasm (inhaled)",
      "Tachycardia, hypotension",
      "Prolactin elevation",
    ],
    monitoring: ["AIMS", "Pulmonary screening (inhaled)", "Weight / metabolic"],
  },

  {
    generic_name: "Molindone",
    drug_class: "Typical (first-generation) antipsychotic",
    plain_language:
      "An older first-generation antipsychotic that is unusual for causing little or no weight gain. No longer widely available in the US.",
    mechanism: "D2 antagonist (dihydroindolone); weight-neutral or possible weight loss; no longer marketed in the US.",
    common_uses: ["Schizophrenia (largely historical / not available in the US)"],
    side_effects: [
      "EPS / akathisia",
      "Tardive dyskinesia",
      "Prolactin elevation",
      "Sedation",
      "Dry mouth, constipation",
    ],
    monitoring: ["AIMS", "EPS exam", "Weight (monitor for loss)"],
  },

  {
    generic_name: "Pimozide",
    drug_class: "Typical (first-generation) antipsychotic",
    plain_language:
      "A first-generation antipsychotic mainly for Tourette disorder that has not responded to other treatments. Needs ECG monitoring because it can dangerously prolong the heart's QTc, especially with certain other drugs.",
    mechanism:
      "D2 antagonist (diphenylbutylpiperidine); marked QTc prolongation; strong CYP3A4/2D6 interactions (fluoxetine contraindicated).",
    common_uses: [
      "Tourette disorder (tics) refractory to standard treatment",
      "Refractory psychosis",
    ],
    side_effects: [
      "QTc prolongation / arrhythmia",
      "EPS / akathisia",
      "Tardive dyskinesia",
      "Sedation",
      "Prolactin elevation",
      "Weight gain",
    ],
    monitoring: [
      "ECG (baseline + titration)",
      "Serum potassium",
      "CYP3A4/2D6 interactions (avoid)",
      "AIMS",
    ],
  },

  {
    generic_name: "Pipothiazine",
    drug_class: "Typical (first-generation) antipsychotic (not US-approved)",
    plain_language:
      "A long-acting injectable first-generation antipsychotic used mainly in the UK and Australia, given about once a month for maintenance.",
    mechanism: "D2 antagonist (phenothiazine); palmitate depot injection (~monthly).",
    common_uses: ["Maintenance treatment of schizophrenia (depot LAI)"],
    side_effects: [
      "EPS",
      "Tardive dyskinesia",
      "Insomnia / restlessness",
      "Prolactin elevation",
      "Weight gain",
      "Hypotension, tachycardia",
    ],
    monitoring: ["AIMS", "EPS exam", "Weight / metabolic"],
  },

  {
    generic_name: "Thiothixene",
    drug_class: "Typical (first-generation) antipsychotic",
    plain_language:
      "A first-generation antipsychotic (thioxanthene) similar to other high-potency drugs; movement side effects and prolactin elevation are common.",
    mechanism: "High-potency D2 antagonist (thioxanthene).",
    common_uses: ["Schizophrenia"],
    side_effects: [
      "EPS (akathisia, parkinsonism)",
      "Tardive dyskinesia",
      "Prolactin elevation",
      "Sedation",
      "Dry mouth, constipation",
      "Hypotension",
    ],
    monitoring: ["AIMS", "EPS exam", "Weight / metabolic"],
  },

  {
    generic_name: "Cyamemazine",
    drug_class: "Typical (first-generation) antipsychotic (not US-approved)",
    plain_language:
      "A French first-generation antipsychotic that at low doses acts as a sedative/anxiolytic, and at high doses treats psychosis. Rarely used outside France.",
    mechanism:
      "D2 antagonist with potent 5-HT2A/5-HT2C antagonism; low-dose anxiolytic, high-dose antipsychotic profile.",
    common_uses: [
      "Schizophrenia (France)",
      "Anxiety (short-term)",
      "Severe depression (adjunct)",
      "Acute agitation (injection)",
    ],
    side_effects: [
      "Dose-dependent sedation",
      "Anticholinergic effects",
      "EPS / akathisia",
      "Hypotension, tachycardia",
      "Weight gain",
    ],
    monitoring: ["AIMS", "Weight / metabolic", "QTc if risk factors"],
  },

  {
    generic_name: "Pimavanserin",
    drug_class: "Atypical antipsychotic (5-HT2A inverse agonist)",
    plain_language:
      "A different kind of antipsychotic that targets only serotonin 2A receptors (no dopamine blockade), so it does not worsen movement symptoms. Used specifically for hallucinations/delusions in Parkinson's disease.",
    mechanism:
      "Selective 5-HT2A inverse agonist / antagonist (minimal D2 activity); avoids worsening parkinsonism; QTc prolongation possible.",
    common_uses: ["Hallucinations and delusions in Parkinson's disease psychosis"],
    side_effects: [
      "Peripheral edema",
      "Confusion",
      "Nausea",
      "QTc prolongation",
      "Low EPS / weight risk",
    ],
    monitoring: ["ECG (QTc)", "Fall / confusion risk", "CYP3A4 interactions (dose adjust)"],
  },

  // ===========================================================================
  // MOOD STABILIZERS / ANTICONVULSANTS
  // ===========================================================================

  {
    generic_name: "Lithium",
    drug_class: "Mood stabilizer",
    plain_language:
      "The gold-standard mood stabilizer for bipolar disorder, especially mania and preventing suicide. Needs regular blood tests to keep the level safe — too low does not work, too high is toxic.",
    mechanism:
      "Multiple actions — inhibits inositol monophosphatase and glycogen synthase kinase-3, modulates intracellular signaling; narrow therapeutic index requiring serum-level monitoring.",
    common_uses: [
      "Bipolar mania and maintenance",
      "Bipolar depression",
      "Reducing suicide risk",
      "Adjunct in major depression",
      "Off-label: neutropenia, vascular headache",
    ],
    side_effects: [
      "Tremor",
      "Polyuria / polydipsia (nephrogenic diabetes insipidus)",
      "Weight gain",
      "Nausea, diarrhea",
      "Hypothyroidism / goiter",
      "Acne, rash",
      "Cognitive dulling",
      "Toxicity: ataxia, confusion, dysarthria",
    ],
    monitoring: [
      "Serum lithium level (trough, 12 h after dose)",
      "Renal function (creatinine)",
      "Thyroid function (TSH)",
      "Electrolytes",
      "ECG if >50 y or cardiac history",
      "Pregnancy counseling",
    ],
  },

  {
    generic_name: "Carbamazepine",
    drug_class: "Mood stabilizer / anticonvulsant",
    plain_language:
      "A mood stabilizer and seizure drug. It speeds up how the liver processes many other medications, and can cause dangerous skin reactions in people with a certain gene (HLA-B*1502), more common in some Asian populations.",
    mechanism:
      "Voltage-gated sodium channel blocker; potent CYP3A4 inducer (auto-induction plus many drug interactions).",
    common_uses: [
      "Bipolar mania / mixed (Equetro)",
      "Partial and tonic-clonic seizures",
      "Trigeminal neuralgia",
    ],
    side_effects: [
      "Sedation, dizziness, ataxia",
      "Nausea, vomiting",
      "Blurred vision / diplopia",
      "Benign transient leukopenia",
      "Rash (including Stevens-Johnson)",
      "Aplastic anemia / agranulocytosis (rare)",
      "SIADH / hyponatremia",
      "Induces its own metabolism",
    ],
    monitoring: [
      "CBC (every 2–4 wk for 2 months, then every 3–6 mo)",
      "LFTs, renal, thyroid",
      "Sodium (hyponatremia)",
      "Serum level",
      "HLA-B*1502 screen if Asian ancestry",
      "Drug-interaction review",
    ],
  },

  {
    generic_name: "Oxcarbazepine",
    drug_class: "Anticonvulsant (off-label mood stabilizer)",
    plain_language:
      "A 'cleaner' cousin of carbamazepine with fewer drug interactions, used for seizures and sometimes bipolar disorder. Watch for low blood sodium.",
    mechanism:
      "Sodium channel blocker; prodrug (MHD / licarbazepine active); fewer enzyme inductions than carbamazepine.",
    common_uses: ["Partial seizures", "Bipolar disorder (off-label)"],
    side_effects: [
      "Sedation, dizziness",
      "Ataxia, diplopia",
      "Nausea",
      "Rash",
      "Hyponatremia",
      "Modest weight gain",
    ],
    monitoring: ["Sodium (especially first 3 months)", "Weight", "LFTs if indicated"],
  },

  {
    generic_name: "Valproate",
    drug_class: "Mood stabilizer / anticonvulsant",
    plain_language:
      "A mood stabilizer and seizure drug, very effective for mania and migraine prevention. Avoid in women who could become pregnant (birth defect risk), and watch liver and platelets with blood tests.",
    mechanism:
      "Multiple actions — blocks voltage-gated sodium channels and increases GABA; inhibits CYP2C9 and UGT (raises lamotrigine levels).",
    common_uses: [
      "Bipolar mania / mixed",
      "Bipolar maintenance (off-label)",
      "Epilepsy (absence, complex partial, etc.)",
      "Migraine prophylaxis",
    ],
    side_effects: [
      "Sedation",
      "Tremor",
      "Nausea / GI upset",
      "Weight gain",
      "Alopecia",
      "Thrombocytopenia",
      "Hepatotoxicity (rare, severe — esp. children <2 y)",
      "Pancreatitis (rare)",
      "Teratogenic (neural tube defects)",
    ],
    monitoring: [
      "LFTs + CBC / platelets (baseline + first months)",
      "Serum valproate level",
      "Weight / BMI",
      "Pregnancy test / contraception counseling",
      "Ammonia if encephalopathy suspected",
    ],
  },

  {
    generic_name: "Lamotrigine",
    drug_class: "Mood stabilizer / anticonvulsant",
    plain_language:
      "A mood stabilizer best at preventing bipolar depression. The dose must be raised very slowly to avoid a serious rash (Stevens-Johnson). Works with minimal weight gain.",
    mechanism:
      "Voltage-gated sodium channel blocker; inhibits glutamate release; glucuronidated (valproate doubles levels, inducers halve).",
    common_uses: [
      "Bipolar maintenance (prevents depression)",
      "Bipolar depression",
      "Partial and generalized seizures",
      "Adjunct in unipolar depression (off-label)",
    ],
    side_effects: [
      "Rash (benign ~10%; rarely SJS/TEN)",
      "Dizziness, ataxia",
      "Blurred / double vision",
      "Headache, sedation",
      "Nausea",
      "Aseptic meningitis (rare)",
      "Weight-neutral",
    ],
    monitoring: [
      "Slow titration (rash prevention)",
      "Rash surveillance",
      "Dose adjust with valproate / carbamazepine",
      "Ophthalmologic checks (optional)",
    ],
  },

  {
    generic_name: "Levetiracetam",
    drug_class: "Anticonvulsant",
    plain_language:
      "A seizure drug with very few drug interactions, sometimes tried for mood and nerve pain. Can cause irritability, aggression, or mood changes.",
    mechanism:
      "Binds synaptic vesicle protein SV2A; not metabolized by CYP enzymes (renally cleared, minimal interactions).",
    common_uses: [
      "Partial and generalized seizures",
      "Myoclonic seizures (juvenile myoclonic epilepsy)",
      "Off-label: neuropathic pain, mania",
    ],
    side_effects: [
      "Sedation, dizziness",
      "Asthenia",
      "Behavioral changes (irritability, aggression)",
      "Anemia (rare)",
      "SJS / TEN (rare)",
    ],
    monitoring: ["Renal function (dose adjust)", "CBC if symptomatic", "Mood / behavior"],
  },

  {
    generic_name: "Zonisamide",
    drug_class: "Anticonvulsant",
    plain_language:
      "A seizure drug that often causes weight loss (so used off-label for that), but can cause kidney stones and should not be used in sulfa allergy.",
    mechanism:
      "Sodium and T-type calcium channel modulation; carbonic anhydrase inhibition (→ kidney stones, weight loss).",
    common_uses: [
      "Partial seizures (adjunct)",
      "Off-label: bipolar, migraine, weight loss, binge eating",
    ],
    side_effects: [
      "Sedation",
      "Difficulty concentrating",
      "Weight loss / anorexia",
      "Kidney stones",
      "Oligohidrosis / hyperthermia (pediatric)",
      "SJS / TEN (sulfonamide, rare)",
    ],
    monitoring: ["Renal function", "Weight", "Hydration (stones)", "Sulfa allergy screen"],
  },

  {
    generic_name: "Tiagabine",
    drug_class: "Anticonvulsant",
    plain_language:
      "A seizure drug that boosts GABA. Rarely used now because it can trigger seizures in people without epilepsy; limited benefit for the anxiety/pain it was tried for.",
    mechanism: "Selective GABA reuptake inhibitor (GAT-1); increases synaptic GABA.",
    common_uses: [
      "Partial seizures (adjunct)",
      "Off-label: anxiety, neuropathic pain (limited evidence)",
    ],
    side_effects: [
      "Sedation, dizziness",
      "Confusion, difficulty concentrating",
      "Tremor",
      "Nausea, diarrhea",
      "New-onset seizures / status epilepticus (in non-epileptics)",
    ],
    monitoring: ["Seizure watch (esp. non-epileptics)", "Ophthalmologic checks (long-term)", "Weight"],
  },

  {
    generic_name: "Gabapentin",
    drug_class: "Anticonvulsant (gabapentinoid)",
    plain_language:
      "A seizure and nerve-pain drug, widely used off-label for anxiety. Cleared by the kidneys; can cause sedation, dizziness, and weight gain. Misuse potential is growing.",
    mechanism:
      "Binds alpha-2-delta subunit of voltage-gated calcium channels (reduces neurotransmitter release); no direct GABA action; renally cleared.",
    common_uses: [
      "Partial seizures (adjunct)",
      "Postherpetic neuralgia",
      "Restless legs syndrome (ER)",
      "Off-label: neuropathic pain, anxiety",
    ],
    side_effects: [
      "Sedation",
      "Dizziness",
      "Ataxia",
      "Peripheral edema",
      "Weight gain",
      "Blurred vision",
      "Respiratory depression (with opioids)",
    ],
    monitoring: [
      "Renal function (dose adjust)",
      "Sedation / fall risk",
      "Respiratory depression if combined with opioids",
    ],
  },

  {
    generic_name: "Pregabalin",
    drug_class: "Anticonvulsant (gabapentinoid)",
    plain_language:
      "A gabapentin-like drug for nerve pain, fibromyalgia, and generalized anxiety in some countries. More predictable absorption than gabapentin; can cause dizziness, weight gain, and has misuse potential.",
    mechanism:
      "Binds alpha-2-delta subunit of voltage-gated calcium channels; renally cleared with no significant drug interactions.",
    common_uses: [
      "Diabetic peripheral neuropathy",
      "Postherpetic neuralgia",
      "Fibromyalgia",
      "Neuropathic pain (spinal cord injury)",
      "Generalized anxiety disorder (EU / other)",
      "Partial-onset seizures (adjunct)",
    ],
    side_effects: [
      "Dizziness",
      "Sedation",
      "Ataxia, tremor",
      "Peripheral edema",
      "Weight gain, increased appetite",
      "Blurred vision",
      "Euphoria / misuse potential",
    ],
    monitoring: [
      "Renal function (dose adjust)",
      "Sedation / fall risk",
      "Misuse / dependence counseling",
      "Respiratory depression if combined with opioids",
    ],
  },
];
