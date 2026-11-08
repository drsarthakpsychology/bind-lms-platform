/**
 * Rx Detective content: side-effect mysteries and interaction puzzles,
 * hand-checked. The medicines themselves (names, Indian brands, class,
 * mechanism, side effects, checks, doses) come from the shared Medicines
 * reference through drugs.ts, so both stay in step.
 */
import type { JourneyData } from "@/lib/study/types";
import type { ItemTags } from "../item-tags";
import type { Action, Topic } from "./drugs";
import { BASE_TAGS, MORE_MYSTERIES } from "./mysteries";
import { MORE_PUZZLES } from "./puzzles";
import { PUZZLES_B } from "./puzzles-b";
import { REVIEWS } from "./reviews";

export { DRUGS, FAMILY, drugById, type Action, type Drug, type Topic } from "./drugs";

/* ------------------------------------------------------- side effects */
export type Effect = { id: string; label: string; receptor: string; action: Action };

export const EFFECTS: Effect[] = [
  { id: "h1", label: "Histamine H1 block", receptor: "H1", action: "antagonist" },
  { id: "m1", label: "Muscarinic (acetylcholine) block", receptor: "M1", action: "antagonist" },
  { id: "a1", label: "Alpha-1 block on blood vessels", receptor: "alpha-1", action: "antagonist" },
  { id: "d2ns", label: "D2 block in the movement pathway", receptor: "D2", action: "antagonist" },
  { id: "d2ti", label: "D2 block in the prolactin pathway", receptor: "D2", action: "antagonist" },
  { id: "d2part", label: "D2 partial agonism", receptor: "D2", action: "partial" },
  { id: "5ht3", label: "Extra serotonin at gut 5-HT3", receptor: "5-HT3", action: "full" },
  { id: "5ht2", label: "Extra serotonin at 5-HT2 receptors", receptor: "5-HT2A", action: "full" },
  { id: "nach", label: "Sodium channel block in the heart", receptor: "heart Na+ channel", action: "antagonist" },
  { id: "dane", label: "More dopamine and noradrenaline", receptor: "DAT", action: "antagonist" },
  { id: "ach", label: "More acetylcholine at the heart", receptor: "M2 (heart)", action: "full" },
  { id: "herg", label: "Potassium (hERG) channel block in the heart", receptor: "hERG K+ channel", action: "antagonist" },
  { id: "5ht2c", label: "Serotonin 2C block (appetite brake released)", receptor: "5-HT2C", action: "antagonist" },
  { id: "sertplt", label: "Serotonin pump block in platelets", receptor: "SERT (platelets)", action: "antagonist" },
  { id: "adh", label: "Extra water-holding hormone (ADH) effect", receptor: "V2 (kidney)", action: "full" },
  { id: "ne", label: "More noradrenaline at blood vessels and heart", receptor: "alpha-1 and beta-1", action: "full" },
  { id: "gaba", label: "GABA-A boost", receptor: "GABA-A", action: "full" },
  { id: "nanerve", label: "Sodium channel block in nerves", receptor: "Na+ channel (nerves)", action: "antagonist" },
  { id: "v2block", label: "Kidney deaf to the water-holding hormone", receptor: "V2 (kidney)", action: "antagonist" },
  { id: "thyroid", label: "Thyroid hormone release slowed", receptor: "thyroid gland", action: "antagonist" },
  { id: "mufull", label: "Opioid mu receptor stimulation", receptor: "mu opioid", action: "full" },
  { id: "mupart", label: "Mu opioid partial agonism", receptor: "mu opioid", action: "partial" },
  { id: "mublock", label: "Opioid receptor block", receptor: "mu opioid", action: "antagonist" },
  { id: "aldh", label: "Aldehyde enzyme block", receptor: "ALDH", action: "antagonist" },
  { id: "achgut", label: "More acetylcholine in the gut", receptor: "muscarinic (gut)", action: "full" },
  { id: "nmda", label: "Glutamate NMDA block", receptor: "NMDA", action: "antagonist" },
  { id: "beta", label: "Beta receptor block", receptor: "beta-1 and beta-2", action: "antagonist" },
  { id: "mt1", label: "Melatonin receptor stimulation", receptor: "MT1 and MT2", action: "full" },
  { id: "a2d", label: "Alpha-2-delta calcium channel binding", receptor: "alpha-2-delta", action: "antagonist" },
  { id: "5ht1a", label: "Serotonin 1A partial agonism", receptor: "5-HT1A", action: "partial" },
  { id: "d2up", label: "D2 receptors grown oversensitive after long block", receptor: "D2", action: "antagonist" },
  { id: "5ht3block", label: "Serotonin 3 block (anti-sickness)", receptor: "5-HT3", action: "antagonist" },
  { id: "a2block", label: "Alpha-2 brake block (more transmitter released)", receptor: "alpha-2", action: "antagonist" },
  { id: "d2ctz", label: "D2 block in the vomiting centre", receptor: "D2", action: "antagonist" },
  { id: "ammonia", label: "Ammonia clearance slowed in the liver", receptor: "urea cycle (liver)", action: "antagonist" },
  { id: "pth", label: "Parathyroid calcium sensor reset", receptor: "calcium-sensing receptor", action: "antagonist" },
  { id: "d2meso", label: "D2 block in the reward pathway", receptor: "D2", action: "antagonist" },
];

