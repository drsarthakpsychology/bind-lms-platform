/**
 * Team Escape Room content. Each room is one patient and a chain of locked
 * doors: MSE, then diagnosis, differential, risk, plan and medicine. Solving a
 * door adds a new page to the case file, which the next door needs.
 */
import { CLINIC_EXAMS, DX_EXAMS, PHARM_EXAMS, type ItemTags, type Level } from "../item-tags";
import { ROOMS_A } from "./rooms-a";
import { ROOMS_B } from "./rooms-b";
import { ROOMS_C } from "./rooms-c";

export type Stage = "mse" | "diagnosis" | "differential" | "risk" | "course" | "plan" | "medicine" | "criteria";

type DoorBase = { tags?: ItemTags };
export type Puzzle = DoorBase &
  (
  | { id: string; stage: Stage; kind: "pick"; prompt: string; options: string[]; answer: number; hint: string; why: string; unlock: string; skill: string }
  | { id: string; stage: Stage; kind: "multi"; prompt: string; options: string[]; answer: number[]; hint: string; why: string; unlock: string; skill: string }
  | { id: string; stage: Stage; kind: "order"; prompt: string; items: string[]; hint: string; why: string; unlock: string; skill: string }
  | { id: string; stage: Stage; kind: "number"; prompt: string; min: number; max: number; answer: number[]; unit?: string; hint: string; why: string; unlock: string; skill: string }
  );

/** Wards a room belongs to (for grouping the library). */
export type Ward = "acute" | "child" | "addiction" | "geriatric" | "liaison" | "forensic" | "perinatal" | "community";
export type Room = { id: string; title: string; place: string; patient: string; intro: string; outro: string; puzzles: Puzzle[]; ward?: Ward };

export const STAGE_LABEL: Record<Stage, string> = {
  mse: "Mental state",
  diagnosis: "Diagnosis",
  differential: "Differential",
  risk: "Risk",
  course: "Course",
  plan: "Plan",
  medicine: "Medicine",
  criteria: "Criteria",
};

