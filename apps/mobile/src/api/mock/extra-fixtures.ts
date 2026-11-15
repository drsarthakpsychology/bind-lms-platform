/**
 * Mock data for the routes the server has not built yet (src/api/extra.ts).
 * Invented sample content, close in shape and length to the real thing.
 * Medicine rows are samples for layout only; the real library comes from the
 * website unchanged.
 */
import type { AppTarget } from "../contract";
import type { AdminActivity, AdminHomeData, AdminMessages, AdminStudent, AdminStudentRow, CaseStudy, GameRound, MedicineList, MedicinePage, PractiseHubData, PrepSet, PrepSubject } from "../extra";

const web = "/";
const game = (id: string): AppTarget => ({ screen: "game", game: id, web: `/games/${id}` });
const tool = (id: string): AppTarget => ({ screen: "practice", tool: id, web: `/practice/${id}` });

export const practise: PractiseHubData = {
  cases: [
    { id: "case-riya", title: "Riya, 24: three weeks of low mood", meta: "First interview · 10 min", kind: "case", target: tool("case-riya"), trailing: "New" },
    { id: "case-arjun", title: "Arjun, 31: panic at work", meta: "Telling anxiety apart · 12 min", kind: "case", target: tool("case-arjun"), trailing: null },
  ],
  games: [
    { id: "quickfire", title: "Quickfire", meta: "Ten questions against the clock", kind: "game", target: game("quickfire"), trailing: "Best 8" },
    { id: "match", title: "Match the term", meta: "Pair each word with its meaning", kind: "game", target: game("match"), trailing: null },
  ],
  prep: [{ id: "prep", title: "Exam Prep", meta: "Question sets by subject", kind: "prep", target: tool("prep"), trailing: "3 subjects" }],
};

export const rounds: Record<string, GameRound> = {
  quickfire: {
    kind: "quickfire",
    v: 1,
    id: "quickfire",
    title: "Quickfire",
    howTo: "Ten questions. Answer each before the line runs out. A right answer adds a point; nothing is taken away.",
    seconds: 12,
    questions: [
      { q: "Loss of interest or pleasure is called:", options: ["Alexithymia", "Anhedonia", "Avolition", "Apathy"], answer: 1, why: "Anhedonia is one of the two core symptoms of depression." },
      { q: "A depressive episode lasts at least:", options: ["Three days", "One week", "Two weeks", "One month"], answer: 2 },
      { q: "Which is a mood stabiliser?", options: ["Lithium", "Sertraline", "Haloperidol", "Clonazepam"], answer: 0 },
      { q: "A panic attack peaks within about:", options: ["Ten minutes", "An hour", "A day", "A week"], answer: 0 },
      { q: "Flight of ideas is most typical of:", options: ["Depression", "Mania", "OCD", "PTSD"], answer: 1 },
    ],
  },
  match: {
    kind: "match",
    v: 1,
    id: "match",
    title: "Match the term",
    howTo: "Tap a word, then tap its meaning. Clear the board in as few tries as you can.",
    pairs: [
      { left: "Anhedonia", right: "No pleasure in things once enjoyed" },
      { left: "Euthymia", right: "A normal, steady mood" },
      { left: "Avolition", right: "Little drive to start tasks" },
      { left: "Lability", right: "Mood that shifts quickly" },
    ],
  },
};

export const cases: Record<string, CaseStudy> = {
  "case-riya": {
    id: "case-riya",
    title: "Riya, 24: three weeks of low mood",
    patient: "Riya, 24, software tester",
    presenting: "Riya comes in because she \"cannot get out of bed\". She has felt low for three weeks, has stopped painting, and sleeps four hours a night.",
    steps: [
      {
        ask: "What do you ask first?",
        choices: [
          { label: "How long, and how much of each day, she has felt this way", verdict: "best", why: "Duration and pervasiveness decide whether this is an episode." },
          { label: "Whether she has tried exercise", verdict: "ok", why: "Useful later, but it skips the assessment." },
          { label: "What medicine her friend takes", verdict: "harm", why: "It moves the interview away from her." },
        ],
      },
      {
        ask: "She mentions that her family \"would be fine without her\". Next?",
        choices: [
          { label: "Ask directly about thoughts of ending her life", verdict: "best", why: "Asking directly is safe and is the standard of care." },
          { label: "Reassure her that her family loves her", verdict: "ok", why: "Kind, but you still do not know the risk." },
          { label: "Move on to sleep", verdict: "harm", why: "Risk goes unassessed." },
        ],
      },
    ],
    takeaway: "Duration and risk come first. Everything else in the plan rests on them.",
  },
};
cases["case-arjun"] = { ...cases["case-riya"]!, id: "case-arjun", title: "Arjun, 31: panic at work", patient: "Arjun, 31, accountant", presenting: "Arjun had three attacks of a racing heart and breathlessness at work this month and now avoids the office lift." };