export const effectById = (id: string) => EFFECTS.find((e) => e.id === id);

export type Mystery = {
  id: string;
  drug: string;
  who: string;
  story: string;
  clues: string[];
  answer: string;
  options: string[];
  why: string;
  topic: Topic;
  /** Why each wrong option is wrong, by content. */
  not?: string;
  tags?: ItemTags;
};

const BASE_MYSTERIES: Mystery[] = [
  {
    id: "olz-weight",
    drug: "olanzapine",
    who: "Rohit, 26, Nagpur",
    story: "Three months on olanzapine for schizophrenia. 'I sleep ten hours and I'm always hungry. My jeans don't fit.'",
    clues: ["Sleepy", "Hungry", "Weight up"],
    answer: "h1",
    options: ["h1", "d2ti", "a1", "5ht3"],
    why: "Blocking histamine H1 in the brain causes sleepiness and drives appetite. Olanzapine also blocks 5-HT2C, which adds to weight gain. Both receptors sit in the hypothalamus, where hunger is set.",
    topic: "antipsychotics",
  },
  {
    id: "que-dizzy",
    drug: "quetiapine",
    who: "Mrs Kapoor, 71, Delhi",
    story: "Started quetiapine for night-time agitation. She fell in the bathroom at 3 am after getting up quickly.",
    clues: ["Dizzy on standing", "Fall", "Older adult"],
    answer: "a1",
    options: ["a1", "h1", "m1", "d2ns"],
    why: "Alpha-1 receptors keep blood vessels tight. Block them and blood pools in the legs on standing, so blood pressure drops and the person feels faint. In older adults this means falls.",
    topic: "antipsychotics",
  },
  {
    id: "ami-dry",
    drug: "amitriptyline",
    who: "Graham, 58, Manchester",
    story: "On amitriptyline for depression and back pain. Dry mouth, hard stools, blurred reading and trouble passing urine.",
    clues: ["Dry mouth", "Constipation", "Blurred vision", "Urine hold-up"],
    answer: "m1",
    options: ["m1", "a1", "h1", "5ht2"],
    why: "Acetylcholine at muscarinic receptors keeps saliva flowing, the gut moving, the eye focusing and the bladder emptying. Block it and all four slow down: dry, constipated, blurred, retention.",
    topic: "antidepressants",
  },
  {
    id: "hal-stiff",
    drug: "haloperidol",
    who: "Imran, 30, Hyderabad",
    story: "Two days after haloperidol injections on the ward, his arms are stiff like a lead pipe and his hands shake.",
    clues: ["Stiff", "Tremor", "Shuffling"],
    answer: "d2ns",
    options: ["d2ns", "d2ti", "m1", "h1"],
    why: "Dopamine in the nigrostriatal pathway smooths movement. Strong D2 block there mimics Parkinson's disease: stiffness, tremor and slowness. Anticholinergic medicines can ease it because dopamine and acetylcholine balance each other in this pathway.",
    topic: "antipsychotics",
  },
  {
    id: "ris-prl",
    drug: "risperidone",
    who: "Ananya, 24, Kolkata",
    story: "On risperidone for a year. Her periods stopped and she noticed milky discharge from her breasts.",
    clues: ["No periods", "Breast milk", "Not pregnant"],
    answer: "d2ti",
    options: ["d2ti", "d2ns", "5ht2", "h1"],
    why: "Dopamine from the hypothalamus normally holds prolactin down (the tuberoinfundibular pathway). Block D2 there and prolactin rises: periods stop, milk appears, libido falls. Risperidone raises prolactin more than most.",
    topic: "antipsychotics",
  },
  {
    id: "ari-prl",
    drug: "aripiprazole",
    who: "Ananya, some months later",
    story: "She switched from risperidone to aripiprazole. Her prolactin is now normal and her periods have returned.",
    clues: ["Prolactin normal", "Psychosis still controlled"],
    answer: "d2part",
    options: ["d2part", "d2ti", "h1", "a1"],
    why: "A partial agonist half-switches D2 on. Where dopamine is low it adds signal, so the prolactin pathway still gets enough to hold prolactin down, while it still damps the overactive psychosis pathway.",
    topic: "antipsychotics",
  },
  {
    id: "mir-sleep",
    drug: "mirtazapine",
    who: "Mr Pereira, 66, Goa",
    story: "Low mood, poor sleep and weight loss. On mirtazapine 15 mg he sleeps through the night and eats well again.",
    clues: ["Sleeps", "Appetite back", "Low dose"],
    answer: "h1",
    options: ["h1", "a1", "m1", "5ht3"],
    why: "Mirtazapine is a strong H1 blocker, so it sedates and boosts appetite. Here the 'side effects' are useful: they treat his insomnia and weight loss.",
    topic: "antidepressants",
  },
  {
    id: "ser-nausea",
    drug: "sertraline",
    who: "Leah, 19, Toronto",
    story: "Day three of sertraline. 'I feel sick after every dose.' A little later it has faded.",
    clues: ["Nausea", "Early", "Fades"],
    answer: "5ht3",
    options: ["5ht3", "h1", "m1", "d2ns"],
    why: "Most of the body's serotonin is in the gut. Extra serotonin stimulates 5-HT3 receptors there and in the vomiting centre, so nausea comes early. The receptors adapt, so it usually settles. Taking it with food helps.",
    topic: "antidepressants",
  },
  {
    id: "esc-sex",
    drug: "escitalopram",
    who: "Karan, 33, Mumbai",
    story: "Mood is better on escitalopram, but he has lost interest in sex and is slow to climax. He is thinking of stopping.",
    clues: ["Low libido", "Delayed orgasm", "Mood better"],
    answer: "5ht2",
    options: ["5ht2", "5ht3", "a1", "m1"],
    why: "Extra serotonin at 5-HT2 receptors in the brain and spinal cord damps sexual response and lowers dopamine downstream. It is a common reason people stop SSRIs, so ask about it directly.",
    topic: "antidepressants",
  },
  {
    id: "ami-od",
    drug: "amitriptyline",
    who: "A 40-year-old in emergency, Chennai",
    story: "Took a month's supply of amitriptyline. Drowsy, pupils wide, heart racing. The ECG shows wide QRS complexes; then a seizure.",
    clues: ["Wide QRS", "Seizure", "Overdose"],
    answer: "nach",
    options: ["nach", "m1", "a1", "h1"],
    why: "In overdose tricyclics block fast sodium channels in the heart, slowing conduction (wide QRS) and risking fatal rhythms. This is why tricyclics are given in small supplies when suicide risk is present.",
    topic: "antidepressants",
  },
  {
    id: "mph-appetite",
    drug: "methylphenidate",
    who: "Aarav, 9, Bengaluru",
    story: "On methylphenidate for ADHD. Better focus at school, but he skips lunch and lies awake till midnight.",
    clues: ["No appetite", "Late sleep", "Focus better"],
    answer: "dane",
    options: ["dane", "h1", "5ht3", "m1"],
    why: "Blocking dopamine and noradrenaline reuptake raises both. That sharpens attention but also suppresses appetite and keeps the brain alert at night. Track height and weight.",
    topic: "child",
  },
  {
    id: "don-faint",
    drug: "donepezil",
    who: "Mrs Okafor, 79, London",
    story: "Started donepezil for Alzheimer's disease. Her pulse is 48 and she fainted at the bus stop.",
    clues: ["Slow pulse", "Fainting", "Dementia medicine"],
    answer: "ach",
    options: ["ach", "a1", "nach", "h1"],
    why: "More acetylcholine reaches the heart's M2 receptors via the vagus nerve, slowing the pulse. Check the pulse before starting and ask about fainting.",
    topic: "neurocognitive",
  },
];