const nightShift: Room = {
  id: "kolkata",
  title: "The night shift",
  place: "Orthopaedic ward, Kolkata",
  patient: "Mr Sen, 52, three days after a fractured leg",
  intro: "2 am. The nurse calls: Mr Sen is shouting, pulling at his drip and brushing 'insects' off his blanket. The ward doors lock until the team solves his case.",
  outro: "Mr Sen settles over the next days. Thiamine went in first, his withdrawal was treated safely, and before discharge he agreed to meet the de-addiction team.",
  puzzles: [
    {
      id: "k1",
      stage: "mse",
      kind: "multi",
      prompt: "Observation note: 'Thinks it is morning and that he is at the railway office. Drifts off mid-sentence, then is suddenly alert. Says beetles are crawling on the sheet. Sweating, hands shaking.' Tick every MSE finding.",
      options: ["Disoriented to time and place", "Attention that comes and goes", "Visual hallucinations", "Formal thought disorder in clear consciousness", "Flat, unreactive affect", "Delusional jealousy"],
      answer: [0, 1, 2],
      hint: "Three findings. Look for orientation, attention and what he sees.",
      why: "Disorientation, fluctuating attention and vivid visual hallucinations point to a clouded consciousness. That is delirium until proved otherwise.",
      unlock: "His wife, on the phone: 'He drinks a full bottle of rum every night. He hasn't had a drop since the accident.'",
      skill: "neurocognitive:recognise",
    },
    {
      id: "k2",
      stage: "diagnosis",
      kind: "pick",
      prompt: "Confused, hallucinating, shaking, three days after his last drink. Most likely diagnosis?",
      options: ["Alcohol withdrawal delirium (delirium tremens)", "Schizophrenia, first episode", "Alzheimer's dementia", "Alcohol intoxication"],
      answer: 0,
      hint: "Count back from the last drink.",
      why: "Delirium with tremor, sweating and vivid hallucinations a few days after stopping heavy drinking is delirium tremens, a medical emergency.",
      unlock: "On examination: when he looks to the side, his eyes jerk and won't move fully. He staggers when he stands.",
      skill: "substance:recognise",
    },
    {
      id: "k3",
      stage: "differential",
      kind: "pick",
      prompt: "Eye movement problems and an unsteady walk, in a heavy drinker. What else is going on?",
      options: ["Wernicke's encephalopathy", "Korsakoff syndrome only", "A stroke of the frontal lobe", "Conversion disorder"],
      answer: 0,
      hint: "A vitamin is running out.",
      why: "Confusion, eye movement problems and ataxia is the classic triad of Wernicke's encephalopathy, caused by thiamine (vitamin B1) deficiency. Often only one or two signs are present, so suspect it in every heavy drinker.",
      unlock: "Pulse 124, temperature 38.2, blood pressure high. The night doctor wants to start a glucose drip because he hasn't eaten.",
      skill: "substance:differentiate",
    },
    {
      id: "k4",
      stage: "risk",
      kind: "multi",
      prompt: "Which dangers are real tonight? Tick all.",
      options: ["Withdrawal seizures", "Falls and pulling out lines", "Dehydration and salt imbalance", "Permanent memory damage if thiamine is missed", "Becoming addicted to his first benzodiazepine dose", "Suicide with saved-up tablets at home"],
      answer: [0, 1, 2, 3],
      hint: "Four of them belong to tonight, on this ward.",
      why: "Delirium tremens can kill through seizures, injury, dehydration and heart strain. Untreated Wernicke's can leave permanent memory loss (Korsakoff syndrome). A short supervised benzodiazepine course is the treatment, not the danger.",
      unlock: "The ward sister asks: 'Which came first? I need it for the handover.'",
      skill: "substance:risk",
    },
    {
      id: "k5",
      stage: "course",
      kind: "order",
      prompt: "Put alcohol withdrawal in the order it usually unfolds after the last drink.",
      items: ["Tremor, sweating, a racing heart", "Hallucinations with a clear head", "Withdrawal seizures", "Delirium tremens"],
      hint: "It starts mild, within hours, and ends with the most dangerous.",
      why: "Tremor comes first, within hours. Perceptual disturbances follow, then seizures, and delirium tremens usually arrives within about three days. Some people skip steps, so watch closely from the start.",
      unlock: "The glucose drip is hanging, ready to go.",
      skill: "substance:apply",
    },
    {
      id: "k6",
      stage: "plan",
      kind: "pick",
      prompt: "The drip is ready. What must happen first?",
      options: ["Give thiamine into a vein before any glucose", "Start the glucose now and thiamine tomorrow", "Give oral thiamine with breakfast", "Hold thiamine until a blood level comes back"],
      answer: 0,
      hint: "Glucose burns up the little B1 he has left.",
      why: "Glucose metabolism uses thiamine. Giving glucose first can tip a deficient brain into Wernicke's. In suspected Wernicke's, thiamine goes in by injection, in high doses, before or with glucose.",
      unlock: "Blood results: his liver is badly damaged (cirrhosis on scan, low albumin).",
      skill: "substance:apply",
    },
    {
      id: "k7",
      stage: "medicine",
      kind: "pick",
      prompt: "His liver is failing. Which benzodiazepine is the safer choice for the withdrawal?",
      options: ["Lorazepam", "Diazepam", "Chlordiazepoxide", "No benzodiazepine; give haloperidol alone"],
      answer: 0,
      hint: "Which one skips the liver's slow, oxidative step?",
      why: "Lorazepam is cleared by a simple liver step (glucuronidation) and has no long-acting active metabolites, so it is less likely to build up in liver failure. Diazepam and chlordiazepoxide are long-acting and can accumulate. Antipsychotics alone don't treat withdrawal and lower the seizure threshold.",
      unlock: "The doors open.",
      skill: "anxiety:pharm",
    },
  ],
};

