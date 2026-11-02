/**
 * "What would you do?" — tricky, branching clinic moments. Each option has a
 * consequence, so students learn what their words and choices lead to.
 * best = what a good clinician does; ok = acceptable but misses something;
 * harm = a common mistake with a real cost.
 */
export type Outcome = "best" | "ok" | "harm";
export type Choice = { text: string; outcome: Outcome; consequence: string };
export type Beat = { says: string; context?: string; choices: Choice[] };
export type Scenario = { id: string; topic: string; noteId: string; who: string; beats: Beat[] };

export const SCENARIOS: Scenario[] = [
  {
    id: "sc-dep-1",
    topic: "Depression",
    noteId: "depression",
    who: "Riya, 24, student",
    beats: [
      {
        says: "“Honestly, nothing matters anymore. Everyone would be fine without me.”",
        choices: [
          { text: "“It sounds like things feel really heavy. Are you having thoughts of ending your life?”", outcome: "best", consequence: "She pauses, then says yes, sometimes at night. You now know what you're dealing with." },
          { text: "“Don't say that! Your family loves you.”", outcome: "harm", consequence: "She feels dismissed and says “forget it”. The risk is still there, and now it's hidden." },
          { text: "“Let's focus on your studies first, then we'll talk feelings.”", outcome: "ok", consequence: "You get exam details, but you've skipped the most important question." },
        ],
      },
      {
        says: "“Sometimes I think about taking all my mother's sleeping pills.”",
        context: "She has access to the pills. No previous attempt.",
        choices: [
          { text: "Ask about intent and timing, make a safety plan, and involve your supervisor today", outcome: "best", consequence: "She agrees to her mother keeping the pills and to a follow-up tomorrow. Your supervisor reviews her the same day." },
          { text: "Promise to keep it between the two of you so she trusts you", outcome: "harm", consequence: "You've made a promise you can't keep. If she's at risk, you must act, and she'll feel betrayed." },
          { text: "Book her next weekly session as usual", outcome: "ok", consequence: "She's still at risk for 7 days with access to the means. Risk needs same-day action." },
        ],
      },
    ],
  },
  {
    id: "sc-mania-1",
    topic: "Bipolar",
    noteId: "bipolar",
    who: "Neha, 26",
    beats: [
      {
        says: "“I haven't slept in 4 days and I've never felt better! I'm launching three companies.”",
        choices: [
          { text: "Ask about sleep, spending, risky decisions and past depressions", outcome: "best", consequence: "You learn she spent ₹2 lakh this week and had a long depression last year. Mania is likely." },
          { text: "“That's amazing, you're so motivated!”", outcome: "harm", consequence: "You've reinforced the grandiosity and missed a probable manic episode." },
          { text: "Suggest a sleep hygiene sheet", outcome: "ok", consequence: "Sleep matters, but this needs a psychiatric review, not a handout." },
        ],
      },
      {
        says: "“My GP gave me an antidepressant last month for low mood.”",
        choices: [
          { text: "Flag it urgently to the psychiatrist: an antidepressant alone may have triggered mania", outcome: "best", consequence: "The psychiatrist reviews her the same day and changes the plan." },
          { text: "Tell her to stop the tablet today", outcome: "harm", consequence: "Medicine changes are the prescriber's job. Stopping suddenly can cause other problems." },
          { text: "Note it and move on", outcome: "ok", consequence: "It's documented, but a key safety issue wasn't escalated." },
        ],
      },
    ],
  },
  {
    id: "sc-psy-1",
    topic: "Schizophrenia",
    noteId: "schizophrenia",
    who: "Kabir, 21",
    beats: [
      {
        says: "“The voices say you're working with my neighbours. Are you recording me?”",
        choices: [
          { text: "“I'm not recording you. It sounds frightening to feel watched. Can you tell me about the voices?”", outcome: "best", consequence: "He relaxes slightly and describes two voices commenting on him." },
          { text: "“There are no voices. That's just your illness talking.”", outcome: "harm", consequence: "Arguing with a delusion breaks trust. He stops talking." },
          { text: "“Okay, yes, let's say the neighbours are involved.”", outcome: "harm", consequence: "Agreeing with the delusion reinforces it and isn't honest." },
        ],
      },
      {
        says: "“The voices tell me to hurt the neighbour's dog.”",
        choices: [
          { text: "Ask if he plans to act, whether he's acted before, and inform the psychiatrist today", outcome: "best", consequence: "Command hallucinations with possible action need urgent review. The team acts in time." },
          { text: "Reassure him that voices can't make him do anything", outcome: "ok", consequence: "Kind, but you haven't assessed the risk." },
          { text: "Change the topic to keep him calm", outcome: "harm", consequence: "You've avoided a risk you were told about." },
        ],
      },
    ],
  },
  {
    id: "sc-ocd-1",
    topic: "OCD",
    noteId: "ocd",
    who: "Sana, 30",
    beats: [
      {
        says: "“Can you just tell me my hands are clean? Please, just say it once.”",
        choices: [
          { text: "Gently explain that reassurance feeds OCD, and stay with her anxiety together", outcome: "best", consequence: "Her anxiety rises, then slowly settles. She's learning it passes without the ritual." },
          { text: "“Yes, your hands are clean.”", outcome: "harm", consequence: "Instant relief, then she asks again in 5 minutes. Reassurance works like a compulsion." },
          { text: "Ignore the question", outcome: "ok", consequence: "No reassurance given, but she feels unheard. Explain why instead." },
        ],
      },
    ],
  },
  {
    id: "sc-pharm-1",
    topic: "Medicines",
    noteId: "stabilisers",
    who: "Sunil, 50, on lithium",
    beats: [
      {
        says: "“My knee hurts, so I've been taking ibuprofen. Now I'm vomiting and my hands shake a lot.”",
        choices: [
          { text: "Treat it as possible lithium toxicity: urgent medical review and a blood level today", outcome: "best", consequence: "His level is high. The team stops lithium and he recovers." },
          { text: "Tell him it's probably a stomach bug", outcome: "harm", consequence: "Lithium toxicity can damage the kidneys and brain. This delay is dangerous." },
          { text: "Advise him to drink more water and see how it goes", outcome: "ok", consequence: "Fluids help, but this needs same-day medical assessment." },
        ],
      },
    ],
  },
  {
    id: "sc-ap-1",
    topic: "Medicines",
    noteId: "antipsychotics",
    who: "Rahul, 19, started haloperidol yesterday",
    beats: [
      {
        says: "“My neck is twisting and my eyes keep rolling up. Am I dying?”",
        choices: [
          { text: "Stay calm, reassure him it's a known treatable side effect, and get the doctor now", outcome: "best", consequence: "Acute dystonia settles quickly after an injection. He trusts the team more." },
          { text: "Tell him he's having a panic attack", outcome: "harm", consequence: "Wrong label; the treatable side effect is missed and he's more frightened." },
          { text: "Advise him to skip tonight's dose", outcome: "harm", consequence: "Medication decisions belong to the prescriber, and he still needs treatment now." },
        ],
      },
    ],
  },
  {
    id: "sc-child-1",
    topic: "Child protection",
    noteId: "casesheet",
    who: "Ananya, 14",
    beats: [
      {
        says: "“If I tell you something, promise you won't tell anyone? An uncle has been touching me.”",
        choices: [
          { text: "Thank her, explain you must share this to keep her safe, and follow POCSO reporting with your supervisor", outcome: "best", consequence: "She's protected, and the report is made as the law requires." },
          { text: "Promise to keep it secret so she keeps talking", outcome: "harm", consequence: "Failing to report under POCSO is an offence, and she stays unsafe." },
          { text: "Call the parents first and let them decide", outcome: "harm", consequence: "The family may be involved or may pressure her. Reporting isn't optional." },
        ],
      },
    ],
  },
  {
    id: "sc-alc-1",
    topic: "Alcohol",
    noteId: "substance",
    who: "Mr Rao, 45, admitted for a fracture",
    beats: [
      {
        says: "“Two days in hospital and I'm shaking, sweating, and I see insects on the wall.”",
        choices: [
          { text: "Recognise likely delirium tremens: urgent medical team, benzodiazepines and thiamine", outcome: "best", consequence: "Treated in time. DTs can be fatal without treatment." },
          { text: "He's anxious about surgery; teach breathing", outcome: "harm", consequence: "A medical emergency is missed." },
          { text: "Ask him to describe the insects for the MSE", outcome: "ok", consequence: "Good description, but this needs action first." },
        ],
      },
    ],
  },
  {
    id: "sc-ptsd-1",
    topic: "Trauma",
    noteId: "ptsd",
    who: "Priya, 28, after a road accident",
    beats: [
      {
        says: "“I don't want to talk about the accident today.”",
        choices: [
          { text: "Respect that, focus on safety and coping today, and explain you'll go at her pace", outcome: "best", consequence: "She feels in control and comes back next week ready to start." },
          { text: "“You have to talk about it to get better. Start from the beginning.”", outcome: "harm", consequence: "Forcing detail too early can overwhelm her. She doesn't return." },
          { text: "Skip trauma work altogether", outcome: "ok", consequence: "Safe today, but avoidance can keep PTSD going. Plan it together later." },
        ],
      },
    ],
  },
  {
    id: "sc-del-1",
    topic: "Delirium",
    noteId: "dementia",
    who: "Mrs Shah, 79",
    beats: [
      {
        says: "Her daughter: “She was fine last week. Since yesterday she's confused and seeing people who aren't there.”",
        choices: [
          { text: "Think delirium: urgent medical check for infection, medicines, sodium", outcome: "best", consequence: "A urinary infection is found and treated; she clears in days." },
          { text: "Diagnose dementia and suggest a memory clinic", outcome: "harm", consequence: "Sudden change is delirium until proven otherwise. The cause is missed." },
          { text: "Suggest a sleeping tablet for the night", outcome: "harm", consequence: "Sedatives can worsen delirium and cause falls." },
        ],
      },
    ],
  },
];