/* ------------------------------------------------------- interactions */
export type Outcome = { id: string; label: string };

export const OUTCOMES: Outcome[] = [
  { id: "ss", label: "Serotonin syndrome" },
  { id: "qt", label: "Longer QT, risk of a dangerous heart rhythm" },
  { id: "up", label: "Level goes up: the liver clears less" },
  { id: "down", label: "Level goes down: the liver clears more" },
  { id: "kidney", label: "Level goes up: the kidneys clear less" },
  { id: "breath", label: "Sedation adds up: breathing slows" },
  { id: "reaction", label: "Flushing and vomiting reaction" },
  { id: "safe", label: "No important clash" },
  { id: "bleed", label: "Bleeding risk goes up" },
  { id: "lowna", label: "Sodium falls: confusion and falls" },
  { id: "seiz", label: "Fits become more likely" },
  { id: "wbc", label: "White cells may fall dangerously" },
  { id: "bp", label: "Blood pressure drops: dizziness and falls" },
  { id: "antichol", label: "Anticholinergic overload: confusion, retention, constipation" },
  { id: "wd", label: "Sudden opioid withdrawal is triggered" },
  { id: "blocked", label: "One medicine cancels the other's effect" },
  { id: "downkid", label: "Level goes down: the kidneys clear more" },
  { id: "slowpulse", label: "Pulse slows too far" },
  { id: "masked", label: "Warning signs of low blood sugar are hidden" },
];