const stillRoom: Room = {
  id: "bengaluru",
  title: "The still room",
  place: "Psychiatry ward, Bengaluru",
  patient: "Ms Lakshmi, 34, schoolteacher",
  intro: "Transferred from a private hospital: she has not spoken, eaten or moved from her bed for four days. The ward is locked until the team works out why.",
  outro: "After lorazepam Ms Lakshmi sipped water and whispered her name. With the depression treated, she was back in her classroom months later.",
  puzzles: [
    {
      id: "b1",
      stage: "mse",
      kind: "multi",
      prompt: "Observation note: 'Lies still, staring. No answer to questions. When I raised her arm it stayed in the air for minutes, then she resisted my moving it, like soft wax. Pulls away when asked to open her mouth.' Tick every finding.",
      options: ["Mutism", "Catalepsy (holds a posture she is put in)", "Waxy flexibility", "Negativism", "Pressured speech", "Flight of ideas"],
      answer: [0, 1, 2, 3],
      hint: "Four. The last two would need her to be talking.",
      why: "Mutism, catalepsy, waxy flexibility and negativism are all catatonic signs. Staring and immobility (stupor) often sit alongside.",
      unlock: "Her sister says: for two months before this she cried every night, stopped eating and said she was a burden.",
      skill: "interview-mse:recognise",
    },
    {
      id: "b2",
      stage: "diagnosis",
      kind: "pick",
      prompt: "Catatonic signs after two months of low mood. Best formulation?",
      options: ["Catatonia associated with major depressive disorder", "Schizophrenia, catatonic type, for certain", "She is pretending (malingering)", "Early-onset dementia"],
      answer: 0,
      hint: "Catatonia is a syndrome; it sits on top of something.",
      why: "Catatonia can come with depression, mania, psychosis or medical illness. Here the months of low mood, guilt and poor eating point to depression. Mood disorders are among its commonest causes.",
      unlock: "The transfer letter: 'Given haloperidol injection twice, as she was not responding.' Now: temperature 39, she is rigid all over and sweating. CK (a muscle enzyme) is very high.",
      skill: "depression:differentiate",
    },
    {
      id: "b3",
      stage: "differential",
      kind: "pick",
      prompt: "Fever, rigidity, sweating and a high CK after haloperidol. What must you rule out now?",
      options: ["Neuroleptic malignant syndrome", "Serotonin syndrome", "A simple viral fever", "Heat stroke"],
      answer: 0,
      hint: "Which emergency follows antipsychotics?",
      why: "Neuroleptic malignant syndrome (fever, rigidity, unstable pulse and blood pressure, confusion, raised CK) can follow antipsychotics, and catatonia raises the risk. Serotonin syndrome brings jerky reflexes rather than lead-pipe rigidity, after serotonin medicines.",
      unlock: "The physician confirms: haloperidol is stopped, fluids started. She is still not eating or moving.",
      skill: "antipsychotics:pharm",
    },
    {
      id: "b4",
      stage: "risk",
      kind: "multi",
      prompt: "She hasn't moved, eaten or drunk for days. Which risks need action? Tick all.",
      options: ["Dehydration and kidney injury", "Clots in the legs that can travel to the lungs", "Pressure sores", "Choking on food or fluids", "Violence to staff as the main risk", "Addiction to lorazepam within a day"],
      answer: [0, 1, 2, 3],
      hint: "Think of what lying still and not swallowing does to a body.",
      why: "Immobility and not drinking bring kidney injury, blood clots, pressure sores and aspiration. Catatonia can be fatal for these medical reasons, so the nursing and medical plan matters as much as the psychiatry.",
      unlock: "The consultant says: 'Let's do a lorazepam challenge.'",
      skill: "depression:apply",
    },
    {
      id: "b5",
      stage: "plan",
      kind: "order",
      prompt: "Put the lorazepam challenge in order.",
      items: ["Rate her catatonic signs at the start", "Give a small dose of lorazepam", "Re-rate the signs after a short wait", "If better, give lorazepam regularly; if not, plan ECT"],
      hint: "You can't measure a change without a starting point.",
      why: "A baseline rating, a test dose, then a repeat rating shows whether she responds. Most people with catatonia improve with benzodiazepines. ECT works well when they don't, and is urgent in malignant catatonia.",
      unlock: "After the dose she sits up and takes a sip of water.",
      skill: "depression:apply",
    },
    {
      id: "b6",
      stage: "medicine",
      kind: "pick",
      prompt: "The team plans her depression treatment. Which medicine stays off the chart for now?",
      options: ["Haloperidol and other antipsychotics", "Lorazepam", "An antidepressant once she can swallow", "Paracetamol for the fever"],
      answer: 0,
      hint: "What brought on the fever?",
      why: "After neuroleptic malignant syndrome, antipsychotics are avoided until it has fully settled, and restarted only with great care if needed. Lorazepam treats the catatonia; an antidepressant (or ECT) treats the depression.",
      unlock: "One more lock: the criteria.",
      skill: "antipsychotics:pharm",
    },
    {
      id: "b7",
      stage: "criteria",
      kind: "number",
      prompt: "To call it catatonia, at least how many of the 12 listed catatonic features must dominate the picture?",
      min: 1,
      max: 12,
      answer: [3],
      unit: "features",
      hint: "Fewer than she had on arrival.",
      why: "Three or more of the twelve (stupor, catalepsy, waxy flexibility, mutism, negativism, posturing, mannerism, stereotypy, agitation, grimacing, echolalia, echopraxia). She had four.",
      unlock: "The doors open.",
      skill: "depression:criteria",
    },
  ],
};

