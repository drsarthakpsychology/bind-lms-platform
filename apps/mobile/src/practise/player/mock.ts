// MOCK DATA: design phase only. See docs/DESIGN.md, To connect.
//
// One sample case in the full rich shape (./types.ts), so the player can be
// seen with everything a rewritten case will carry: context blocks, a test
// that opens on request, new information before the second step, 5 options
// with a grade and a reason each, three hints, the concept, the clinical
// point and common errors. It is a teaching sample written for the design
// phase and has NOT been through clinical review. Do not treat it as content.
import type { KeyedCase } from "./types";

export const SAMPLE_CASES: KeyedCase[] = [
  {
    id: "sample-long-low-mood",
    title: "Two years of feeling flat",
    level: 3,
    topic: "depressive-disorders",
    competency: "differentiate",
    objective: "Tell a long, milder low mood apart from a major depressive episode, and choose a safe next step as a trainee.",
    role: "trainee-psychologist",
    context: [
      { kind: "setting", text: "A weekday outpatient clinic. You are the psychology trainee taking the first history. Your supervisor is in the next room." },
      { kind: "demographics", text: "Rohit, 41, an accountant. Married, one child. He came by himself." },
      { kind: "presenting", text: "\"My wife says I am never happy. I think she is right. I am just flat.\"" },
      { kind: "history", text: "Low mood on most days for about two years, with no stretch of more than a few weeks when he felt well. He sleeps badly, feels tired and thinks poorly of himself. He has stopped playing cricket on Sundays. He has not missed work. No earlier treatment. He drinks one or two beers at the weekend." },
      { kind: "family-social", text: "His father was \"a quiet, sad man\" who was never treated. The marriage is steady. Money is tight but managed." },
      { kind: "observation", text: "Neatly dressed, on time. Speaks slowly but answers fully. Mood described as \"flat\"; affect is narrowed but he smiles when he talks about his daughter. No ideas of self harm when asked directly. Thinking is clear." },
      { kind: "investigation", label: "Thyroid and routine bloods", text: "Done by his family doctor last month. All within the usual range.", onRequest: true },
    ],
    steps: [
      {
        id: "s1",
        kind: "single",
        prompt: "Which diagnosis fits best?",
        options: [
          { id: "a", text: "Major depressive episode, moderate" },
          { id: "b", text: "Persistent depressive disorder" },
          { id: "c", text: "Adjustment disorder with low mood" },
          { id: "d", text: "Generalised anxiety disorder" },
          { id: "e", text: "Low mood due to an underactive thyroid" },
        ],
        hints: ["Start with time. How long has this lasted, and has it ever lifted?", "Weigh how many symptoms he has against how well he still works and copes.", "One of these needs two years of low mood on most days, with fewer symptoms than a full episode."],
      },
      {
        id: "s2",
        kind: "single",
        reveal: [{ kind: "collateral", text: "His wife joins for the last ten minutes. She says he has been like this \"since before our daughter started school\", and that last winter he once said the family would manage without him. He has not said it since." }],
        prompt: "You are the trainee. What do you do next?",
        options: [
          { id: "a", text: "Ask him directly about thoughts of ending his life, then brief your supervisor today" },
          { id: "b", text: "Reassure them both that he is safe because he denied it earlier" },
          { id: "c", text: "Book him for next week and raise it in supervision then" },
          { id: "d", text: "Tell him he needs an antidepressant and suggest a dose" },
          { id: "e", text: "Ask his wife to keep a close watch and call if things get worse" },
        ],
        hints: ["Something new has just been said. What kind of information is it?", "Think about what is yours to do as a trainee, and what must not wait.", "Two things are needed: one with him now, one with your supervisor before he leaves."],
      },
    ],
    links: { module: "m02", quickNote: "depression" },
    keys: {
      s1: {
        options: {
          a: { grade: "poor", feedback: "A full episode needs more symptoms at once, and usually a clear change from how he was. His picture is long, steady and milder.", error: "duration-miss" },
          b: { grade: "best", feedback: "Two years of low mood on most days, never lifting for long, with a few added symptoms and work still intact." },
          c: { grade: "poor", feedback: "There is no clear stress that started it, and an adjustment reaction does not run for two years.", error: "anchoring" },
          d: { grade: "poor", feedback: "Worry is not the main complaint. The centre of this story is mood.", error: "premature-closure" },
          e: { grade: "poor", feedback: "A good thing to rule out, and it has been: his thyroid tests were normal last month.", error: "missed-organic" },
        },
        explanation: {
          concept: "Duration and course decide between look-alike mood diagnoses",
          whyCorrect: "Low mood on most days for two years, with no gap longer than a few weeks, plus poor sleep, tiredness and low self-worth, while he still gets to work: that is the long, milder pattern of persistent depressive disorder.",
          theory: "Persistent depressive disorder asks for at least two years of depressed mood with two or more added symptoms. A major depressive episode asks for five or more symptoms over at least two weeks and a change from before.",
          implication: "A long course usually means a longer plan: therapy that fits chronic low mood, and a medical review, instead of waiting for it to pass.",
          commonErrors: ["Calling every low mood a major episode without counting symptoms.", "Missing the long course because the person still works.", "Forgetting to rule out a medical cause before settling on the diagnosis."],
        },
      },
      s2: {
        options: {
          a: { grade: "best", feedback: "New risk information changes the picture. Ask plainly, then tell your supervisor before he leaves.", consequence: "He says the thought comes back on bad nights. Your supervisor joins and a safety plan is made today." },
          b: { grade: "harmful", feedback: "An earlier \"no\" does not cancel new information from the family.", consequence: "He goes home with no one having asked again.", error: "false-reassurance" },
          c: { grade: "poor", feedback: "Risk does not wait a week. Supervision is for today.", consequence: "A week passes before anyone senior hears about it.", error: "missed-risk" },
          d: { grade: "harmful", feedback: "Medicines are not a trainee psychologist's call. Flag it; do not prescribe.", consequence: "He leaves with advice you are not trained or allowed to give.", error: "scope-overreach" },
          e: { grade: "acceptable", feedback: "Involving the family helps, but it does not replace asking him and telling your supervisor.", consequence: "His wife is watchful, yet nobody has checked the risk with him directly.", error: "under-referral" },
        },
        explanation: {
          concept: "New risk information is acted on the same day, inside your role",
          whyCorrect: "A remark that the family would manage without him is a possible sign of suicidal thinking. The trainee asks about it directly and briefs the supervisor today.",
          theory: "Asking about suicide does not plant the idea. Risk is reviewed whenever new information arrives, not only at the first interview.",
          implication: "He gets a proper risk review and a safety plan before he leaves, with a senior clinician involved.",
          commonErrors: ["Treating a denial earlier in the session as the final word.", "Holding risk information for the next supervision slot.", "Stepping outside the trainee role to settle it alone."],
        },
      },
    },
  },
];

export const sampleCase = (id?: string | null) => SAMPLE_CASES.find((c) => c.id === id) ?? SAMPLE_CASES[0]!;