export const outcomeById = (id: string) => OUTCOMES.find((o) => o.id === id);

export type Puzzle = {
  id: string;
  a: string;
  b: string;
  story: string;
  answer: string;
  why: string;
  topic: Topic;
  /** Liver or kidney puzzles animate the journey; others the receptor. */
  journey?: Omit<JourneyData, "caption"> & { caption?: string };
  receptor?: { receptor: string; caption: string };
  /** Three fixed wrong outcomes, each checked to be false for this pair. */
  options?: string[];
  /** Why each wrong option is wrong, by content. */
  not?: string;
  tags?: ItemTags;
};

const BASE_PUZZLES: Puzzle[] = [
  {
    id: "ser-tram",
    a: "Sertraline",
    b: "Tramadol",
    story: "On sertraline, she was given tramadol for a sprained ankle. Now: shivering, sweating, jerky reflexes, diarrhoea, temperature rising.",
    answer: "ss",
    why: "Tramadol also blocks serotonin reuptake. Two serotonin boosters together can overload serotonin receptors: agitation, sweating, tremor, clonus (jerky reflexes) and fever. Stop the cause and get medical help.",
    topic: "antidepressants",
    receptor: { receptor: "5-HT2A", caption: "Too much serotonin acts like a flood of full agonist. Tap Full agonist to see the signal max out." },
  },
  {
    id: "esc-line",
    a: "Escitalopram",
    b: "Linezolid",
    story: "A man on escitalopram is started on the antibiotic linezolid for a resistant infection.",
    answer: "ss",
    why: "Linezolid is also a weak MAO inhibitor, so serotonin is broken down less. Add an SSRI and serotonin can build up dangerously. The team weighs the need for both and watches closely.",
    topic: "antidepressants",
    receptor: { receptor: "5-HT2A", caption: "Less breakdown plus blocked reuptake: serotonin floods the receptor. Tap Full agonist." },
  },
  {
    id: "flu-ris",
    a: "Fluoxetine",
    b: "Risperidone",
    story: "Fluoxetine is added to his risperidone. A month later he is stiff and shaky.",
    answer: "up",
    why: "Fluoxetine blocks CYP2D6, the liver enzyme that breaks down risperidone. Risperidone builds up, and with it the movement side effects.",
    topic: "antipsychotics",
    journey: { drug: "risperidone", target: "dopamine D2 receptors", notes: { liver: "Fluoxetine blocks CYP2D6 here, so far less risperidone is broken down on its way through. More of it reaches the blood." } },
  },
  {
    id: "flv-clz",
    a: "Fluvoxamine",
    b: "Clozapine",
    story: "Fluvoxamine is added for obsessive thoughts in a woman stable on clozapine. She becomes very sleepy and drools more.",
    answer: "up",
    why: "Fluvoxamine strongly blocks CYP1A2, the main enzyme that clears clozapine. Clozapine levels can rise several-fold, with sedation, low blood pressure and seizure risk.",
    topic: "antipsychotics",
    journey: { drug: "clozapine", target: "D2, 5-HT2A and many other receptors", notes: { liver: "Fluvoxamine blocks CYP1A2, the main way clozapine is cleared. Levels climb." } },
  },
  {
    id: "clz-smoke",
    a: "Clozapine",
    b: "Stopping smoking",
    story: "He gave up cigarettes overnight after a chest infection. Days later he is very drowsy and has a seizure.",
    answer: "up",
    why: "Tobacco smoke (not nicotine) speeds up CYP1A2. Stop smoking and the enzyme slows back down, so the same clozapine dose gives a much higher level. The dose often needs lowering when someone quits.",
    topic: "antipsychotics",
    journey: { drug: "clozapine", target: "D2, 5-HT2A and many other receptors", notes: { liver: "Smoke had been speeding up CYP1A2. Without it, the liver clears clozapine more slowly and levels rise." } },
  },
  {
    id: "cbz-pill",
    a: "Carbamazepine",
    b: "The contraceptive pill",
    story: "She takes carbamazepine for bipolar disorder and the combined pill for contraception. She becomes pregnant.",
    answer: "down",
    why: "Carbamazepine speeds up CYP3A4, which clears the hormones in the pill. Hormone levels drop and contraception fails. Other methods are advised.",
    topic: "stabilisers",
    journey: { drug: "the contraceptive pill", target: "hormone receptors", notes: { liver: "Carbamazepine has sped up CYP3A4, so more of the hormone is destroyed in the liver before it can work." } },
  },
  {
    id: "li-ibu",
    a: "Lithium",
    b: "Ibuprofen",
    story: "On lithium, he took ibuprofen for several days of toothache. Now: coarse tremor, vomiting, unsteady walk.",
    answer: "kidney",
    why: "Anti-inflammatory painkillers reduce lithium clearance by the kidneys. The level climbs into the toxic range. Paracetamol is the safer choice; check a level urgently.",
    topic: "stabilisers",
    journey: { drug: "lithium", target: "second messengers inside neurons", notes: { liver: "Lithium is not broken down by the liver at all. It passes straight on.", out: "Lithium leaves only through the kidneys. Ibuprofen makes the kidneys hold on to it, so the level rises." } },
  },
  {
    id: "li-dehyd",
    a: "Lithium",
    b: "Diarrhoea and a heatwave",
    story: "A May heatwave in Nagpur, and two days of diarrhoea. She is on lithium and now confused and shaky.",
    answer: "kidney",
    why: "When the body is short of water and salt, the kidneys hold on to lithium along with sodium. Levels rise fast. Fluids, a level check and medical review are needed.",
    topic: "stabilisers",
    journey: { drug: "lithium", target: "second messengers inside neurons", notes: { out: "Dehydrated kidneys hold on to sodium, and lithium with it. The level climbs." } },
  },
  {
    id: "vpa-ltg",
    a: "Sodium valproate",
    b: "Lamotrigine",
    story: "Lamotrigine is added to valproate at the usual starting dose. Soon after, a rash spreads and her mouth is sore.",
    answer: "up",
    why: "Valproate blocks the liver pathway (glucuronidation) that clears lamotrigine, roughly doubling its level. A fast rise raises the risk of a serious rash, so lamotrigine is started at half the usual dose with valproate.",
    topic: "stabilisers",
    journey: { drug: "lamotrigine", target: "sodium channels", notes: { liver: "Valproate blocks the enzyme that joins lamotrigine to glucuronic acid for removal. Lamotrigine piles up." } },
  },
  {
    id: "lor-alc",
    a: "Lorazepam",
    b: "Alcohol",
    story: "After a wedding party he took two lorazepam to sleep. His wife can't wake him and his breathing is slow.",
    answer: "breath",
    why: "Both act on GABA-A receptors and both depress breathing. Together the effects add up. Benzodiazepines with alcohol or opioids are a common cause of fatal overdose.",
    topic: "anxiety",
    receptor: { receptor: "GABA-A", caption: "Two boosters at the same calming receptor: tap Full agonist and picture it pushed even further." },
  },
  {
    id: "dis-alc",
    a: "Disulfiram",
    b: "A cough syrup with alcohol",
    story: "Two days into disulfiram, he drank a cough syrup. Within minutes: flushed face, pounding heart, vomiting.",
    answer: "reaction",
    why: "Disulfiram blocks the enzyme that clears acetaldehyde. Even hidden alcohol in syrups, sauces or aftershave can trigger the reaction. People need to know all the hidden sources.",
    topic: "substance",
    receptor: { receptor: "ALDH", caption: "The enzyme is blocked, so acetaldehyde piles up. Tap Antagonist." },
  },
  {
    id: "hal-azi",
    a: "Haloperidol",
    b: "Azithromycin",
    story: "An older man with delirium on the medical ward is on azithromycin. The team plans haloperidol injections.",
    answer: "qt",
    why: "Both lengthen the QT interval. Together, with low potassium or heart disease, the risk of a dangerous rhythm (torsades de pointes) rises. An ECG and electrolytes come first.",
    topic: "antipsychotics",
  },
  {
    id: "cit-meth",
    a: "Citalopram",
    b: "Methadone",
    story: "A woman on methadone maintenance asks to start citalopram for depression.",
    answer: "qt",
    why: "Methadone and citalopram both lengthen QT. An ECG before and after, and a choice of antidepressant with less QT effect (such as sertraline), is safer.",
    topic: "antidepressants",
  },
  {
    id: "ser-para",
    a: "Sertraline",
    b: "Paracetamol",
    story: "On sertraline, she asks if she can take paracetamol for a headache.",
    answer: "safe",
    why: "No important clash at normal doses. Paracetamol is often the safer painkiller for people on SSRIs, which with anti-inflammatories can raise the risk of stomach bleeding.",
    topic: "antidepressants",
  },
];

export const MYSTERIES: Mystery[] = [...BASE_MYSTERIES.map((m) => ({ ...m, ...BASE_TAGS[m.id] })), ...MORE_MYSTERIES];
export const PUZZLES: Puzzle[] = [...BASE_PUZZLES.map((p) => ({ ...p, ...BASE_TAGS[p.id] })), ...MORE_PUZZLES, ...PUZZLES_B];
export { REVIEWS, type Review } from "./reviews";
export const reviewById = (id: string) => REVIEWS.find((r) => r.id === id);

/**
 * Medicines whose side effects or checks overlap (sedation and weight, the
 * QT interval, blood counts, pulse and blood pressure). For the mechanism,
 * side-effect and monitoring steps, distractors never come from the same
 * topic or an overlapping group, so a "wrong" option is never also true.
 */
export const OVERLAP: string[][] = [
  ["mirtazapine", "amitriptyline", "olanzapine", "quetiapine", "clozapine", "lorazepam", "valproate", "risperidone", "aripiprazole"],
  ["escitalopram", "haloperidol", "amitriptyline", "quetiapine", "clozapine"],
  ["clozapine", "mirtazapine", "carbamazepine", "valproate"],
  ["venlafaxine", "methylphenidate", "donepezil"],
];