const nightBus: Room = {
  id: "london",
  title: "The night bus",
  place: "Emergency department, London",
  patient: "Zara, 24, junior accountant",
  intro: "Zara arrives by ambulance, clutching her chest: 'I'm having a heart attack.' It's her fourth visit this year. The cubicle locks until the team solves her case.",
  outro: "Zara's tests were normal. Six sessions of CBT later she rode the night bus home alone, and the panic came and went without taking over.",
  puzzles: [
    {
      id: "l1",
      stage: "mse",
      kind: "multi",
      prompt: "Observation note: 'Restless, tearful, hands trembling. Speech fast but makes sense. Says she will die or go mad. No odd beliefs, no voices. Knows where she is. Says this must be her heart.' Tick every finding.",
      options: ["Anxious affect", "Fear of dying or losing control", "Fast but coherent speech", "Intact orientation", "A delusion that her heart has been replaced", "Clouded consciousness"],
      answer: [0, 1, 2, 3],
      hint: "Four. Nothing psychotic, nothing confused.",
      why: "Intense anxiety with catastrophic fears, in clear consciousness and without psychotic features. The belief about her heart is a fear she can doubt, not a fixed delusion.",
      unlock: "She says the attacks come out of nowhere: on the bus, at her desk, once in her sleep. They peak within minutes.",
      skill: "anxiety:recognise",
    },
    {
      id: "l2",
      stage: "diagnosis",
      kind: "pick",
      prompt: "Sudden attacks out of the blue, peaking in minutes, and months of dread about the next one. Most likely?",
      options: ["Panic disorder", "Generalised anxiety disorder", "Illness anxiety disorder", "Social anxiety disorder"],
      answer: 0,
      hint: "Unexpected attacks, plus worry about having more.",
      why: "Recurrent unexpected panic attacks with persistent worry about more attacks (or changes to avoid them) is panic disorder. GAD is steady worry about many things; social anxiety attacks come with being watched.",
      unlock: "The registrar: 'Before we call it panic, what must we rule out?'",
      skill: "anxiety:criteria",
    },
    {
      id: "l3",
      stage: "differential",
      kind: "multi",
      prompt: "Which checks make sense before you settle on panic disorder? Tick all.",
      options: ["An ECG", "Thyroid function", "Caffeine, energy drinks and stimulant use", "Blood sugar", "A brain MRI for everyone", "A lumbar puncture"],
      answer: [0, 1, 2, 3],
      hint: "Heart, hormones, what she takes in, and fuel.",
      why: "Heart rhythm problems, an overactive thyroid, stimulants (including lots of caffeine) and low blood sugar can all mimic panic. Brain scans and lumbar punctures aren't routine without other signs.",
      unlock: "All normal. She drinks four energy drinks a day and has started taking her flatmate's diazepam.",
      skill: "anxiety:differentiate",
    },
    {
      id: "l4",
      stage: "risk",
      kind: "pick",
      prompt: "Left untreated, what is she most at risk of?",
      options: ["Avoiding more and more places, and using alcohol or sedatives to cope", "Developing schizophrenia", "A heart attack caused by the panic itself", "Dementia in later life"],
      answer: 0,
      hint: "Look at what she has already started doing.",
      why: "Panic disorder often grows into agoraphobia (avoiding buses, shops, being alone) and self-medication with alcohol or benzodiazepines. Depression can follow too, so ask about mood and suicidal thoughts as well.",
      unlock: "She agrees to CBT. The therapist sketches the plan.",
      skill: "anxiety:apply",
    },
    {
      id: "l5",
      stage: "plan",
      kind: "order",
      prompt: "Put her CBT plan in a sensible order.",
      items: ["Map the panic cycle together: sensation, scary thought, more fear", "Catch and test the catastrophic thought ('my heart will stop')", "Bring on the body sensations safely, on purpose", "Go back to avoided places, step by step", "Make a plan for setbacks"],
      hint: "Understand it, question it, face the feelings, face the places, then protect the gains.",
      why: "CBT for panic starts with a shared model, tests the misreading of body sensations, then uses exposure to sensations (like spinning or running on the spot) and to avoided places. A relapse plan keeps the gains.",
      unlock: "Her GP asks about medicine too.",
      skill: "anxiety:apply",
    },
    {
      id: "l6",
      stage: "medicine",
      kind: "pick",
      prompt: "If she wants medicine as well, what is the usual first choice?",
      options: ["An SSRI, started at a low dose and raised slowly", "Regular alprazolam, long term", "Propranolol on its own", "An antipsychotic"],
      answer: 0,
      hint: "First line, and the dose starts low for a reason.",
      why: "SSRIs are first-line medicines for panic disorder. People with panic often feel jittery in the first days, so the dose starts low. Long-term benzodiazepines bring dependence and can get in the way of CBT.",
      unlock: "One more lock: the criteria.",
      skill: "antidepressants:pharm",
    },
    {
      id: "l7",
      stage: "criteria",
      kind: "number",
      prompt: "A panic attack is defined by at least how many of the 13 listed symptoms (racing heart, sweating, trembling and so on)?",
      min: 1,
      max: 13,
      answer: [4],
      unit: "symptoms",
      hint: "Fewer than a third of the list.",
      why: "Four or more of the thirteen. Attacks with fewer are 'limited-symptom' attacks.",
      unlock: "The doors open.",
      skill: "anxiety:criteria",
    },
  ],
};

