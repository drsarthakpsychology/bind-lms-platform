/**
 * The small things checklist (v5 Part 2.2) — the observations novices never
 * make. A reference card mid-exam AND a drill mode: each item is a stimulus
 * describing a moment in an interview, and the student must say WHAT changed /
 * what they noticed before it becomes meaningful.
 *
 * The skill: the MSE is not only the 11 domains. It is the pause before the
 * "no", the look at the family member, the past tense used about oneself.
 */

export interface SmallThingItem {
  id: string;
  /** The observed moment. */
  moment: string;
  /** What the student should have noticed it meant. */
  read: string;
  /** What to do with it. */
  move: string;
  /** The interview skill this belongs to. */
  skill: string;
}

export const SMALL_THINGS: SmallThingItem[] = [
  { id: "st-1", moment: "The patient made eye contact the whole session — until you asked about the marriage.", read: "A topic-specific avoidance pattern, not general shyness.", move: "Seed the topic again later, more gently, and watch whether the same thing recurs.", skill: "eye contact micro-shifts" },
  { id: "st-2", moment: "The patient's leg was tapping constantly. It stopped the moment the marriage was mentioned.", read: "Either the topic is charged, or it's relief it finally came up.", move: "Wait in the silence — the pause after a topic change is often where they either shut or open.", skill: "body micro-shifts" },
  { id: "st-3", moment: "You asked about sleep. The patient answered a different question — about work.", read: "Answering the wrong question is a deflection with a direction; the avoided topic is the topic.", move: "Reflect it: 'I noticed when I asked about sleep you brought up work — what is that about?'", skill: "topic deflection" },
  { id: "st-4", moment: "The patient described a recent event in the past tense about themselves: 'I was a good father.'", read: "The past tense about the self can signal the person no longer identifies with who they were.", move: "Gently explore: 'You said you WERE a good father — how do you see yourself now?'", skill: "verb tense" },
  { id: "st-5", moment: "Before answering, the patient looked at the family member who brought them.", read: "Permission-seeking: the disclosure has family consequences.", move: "Separate the patient from the family for at least part of the session; name the dynamic directly.", skill: "informant dynamics" },
  { id: "st-6", moment: "You asked the risk question. There was a long pause before the patient said 'no.'", read: "The pause is the disclosure. A practised 'no' comes fast; a real one hesitates or shifts.", move: "Follow the pause: 'You took a moment before no — what was in it?'", skill: "risk questioning" },
  { id: "st-7", moment: "The patient's speech was steady and slow — then sped up markedly when the topic changed to the exam.", read: "Rate change is an arousal marker; the accelerated topic is charged.", move: "Return to the slower register to understand what the speed is protecting.", skill: "speech rate shifts" },
  { id: "st-8", moment: "The patient is wearing the same clothes described at the last visit, and they're not clean.", read: "Self-care decline across sessions — a functional marker, not just appearance.", move: "Check the pattern: 'In the last two weeks, how many days have you showered?'", skill: "self-care baseline" },
  { id: "st-9", moment: "The patient laughed at something that was not funny.", read: "Incongruent affect — the laugh is doing work (deflection, masking, or frank incongruity).", move: "Name it lightly and watch whether the affect broadens or stays flat.", skill: "affect congruence" },
  { id: "st-10", moment: "The patient said 'we decided' about a decision that was clearly theirs alone.", read: "The 'we' can signal enmeshment, a dominating family, or a lack of ownership over their own life.", move: "Clarify who 'we' is, and whose decision it truly was.", skill: "agency and language" },
  { id: "st-11", moment: "The patient shifted posture — uncrossed arms and leaned forward — right after you validated them.", read: "Validation caused an approach response; the patient is opening.", move: "Continue on the validation, now gently deepen the topic it opened.", skill: "validation response" },
  { id: "st-12", moment: "The patient's voice went quiet and the sentence dropped off before it finished.", read: "Trailing off often precedes the hard thing — the mouth stops before the mind decides.", move: "Let the silence hold; do not rescue it. Then reflect what you saw.", skill: "silence tolerance" },
  { id: "st-13", moment: "You offered a referral or a clinic; the patient immediately asked how much it costs.", read: "Cost is the gate for disclosure. Answer it plainly and the door opens.", move: "Address cost directly and early — it is a presenting problem, not a distraction.", skill: "treatment barriers" },
  { id: "st-14", moment: "The patient answered everything — then asked you one question about yourself.", read: "A question back is the patient testing whether you are safe to trust.", move: "Answer honestly and briefly, then return to them. Do not sidestep it.", skill: "trust testing" },
];

/** Drill mode: present the moment, student commits to what it reads as. */
export type SmallThingReading = "avoidance" | "approach" | "deflection" | "charge" | "trust";

export function readingFor(item: SmallThingItem): SmallThingReading {
  const text = (item.read + " " + item.move).toLowerCase();
  if (text.includes("topic") && (text.includes("avoid") || text.includes("deflect"))) return "deflection";
  if (text.includes("open") || text.includes("approach") || text.includes("trust")) return "approach";
  if (text.includes("charged") || text.includes("arousal")) return "charge";
  return "avoidance";
}