export const prepSubjects: PrepSubject[] = [
  { id: "psychopathology", title: "Psychopathology", questions: 120, done: 46, best: 78 },
  { id: "pharmacology", title: "Pharmacology", questions: 90, done: 12, best: 64 },
  { id: "assessment", title: "Assessment", questions: 60, done: 0, best: null },
];
export const prepSet = (id: string): PrepSet => ({ id, title: prepSubjects.find((s) => s.id === id)?.title ?? "Practice set", questions: (rounds.quickfire as Extract<GameRound, { kind: "quickfire" }>).questions });

const med = (id: string, name: string, className: string, keyDose: string, brands: string[]) => ({ id, name, className, keyDose, brands });
export const medicines: MedicineList = {
  classes: ["SSRI", "SNRI", "Mood stabiliser", "Antipsychotic", "Benzodiazepine"],
  items: [
    med("escitalopram", "Escitalopram", "SSRI", "10 mg once a day", ["Nexito", "Cipralex"]),
    med("fluoxetine", "Fluoxetine", "SSRI", "20 mg once a day", ["Fludac", "Prozac"]),
    med("sertraline", "Sertraline", "SSRI", "50 mg once a day", ["Serta", "Zoloft"]),
    med("venlafaxine", "Venlafaxine", "SNRI", "75 mg a day", ["Venlor", "Effexor"]),
    med("duloxetine", "Duloxetine", "SNRI", "60 mg once a day", ["Duvanta", "Cymbalta"]),
    med("lithium", "Lithium carbonate", "Mood stabiliser", "By blood level: 0.6 to 1.0 mmol/L", ["Licab", "Lithosun"]),
    med("valproate", "Sodium valproate", "Mood stabiliser", "20 mg per kg a day", ["Valparin", "Encorate"]),
    med("olanzapine", "Olanzapine", "Antipsychotic", "10 mg at night", ["Oleanz", "Zyprexa"]),
    med("risperidone", "Risperidone", "Antipsychotic", "2 to 4 mg a day", ["Sizodon", "Risperdal"]),
    med("clonazepam", "Clonazepam", "Benzodiazepine", "0.25 to 0.5 mg twice a day, short term", ["Lonazep", "Rivotril"]),
  ],
};
export const medicinePage = (id: string): MedicinePage | null => {
  const row = medicines.items.find((m) => m.id === id);
  if (!row) return null;
  return {
    ...row,
    summary: `A **${row.className}** used in the clinic. Sample page for the app layout: the real page comes from the website's medicine library, unchanged.`,
    sections: [
      { id: "uses", title: "Used for", points: ["Depression", "Generalised anxiety", "Panic disorder"] },
      { id: "dose", title: "Dose", points: [`Start: ${row.keyDose}`, "Review after two to four weeks", "Increase slowly if needed"] },
      { id: "side", title: "Side effects", points: ["Nausea in the first week", "Headache", "Sleep changes", "Sexual side effects"] },
      { id: "watch", title: "Watch for", points: ["Restlessness or new thoughts of self-harm when starting, especially under 25", "Serotonin syndrome with other serotonergic medicines"] },
      { id: "tell", title: "What to tell the patient", points: ["It takes two to four weeks to help", "Do not stop suddenly", "Side effects usually settle"] },
    ],
  };
};

/* ------------------------------------------------------------------ admin */

