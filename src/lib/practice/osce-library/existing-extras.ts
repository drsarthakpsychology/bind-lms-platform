/**
 * Role briefs, model points and tags for the first 12 stations (osce-1 to
 * osce-12). Their task and checklist text stay exactly as written; this only
 * adds the missing layer so every station carries the same parts.
 */

import type { OsceStation } from "@/lib/practice/osce";

type Extra = Pick<OsceStation, "role" | "role_brief" | "model_points" | "tags">;

export const EXISTING_EXTRAS: Record<string, Extra> = {
  "osce-1": {
    role: "patient",
    role_brief: "You are Ananya, 26, a bank clerk in Pune. Your boyfriend of four years ended things six weeks ago. You sleep badly and cry at work. If asked clearly, you say you have thought 'it would be easier not to wake up' most nights, and last week you looked at your mother's sleeping tablets but did not take any. You have no plan for tonight. Your younger sister matters a great deal to you. You drink 'a few' beers at weekends. Answer honestly when asked directly; volunteer nothing about the tablets.",
    model_points: [
      "Asks about suicide in plain words: 'Have you had thoughts of ending your life?'",
      "Moves from thoughts to plan, means (the tablets), intent and timing, without flinching",
      "Asks about past attempts, alcohol and who knows",
      "Draws out the sister as a reason for living and uses it in the plan",
      "Agrees a written safety plan: the tablets handed to her mother, a crisis number, a review within days",
    ],
    tags: { topic: "suicide-risk", difficulty: 3, objective: "Run a structured suicide risk assessment and safety plan", exams: ["mcp-entrance", "md-psychiatry", "ma-semester"], module: "suicide" },
  },
  "osce-2": {
    role: "patient",
    role_brief: "You are Mr Sharma, 40, a transport supervisor. Your doctor wants you to start an antidepressant. Your cousin 'got hooked' on sleeping pills, and you think these are the same. You also worry about losing your sex drive. You will agree to a trial only if your fears are answered without lecturing.",
    model_points: [
      "Explains the medicine in plain words: it helps the brain's mood signalling settle over weeks",
      "Sets the timeline: side effects may come first, benefit usually builds over 2 to 6 weeks",
      "Separates antidepressants from sleeping pills: no craving or need for higher doses, but stopping suddenly can cause unpleasant discontinuation symptoms",
      "Names common side effects, including sexual ones, and what to do about them",
      "Invites his questions and lets him decide",
    ],
    tags: { topic: "antidepressants", difficulty: 2, objective: "Explain an SSRI and answer the addiction fear honestly", exams: ["mcp-entrance", "md-psychiatry", "ma-semester"], module: "antidepressants" },
  },
  "osce-3": {
    role: "patient",
    role_brief: "You are Imran, 30, a software tester. You have had low mood and poor sleep for months and counselling has helped only a little. The counsellor now wants a psychiatrist to see you. To you, psychiatrists are 'for mad people', and your father must never find out. Ask: 'Does this mean I'm crazy?' and 'Will it go on my company record?'",
    model_points: [
      "Gives a warning shot, then the news in one clear sentence",
      "Explains why: a medical review can add treatment options, not a verdict on his sanity",
      "Answers the stigma question directly and the confidentiality question accurately",
      "Says what the first psychiatry visit will look like",
      "Checks how he feels and offers continued counselling alongside",
    ],
    tags: { topic: "communication", difficulty: 2, objective: "Deliver a referral without feeding stigma", exams: ["mcp-entrance", "ma-semester"], module: "interview-mse" },
  },
  "osce-4": {
    role: "patient",
    role_brief: "You are Mr Iyer, 72, admitted with a chest infection. You have moderate dementia. You want to leave to 'check on the shop', which your son sold three years ago. You can repeat that the doctor wants you to stay, but you cannot weigh the risk of the infection worsening; you keep returning to the shop. You are polite and a little frightened.",
    model_points: [
      "Explains why the conversation is happening and that it is about this one decision",
      "Tests understanding, retention, weighing and communication separately",
      "Notes that he understands and communicates but cannot weigh the risk against the shop belief",
      "Does not treat disagreement as incapacity, or dementia as automatic incapacity",
      "Records the finding and the least restrictive plan in his best interests, with family involved",
    ],
    tags: { topic: "capacity", difficulty: 4, objective: "Assess decision-specific capacity in dementia", exams: ["md-psychiatry", "mcp-entrance"], module: "ethics-law" },
  },
  "osce-5": {
    role: "relative",
    role_brief: "You are Vikram, 35. Your younger brother was admitted ten days ago and seems 'drugged and slow'. Nobody has explained his medicines to you. You are shouting in the waiting room. You calm down if someone lets you speak, names your worry and offers a real meeting with the treating team. You escalate if told to lower your voice first.",
    model_points: [
      "Introduces self, moves to a private space, keeps an open posture",
      "Names the emotion: 'You're worried he's worse, and nobody has told you why'",
      "Lets him finish before giving any information",
      "Offers concrete action: a family meeting with the doctor, a medicine review, the complaint route",
      "Sets one calm limit on shouting only if needed, without threat",
    ],
    tags: { topic: "communication", difficulty: 3, objective: "De-escalate an angry relative and agree a next step", exams: ["mcp-entrance", "md-psychiatry"], module: "interview-mse" },
  },
  "osce-6": {
    role: "patient",
    role_brief: "You are Farah, 38, a school teacher on an SSRI for six months. Your mood improved, but you gained 7 kg and stopped the tablet two weeks ago. You feel dizzy and irritable since stopping. You expect to be scolded and are ready to argue. You soften if your concern about weight is taken seriously.",
    model_points: [
      "Asks why she stopped before saying anything else",
      "Validates the weight gain as a real reason",
      "Links the dizziness and irritability to stopping suddenly, without blaming",
      "Lays out options: a different medicine, a slow taper, a review with the prescriber, therapy",
      "Ends with a plan she chooses and a follow-up date",
    ],
    tags: { topic: "adherence", difficulty: 3, objective: "Hold a non-coercive adherence conversation", exams: ["mcp-entrance", "md-psychiatry", "ma-semester"], module: "antidepressants" },
  },
  "osce-7": {
    role: "relative",
    role_brief: "You are the mother of Rohan, 19, admitted with his first psychotic episode. You think he is 'ruined for life' and that your family will be talked about. You want to know if he will finish engineering and whether it is your fault for letting him smoke 'that stuff'.",
    model_points: [
      "Names the condition in plain words and explains what psychosis is",
      "Gives honest hope: many people recover well after a first episode, especially with early treatment and staying on it",
      "Addresses blame and stigma directly",
      "Explains the plan: medicine, family support, a return-to-study plan, avoiding cannabis",
      "Invites questions and offers family sessions",
    ],
    tags: { topic: "psychosis", difficulty: 3, objective: "Explain first-episode psychosis to a family honestly", exams: ["md-psychiatry", "mcp-entrance"], module: "psychosis" },
  },
  "osce-8": {
    role: "patient",
    role_brief: "You are Tanvi, 15. Your parents brought you because your marks fell and you stay in your room. You will not speak while they are present. Alone, you say you are being teased in a class group chat. You are not self-harming. You fear your parents will take your phone if they find out.",
    model_points: [
      "Greets her first, then explains confidentiality and its limits to everyone together",
      "Asks the parents to wait outside for part of the session",
      "Builds rapport with neutral topics before the problem",
      "Screens for safety, including self-harm and online risk",
      "Agrees with her what will be shared with the parents and how",
    ],
    tags: { topic: "child-adolescent", difficulty: 3, objective: "Interview an adolescent alone and negotiate confidentiality", exams: ["mcp-entrance", "ma-semester"], module: "child" },
  },
  "osce-9": {
    role: "patient",
    role_brief: "You are Mr Pillai, 58. Your wife died of cancer four weeks ago. You cry daily, eat little and sleep badly, but you still go to the temple and talk with your brother. You feel guilt that you did not take her to the hospital sooner. You do not feel worthless and have no wish to die.",
    model_points: [
      "Lets him tell the story of the loss before any checklist",
      "Asks the questions that separate grief from depression: waves of pain linked to the loss, self-esteem kept, moments of warmth",
      "Asks about suicide plainly",
      "Concludes it fits a normal grief reaction for now and says so warmly",
      "Plans a review and tells him which changes should bring him back sooner",
    ],
    tags: { topic: "grief", difficulty: 4, objective: "Tell normal grief from a depressive episode", exams: ["mcp-entrance", "md-psychiatry", "ma-semester"], module: "depression" },
  },
  "osce-10": {
    role: "patient",
    role_brief: "You are Neha, 26. In your third session you say your partner 'gets physical' when angry. Last month he pushed you into a wall. You are not ready to leave him and fear being told to. If asked, you say he has never choked you and there are no weapons at home. You have a friend you trust.",
    model_points: [
      "Thanks her for telling and believes her",
      "Asks about safety now: frequency, escalation, choking, weapons, threats, children",
      "Respects her decision not to leave",
      "Builds a safety plan: a safe contact, an exit bag, the helpline and police numbers",
      "Explains what stays confidential and when it cannot",
    ],
    tags: { topic: "domestic-violence", difficulty: 3, objective: "Respond safely to a disclosure of partner violence", exams: ["mcp-entrance", "ma-semester"], module: "trauma" },
  },
  "osce-11": {
    role: "patient",
    role_brief: "You are Karan, 29, started on an antipsychotic three weeks ago. You cannot sit still, pace at night and feel 'like ants under the skin'. Your doctor said it was anxiety. You are thinking of stopping the tablets. You feel desperate but have no thoughts of self-harm.",
    model_points: [
      "Recognises the inner restlessness plus movement as likely akathisia",
      "Times it against the medicine start or dose change",
      "Explains why this matters: distress, stopping treatment, and a link with suicidal feelings",
      "Escalates to the prescriber the same day rather than changing medicine himself",
      "Reassures with a plan, not with words alone",
    ],
    tags: { topic: "antipsychotic-side-effects", difficulty: 4, objective: "Recognise akathisia and escalate it", exams: ["md-psychiatry", "mcp-entrance"], module: "antipsychotics" },
  },
  "osce-12": {
    role: "patient",
    role_brief: "You are Rhea, 31, a client in weekly therapy. It is 9 pm. You are in your parked car, breathing fast, and want a full session now. You have called twice this month. You calm with slow breathing. You feel rejected if the boundary is set coldly, and accept it if it comes with care and a plan.",
    model_points: [
      "Checks immediate safety and location first",
      "Grounds her with slow breathing until the peak passes",
      "Declines a full session kindly and explains why",
      "Names the pattern without blame and books it for the next session",
      "Reminds her of the crisis plan and numbers for nights",
    ],
    tags: { topic: "boundaries", difficulty: 4, objective: "Hold a therapeutic boundary safely in a crisis call", exams: ["mcp-entrance", "ma-semester"], module: "therapies" },
  },
};
