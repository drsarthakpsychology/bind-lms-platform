import type { LongQA } from "@/lib/prep/long-types";
import { anchored, compare, timeline, tree } from "./visual";

export const PSYCHOPHARMACOLOGY_L06: LongQA[] = anchored([
  {
    id: "phar-l06-001",
    subject: "psychopharmacology",
    topic: "pregnancy",
    marks: 15,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Discuss the principles of prescribing psychotropic drugs in pregnancy, with reference to antidepressants, antipsychotics, mood stabilisers and benzodiazepines.",
    plan: ["Why the decision is a balance of risks", "General principles", "Drug classes one by one", "Lithium management around delivery", "Planning and the postpartum period", "Conclusion"],
    answer: `## A balance of risks
Untreated mental illness in pregnancy carries real risks: poor self care and nutrition, substance use, suicide (a leading cause of maternal death in the year after birth), preterm birth, low birth weight, and relapse after delivery. Medicines carry risks of malformations (mostly in the first trimester), pregnancy complications, neonatal effects and possible long term neurodevelopmental effects. Most decisions balance these two sets of risks with the woman, ideally before conception.

## General principles
- Plan pregnancy: discuss contraception and pregnancy intentions with every woman of childbearing potential on psychotropics.
- Use the lowest effective dose of the drug with the best known safety; prefer drugs that have worked for her before.
- Prefer monotherapy; avoid switching in a stable woman just because she is pregnant, as relapse may be riskier.
- Avoid valproate and, where possible, carbamazepine.
- Do not stop medicines abruptly on discovering pregnancy; by then the first trimester exposure has often occurred.
- Give folic acid; arrange detailed anomaly scanning when there is exposure to teratogens.
- Work with obstetricians and paediatricians; plan for delivery and the newborn.
- Psychological therapies are first line for mild to moderate depression and anxiety.

## Antidepressants
- SSRIs are the most studied. Sertraline is often preferred. Absolute risks of major malformations are low; paroxetine has been linked with a small increase in cardiac defects.
- Late pregnancy exposure: poor neonatal adaptation syndrome (jitteriness, feeding problems, breathing difficulty, usually mild and brief) in up to a third of exposed babies, and a small increase in persistent pulmonary hypertension of the newborn (about 3 per 1000 versus 1 to 2).
- Possible small increase in postpartum haemorrhage.
- Tricyclics (nortriptyline) and mirtazapine are alternatives.

## Antipsychotics
- Not major teratogens on current evidence; olanzapine, quetiapine, aripiprazole and haloperidol have the most data.
- Risks: gestational diabetes and weight gain (olanzapine, clozapine), so screen glucose; hyperprolactinaemia drugs reduce fertility, so switching to a prolactin sparing drug may lead to unexpected pregnancy.
- Neonatal extrapyramidal or withdrawal symptoms after third trimester exposure.
- Clozapine can be continued in resistant illness with monitoring of the baby's blood count after delivery.

## Mood stabilisers
- Valproate: highest risk (about 10 percent major malformations, including neural tube defects, and neurodevelopmental problems in up to a third); avoid.
- Carbamazepine: neural tube defects (about 1 percent) and other malformations; avoid where possible.
- Lithium: a small increase in cardiac malformations, including Ebstein anomaly, lower than older studies suggested; may be continued in women with severe bipolar disorder after discussion, with a detailed fetal heart scan.
- Lamotrigine: relatively low malformation risk; levels fall markedly in pregnancy and rise after delivery, so monitor.

## Benzodiazepines
Use only short term at low doses. Third trimester use can cause neonatal sedation, breathing problems and withdrawal ("floppy infant syndrome"). The link with cleft palate is weak.

## Lithium around delivery
- Renal clearance rises in pregnancy, so levels fall; check monthly, then weekly from about 36 weeks.
- Deliver in hospital; consider stopping lithium at the onset of labour or 24 to 48 hours before a planned caesarean section, and restart soon after delivery at the pre pregnancy dose, checking levels.
- Watch for neonatal toxicity (floppiness, poor feeding, hypothyroidism).

## ECT
ECT is safe in all trimesters and is valuable for severe depression, psychosis, catatonia or mania in pregnancy, with obstetric and anaesthetic support.

## Postpartum period
Relapse risk is highest in the weeks after delivery, especially in bipolar disorder (risk of postpartum psychosis). Plan prophylaxis, sleep protection and early review. Consider breastfeeding compatibility when choosing medicines.

## Conclusion
Prescribing in pregnancy aims to protect both mother and baby. With planning, the safest effective drug at the lowest dose, avoidance of valproate, careful lithium management and collaboration with obstetric teams, most women with mental illness can have healthy pregnancies.`,
    keyPoints: ["Risks of untreated illness including maternal suicide", "Plan pregnancy and avoid abrupt stopping", "SSRIs: sertraline, paroxetine cardiac, PNAS and PPHN", "Antipsychotics: no major teratogenicity, gestational diabetes", "Valproate and carbamazepine risks", "Lithium Ebstein risk and monitoring around delivery", "Benzodiazepine neonatal effects", "ECT safe and postpartum planning"],
    pitfalls: ["Stopping all medicines on learning of pregnancy", "Ignoring the risk of untreated illness", "Using valproate"],
    visuals: [timeline("Lithium around delivery", [["Levels monthly", "Early pregnancy"], ["Levels weekly", "From about 36 weeks"], ["Stop at onset of labour", "Or 24 to 48 hours before caesarean"], ["Restart after delivery", "Check level and the baby"]])],
    module: "medicine-profiles",
    ref: "Maudsley pregnancy chapter; NICE CG192 antenatal and postnatal mental health; Munk-Olsen 2018 Lancet Psychiatry lithium; Huybrechts 2015 PPHN; MHRA valproate",
  },
  {
    id: "phar-l06-002",
    subject: "psychopharmacology",
    topic: "lactation",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Discuss the use of psychotropic drugs during breastfeeding.",
    plan: ["Benefits of breastfeeding and principles", "How drugs pass into milk and relative infant dose", "Drug classes", "Monitoring the infant", "Conclusion"],
    answer: `## Principles
Breastfeeding benefits mother and baby, and most psychotropics are compatible with it. The aim is to keep the mother well while minimising infant exposure. Decisions should be shared with the mother, considering the infant's age (premature and newborn babies clear drugs slowly), health, and the mother's previous response.

## Transfer into milk
Drugs enter milk mainly by passive diffusion. Transfer is higher for drugs that are lipid soluble, not protein bound, of low molecular weight and weakly basic. The relative infant dose (RID), the infant's dose per kilogram as a percentage of the mother's, is a useful guide: below about 10 percent is usually considered acceptable.

## Drug classes
Antidepressants:
- Sertraline and paroxetine give very low infant levels and are often preferred; escitalopram is also acceptable.
- Fluoxetine and citalopram give higher infant levels; fluoxetine's long half life can cause accumulation.
- Mirtazapine and nortriptyline are alternatives.
Antipsychotics:
- Olanzapine and quetiapine have low milk levels and reasonable data.
- Risperidone and aripiprazole (which may reduce milk supply by lowering prolactin) have less data.
- Clozapine is generally avoided because of the risk of agranulocytosis and seizures in the infant.
Mood stabilisers:
- Lithium passes into milk in significant amounts (infant levels can reach a third to half of the mother's) and infants have immature kidneys; it is often avoided, but may be used with close monitoring of infant lithium levels, renal and thyroid function and hydration when the mother's need is strong.
- Valproate gives low milk levels but carries rare risks of liver toxicity and blood problems; avoid in women who may become pregnant again.
- Lamotrigine gives fairly high infant levels; watch for rash and drowsiness.
- Carbamazepine is considered compatible with monitoring.
Benzodiazepines and hypnotics:
- Short acting drugs (lorazepam) at low doses for short periods; avoid long acting diazepam; watch for sedation and poor feeding.
- Never co-sleep with the baby after taking sedatives.

## Monitoring the infant
Watch for sedation, poor feeding, irritability, poor weight gain, jaundice; check infant blood levels where indicated (lithium, sometimes lamotrigine). Time doses after feeds or before the baby's longest sleep if this helps.

## Conclusion
Most mothers on psychotropics can breastfeed safely. Prefer drugs with low relative infant doses such as sertraline and olanzapine, avoid clozapine and use lithium only with careful monitoring, and watch the baby for effects.`,
    keyPoints: ["Benefits and shared decisions", "Factors affecting milk transfer", "Relative infant dose under 10 percent", "Sertraline and paroxetine preferred", "Olanzapine and quetiapine acceptable; clozapine avoided", "Lithium with close infant monitoring", "Short acting benzodiazepines and co-sleeping warning", "Infant monitoring"],
    visuals: [compare("Drug classes: preferred and cautious choices", ["Usually preferred", ["Sertraline, paroxetine", "Olanzapine, quetiapine", "Low dose lorazepam briefly"], "Low infant exposure"], ["Use with caution or avoid", ["Clozapine", "Lithium without infant monitoring", "Long acting diazepam", "Fluoxetine in newborns"], "Higher infant risk"])],
    module: "medicine-profiles",
    ref: "Maudsley breastfeeding; LactMed; Hale Medications and Mothers' Milk; NICE CG192",
  },
  {
    id: "phar-l06-003",
    subject: "psychopharmacology",
    topic: "child-adolescent",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Discuss the special considerations in prescribing psychotropic drugs to children and adolescents.",
    plan: ["Why children differ", "Evidence base and off label use", "Key indications and drugs", "Safety concerns", "Consent and good practice", "Conclusion"],
    answer: `## Why children differ
- Pharmacokinetics: children often metabolise drugs faster per kilogram (more liver relative to body size), so they may need relatively higher doses or more frequent dosing; adolescents may be similar to adults.
- Pharmacodynamics: developing brains may respond differently; side effects such as weight gain, prolactin rise and activation are often greater.
- Psychological and family factors strongly shape illness and adherence.

## Evidence and off label use
Many psychotropics are not licensed for children, so off label use is common. Trials are fewer and shorter, and placebo response is high in childhood depression and anxiety.

## Key indications and drugs
- ADHD: methylphenidate, atomoxetine, guanfacine and others.
- Depression: psychological therapy first for mild cases; fluoxetine has the best evidence (approved from age 8 in the USA), escitalopram from age 12.
- Anxiety and OCD: CBT first; SSRIs (sertraline, fluoxetine, fluvoxamine) and clomipramine for OCD.
- Autism: risperidone and aripiprazole for irritability and aggression, not for core features; melatonin for sleep.
- Early onset schizophrenia and bipolar disorder: antipsychotics (aripiprazole, risperidone, olanzapine, quetiapine, lurasidone) and lithium (approved from age 7 in the USA for bipolar disorder).
- Tic disorders: alpha 2 agonists and aripiprazole.
- Enuresis: desmopressin.

## Safety concerns
- Antidepressants: small increase in suicidal thoughts in under 25s; monitor closely in the first weeks.
- Antipsychotics: young people gain weight faster and more, with metabolic changes; monitor weight, BMI percentiles, glucose, lipids and prolactin.
- Stimulants: appetite, sleep, growth and blood pressure.
- Lithium: polyuria and enuresis, acne, effects on thyroid and kidneys; toxicity with dehydration.
- Long term effects on brain development are not fully known.
- Polypharmacy should be avoided.

## Consent and good practice
- Involve both the child (assent, in age appropriate language) and parents (consent); adolescents' views should carry weight.
- Use medicines as part of a broader plan with psychological, family and school interventions.
- Start low, go slow, but reach effective doses; review regularly and plan duration.
- In India, school and family pressures, cost and stigma affect adherence; clear explanation to parents is important.

## Conclusion
Prescribing for children needs a strong indication, evidence based drug choice, careful monitoring of growth, metabolism and suicidality, and integration with psychosocial care.`,
    keyPoints: ["Pharmacokinetic and pharmacodynamic differences", "Off label use and limited trials", "Indications with first line drugs", "Fluoxetine for depression and age approvals", "Risperidone and aripiprazole in autism irritability", "Suicidality, metabolic and growth monitoring", "Assent and consent", "Medicines within a broader plan"],
    visuals: [tree("Key indications and drugs", [["Children and adolescents", "", -1], ["ADHD", "Methylphenidate, atomoxetine", 0], ["Depression", "Fluoxetine after therapy", 0], ["OCD and anxiety", "CBT, then SSRIs", 0], ["Autism irritability", "Risperidone, aripiprazole", 0], ["Psychosis, bipolar", "Antipsychotics, lithium", 0]])],
    module: "child",
    ref: "Maudsley children and adolescents; NICE NG134 depression in children; FDA labels; Correll 2009 JAMA antipsychotic weight youth",
  },
  {
    id: "phar-l06-004",
    subject: "psychopharmacology",
    topic: "older-adults",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Discuss the principles of prescribing psychotropic drugs for older adults.",
    plan: ["Age related pharmacokinetic and pharmacodynamic changes", "Common problems: polypharmacy, falls, delirium", "Drug class specific points", "Tools such as Beers and STOPP START", "Conclusion"],
    answer: `## Age related changes
Pharmacokinetic:
- Reduced renal function (lithium, gabapentin, pregabalin, amisulpride, memantine accumulate).
- Reduced liver blood flow and oxidative metabolism (diazepam and many drugs last longer); conjugation is relatively preserved.
- More body fat and less water: lipophilic drugs have longer half lives; water soluble drugs such as lithium reach higher levels.
- Lower albumin in frail people.
Pharmacodynamic:
- Greater brain sensitivity to sedation, anticholinergic effects and extrapyramidal effects.
- Impaired postural reflexes and blood pressure control, leading to falls.
- Reduced cholinergic reserve, increasing delirium risk.

## Common problems
- Polypharmacy and interactions; poor adherence due to cognitive or visual problems.
- Falls and fractures (benzodiazepines, Z drugs, antipsychotics, antidepressants, antihypertensives).
- Delirium (anticholinergics, benzodiazepines, opioids).
- Hyponatraemia with SSRIs, SNRIs and carbamazepine.
- QTc prolongation and arrhythmias.

## Drug class points
- Antidepressants: sertraline, escitalopram (maximum 10 mg in older people for QTc), mirtazapine; avoid tricyclics and paroxetine; check sodium at baseline and after two to four weeks.
- Antipsychotics: low doses (for example risperidone 0.5 to 1 mg, quetiapine 25 to 100 mg); increased stroke and mortality risk in dementia; avoid typical antipsychotics in Lewy body dementia.
- Lithium: lower target levels (about 0.4 to 0.7), more frequent monitoring, care with diuretics and ACE inhibitors.
- Benzodiazepines and Z drugs: avoid where possible; if needed, short courses of short acting drugs at low doses.
- Anticholinergics: avoid.
- Cholinesterase inhibitors: check pulse for bradycardia.
- ECT is effective and generally well tolerated.

## Tools
- The Beers criteria (American Geriatrics Society) list potentially inappropriate medicines in older adults.
- STOPP and START criteria identify drugs to stop and treatments that are wrongly omitted.
- Anticholinergic burden scales.
- Regular medication review with deprescribing.

## Conclusion
"Start low, go slow, but go" sums up prescribing for older adults: lower starting doses, slower increases, adequate trials, vigilance for falls, delirium and hyponatraemia, and regular review.`,
    keyPoints: ["Renal and hepatic changes", "Body composition effects", "Increased sensitivity and falls", "Polypharmacy and delirium", "Antidepressant choices and sodium checks", "Antipsychotic risks in dementia", "Lower lithium targets", "Beers and STOPP START"],
    visuals: [compare("Age related changes", ["Younger adult", ["Normal kidney and liver clearance", "Good postural reflexes", "More cholinergic reserve"], "Standard doses"], ["Older adult", ["Slower clearance, longer half lives", "Falls and postural drops", "Delirium with anticholinergics", "Hyponatraemia with SSRIs"], "Start low, go slow, but go"])],
    module: "medicine-profiles",
    ref: "Maudsley older adults; AGS Beers criteria 2023; O'Mahony STOPP/START v3 2023",
  },
  {
    id: "phar-l06-005",
    subject: "psychopharmacology",
    topic: "renal",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Write short notes on prescribing psychotropics in renal impairment.",
    plan: ["Assessing renal function", "Drugs needing caution", "Safer choices", "Dialysis"],
    answer: `## Assessing renal function
Use the estimated glomerular filtration rate (eGFR) or creatinine clearance; chronic kidney disease stage guides dosing. Remember that renal function falls with age and with dehydration, and that patients may be on interacting drugs such as diuretics and ACE inhibitors.

## Drugs needing caution
- Lithium: excreted almost entirely by the kidneys and can itself damage them; avoid in significant renal impairment or use with specialist advice, lower doses and frequent levels.
- Amisulpride and sulpiride: renally excreted; reduce doses or avoid.
- Paliperidone (and risperidone, whose active metabolite is paliperidone): reduce doses.
- Gabapentin and pregabalin: accumulate, causing sedation and respiratory depression; reduce doses.
- Memantine, desvenlafaxine, venlafaxine, levetiracetam, topiramate and acamprosate: reduce doses or avoid when severe.
- Benzodiazepines and opioids: increased sedation in uraemia.

## Safer choices
- Antidepressants: sertraline, citalopram (low dose), mirtazapine (reduced dose).
- Antipsychotics: haloperidol, olanzapine (low dose), aripiprazole, quetiapine.
- Mood stabilisers: valproate or lamotrigine (with dose adjustment) rather than lithium.
- Hypnotics: lorazepam or zopiclone at low doses for short periods.
Start at low doses and increase slowly, because uraemia increases brain sensitivity.

## Dialysis
Lithium is removed by haemodialysis and can be given after dialysis sessions with specialist care; highly protein bound and lipophilic drugs are not removed. Depression is common in dialysis patients and SSRIs such as sertraline are often used.

## Conclusion
In renal impairment, avoid or reduce renally excreted drugs such as lithium, amisulpride, paliperidone and gabapentinoids, prefer liver metabolised drugs, and start low.`,
    keyPoints: ["eGFR based assessment", "Lithium avoid or specialist use", "Amisulpride, paliperidone, gabapentinoids", "Other renally cleared drugs", "Safer choices", "Dialysis points"],
    module: "medicine-profiles",
    ref: "Maudsley renal impairment chapter; Stahl prescriber's guide renal dosing",
  },
  {
    id: "phar-l06-006",
    subject: "psychopharmacology",
    topic: "hepatic",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Write short notes on prescribing psychotropics in liver disease.",
    plan: ["Effects of liver disease on drugs", "Drugs to avoid", "Safer choices", "Practical principles"],
    answer: `## Effects of liver disease
Liver disease reduces drug metabolism (especially phase 1 oxidation), reduces albumin (more free drug), and may cause portosystemic shunting, which bypasses first pass metabolism and raises levels of oral drugs. Hepatic encephalopathy makes the brain very sensitive to sedatives. Liver function tests do not reliably show metabolic capacity; the Child-Pugh score (bilirubin, albumin, INR, ascites, encephalopathy) is a better guide. Alcohol related liver disease is common in psychiatric practice.

## Drugs to avoid or use with great caution
- Valproate (hepatotoxicity), carbamazepine.
- Agomelatine (hepatotoxicity), duloxetine (avoid in hepatic impairment and heavy drinking).
- Disulfiram and high dose naltrexone.
- Chlorpromazine (cholestatic jaundice) and tricyclics.
- Long acting benzodiazepines (diazepam, chlordiazepoxide), which accumulate and can precipitate encephalopathy.

## Safer choices
- Benzodiazepines: lorazepam or oxazepam (conjugation only), at low doses, for alcohol withdrawal and anxiety.
- Antidepressants: sertraline or citalopram at low doses.
- Antipsychotics: low dose haloperidol, or renally excreted amisulpride or paliperidone.
- Mood stabilisers: lithium (renally excreted) with care for fluid shifts and ascites.
- Alcohol relapse prevention: acamprosate (renally excreted) or baclofen.

## Practical principles
Start with low doses and increase slowly, avoid constipating and sedating drugs where encephalopathy is a risk, monitor liver function and mental state, and work with hepatologists.

## Conclusion
In liver disease, choose drugs that are conjugated or renally excreted, avoid hepatotoxic and long acting sedative drugs, and use low doses.`,
    keyPoints: ["Reduced metabolism and albumin", "Shunting and encephalopathy sensitivity", "Child-Pugh rather than LFTs", "Drugs to avoid including valproate, agomelatine, duloxetine", "Lorazepam and oxazepam", "Acamprosate, amisulpride, lithium as renal options"],
    module: "medicine-profiles",
    ref: "Maudsley hepatic impairment chapter; Telles-Correia 2017 review",
  },
  {
    id: "phar-l06-007",
    subject: "psychopharmacology",
    topic: "cardiac",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Write short notes on the use of psychotropics in patients with heart disease.",
    plan: ["Why it matters", "Antidepressants", "Antipsychotics and others", "Monitoring"],
    answer: `## Why it matters
Depression is common after myocardial infarction and in heart failure and worsens cardiac outcomes. Severe mental illness carries high cardiovascular risk. Several psychotropics affect heart rate, blood pressure, rhythm or the heart muscle.

## Antidepressants
- Sertraline is preferred: trials in patients after acute coronary syndromes (such as SADHART) showed safety and modest benefit for depression. Escitalopram and mirtazapine are alternatives.
- Citalopram and escitalopram cause dose related QTc prolongation.
- Tricyclics should be avoided after myocardial infarction and in conduction disease or heart failure because of arrhythmia and hypotension risk.
- Venlafaxine raises blood pressure at higher doses.
- SSRIs increase bleeding with antiplatelet drugs and anticoagulants; consider gastric protection.

## Antipsychotics and others
- QTc prolongation: higher risk with haloperidol at high doses or intravenously, ziprasidone, thioridazine, pimozide; lower with aripiprazole and lurasidone.
- Postural hypotension and tachycardia: clozapine, quetiapine, chlorpromazine.
- Clozapine: myocarditis and cardiomyopathy.
- Metabolic effects of antipsychotics increase long term cardiac risk.
- Lithium: sinus node dysfunction and T wave changes; interacts with ACE inhibitors and diuretics.
- Stimulants raise heart rate and blood pressure; assess cardiac history.
- Cholinesterase inhibitors: bradycardia and syncope.

## Monitoring
Baseline and follow up ECG for at risk drugs and patients; check potassium and magnesium; monitor blood pressure and pulse; collaborate with cardiologists; treat cardiovascular risk factors.

## Conclusion
In heart disease, sertraline is the antidepressant of choice, tricyclics are avoided, and antipsychotics are chosen for low QTc and metabolic risk, with ECG monitoring.`,
    keyPoints: ["Depression worsens cardiac outcomes", "Sertraline and SADHART", "Avoid tricyclics after infarction", "QTc risks of citalopram, haloperidol, ziprasidone", "Clozapine myocarditis", "Lithium and cholinesterase inhibitor cardiac effects", "ECG and electrolyte monitoring"],
    module: "medicine-profiles",
    ref: "Glassman 2002 JAMA SADHART; Maudsley cardiac disease; Beach 2013 QTc review",
  },
  {
    id: "phar-l06-008",
    subject: "psychopharmacology",
    topic: "contraception-interactions",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Write short notes on psychotropics and hormonal contraception.",
    plan: ["Why it matters", "Psychotropics that reduce contraceptive effect", "Contraceptives that change psychotropic levels", "Practical advice"],
    answer: `## Why it matters
Many women taking psychotropics are of childbearing age. Unplanned pregnancy while taking teratogenic drugs (valproate, carbamazepine, topiramate) is a serious risk, and some combinations make contraception fail.

## Psychotropics that reduce contraceptive effect
Enzyme inducers increase metabolism of oestrogen and progestogen, so oral pills, patches, rings and implants may fail:
- Carbamazepine, oxcarbazepine, phenytoin, phenobarbital.
- Topiramate at higher doses (above 200 mg a day).
- Modafinil and armodafinil.
- St John's wort.
Recommended methods with inducers: copper intrauterine device, levonorgestrel intrauterine system, or medroxyprogesterone injection, which are not affected; emergency contraception may need a higher dose or a copper device.

## Contraceptives that change psychotropic levels
- Oestrogen containing contraceptives induce glucuronidation, lowering lamotrigine levels by up to half; levels rise in the pill free week, which can cause toxicity. Progestogen only methods have little effect.
- Oestrogens inhibit CYP1A2, which can raise clozapine and olanzapine levels.

## Practical advice
- Ask every woman about contraception and pregnancy plans when prescribing.
- Avoid valproate in women who could become pregnant; if unavoidable, ensure a pregnancy prevention programme with highly effective contraception.
- Review contraception when starting or stopping enzyme inducers.
- Hyperprolactinaemia from antipsychotics reduces fertility; switching to a prolactin sparing drug can restore fertility, so contraception should be discussed.

## Conclusion
Enzyme inducing psychotropics can make hormonal contraception fail, and oestrogen lowers lamotrigine levels; reliable, interaction free methods protect women on teratogenic drugs.`,
    keyPoints: ["Teratogenic risk with unplanned pregnancy", "Enzyme inducers that reduce contraceptive effect", "IUD, IUS and injection as reliable methods", "Oestrogen lowers lamotrigine", "Oestrogen raises clozapine via CYP1A2", "Prolactin and fertility on switching"],
    module: "medicine-profiles",
    ref: "FSRH CEU guidance drug interactions with hormonal contraception 2022; Maudsley; Reimers lamotrigine and contraception",
  },
  {
    id: "phar-l06-009",
    subject: "psychopharmacology",
    topic: "indian-prescribing",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on issues in psychotropic prescribing in India.",
    plan: ["Access and cost", "Irrational combinations and over the counter use", "Regulation and schedules", "Good practice"],
    answer: `## Access and cost
Most mental health costs in India are paid out of pocket. Generic psychotropics are inexpensive, and government schemes such as the Pradhan Mantri Bhartiya Janaushadhi Pariyojana sell generic medicines at low prices; the National List of Essential Medicines includes core psychotropics that should be available in public facilities. Even so, supply in district and primary care is often irregular, and newer drugs (LAIs, some second generation antipsychotics) are costly.

## Irrational combinations and over the counter use
- Fixed dose combinations (for example an antidepressant with a benzodiazepine, or several drugs for "nerves") have been common; the government has banned many irrational combinations since 2016.
- Benzodiazepines (alprazolam, clonazepam) and trihexyphenidyl are sometimes sold without prescription and misused.
- Multiple brand names for the same drug cause confusion and duplication.
- Polypharmacy and high doses are common in some settings, as are "tonics" and vitamin injections.

## Regulation
- Prescription only drugs are in Schedule H; Schedule H1 (including some benzodiazepines and other habit forming drugs) requires pharmacists to keep records; narcotic and psychotropic substances (including some benzodiazepines, buprenorphine and methylphenidate) are also controlled under the NDPS Act.
- Telemedicine Practice Guidelines in 2020 restrict the drugs that can be prescribed remotely.

## Good practice
- Prescribe by generic name with clear instructions in the patient's language.
- Choose effective, affordable drugs and avoid unnecessary combinations.
- Educate families, who often manage medicines, about doses, side effects and adherence.
- Review long term benzodiazepine and anticholinergic use.
- Use the District Mental Health Programme and Tele MANAS for continuity of care.

## Conclusion
Good psychotropic prescribing in India means affordable generic choices, rational monotherapy, careful control of habit forming drugs and active family education.`,
    keyPoints: ["Out of pocket costs and Janaushadhi", "Essential medicines list and supply gaps", "Banned fixed dose combinations", "Over the counter benzodiazepines and trihexyphenidyl", "Schedule H and H1 and NDPS", "Telemedicine guidelines and good practice"],
    module: "medicine-profiles",
    ref: "NLEM 2022; Drugs and Cosmetics Rules Schedule H1 (2013); MoHFW FDC bans 2016 and 2018; Telemedicine Practice Guidelines 2020",
  },
  {
    id: "phar-l06-010",
    subject: "psychopharmacology",
    topic: "off-label",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Write short notes on off label prescribing in psychiatry.",
    plan: ["Definition", "Common examples", "Ethical and legal points", "Good practice"],
    answer: `## Definition
Off label prescribing means using a licensed medicine outside the terms of its marketing approval: for a different indication, age group, dose, duration or route. It is legal and often necessary, but carries extra responsibility.

## Common examples in psychiatry
- Antipsychotics for agitation in dementia (except where specifically approved), insomnia (low dose quetiapine) or anxiety.
- Antidepressants in children below approved ages.
- Prazosin for PTSD nightmares; clonidine for ADHD in some countries; propranolol for akathisia.
- Lithium augmentation, high dose SSRIs for OCD, and antipsychotic augmentation in OCD.
- Melatonin in children with autism; ketamine infusions for depression.

## Ethical and legal points
- The prescriber takes responsibility for the decision; it should rest on reasonable evidence or expert guidance, not on habit or marketing.
- Patients (or parents) should be told that the use is off label, and why, as part of informed consent.
- Indian law does not specifically regulate off label use, but medical negligence standards and the MHCA 2017 right to informed consent apply; the National Medical Commission expects evidence based practice.
- Promoting off label uses by companies is not permitted.

## Good practice
Check the evidence, use the lowest effective dose, document the reasoning and consent, monitor closely for benefit and harm, and stop if there is no benefit. Avoid low dose quetiapine for insomnia because of metabolic risks.

## Conclusion
Off label prescribing is common and sometimes the best option, but it must be evidence based, explained to patients and carefully monitored.`,
    keyPoints: ["Definition", "Examples in psychiatry", "Prescriber responsibility", "Informed consent and documentation", "Indian legal context", "Monitoring and stopping"],
    module: "medicine-profiles",
    ref: "Maudsley off-label prescribing; Royal College of Psychiatrists CR142 off-label; MHCA 2017 informed consent",
  },
]);