export const adminStudents: AdminStudentRow[] = [
  { id: "u1", name: "Ananya Mehta", rollNumber: "VIBHA-000123", cohort: "Cohort Two", status: "active", lastSeen: "2026-11-15T09:40:00.000Z", progressPct: 52, lecturesOnly: false },
  { id: "u2", name: "Rohan Shah", rollNumber: "VIBHA-000207", cohort: "Cohort Two", status: "active", lastSeen: "2026-11-14T19:10:00.000Z", progressPct: 38, lecturesOnly: true },
  { id: "u3", name: "Meera Pillai", rollNumber: "VIBHA-000118", cohort: "Cohort Two", status: "active", lastSeen: "2026-11-09T11:00:00.000Z", progressPct: 12, lecturesOnly: false },
  { id: "u4", name: "Karan Desai", rollNumber: "VIBHA-000131", cohort: "Cohort Two", status: "paused", lastSeen: "2026-11-02T08:00:00.000Z", progressPct: 20, lecturesOnly: false },
  { id: "u5", name: "Sana Khan", rollNumber: "VIBHA-000142", cohort: "Cohort Two", status: "active", lastSeen: "2026-11-15T07:55:00.000Z", progressPct: 71, lecturesOnly: false },
];
export const adminHome: AdminHomeData = {
  dateLine: "Sun, 15 Nov",
  needsLook: [
    { id: "a1", studentId: "u3", name: "Meera Pillai", reason: "Not seen for 6 days", since: "2026-11-09T11:00:00.000Z" },
    { id: "a2", studentId: "u4", name: "Karan Desai", reason: "Paused: fees pending", since: "2026-11-02T08:00:00.000Z" },
    { id: "a3", studentId: "u2", name: "Rohan Shah", reason: "Asked to change phone a third time", since: "2026-11-14T19:10:00.000Z" },
  ],
  today: { active: 18, total: 24, lecturesWatched: 31, doubtsOpen: 4, submissionsToGrade: 6 },
};
export const adminStudent = (id: string): AdminStudent | null => {
  const r = adminStudents.find((s) => s.id === id);
  if (!r) return null;
  return {
    ...r,
    email: `${r.name.split(" ")[0]!.toLowerCase()}@example.com`,
    mobile: "98765 43210",
    phone: { name: "Pixel 8", changesUsed: r.id === "u2" ? 2 : 0, limit: 2 },
    recent: [
      { at: "2026-11-15T09:40:00.000Z", what: "Watched Lecture 5 to 18:24" },
      { at: "2026-11-14T18:00:00.000Z", what: "Read 2.1 What depression looks like" },
      { at: "2026-11-13T12:20:00.000Z", what: "Asked a doubt about low mood" },
    ],
    lectures: { done: 4, total: 8 },
    study: r.lecturesOnly ? null : { done: 6, total: 22 },
  };
};
export const adminActivity: AdminActivity = {
  items: [
    { id: "e1", at: "2026-11-15T09:40:00.000Z", who: "Ananya Mehta", what: "watched Lecture 5", kind: "lecture" },
    { id: "e2", at: "2026-11-15T08:12:00.000Z", who: "Sana Khan", what: "handed in Write up a first interview", kind: "submission" },
    { id: "e3", at: "2026-11-15T07:55:00.000Z", who: "Sana Khan", what: "signed in on a new phone", kind: "sign_in" },
    { id: "e4", at: "2026-11-14T21:30:00.000Z", who: "Karan Desai", what: "asked: Is flat affect the same as blunted affect?", kind: "doubt" },
    { id: "e5", at: "2026-11-14T19:10:00.000Z", who: "Rohan Shah", what: "finished Lecture 4", kind: "lecture" },
    { id: "e6", at: "2026-11-14T18:00:00.000Z", who: "Ananya Mehta", what: "read 2.1 What depression looks like", kind: "study" },
  ],
};
export const adminMessages: AdminMessages = {
  items: [
    { id: "t1", to: "Cohort Two", title: "Lecture 6 opens on Monday", preview: "Risk assessment and safety planning opens on Monday at 9 am.", at: "2026-11-15T07:10:00.000Z", unread: false },
    { id: "t2", to: "Meera Pillai", title: "Checking in", preview: "We missed you this week. Is everything all right?", at: "2026-11-14T12:00:00.000Z", unread: true },
    { id: "t3", to: "Everyone", title: "Welcome to Cohort Two", preview: "Your account is ready. Start with Lecture 1.", at: "2026-11-02T09:00:00.000Z", unread: false },
  ],
};
export { web };