/** "Words matter": pick the better way to say it. */
export const WORDS: { worse: string; better: string; why: string }[] = [
  { worse: "committed suicide", better: "died by suicide", why: "'Committed' suggests a crime. Suicide is a health outcome." },
  { worse: "a schizophrenic", better: "a person with schizophrenia", why: "Person-first: the illness isn't their identity." },
  { worse: "the patient is lying", better: "the account is inconsistent with collateral", why: "Describe facts; don't assume intent." },
  { worse: "attention-seeking", better: "seeking connection / help in a risky way", why: "The behaviour is a signal of need; labels shut down curiosity." },
  { worse: "non-compliant", better: "not taking the medicine as prescribed (reasons explored)", why: "Invites the 'why': side effects, cost, beliefs." },
  { worse: "patient claims to hear voices", better: "patient reports hearing voices", why: "'Claims' implies disbelief. 'Reports' is neutral." },
  { worse: "drug addict", better: "person with a substance use disorder", why: "Reduces stigma and treats it as a health condition." },
  { worse: "failed suicide attempt", better: "survived a suicide attempt", why: "'Failed' implies death was a goal to succeed at." },
  { worse: "manipulative", better: "describes what happened and its effect", why: "Write the behaviour, not a judgement." },
  { worse: "OCD (meaning tidy)", better: "very organised", why: "Using diagnoses as adjectives trivialises real illness." },
];
