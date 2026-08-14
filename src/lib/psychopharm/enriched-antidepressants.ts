/**
 * Enriched antidepressant content — structured, student-safe, quote-first.
 *
 * One entry per drug: a student plain-language summary (what it is, what it is
 * for, the one thing to remember) plus a clinical summary (mechanism, common
 * uses, key side effects, monitoring). Every field is condensed from Stahl's
 * Prescriber's Guide, 7th ed. (source id `stahl_pg_7th`); each entry carries a
 * trailing comment citing the monograph page. Where a claim is not in Stahl or
 * is practice-dependent, it is flagged as uncertain rather than asserted.
 *
 * Class taxonomy: SSRI, SNRI, TCA, MAOI, RIMA, NaSSA, TeCA (tetracyclic),
 * NDRI, SARI, serotonin modulator, SPARI, melatonergic, NRI, atypical
 * (glutamatergic/opioid), NMDA antagonist.
 */

export interface EnrichedAntidepressant {
  generic_name: string;
  drug_class: string;
  plain_language: string;
  mechanism: string;
  common_uses: string[];
  side_effects: string[];
  monitoring: string[];
}

export const ENRICHED_ANTIDEPRESSANTS: EnrichedAntidepressant[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // SSRIs
  // ─────────────────────────────────────────────────────────────────────────
  {
    generic_name: "Fluoxetine",
    drug_class: "SSRI",
    plain_language:
      "An SSRI for depression, OCD, bulimia, panic, and PMDD. It raises brain serotonin by blocking its reuptake. Remember: it has a very long half-life, so it takes weeks to fully wash out and needs a long gap before starting an MAOI.",
    mechanism:
      "Blocks the serotonin reuptake pump (SERT), boosting serotonin; also blocks 5HT2C receptors, which may increase norepinephrine and dopamine.",
    common_uses: [
      "Major depressive disorder (adults and 8+)",
      "Obsessive-compulsive disorder",
      "Bulimia nervosa",
      "Panic disorder",
      "Premenstrual dysphoric disorder",
      "Bipolar depression (with olanzapine)",
    ],
    side_effects: [
      "Sexual dysfunction",
      "Nausea, diarrhea, decreased appetite",
      "Insomnia or sedation, agitation",
      "Sweating",
      "Bruising/bleeding, SIADH/hyponatremia",
    ],
    monitoring: [
      "Suicidal ideation early in treatment (esp. <25)",
      "Activation/agitation early on",
      "Weight and appetite",
      "Bleeding risk (with NSAIDs/anticoagulants)",
    ],
  }, // Stahl PG 7th p884

  {
    generic_name: "Sertraline",
    drug_class: "SSRI",
    plain_language:
      "An SSRI for depression, OCD, panic, PTSD, social anxiety, and PMDD. It boosts serotonin, with a small extra effect on dopamine. Remember: it is one of the best-studied SSRIs and generally weight-neutral.",
    mechanism:
      "Blocks SERT, boosting serotonin; also weakly blocks the dopamine transporter (DAT) and binds sigma-1 receptors.",
    common_uses: [
      "Major depressive disorder",
      "Obsessive-compulsive disorder",
      "Panic disorder",
      "Posttraumatic stress disorder",
      "Social anxiety disorder",
      "Premenstrual dysphoric disorder",
    ],
    side_effects: [
      "Sexual dysfunction (dose-dependent)",
      "Nausea, diarrhea, dry mouth",
      "Insomnia or sedation",
      "Hyponatremia (esp. elderly)",
      "Bruising/bleeding",
    ],
    monitoring: [
      "Suicidal ideation early in treatment",
      "Hyponatremia in elderly patients",
      "Bleeding risk",
    ],
  }, // Stahl PG 7th p2065

  {
    generic_name: "Paroxetine",
    drug_class: "SSRI",
    plain_language:
      "An SSRI for depression, OCD, panic, social anxiety, PTSD, and GAD. It is more sedating and causes more weight gain than other SSRIs. Remember: it has the worst discontinuation (withdrawal) syndrome of the SSRIs, so stopping it needs slow, careful dose reduction.",
    mechanism:
      "Blocks SERT, boosting serotonin; has mild anticholinergic and mild norepinephrine reuptake effects.",
    common_uses: [
      "Major depressive disorder",
      "Obsessive-compulsive disorder",
      "Panic disorder",
      "Social anxiety disorder",
      "Posttraumatic stress disorder",
      "Generalized anxiety disorder",
    ],
    side_effects: [
      "Sexual dysfunction",
      "Sedation, weight gain",
      "Anticholinergic: dry mouth, constipation",
      "Discontinuation syndrome on stopping",
      "SIADH/hyponatremia",
    ],
    monitoring: [
      "Suicidal ideation early in treatment",
      "Weight gain",
      "Discontinuation symptoms when tapering",
    ],
  }, // Stahl PG 7th p1708

  {
    generic_name: "Fluvoxamine",
    drug_class: "SSRI",
    plain_language:
      "An SSRI used mainly for OCD, with some use in social anxiety. It boosts serotonin and is more sedating than most SSRIs. Remember: it strongly inhibits several liver (CYP) enzymes, so it causes many drug interactions.",
    mechanism:
      "Blocks SERT, boosting serotonin; also binds sigma-1 receptors, which may contribute to sedation.",
    common_uses: [
      "Obsessive-compulsive disorder (primary)",
      "Social anxiety disorder (CR)",
      "Depression",
      "Panic disorder",
    ],
    side_effects: [
      "Sexual dysfunction",
      "Nausea, diarrhea, dry mouth",
      "Sedation and fatigue",
      "Insomnia",
      "Hyponatremia",
    ],
    monitoring: [
      "Suicidal ideation early in treatment",
      "CYP interactions (inhibits 1A2, 2C9/19, 3A4)",
      "Sedation",
    ],
  }, // Stahl PG 7th p956

  {
    generic_name: "Citalopram",
    drug_class: "SSRI",
    plain_language:
      "An SSRI for depression (and off-label anxiety disorders). It boosts serotonin but can prolong the heart's QT interval at higher doses. Remember: the FDA caps the dose at 40 mg/day (20 mg in many older adults) because of QT risk.",
    mechanism:
      "Blocks SERT, boosting serotonin; mild H1 histamine antagonism can cause some sedation.",
    common_uses: [
      "Major depressive disorder",
      "Generalized anxiety disorder",
      "Panic disorder",
      "Obsessive-compulsive disorder",
      "Premenstrual dysphoric disorder",
    ],
    side_effects: [
      "Sexual dysfunction",
      "Nausea, dry mouth",
      "Insomnia or sedation",
      "QTc prolongation (dose-dependent)",
      "Hyponatremia/SIADH",
    ],
    monitoring: [
      "QTc (max 40 mg/day; 20 mg in many elderly)",
      "Suicidal ideation early in treatment",
      "Hyponatremia",
    ],
  }, // Stahl PG 7th p468

  {
    generic_name: "Escitalopram",
    drug_class: "SSRI",
    plain_language:
      "An SSRI for depression and generalized anxiety (also panic, OCD, PTSD). It is the active S-enantiomer of citalopram and is highly selective for serotonin. Remember: it is generally well tolerated and has fewer drug interactions than most SSRIs.",
    mechanism:
      "Blocks SERT, boosting serotonin; highly selective with minimal off-target actions.",
    common_uses: [
      "Major depressive disorder",
      "Generalized anxiety disorder",
      "Panic disorder",
      "Obsessive-compulsive disorder",
      "Posttraumatic stress disorder",
    ],
    side_effects: [
      "Sexual dysfunction",
      "Nausea, diarrhea, dry mouth",
      "Insomnia or sedation",
      "Hyponatremia/SIADH",
      "Bruising/bleeding",
    ],
    monitoring: [
      "Suicidal ideation early in treatment",
      "Hyponatremia in elderly patients",
      "Bleeding risk",
    ],
  }, // Stahl PG 7th p789

  // ─────────────────────────────────────────────────────────────────────────
  // SNRIs
  // ─────────────────────────────────────────────────────────────────────────
  {
    generic_name: "Venlafaxine",
    drug_class: "SNRI",
    plain_language:
      "An SNRI for depression and anxiety (GAD, social anxiety, panic). It boosts both serotonin and norepinephrine, and at higher doses dopamine. Remember: it can raise blood pressure at higher doses, so BP should be checked.",
    mechanism:
      "Blocks SERT and NET (serotonin + norepinephrine reuptake); weakly blocks DAT, raising dopamine in frontal cortex.",
    common_uses: [
      "Major depressive disorder",
      "Generalized anxiety disorder",
      "Social anxiety disorder",
      "Panic disorder",
      "Posttraumatic stress disorder",
    ],
    side_effects: [
      "Nausea, decreased appetite",
      "Insomnia, headache, nervousness",
      "Sexual dysfunction",
      "Dose-dependent blood pressure increase",
      "Sweating, SIADH/hyponatremia",
    ],
    monitoring: [
      "Blood pressure (baseline and during treatment)",
      "Suicidal ideation early in treatment",
      "Discontinuation syndrome on stopping",
    ],
  }, // Stahl PG 7th p2399

  {
    generic_name: "Desvenlafaxine",
    drug_class: "SNRI",
    plain_language:
      "An SNRI for depression. It is the active metabolite of venlafaxine and works similarly but with fewer liver-enzyme interactions. Remember: it is mostly used for depression at a fixed 50 mg once-daily dose.",
    mechanism:
      "Blocks SERT and NET, boosting serotonin and norepinephrine (and frontal dopamine).",
    common_uses: [
      "Major depressive disorder",
      "Vasomotor symptoms (off-label)",
      "Generalized anxiety disorder (off-label)",
    ],
    side_effects: [
      "Nausea, constipation, decreased appetite",
      "Insomnia, sedation, dizziness",
      "Sexual dysfunction",
      "Blood pressure increase",
      "Sweating, hyponatremia",
    ],
    monitoring: [
      "Blood pressure (baseline and during treatment)",
      "Suicidal ideation early in treatment",
    ],
  }, // Stahl PG 7th p629

  {
    generic_name: "Duloxetine",
    drug_class: "SNRI",
    plain_language:
      "An SNRI used for depression, generalized anxiety, and several pain conditions (diabetic nerve pain, fibromyalgia, chronic musculoskeletal pain). It boosts serotonin and norepinephrine, which helps pain pathways. Remember: it can raise blood pressure and, rarely, injure the liver.",
    mechanism:
      "Blocks SERT and NET, boosting serotonin, norepinephrine, and frontal dopamine.",
    common_uses: [
      "Major depressive disorder",
      "Generalized anxiety disorder",
      "Diabetic peripheral neuropathic pain",
      "Fibromyalgia",
      "Chronic musculoskeletal pain",
      "Stress urinary incontinence",
    ],
    side_effects: [
      "Nausea, dry mouth, constipation",
      "Insomnia, sedation, dizziness",
      "Sexual dysfunction",
      "Blood pressure increase",
      "Urinary retention",
    ],
    monitoring: [
      "Blood pressure (baseline and during treatment)",
      "Liver function (rare hepatotoxicity)",
      "Suicidal ideation early in treatment",
    ],
  }, // Stahl PG 7th p768

  {
    generic_name: "Milnacipran",
    drug_class: "SNRI",
    plain_language:
      "An SNRI used mainly for fibromyalgia (and for depression outside the US). It favors norepinephrine over serotonin reuptake. Remember: it can raise blood pressure and heart rate, so monitor BP.",
    mechanism:
      "Blocks NET and SERT (norepinephrine > serotonin); weak NMDA antagonist action at high doses may help pain.",
    common_uses: [
      "Fibromyalgia (FDA-approved)",
      "Major depressive disorder (non-US)",
      "Neuropathic/chronic pain",
    ],
    side_effects: [
      "Blood pressure and heart-rate increase",
      "Nausea, dry mouth, constipation",
      "Urinary hesitancy/retention",
      "Sweating, sexual dysfunction",
      "Headache, insomnia",
    ],
    monitoring: [
      "Blood pressure and heart rate",
      "Suicidal ideation early in treatment",
    ],
  }, // Stahl PG 7th p1465

  {
    generic_name: "Levomilnacipran",
    drug_class: "SNRI",
    plain_language:
      "An SNRI for depression (the active enantiomer of milnacipran). It favors norepinephrine over serotonin. Remember: it can raise heart rate and blood pressure and cause urinary hesitancy.",
    mechanism:
      "Blocks NET and SERT (norepinephrine > serotonin), boosting noradrenergic and serotonergic transmission.",
    common_uses: [
      "Major depressive disorder",
      "Fibromyalgia (off-label)",
      "Neuropathic/chronic pain (off-label)",
    ],
    side_effects: [
      "Tachycardia, palpitations",
      "Nausea, constipation",
      "Hyperhidrosis (sweating)",
      "Erectile dysfunction",
      "Urinary hesitancy/retention",
    ],
    monitoring: [
      "Heart rate and blood pressure (baseline and during treatment)",
      "Suicidal ideation early in treatment",
    ],
  }, // Stahl PG 7th p1173

  // ─────────────────────────────────────────────────────────────────────────
  // Tricyclic antidepressants (TCAs)
  // ─────────────────────────────────────────────────────────────────────────
  {
    generic_name: "Amitriptyline",
    drug_class: "Tricyclic antidepressant (TCA)",
    plain_language:
      "An older TCA used for depression, nerve pain, migraine prevention, and low-dose insomnia. It is very sedating and causes weight gain. Remember: TCAs are dangerous in overdose (heart rhythm) and have many anticholinergic effects.",
    mechanism:
      "Blocks SERT and NET, boosting serotonin and norepinephrine; strong anticholinergic, antihistamine (H1), and alpha-1 blocking effects.",
    common_uses: [
      "Major depressive disorder",
      "Neuropathic/chronic pain",
      "Fibromyalgia, migraine prevention",
      "Insomnia (low dose)",
      "Anxiety",
    ],
    side_effects: [
      "Sedation, weight gain",
      "Dry mouth, constipation, blurred vision",
      "Urinary retention",
      "Orthostatic hypotension",
      "QTc prolongation, arrhythmias (esp. overdose)",
    ],
    monitoring: [
      "Baseline ECG (patients >50)",
      "Weight/BMI and metabolic markers",
      "Suicidal ideation early in treatment",
      "Cardiac status (overdose is fatal)",
    ],
  }, // Stahl PG 7th p89

  {
    generic_name: "Nortriptyline",
    drug_class: "Tricyclic antidepressant (TCA)",
    plain_language:
      "A TCA for depression and nerve pain. It is a metabolite of amitriptyline and is somewhat less sedating. Remember: it has a well-defined therapeutic blood-level window, so levels can be monitored.",
    mechanism:
      "Blocks NET (norepinephrine > serotonin), boosting noradrenergic transmission.",
    common_uses: [
      "Major depressive disorder",
      "Neuropathic/chronic pain",
      "Anxiety, insomnia",
      "Treatment-resistant depression",
    ],
    side_effects: [
      "Sedation (less than amitriptyline)",
      "Dry mouth, constipation",
      "Weight gain",
      "Orthostatic hypotension",
      "QTc prolongation (esp. overdose)",
    ],
    monitoring: [
      "Baseline ECG (patients >50)",
      "Plasma drug levels (therapeutic window)",
      "Weight/BMI",
      "Suicidal ideation early in treatment",
    ],
  }, // Stahl PG 7th p1595

  {
    generic_name: "Imipramine",
    drug_class: "Tricyclic antidepressant (TCA)",
    plain_language:
      "A TCA for depression and nerve pain, historically also used for childhood bedwetting (enuresis). It raises serotonin and norepinephrine. Remember: it is sedating and anticholinergic, with the same overdose danger as other TCAs.",
    mechanism:
      "Blocks SERT and NET, boosting serotonin and norepinephrine; anticholinergic effects explain its enuresis action.",
    common_uses: [
      "Major depressive disorder",
      "Enuresis (childhood)",
      "Neuropathic/chronic pain",
      "Anxiety, panic",
      "Treatment-resistant depression",
    ],
    side_effects: [
      "Sedation, weight gain",
      "Dry mouth, constipation, blurred vision",
      "Urinary retention",
      "Orthostatic hypotension",
      "QTc prolongation (esp. overdose)",
    ],
    monitoring: [
      "Baseline ECG (patients >50)",
      "Weight/BMI",
      "Suicidal ideation early in treatment",
    ],
  }, // Stahl PG 7th p1081

  {
    generic_name: "Desipramine",
    drug_class: "Tricyclic antidepressant (TCA)",
    plain_language:
      "A TCA for depression and nerve pain; the most norepinephrine-selective TCA. It is less sedating and less anticholinergic than many TCAs. Remember: it still carries the TCA overdose and cardiac risks.",
    mechanism:
      "Blocks NET (norepinephrine > serotonin), boosting noradrenergic transmission.",
    common_uses: [
      "Major depressive disorder",
      "Neuropathic/chronic pain",
      "Anxiety, insomnia",
      "Treatment-resistant depression",
    ],
    side_effects: [
      "Less sedation than most TCAs",
      "Dry mouth, constipation (milder)",
      "Orthostatic hypotension, tachycardia",
      "QTc prolongation (esp. overdose)",
      "Weight gain",
    ],
    monitoring: [
      "Baseline ECG (patients >50)",
      "Plasma drug levels (therapeutic window)",
      "Suicidal ideation early in treatment",
    ],
  }, // Stahl PG 7th p608

  {
    generic_name: "Clomipramine",
    drug_class: "Tricyclic antidepressant (TCA)",
    plain_language:
      "A TCA that is the most serotonin-selective and is best known for OCD. It is sedating and causes sexual dysfunction. Remember: it lowers the seizure threshold, and seizures become much more likely above 250 mg/day.",
    mechanism:
      "Blocks SERT (serotonin > norepinephrine), boosting serotonergic transmission.",
    common_uses: [
      "Obsessive-compulsive disorder (primary)",
      "Major depressive disorder",
      "Cataplexy",
      "Panic disorder",
      "Neuropathic/chronic pain",
    ],
    side_effects: [
      "Sedation, weight gain",
      "Dry mouth, constipation",
      "Sexual dysfunction",
      "Seizures (dose-dependent, >250 mg/day)",
      "Orthostatic hypotension, QTc prolongation",
    ],
    monitoring: [
      "Baseline ECG (patients >50)",
      "Seizure risk (esp. high doses)",
      "Plasma levels (specialty labs)",
      "Suicidal ideation early in treatment",
    ],
  }, // Stahl PG 7th p486

  {
    generic_name: "Doxepin",
    drug_class: "Tricyclic antidepressant (TCA)",
    plain_language:
      "A very sedating TCA used for depression/anxiety and, at very low doses (3–6 mg), for insomnia. A topical form treats itching. Remember: low-dose doxepin is essentially an antihistamine sleep aid, not an antidepressant dose.",
    mechanism:
      "At antidepressant doses blocks SERT and NET; at low (3–6 mg) doses potently blocks H1 histamine receptors to promote sleep.",
    common_uses: [
      "Major depressive disorder and anxiety",
      "Insomnia (3–6 mg at bedtime, Silenor)",
      "Pruritus/dermatitis (topical)",
      "Neuropathic/chronic pain",
    ],
    side_effects: [
      "Sedation (prominent)",
      "Weight gain, increased appetite",
      "Dry mouth, constipation",
      "Orthostatic hypotension",
      "QTc prolongation (esp. overdose)",
    ],
    monitoring: [
      "Baseline ECG (patients >50, not low-dose Silenor)",
      "Weight/BMI",
      "Suicidal ideation early in treatment",
    ],
  }, // Stahl PG 7th p744

  {
    generic_name: "Trimipramine",
    drug_class: "Tricyclic antidepressant (TCA)",
    plain_language:
      "A sedating TCA used for depression, anxiety, and insomnia. It raises serotonin and norepinephrine. Remember: like other TCAs it is anticholinergic, causes weight gain, and is dangerous in overdose.",
    mechanism:
      "Blocks SERT and NET, boosting serotonin and norepinephrine.",
    common_uses: [
      "Major depressive disorder",
      "Anxiety, insomnia",
      "Neuropathic/chronic pain",
      "Treatment-resistant depression",
    ],
    side_effects: [
      "Sedation (prominent)",
      "Weight gain",
      "Dry mouth, constipation",
      "Orthostatic hypotension",
      "QTc prolongation (esp. overdose)",
    ],
    monitoring: [
      "Baseline ECG (patients >50)",
      "Weight/BMI",
      "Suicidal ideation early in treatment",
    ],
  }, // Stahl PG 7th p2337

  {
    generic_name: "Protriptyline",
    drug_class: "Tricyclic antidepressant (TCA)",
    plain_language:
      "A TCA for depression that is the most activating (least sedating) of the TCAs. It is dosed at unusually low and frequent amounts (15–40 mg/day in 3–4 doses). Remember: it can be very anticholinergic and cause insomnia and activation.",
    mechanism:
      "Blocks NET (norepinephrine > serotonin), boosting noradrenergic transmission.",
    common_uses: [
      "Major depressive disorder",
      "Treatment-resistant depression",
    ],
    side_effects: [
      "Insomnia, activation (not sedating)",
      "Dry mouth, constipation, blurred vision (potent anticholinergic)",
      "Tachycardia, orthostatic hypotension",
      "QTc prolongation (esp. overdose)",
      "Weight gain",
    ],
    monitoring: [
      "Baseline ECG (patients >50)",
      "Suicidal ideation early in treatment",
      "Activation/insomnia",
    ],
  }, // Stahl PG 7th p1891

  {
    generic_name: "Amoxapine",
    drug_class: "Tricyclic/tetracyclic antidepressant",
    plain_language:
      "A TCA-like antidepressant with a metabolite that blocks dopamine receptors, giving it antipsychotic properties. It is used for depression, including depression with psychotic features. Remember: it can cause movement problems (parkinsonism, akathisia, tardive dyskinesia).",
    mechanism:
      "Blocks NET (norepinephrine > serotonin); its metabolite blocks D2 receptors, reducing psychotic symptoms.",
    common_uses: [
      "Major depressive disorder (incl. psychotic depression)",
      "Anxiety/agitation",
      "Neuropathic/chronic pain",
      "Treatment-resistant depression",
    ],
    side_effects: [
      "Drug-induced parkinsonism, akathisia, tardive dyskinesia",
      "Sedation, weight gain",
      "Dry mouth, constipation",
      "Seizures (dose-dependent)",
      "QTc prolongation (esp. overdose)",
    ],
    monitoring: [
      "Baseline ECG (patients >50)",
      "Extrapyramidal symptoms (EPS)",
      "Seizure risk",
      "Suicidal ideation early in treatment",
    ],
  }, // Stahl PG 7th p110

  {
    generic_name: "Lofepramine",
    drug_class: "Tricyclic antidepressant (TCA)",
    plain_language:
      "A TCA used for depression (available in the UK, not the US). It is less sedating and less cardiotoxic than older TCAs. Remember: its dose (140–210 mg/day) is unusual compared with most TCAs.",
    mechanism:
      "Blocks NET (norepinephrine > serotonin), boosting noradrenergic transmission.",
    common_uses: [
      "Major depressive disorder",
      "Anxiety, insomnia",
      "Neuropathic/chronic pain",
      "Treatment-resistant depression",
    ],
    side_effects: [
      "Sedation (less than older TCAs)",
      "Dry mouth, constipation (milder anticholinergic)",
      "Weight gain",
      "Orthostatic hypotension",
      "QTc prolongation (esp. overdose)",
    ],
    monitoring: [
      "Baseline ECG (patients >50)",
      "Weight/BMI",
      "Suicidal ideation early in treatment",
    ],
  }, // Stahl PG 7th p1228

  {
    generic_name: "Dothiepin",
    drug_class: "Tricyclic antidepressant (TCA)",
    plain_language:
      "A sedating TCA (dosulepin) used for depression (UK; not marketed in the US). It raises serotonin and norepinephrine. Remember: it is strongly cardiotoxic in overdose and more dangerous than many other TCAs.",
    mechanism:
      "Blocks SERT and NET, boosting serotonin and norepinephrine.",
    common_uses: [
      "Major depressive disorder",
      "Anxiety, insomnia",
      "Neuropathic/chronic pain",
      "Treatment-resistant depression",
    ],
    side_effects: [
      "Sedation (prominent)",
      "Weight gain",
      "Dry mouth, constipation",
      "Orthostatic hypotension",
      "QTc prolongation, arrhythmias (esp. overdose)",
    ],
    monitoring: [
      "Baseline ECG (patients >50)",
      "Weight/BMI",
      "Cardiac status (overdose risk)",
      "Suicidal ideation early in treatment",
    ],
  }, // Stahl PG 7th p724

  // ─────────────────────────────────────────────────────────────────────────
  // MAOIs
  // ─────────────────────────────────────────────────────────────────────────
  {
    generic_name: "Phenelzine",
    drug_class: "MAOI (irreversible)",
    plain_language:
      "An older irreversible MAOI used for atypical and treatment-resistant depression, panic, and social anxiety. It raises all three monoamines. Remember: it requires a low-tyramine diet to avoid a dangerous blood-pressure spike (hypertensive crisis).",
    mechanism:
      "Irreversibly blocks monoamine oxidase (MAO-A and MAO-B), raising norepinephrine, serotonin, and dopamine.",
    common_uses: [
      "Atypical depression",
      "Treatment-resistant depression",
      "Treatment-resistant panic disorder",
      "Treatment-resistant social anxiety disorder",
    ],
    side_effects: [
      "Orthostatic hypotension",
      "Weight gain (most of any MAOI)",
      "Sexual dysfunction (highest of MAOIs)",
      "Sedation, insomnia",
      "Hypertensive crisis with tyramine",
    ],
    monitoring: [
      "Blood pressure (before and 45–60 min after dose)",
      "Hepatic function (high dose/long-term)",
      "Weight/BMI",
      "Tyramine diet adherence",
    ],
  }, // Stahl PG 7th p1764

  {
    generic_name: "Tranylcypromine",
    drug_class: "MAOI (irreversible)",
    plain_language:
      "An irreversible MAOI for depression (and treatment-resistant panic/social anxiety) that is structurally related to amphetamine, so it is more activating. Remember: like phenelzine it requires a low-tyramine diet because of hypertensive-crisis risk.",
    mechanism:
      "Irreversibly blocks MAO (MAO-A and MAO-B); amphetamine-like structure adds stimulant effects.",
    common_uses: [
      "Major depressive disorder (non-melancholic)",
      "Treatment-resistant depression",
      "Treatment-resistant panic disorder",
      "Treatment-resistant social anxiety disorder",
    ],
    side_effects: [
      "Insomnia, agitation (activating)",
      "Orthostatic hypotension",
      "Weight gain",
      "Sexual dysfunction (less than phenelzine)",
      "Hypertensive crisis with tyramine",
    ],
    monitoring: [
      "Blood pressure (before and 45–60 min after dose)",
      "Hepatic function (high dose/long-term)",
      "Tyramine diet adherence",
    ],
  }, // Stahl PG 7th p2248

  {
    generic_name: "Isocarboxazid",
    drug_class: "MAOI (irreversible)",
    plain_language:
      "An irreversible MAOI for depression and treatment-resistant panic/social anxiety. It raises all three monoamines. Remember: it carries the same low-tyramine diet and hypertensive-crisis precautions as other irreversible MAOIs.",
    mechanism:
      "Irreversibly blocks MAO (MAO-A and MAO-B), raising norepinephrine, serotonin, and dopamine.",
    common_uses: [
      "Major depressive disorder",
      "Treatment-resistant depression",
      "Treatment-resistant panic disorder",
      "Treatment-resistant social anxiety disorder",
    ],
    side_effects: [
      "Orthostatic hypotension",
      "Sedation, insomnia",
      "Weight gain",
      "Sexual dysfunction",
      "Hypertensive crisis with tyramine",
    ],
    monitoring: [
      "Blood pressure (before and 45–60 min after dose)",
      "Hepatic function (high dose/long-term)",
      "Tyramine diet adherence",
    ],
  }, // Stahl PG 7th p1101

  {
    generic_name: "Selegiline",
    drug_class: "MAOI (MAO-B selective / transdermal)",
    plain_language:
      "A selective MAO-B inhibitor used orally for Parkinson's disease and as a transdermal patch for depression. The patch raises brain monoamines with less gut MAO inhibition. Remember: at low patch doses (6 mg/24 h) no tyramine diet is usually needed, but higher doses require one.",
    mechanism:
      "Oral (low dose) selectively, irreversibly blocks MAO-B; transdermal (recommended doses) blocks both MAO-A and MAO-B in brain while staying relatively MAO-B selective in the gut.",
    common_uses: [
      "Major depressive disorder (transdermal)",
      "Parkinson's disease (oral, adjunctive)",
      "Treatment-resistant depression (transdermal)",
    ],
    side_effects: [
      "Application-site reactions (patch)",
      "Insomnia",
      "Orthostatic hypotension",
      "Hypertensive crisis (high doses/tyramine)",
      "Headache, nausea",
    ],
    monitoring: [
      "Blood pressure",
      "Tyramine diet adherence (patch >6 mg/24 h)",
      "Hepatic function (high oral doses)",
    ],
  }, // Stahl PG 7th p2024

  {
    generic_name: "Moclobemide",
    drug_class: "RIMA (reversible MAO-A inhibitor)",
    plain_language:
      "A reversible MAO-A inhibitor (RIMA) for depression and social anxiety (not US-marketed). It raises norepinephrine and serotonin. Remember: because it is reversible, it has a much lower risk of tyramine-induced hypertensive crisis than older MAOIs.",
    mechanism:
      "Reversibly blocks MAO-A, raising norepinephrine, serotonin, and dopamine.",
    common_uses: [
      "Major depressive disorder",
      "Social anxiety disorder",
    ],
    side_effects: [
      "Insomnia, agitation",
      "Dizziness, restlessness",
      "Rare hypertension",
      "Galactorrhea (rare)",
    ],
    monitoring: [
      "Blood pressure",
      "Suicidal ideation early in treatment",
    ],
  }, // Stahl PG 7th p1500

  // ─────────────────────────────────────────────────────────────────────────
  // NaSSA, tetracyclic, NDRI, SARI, others
  // ─────────────────────────────────────────────────────────────────────────
  {
    generic_name: "Mirtazapine",
    drug_class: "NaSSA (noradrenergic and specific serotonergic antidepressant)",
    plain_language:
      "An antidepressant that works differently from SSRIs (it does not block serotonin reuptake). It is strongly sedating at low doses and increases appetite/weight. Remember: it is often chosen for depression with insomnia and poor appetite, and it rarely causes sexual dysfunction.",
    mechanism:
      "Blocks presynaptic alpha-2 receptors (raising NE and 5HT) and blocks 5HT2A/2C/3 and H1 receptors.",
    common_uses: [
      "Major depressive disorder",
      "Panic disorder",
      "Generalized anxiety disorder",
      "Posttraumatic stress disorder",
    ],
    side_effects: [
      "Sedation (esp. low doses)",
      "Weight gain, increased appetite",
      "Dry mouth, constipation",
      "Dizziness, hypotension",
      "Rare agranulocytosis (flu-like symptoms)",
    ],
    monitoring: [
      "Weight/BMI",
      "Blood count if blood dyscrasia risk (rare)",
      "Suicidal ideation early in treatment",
    ],
  }, // Stahl PG 7th p1484

  {
    generic_name: "Mianserin",
    drug_class: "NaSSA (tetracyclic)",
    plain_language:
      "An older NaSSA-like antidepressant (not US-marketed) used for depression, anxiety, and insomnia. It is sedating and increases appetite. Remember: it can rarely suppress blood-cell counts (agranulocytosis), so blood counts may need monitoring.",
    mechanism:
      "Blocks presynaptic alpha-2 receptors (raising NE) and blocks 5HT2A/2C/3 and H1 receptors.",
    common_uses: [
      "Major depressive disorder",
      "Anxiety, insomnia",
      "Treatment-resistant depression",
    ],
    side_effects: [
      "Sedation (prominent)",
      "Weight gain, increased appetite",
      "Rare blood dyscrasias (agranulocytosis)",
      "Rare seizures",
    ],
    monitoring: [
      "Blood count (agranulocytosis risk)",
      "Baseline ECG (patients >50)",
      "Weight/BMI",
      "Suicidal ideation early in treatment",
    ],
  }, // Stahl PG 7th p1441

  {
    generic_name: "Maprotiline",
    drug_class: "Tetracyclic antidepressant (TeCA)",
    plain_language:
      "A tetracyclic antidepressant that mainly raises norepinephrine, used for depression and anxiety. It is sedating and anticholinergic like a TCA. Remember: seizures become more likely at higher doses (especially above 200 mg/day).",
    mechanism:
      "Blocks NET (norepinephrine > serotonin), boosting noradrenergic transmission.",
    common_uses: [
      "Major depressive disorder",
      "Anxiety, insomnia",
      "Neuropathic/chronic pain",
      "Treatment-resistant depression",
    ],
    side_effects: [
      "Sedation, weight gain",
      "Dry mouth, constipation, blurred vision",
      "Orthostatic hypotension",
      "Seizures (dose-dependent, >200 mg/day)",
      "QTc prolongation (esp. overdose)",
    ],
    monitoring: [
      "Baseline ECG (patients >50)",
      "Seizure risk",
      "Weight/BMI",
      "Suicidal ideation early in treatment",
    ],
  }, // Stahl PG 7th p1355

  {
    generic_name: "Bupropion",
    drug_class: "NDRI (norepinephrine-dopamine reuptake inhibitor)",
    plain_language:
      "An antidepressant that raises norepinephrine and dopamine (not serotonin), used for depression, seasonal affective disorder, and smoking cessation. It is activating and can cause weight loss. Remember: it rarely causes sexual dysfunction, but it lowers the seizure threshold (especially at high doses).",
    mechanism:
      "Blocks NET and DAT, boosting norepinephrine and dopamine.",
    common_uses: [
      "Major depressive disorder",
      "Seasonal affective disorder",
      "Smoking cessation",
      "ADHD (off-label)",
      "Bipolar depression (as adjunct)",
    ],
    side_effects: [
      "Insomnia, agitation, tremor",
      "Dry mouth, nausea, anorexia/weight loss",
      "Hypertension",
      "Seizures (dose-dependent)",
      "No sexual dysfunction (unlike SSRIs)",
    ],
    monitoring: [
      "Blood pressure (baseline and periodically)",
      "Seizure risk (avoid high doses)",
      "Suicidal ideation early in treatment",
    ],
  }, // Stahl PG 7th p351

  {
    generic_name: "Trazodone",
    drug_class: "SARI (serotonin antagonist and reuptake inhibitor)",
    plain_language:
      "An antidepressant that blocks serotonin 2A receptors and weakly blocks serotonin reuptake. At low doses it is used as a sleep aid; full antidepressant doses are much higher. Remember: it is very sedating and rarely causes sexual dysfunction, but can rarely cause priapism (painful prolonged erection).",
    mechanism:
      "Potently blocks 5HT2A receptors and weakly blocks SERT; antihistamine and alpha-1 blockade cause sedation.",
    common_uses: [
      "Major depressive disorder",
      "Insomnia (low dose, off-label)",
      "Anxiety",
    ],
    side_effects: [
      "Sedation (prominent)",
      "Dizziness, orthostatic hypotension",
      "Nausea, dry mouth, constipation",
      "Rare priapism",
      "Headache, incoordination",
    ],
    monitoring: [
      "Suicidal ideation early in treatment",
      "Counsel on priapism (rare)",
      "Sedation/falls risk",
    ],
  }, // Stahl PG 7th p2266

  {
    generic_name: "Nefazodone",
    drug_class: "SARI (serotonin antagonist and reuptake inhibitor)",
    plain_language:
      "An antidepressant that blocks serotonin 2A receptors and weakly blocks serotonin/norepinephrine reuptake. It causes little sexual dysfunction or insomnia. Remember: it can rarely cause severe, even fatal, liver failure, so it is used cautiously.",
    mechanism:
      "Potently blocks 5HT2A receptors and weakly blocks SERT and NET.",
    common_uses: [
      "Major depressive disorder",
      "Panic disorder",
      "Posttraumatic stress disorder",
    ],
    side_effects: [
      "Sedation, dizziness",
      "Nausea, dry mouth, constipation",
      "Headache, vision changes",
      "Rare hepatotoxicity (hepatic failure)",
      "Rare postural hypotension",
    ],
    monitoring: [
      "Liver function tests (hepatotoxicity risk)",
      "Suicidal ideation early in treatment",
    ],
  }, // Stahl PG 7th p1578

  {
    generic_name: "Vortioxetine",
    drug_class: "Serotonin modulator (multimodal)",
    plain_language:
      "A multimodal antidepressant for depression that blocks serotonin reuptake and also acts on several serotonin receptors. It may improve cognition in depression and causes less sexual dysfunction. Remember: nausea is its most common side effect.",
    mechanism:
      "Blocks SERT plus acts as a 5HT1A agonist, 5HT1B partial agonist, and 5HT3/5HT7/5HT1D antagonist (multimodal).",
    common_uses: [
      "Major depressive disorder",
      "Cognitive symptoms of depression",
      "Generalized anxiety disorder (off-label)",
    ],
    side_effects: [
      "Nausea (most common)",
      "Constipation, vomiting",
      "Sexual dysfunction (less than SSRIs)",
    ],
    monitoring: [
      "Suicidal ideation early in treatment",
    ],
  }, // Stahl PG 7th p2438

  {
    generic_name: "Vilazodone",
    drug_class: "SPARI (serotonin partial agonist/reuptake inhibitor)",
    plain_language:
      "An antidepressant that blocks serotonin reuptake and also partially activates serotonin 1A receptors. It may cause less sexual dysfunction than SSRIs. Remember: it must be taken with food, or its absorption drops by half.",
    mechanism:
      "Blocks SERT and is a partial agonist at 5HT1A receptors.",
    common_uses: [
      "Major depressive disorder",
      "Anxiety (off-label)",
      "Obsessive-compulsive disorder (off-label)",
    ],
    side_effects: [
      "Nausea, diarrhea, vomiting",
      "Insomnia, dizziness",
      "Sexual dysfunction (less than SSRIs)",
      "Bruising/bleeding, hyponatremia",
    ],
    monitoring: [
      "Suicidal ideation early in treatment",
      "Take with food (absorption)",
    ],
  }, // Stahl PG 7th p2420

  {
    generic_name: "Agomelatine",
    drug_class: "Melatonergic antidepressant",
    plain_language:
      "An antidepressant (not US-marketed) that acts on melatonin receptors to resynchronize the sleep–wake rhythm, plus blocks 5HT2C receptors. It does not raise serotonin. Remember: it can raise liver enzymes, so liver tests are required before and during treatment.",
    mechanism:
      "Agonist at melatonin MT1/MT2 receptors and antagonist at 5HT2C, increasing prefrontal dopamine/norepinephrine and resynchronizing circadian rhythm.",
    common_uses: [
      "Major depressive disorder",
      "Generalized anxiety disorder",
    ],
    side_effects: [
      "Nausea, dizziness",
      "Somnolence, fatigue",
      "Insomnia, headache",
      "Rare hepatitis/hepatic failure",
      "Transaminase elevation",
    ],
    monitoring: [
      "Liver function tests (baseline and serial)",
      "Suicidal ideation early in treatment",
    ],
  }, // Stahl PG 7th p34

  {
    generic_name: "Reboxetine",
    drug_class: "NRI (norepinephrine reuptake inhibitor)",
    plain_language:
      "A selective norepinephrine reuptake inhibitor for depression (not US-marketed; also studied for ADHD). It is activating. Remember: it can cause insomnia, dry mouth, urinary hesitancy, and sexual dysfunction.",
    mechanism:
      "Blocks NET, boosting norepinephrine (and frontal dopamine).",
    common_uses: [
      "Major depressive disorder",
      "Dysthymia",
      "Panic disorder",
      "ADHD (off-label)",
    ],
    side_effects: [
      "Insomnia, agitation, anxiety",
      "Dry mouth, constipation",
      "Urinary hesitancy/retention",
      "Sexual dysfunction",
      "Dose-dependent hypotension",
    ],
    monitoring: [
      "Blood pressure (hypotension)",
      "Suicidal ideation early in treatment",
    ],
  }, // Stahl PG 7th p1961

  {
    generic_name: "Tianeptine",
    drug_class: "Atypical antidepressant (glutamatergic / mu-opioid)",
    plain_language:
      "An atypical antidepressant (not US-marketed) that modulates glutamate and also acts on opioid receptors. It is used for depression and anxiety. Remember: it has abuse and dependence potential, especially in people with a history of substance misuse.",
    mechanism:
      "Modulates glutamatergic transmission (AMPA potentiation) and is a full mu-opioid receptor agonist.",
    common_uses: [
      "Major depressive disorder",
      "Dysthymia",
      "Anxiety associated with depression",
    ],
    side_effects: [
      "Headache, dizziness",
      "Nausea, constipation, dry mouth",
      "Insomnia or sedation",
      "Rare hepatitis",
      "Abuse/dependence potential",
    ],
    monitoring: [
      "Liver function (hepatitis risk)",
      "Abuse/dependence risk (substance-use history)",
      "Suicidal ideation early in treatment",
    ],
  }, // Stahl PG 7th p2218

  // ─────────────────────────────────────────────────────────────────────────
  // Rapid-acting NMDA antagonists
  // ─────────────────────────────────────────────────────────────────────────
  {
    generic_name: "Esketamine",
    drug_class: "NMDA receptor antagonist (rapid-acting)",
    plain_language:
      "A rapid-acting intranasal NMDA-antagonist used alongside an oral antidepressant for treatment-resistant depression and for major depression with acute suicidal thinking. Remember: it causes dissociation and sedation, so each session requires 2-hour monitoring, and it is a controlled (Schedule III) drug given only under a REMS program.",
    mechanism:
      "Noncompetitive NMDA receptor (phencyclidine-site) blocker, leading to downstream glutamate/AMPA activation and synaptic-growth (BDNF) effects.",
    common_uses: [
      "Treatment-resistant depression (adjunct)",
      "MDD with acute suicidal ideation (adjunct)",
    ],
    side_effects: [
      "Dissociation, sedation, dizziness",
      "Nausea, vomiting",
      "Increased blood pressure",
      "Short-term cognitive impairment (resolves ~2 h)",
      "Lower urinary tract symptoms",
    ],
    monitoring: [
      "Blood pressure before and after dosing",
      "≥2-hour observation after each dose",
      "Assess for psychosis before use",
      "REMS program compliance",
    ],
  }, // Stahl PG 7th p807

  {
    generic_name: "Ketamine",
    drug_class: "NMDA receptor antagonist (rapid-acting)",
    plain_language:
      "An anesthetic NMDA-antagonist that at low (sub-anesthetic) doses has rapid antidepressant effects, used off-label for treatment-resistant depression and for pain. Remember: it can cause dissociation and hallucinations, raise blood pressure, and carries dependence risk with repeated use.",
    mechanism:
      "Noncompetitive NMDA receptor (phencyclidine-site) blocker, leading to downstream glutamate/AMPA activation and synaptic-growth effects.",
    common_uses: [
      "Induction/maintenance of anesthesia",
      "Pain / neuropathic pain",
      "Treatment-resistant depression (low dose, off-label)",
      "Sedation",
    ],
    side_effects: [
      "Dissociation, hallucinations, vivid dreams",
      "Hypertension, tachycardia",
      "Nausea, hypersalivation",
      "Blurred vision, diplopia",
      "Urinary tract toxicity (chronic use)",
    ],
    monitoring: [
      "Blood pressure and heart rate",
      "Dissociation/emergence reactions",
      "Dependence potential (repeated use)",
    ],
  }, // Stahl PG 7th p1111
];
