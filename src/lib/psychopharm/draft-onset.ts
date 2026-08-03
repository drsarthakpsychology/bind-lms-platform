/**
 * Curated onset_time values — student register, quote-first.
 *
 * Each `onset_time` is a reviewed, plain-language sentence written AGAINST the
 * verbatim source snippet (Stahl Prescriber's Guide 7th ed., "How Long Until
 * It Works" section). Non-prescriber register: describes what is observed,
 * never what anyone should do.
 *
 * The three curated drugs with no exact Stahl monograph key — Methylphenidate,
 * Cyproheptadine, Melatonin — are handled by hand below from their nearest
 * monograph (Methylphenidate (D)/(D,L)); where the source gives nothing
 * usable, `onset_time` is left undefined rather than fabricated.
 */
import { DrugDraft } from "./draft";

const S = "stahl_pg_7th";

type OnsetPatch = { generic_name: string; onset_time: DrugDraft["onset_time"] };

export const ONSET_PATCHES: OnsetPatch[] = [
  {
    generic_name: "Aripiprazole",
    onset_time: {
      value:
        "Some easing of psychosis or mania can appear within the first week, but the full effect builds over several weeks; the sources suggest allowing 4–6 weeks, and sometimes longer, to judge how well it is working.",
      source_id: S,
      page_ref: "p176",
      snippet: "Psychotic and manic symptoms can improve within 1 week, but it may take several weeks for full effect ... Classically recommended to wait at least 4–6 weeks to determine efficacy",
      agreement: "single",
    },
  },
  {
    generic_name: "Quetiapine",
    onset_time: {
      value:
        "Psychosis or mania may improve within the first week, but the full effect on mood and behaviour takes several weeks; the sources suggest allowing 4–6 weeks to judge the response.",
      source_id: S,
      page_ref: "p1925",
      snippet: "Psychotic and manic symptoms can improve within 1 week, but it may take several weeks for full effect ... wait at least 4–6 weeks to determine efficacy",
      agreement: "single",
    },
  },
  {
    generic_name: "Risperidone",
    onset_time: {
      value:
        "Psychotic and manic symptoms can improve within the first week, but the full effect takes several weeks; the sources suggest allowing 4–6 weeks, sometimes longer, to judge the response.",
      source_id: S,
      page_ref: "p1978",
      snippet: "Psychotic and manic symptoms can improve within 1 week, but it may take several weeks for full effect ... wait at least 4–6 weeks",
      agreement: "single",
    },
  },
  {
    generic_name: "Fluoxetine",
    onset_time: {
      value:
        "Some people feel more energy or activation early on; the fuller antidepressant effect usually takes 2–4 weeks, and the sources suggest allowing 6–8 weeks to judge whether it is helping.",
      source_id: S,
      page_ref: "p885",
      snippet: "Some patients may experience increased energy or activation early after initiation ... Onset of therapeutic actions usually not immediate, but often delayed 2–4 weeks",
      agreement: "single",
    },
  },
  {
    generic_name: "Venlafaxine",
    onset_time: {
      value:
        "The antidepressant effect usually takes 2–4 weeks to appear. For generalised anxiety, improvement can keep building past 8 weeks and up to around 6 months.",
      source_id: S,
      page_ref: "p2400",
      snippet: "Onset of therapeutic actions usually not immediate, but often delayed 2–4 weeks ... for generalized anxiety, onset of response ... may still occur after 8 weeks, and for up to 6 months",
      agreement: "single",
    },
  },
  {
    generic_name: "Lithium",
    onset_time: {
      value: "Effects on an acute high can appear in about 1–3 weeks.",
      source_id: S,
      page_ref: "p1210",
      snippet: "1–3 weeks",
      agreement: "single",
    },
  },
  {
    generic_name: "Paroxetine",
    onset_time: {
      value:
        "Some relief of sleep or anxiety can appear in the first days. The fuller antidepressant effect usually takes 2–4 weeks. For generalised anxiety, improvement can keep building after 8 weeks and up to around 6 months.",
      source_id: S,
      page_ref: "p1709",
      snippet: "Some patients may experience relief of insomnia or anxiety early after initiation ... often delayed 2–4 weeks ... for generalized anxiety ... up to 6 months after initiating dosing",
      agreement: "single",
    },
  },
  {
    generic_name: "Alprazolam",
    onset_time: {
      value:
        "Some relief comes with the first dose, and it can be quick; the fullest effect with regular daily use builds over several weeks.",
      source_id: S,
      page_ref: "p50",
      snippet: "Some immediate relief with first dosing is common; can take several weeks with daily dosing for maximal therapeutic benefit",
      agreement: "single",
    },
  },
  {
    generic_name: "Amisulpride",
    onset_time: {
      value:
        "Psychotic symptoms can improve within the first week, but the full effect takes several weeks; the sources suggest allowing 4–6 weeks, sometimes longer.",
      source_id: S,
      page_ref: "p68",
      snippet: "Psychotic symptoms can improve within 1 week, but it may take several weeks for full effect ... wait at least 4–6 weeks",
      agreement: "single",
    },
  },
  {
    generic_name: "Sulpiride",
    onset_time: {
      value:
        "Psychotic symptoms can improve within the first week, but the full effect takes several weeks.",
      source_id: S,
      page_ref: "p2122",
      snippet: "Psychotic symptoms can improve within 1 week, but it may take several weeks for full effect",
      agreement: "single",
    },
  },
  {
    generic_name: "Ziprasidone",
    onset_time: {
      value:
        "Psychosis or mania can improve within the first week, but the full effect takes several weeks. An injection can ease agitation within about 15 minutes.",
      source_id: S,
      page_ref: "p2470",
      snippet: "Psychotic and manic symptoms can improve within 1 week, but it may take several weeks for full effect ... IM formulation can reduce agitation in 15 minutes",
      agreement: "single",
    },
  },
  {
    generic_name: "Valproate",
    onset_time: {
      value:
        "For an acute high, effects can appear within a few days. Mood stabilising effects may take weeks to months to optimise; seizures and migraine often improve within a few weeks.",
      source_id: S,
      page_ref: "p2368",
      snippet: "For acute mania, effects should occur within a few days ... May take several weeks to months to optimize an effect on mood stabilization ... reduce seizures and improve migraine within a few weeks",
      agreement: "single",
    },
  },
  {
    generic_name: "Chlordiazepoxide",
    onset_time: {
      value:
        "Some relief comes with the first dose; the fullest effect with regular daily use builds over several weeks.",
      source_id: S,
      page_ref: "p436",
      snippet: "Some immediate relief with first dosing is common; can take several weeks with daily dosing for maximal therapeutic benefit",
      agreement: "single",
    },
  },
  {
    generic_name: "Oxazepam",
    onset_time: {
      value:
        "Some relief comes with the first dose; the fullest effect with regular daily use builds over several weeks.",
      source_id: S,
      page_ref: "p1647",
      snippet: "Some immediate relief with first dosing is common; can take several weeks with daily dosing for maximal therapeutic benefit",
      agreement: "single",
    },
  },
  {
    generic_name: "Lorazepam",
    onset_time: {
      value:
        "Some relief comes with the first dose; the fullest effect with regular daily use builds over several weeks.",
      source_id: S,
      page_ref: "p1274",
      snippet: "Some immediate relief with first dosing is common; can take several weeks for maximal therapeutic benefit with daily dosing",
      agreement: "single",
    },
  },
  {
    generic_name: "Lamotrigine",
    onset_time: {
      value:
        "Seizure control can improve within about 2 weeks, though full stabilising effects can take weeks to months. Bipolar depression can take several weeks to improve.",
      source_id: S,
      page_ref: "p1127",
      snippet: "May take several weeks to improve bipolar depression ... Can reduce seizures by 2 weeks, but may take several weeks to months",
      agreement: "single",
    },
  },
  {
    generic_name: "Duloxetine",
    onset_time: {
      value:
        "The antidepressant effect usually takes 2–4 weeks. Neuropathic pain can ease within a week, though sometimes longer. Hot flushes in perimenopausal women can improve within about a week.",
      source_id: S,
      page_ref: "p769",
      snippet: "often delayed 2–4 weeks for depression ... Can reduce neuropathic pain within a week ... Vasomotor symptoms ... may improve within 1 week",
      agreement: "single",
    },
  },
  {
    generic_name: "Topiramate",
    onset_time: {
      value:
        "Seizure control can improve within about 2 weeks. Mood-stabilising effects, where they occur, can take several weeks to months.",
      source_id: S,
      page_ref: "p2232",
      snippet: "Should reduce seizures by 2 weeks ... may take several weeks to months to optimize an effect on mood stabilization",
      agreement: "single",
    },
  },
  {
    generic_name: "Hydroxyzine",
    onset_time: {
      value: "Taken by mouth, it can work within about 15–20 minutes.",
      source_id: S,
      page_ref: "p1049",
      snippet: "15–20 minutes (oral administration)",
      agreement: "single",
    },
  },
  {
    generic_name: "Cariprazine",
    onset_time: {
      value:
        "Psychotic, manic and depressive symptoms can improve within the first week, but the full effect takes several weeks; the sources suggest allowing 4–6 weeks, sometimes longer.",
      source_id: S,
      page_ref: "p412",
      snippet: "Psychotic, and manic and depressive symptoms can improve within 1 week ... wait at least 4–6 weeks to determine full antipsychotic and antidepressant efficacy",
      agreement: "single",
    },
  },
  {
    generic_name: "Brexpiprazole",
    onset_time: {
      value:
        "For psychosis, improvement can begin within the first week but the full effect takes several weeks (4–6 weeks or longer). For depression as an add-on, the effect usually takes 2–4 weeks.",
      source_id: S,
      page_ref: "p313",
      snippet: "Psychotic symptoms can improve within 1 week ... wait at least 4–6 weeks ... For depression, onset of therapeutic actions usually not immediate, but often delayed 2–4 weeks",
      agreement: "single",
    },
  },
  {
    generic_name: "Perphenazine",
    onset_time: {
      value:
        "Psychotic symptoms can improve within the first week, with the full effect over several weeks. An injection can work within 10 minutes, peaking at 1–2 hours. Nausea and vomiting respond quickly.",
      source_id: S,
      page_ref: "p1747",
      snippet: "Psychotic symptoms can improve within 1 week, but may take several weeks for full effect on behavior. Injection: initial effect after 10 minutes ... Actions on nausea and vomiting are immediate",
      agreement: "single",
    },
  },
  {
    generic_name: "Benztropine",
    onset_time: {
      value: "For stiffness caused by medication, it can start working within minutes to hours.",
      source_id: S,
      page_ref: "p262",
      snippet: "For drug-induced parkinsonism and in Parkinson's disease, onset of action can be within minutes or hours",
      agreement: "single",
    },
  },
  {
    generic_name: "Clorazepate",
    onset_time: {
      value:
        "Some relief comes with the first dose; the fullest effect with regular daily use builds over several weeks.",
      source_id: S,
      page_ref: "p544",
      snippet: "Some immediate relief with first dosing is common; can take several weeks with daily dosing for maximal therapeutic benefit",
      agreement: "single",
    },
  },
  {
    generic_name: "Lisdexamfetamine",
    onset_time: {
      value:
        "Some effects can appear with the first dose, though the fullest benefit may take several weeks.",
      source_id: S,
      page_ref: "p1190",
      snippet: "Some immediate effects can be seen with first dosing. Can take several weeks to attain maximum therapeutic benefit",
      agreement: "single",
    },
  },
  {
    generic_name: "Sertraline",
    onset_time: {
      value:
        "Some people feel more energy or activation early on; the fuller antidepressant effect usually takes 2–4 weeks, and the sources suggest allowing 6–8 weeks to judge whether it is helping.",
      source_id: S,
      page_ref: "p2066",
      snippet: "Some patients may experience increased energy or activation early ... often delayed 2–4 weeks",
      agreement: "single",
    },
  },
  {
    generic_name: "Escitalopram",
    onset_time: {
      value:
        "The antidepressant effect usually takes 2–4 weeks, and the sources suggest allowing 6–8 weeks to judge whether it is helping.",
      source_id: S,
      page_ref: "p790",
      snippet: "Onset of therapeutic actions usually not immediate, but often delayed 2–4 weeks",
      agreement: "single",
    },
  },
  {
    generic_name: "Citalopram",
    onset_time: {
      value:
        "The antidepressant effect usually takes 2–4 weeks, and the sources suggest allowing 6–8 weeks to judge whether it is helping.",
      source_id: S,
      page_ref: "p469",
      snippet: "Onset of therapeutic actions usually not immediate, but often delayed 2–4 weeks",
      agreement: "single",
    },
  },
  {
    generic_name: "Mirtazapine",
    onset_time: {
      value:
        "Effects on sleep and anxiety can start soon after the first doses. The fuller antidepressant effect usually takes 2–4 weeks.",
      source_id: S,
      page_ref: "p1485",
      snippet: "Actions on insomnia and anxiety can start shortly after initiation ... depression ... often delayed 2–4 weeks",
      agreement: "single",
    },
  },
  {
    generic_name: "Olanzapine",
    onset_time: {
      value:
        "Psychosis or mania can improve within the first week, but the full effect takes several weeks; the sources suggest allowing 4–6 weeks, sometimes longer. An injection can ease agitation within 15–30 minutes.",
      source_id: S,
      page_ref: "p1618",
      snippet: "Psychotic and manic symptoms can improve within 1 week ... wait at least 4–6 weeks ... IM formulation can reduce agitation in 15–30 minutes",
      agreement: "single",
    },
  },
  {
    generic_name: "Haloperidol",
    onset_time: {
      value:
        "Psychotic symptoms can improve within the first week, but the full effect takes several weeks.",
      source_id: S,
      page_ref: "p1025",
      snippet: "Psychotic symptoms can improve within 1 week, but it may take several weeks for full effect",
      agreement: "single",
    },
  },
  {
    generic_name: "Bupropion",
    onset_time: {
      value:
        "The antidepressant effect usually takes 2–4 weeks, and the sources suggest allowing 6–8 weeks to judge whether it is helping.",
      source_id: S,
      page_ref: "p352",
      snippet: "Onset of therapeutic actions usually not immediate, but often delayed 2–4 weeks",
      agreement: "single",
    },
  },
  {
    generic_name: "Lurasidone",
    onset_time: {
      value:
        "For psychosis, improvement can begin within the first week but the full effect takes several weeks. For bipolar depression, the effect usually takes 2–4 weeks.",
      source_id: S,
      page_ref: "p1332",
      snippet: "Psychotic symptoms can improve within 1 week ... wait at least 4–6 weeks ... For bipolar depression, onset of therapeutic acti[on] ... 2–4 weeks",
      agreement: "single",
    },
  },
  {
    generic_name: "Gabapentin",
    onset_time: {
      value:
        "Seizure control and post-herpetic pain often improve within about 2 weeks; other neuropathic pain may take a few weeks; anxiety can ease within a few weeks.",
      source_id: S,
      page_ref: "p977",
      snippet: "Should reduce seizures by 2 weeks ... reduce pain in postherpetic neuralgia by 2 weeks ... reduce anxiety ... within a few weeks",
      agreement: "single",
    },
  },
  {
    generic_name: "Pregabalin",
    onset_time: {
      value:
        "Neuropathic pain and anxiety can improve within a week; seizures within about 2 weeks.",
      source_id: S,
      page_ref: "p1862",
      snippet: "Can reduce neuropathic pain and anxiety within a week. Should reduce seizures by 2 weeks",
      agreement: "single",
    },
  },
  {
    generic_name: "Carbamazepine",
    onset_time: {
      value:
        "For an acute high, effects can appear within a few weeks. Seizure control can improve within about 2 weeks; mood stabilising effects may take weeks to months.",
      source_id: S,
      page_ref: "p392",
      snippet: "For acute mania, effects should occur within a few weeks ... Should reduce seizures by 2 weeks",
      agreement: "single",
    },
  },
  {
    generic_name: "Trazodone",
    onset_time: {
      value:
        "Effects on sleep can be immediate when the dose suits. The antidepressant effect usually takes 2–4 weeks.",
      source_id: S,
      page_ref: "p2267",
      snippet: "Onset of therapeutic actions in insomnia are immediate if dosing is correct ... depression ... often delayed 2–4 weeks",
      agreement: "single",
    },
  },
  {
    generic_name: "Vortioxetine",
    onset_time: {
      value:
        "The antidepressant effect usually takes 2–4 weeks, and the sources suggest allowing 6–8 weeks to judge whether it is helping.",
      source_id: S,
      page_ref: "p2440",
      snippet: "Onset of therapeutic actions is usually not immediate, but often delayed 2–4 weeks",
      agreement: "single",
    },
  },
  {
    generic_name: "Desvenlafaxine",
    onset_time: {
      value:
        "The antidepressant effect usually takes 2–4 weeks. Hot flushes in perimenopausal women can improve within about a week.",
      source_id: S,
      page_ref: "p630",
      snippet: "often delayed 2–4 weeks ... Vasomotor symptoms ... may improve within 1 week",
      agreement: "single",
    },
  },
  {
    generic_name: "Fluvoxamine",
    onset_time: {
      value:
        "Some relief of sleep or anxiety can appear in the first days. The fuller effect usually takes 2–4 weeks.",
      source_id: S,
      page_ref: "p957",
      snippet: "Some patients may experience relief of insomnia or anxiety early ... often delayed 2–4 weeks",
      agreement: "single",
    },
  },
  {
    generic_name: "Donepezil",
    onset_time: {
      value:
        "Any improvement in memory or behaviour may take up to 6 weeks to appear; changes in the course of the condition can take months.",
      source_id: S,
      page_ref: "p710",
      snippet: "May take up to 6 weeks before any improvement in baseline memory or behavior is evident ... months before any stabilization",
      agreement: "single",
    },
  },
  {
    generic_name: "Clozapine",
    onset_time: {
      value:
        "Response relates to reaching a certain level in the blood; once that is reached, a response is typically seen within about 3 weeks.",
      source_id: S,
      page_ref: "p558",
      snippet: "Likelihood of response depends on achieving trough plasma levels of at least 350 ng/mL. Median time to response after achieving therapeutic plasma levels ... approximately 3 weeks",
      agreement: "single",
    },
  },
  {
    generic_name: "Atomoxetine",
    onset_time: {
      value:
        "Effects on attention can begin as early as the first day, and can keep improving over 8–12 weeks.",
      source_id: S,
      page_ref: "p246",
      snippet: "Onset of therapeutic actions in ADHD can be seen as early as the first day ... may continue to improve for 8–12 weeks",
      agreement: "single",
    },
  },
  {
    generic_name: "Oxcarbazepine",
    onset_time: {
      value:
        "For an acute high, effects can appear within a few weeks. Seizure control can improve within about 2 weeks; mood stabilising effects may take weeks to months.",
      source_id: S,
      page_ref: "p1661",
      snippet: "For acute mania, effects should occur within a few weeks ... Should reduce seizures by 2 weeks",
      agreement: "single",
    },
  },
  {
    generic_name: "Zolpidem",
    onset_time: { value: "Generally takes effect in under an hour.", source_id: S, page_ref: "p2493", snippet: "Generally takes effect in less than an hour", agreement: "single" },
  },
  {
    generic_name: "Eszopiclone",
    onset_time: { value: "Generally takes effect in under an hour.", source_id: S, page_ref: "p836", snippet: "Generally takes effect in less than an hour", agreement: "single" },
  },
  {
    generic_name: "Levetiracetam",
    onset_time: {
      value: "Seizure control can improve within about 2 weeks; other effects, where they occur, can take weeks to months.",
      source_id: S, page_ref: "p1161",
      snippet: "Should reduce seizures by 2 weeks ... may take several weeks to months to optimize clinical effects",
      agreement: "single",
    },
  },
  {
    generic_name: "Memantine",
    onset_time: {
      value: "Memory improvement is not expected; changes in the course of the condition can take months to appear.",
      source_id: S, page_ref: "p1376",
      snippet: "Memory improvement is not expected and it may take months before any stabilization in degenerative course is evident",
      agreement: "single",
    },
  },
  {
    generic_name: "Phenelzine",
    onset_time: {
      value: "The antidepressant effect usually takes 2–4 weeks once the dose is adequate, and the sources suggest allowing 6–8 weeks to judge the response.",
      source_id: S, page_ref: "p1765",
      snippet: "Onset of therapeutic actions usually not immediate, but often delayed 2–4 weeks following adequate dosing",
      agreement: "single",
    },
  },
  {
    generic_name: "Tranylcypromine",
    onset_time: {
      value: "Some people notice stimulant-like effects early; the fuller antidepressant effect usually takes 2–4 weeks once the dose is adequate.",
      source_id: S, page_ref: "p2249",
      snippet: "Some patients may experience stimulant-like actions early in dosing ... often delayed 2–4 weeks following adequate dosing",
      agreement: "single",
    },
  },
  {
    generic_name: "Modafinil",
    onset_time: {
      value: "Daytime sleepiness can lessen within about 2 hours of the first dose; the full effect may take a few days.",
      source_id: S, page_ref: "p1511",
      snippet: "Can immediately reduce daytime sleepiness and improve cognitive task performance within 2 hours of first dosing. Can take several days to optimize",
      agreement: "single",
    },
  },
  {
    generic_name: "Fluphenazine",
    onset_time: {
      value: "Psychotic symptoms can improve within the first week, but the full effect takes several weeks.",
      source_id: S, page_ref: "p923",
      snippet: "Psychotic symptoms can improve within 1 week, but it may take several weeks for full effect",
      agreement: "single",
    },
  },
  {
    generic_name: "Rivastigmine",
    onset_time: {
      value: "Any improvement in memory or behaviour may take up to 6 weeks to appear; changes in the course of the condition can take months.",
      source_id: S, page_ref: "p2008",
      snippet: "May take up to 6 weeks before any improvement in baseline memory or behavior is evident ... months before any stabilization",
      agreement: "single",
    },
  },
  {
    generic_name: "Acamprosate",
    onset_time: {
      value: "The studies supporting it ran for 13–52 weeks, so its benefit is judged over months rather than days.",
      source_id: S, page_ref: "p25",
      snippet: "Has demonstrated efficacy in trials lasting between 13 and 52 weeks",
      agreement: "single",
    },
  },
  {
    generic_name: "Disulfiram",
    onset_time: {
      value: "Its effect is immediate — the reaction to alcohol begins quickly once the medicine is in the body.",
      source_id: S, page_ref: "p700",
      snippet: "Disulfiram's effects are immediate",
      agreement: "single",
    },
  },
  {
    generic_name: "Chlorpromazine",
    onset_time: {
      value: "Psychotic symptoms can improve within the first week, with the full effect over several weeks. Nausea and vomiting respond quickly, and it can give a few hours of relief when used for acute agitation.",
      source_id: S, page_ref: "p450",
      snippet: "Psychotic symptoms can improve within 1 week ... Actions on nausea and vomiting are immediate",
      agreement: "single",
    },
  },
  {
    generic_name: "Naltrexone",
    onset_time: {
      value: "It can start working within a few days, though the fullest effect may take a few weeks.",
      source_id: S, page_ref: "p1554",
      snippet: "Can begin working within a few days but maximum effects may not be seen for a few weeks",
      agreement: "single",
    },
  },
  {
    generic_name: "Prazosin",
    onset_time: { value: "Effects can appear within a few days to a few weeks.", source_id: S, page_ref: "p1852", snippet: "Within a few days to a few weeks", agreement: "single" },
  },
  {
    generic_name: "Diazepam",
    onset_time: {
      value: "Some relief comes with the first dose; the fullest effect with regular daily use builds over several weeks.",
      source_id: S, page_ref: "p674",
      snippet: "Some immediate relief with first dosing is common; can take several weeks with daily dosing for maximal therapeutic benefit",
      agreement: "single",
    },
  },
  {
    generic_name: "Paliperidone",
    onset_time: {
      value: "Psychotic symptoms can improve within the first week, but the full effect takes several weeks; the sources suggest allowing 4–6 weeks, sometimes longer.",
      source_id: S, page_ref: "p1679",
      snippet: "Psychotic symptoms can improve within 1 week ... wait at least 4–6 weeks ... up to 16–20 weeks",
      agreement: "single",
    },
  },
  {
    generic_name: "Propranolol",
    onset_time: {
      value: "For tremor, effects can begin within days. For migraine, it can start working within about 2 weeks, with the full effect up to 3 months.",
      source_id: S, page_ref: "p1879",
      snippet: "For migraine, can begin to work within 2 weeks, but may take up to 3 months ... For tremor, can begin to work within days",
      agreement: "single",
    },
  },
  {
    generic_name: "Trifluoperazine",
    onset_time: {
      value: "Psychotic symptoms can improve within the first week, but the full effect takes several weeks.",
      source_id: S, page_ref: "p2296",
      snippet: "Psychotic symptoms can improve within 1 week, but it may take several weeks for full effect",
      agreement: "single",
    },
  },
  {
    generic_name: "Temazepam",
    onset_time: {
      value: "Generally takes effect in under an hour, though longer in some people.",
      source_id: S, page_ref: "p2159",
      snippet: "Generally takes effect in less than an hour, but can take longer in some patients",
      agreement: "single",
    },
  },
  // Methylphenidate — nearest monograph is (D)/(D,L); Stahl gives no onset
  // section for the plain name, so we leave onset_time undefined rather than
  // fabricate. Same for Cyproheptadine and Melatonin.
];