/** Default ladder level for a door by its stage (a room's last door is the full case). */
export const STAGE_LEVEL: Record<Stage, Level> = { mse: 1, criteria: 2, diagnosis: 2, course: 2, differential: 4, risk: 3, plan: 3, medicine: 3 };

/** Objectives for the first three rooms' doors. */
const BASE_OBJECTIVE: Record<string, string> = {
  k1: "Pick out the MSE signs of delirium.",
  k2: "Recognise delirium tremens from timing and signs.",
  k3: "Spot Wernicke's encephalopathy in a heavy drinker.",
  k4: "Name the real dangers of severe alcohol withdrawal.",
  k5: "Order the stages of alcohol withdrawal.",
  k6: "Give thiamine before glucose.",
  k7: "Choose a benzodiazepine for withdrawal in liver failure.",
};

function withTags(r: Room): Room {
  return {
    ...r,
    puzzles: r.puzzles.map((p, i) => {
      if (p.tags) return p;
      const learn = p.skill.split(":")[0];
      const level: Level = i === r.puzzles.length - 1 ? 5 : STAGE_LEVEL[p.stage];
      const exams = p.stage === "medicine" ? PHARM_EXAMS : p.stage === "risk" || p.stage === "plan" ? CLINIC_EXAMS : DX_EXAMS;
      const objective = BASE_OBJECTIVE[p.id] ?? `${STAGE_LABEL[p.stage]}: ${p.prompt.split(/[.?:]/)[0].slice(0, 80)}.`;
      return { ...p, tags: { topic: `${r.title}: ${STAGE_LABEL[p.stage].toLowerCase()}`, level, objective, exams, learn } };
    }),
  };
}

export const ROOMS: Room[] = [nightShift, stillRoom, nightBus, ...ROOMS_A, ...ROOMS_B, ...ROOMS_C].map(withTags);

export const roomById = (id: string) => ROOMS.find((r) => r.id === id);
