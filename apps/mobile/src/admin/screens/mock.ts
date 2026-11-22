// MOCK DATA: design phase only. See docs/DESIGN.md, To connect, and docs/CONNECT-badmin.md.
// Every screen that reads this file says so on the screen (MockNote). Nothing here is sent to the server.

/* --------------------------------------------------------- feature switches */

/** The website's three states (src/lib/flags.ts): hidden, shown but locked, open. */
export type SwitchState = "off" | "live" | "unlocked";
export const SWITCH_LABEL: Record<SwitchState, string> = { off: "Hidden", live: "Shown, locked", unlocked: "Open" };
export const SWITCH_ABOUT: Record<SwitchState, string> = {
  off: "Students do not see it at all.",
  live: "Students see it exists, but cannot open it yet.",
  unlocked: "Students can open and use it.",
};

export type FeatureLimit = { label: string; value: number; unit: string; min: number; max: number; step: number };
export type FeatureSwitch = { key: string; name: string; about: string; state: SwitchState; /** Students who used it in the last 7 days. */ using: number; limit?: FeatureLimit; recent: { name: string; when: string }[] };
export type FeatureGroup = { title: string; items: FeatureSwitch[] };

const who = (...n: string[]) => n.map((name, i) => ({ name, when: ["Today", "Today", "Yesterday", "2 days ago", "4 days ago"][i] ?? "This week" }));

export const FEATURES: FeatureGroup[] = [
  {
    title: "Learning",
    items: [
      { key: "lectures", name: "Lectures", about: "Recorded classes with materials and hand-ins.", state: "unlocked", using: 96, recent: who("Aarav Shah", "Diya Patel", "Kabir Mehta", "Isha Rao") },
      { key: "learn", name: "Study modules and notes", about: "Modules, checkpoints, revision notes and quick reference.", state: "unlocked", using: 84, recent: who("Meera Joshi", "Rohan Desai", "Tanvi Kulkarni") },
      { key: "medicines", name: "Medicines", about: "The medicine library and compare.", state: "unlocked", using: 71, recent: who("Diya Patel", "Aarav Shah") },
      { key: "lab", name: "Psychology lab", about: "Experiments inside Games. Read the review notes before opening.", state: "live", using: 0, recent: [] },
    ],
  },
  {
    title: "Practice",
    items: [
      { key: "case_library", name: "Case library", about: "Worked cases students read and answer.", state: "unlocked", using: 58, limit: { label: "New cases a day", value: 5, unit: "cases", min: 1, max: 20, step: 1 }, recent: who("Kabir Mehta", "Isha Rao", "Meera Joshi") },
      { key: "games", name: "Games", about: "Quick games with a weekly board.", state: "unlocked", using: 77, recent: who("Rohan Desai", "Aarav Shah", "Tanvi Kulkarni", "Diya Patel") },
      { key: "prep", name: "Exam practice", about: "Question sets, timed mocks and long answers.", state: "unlocked", using: 49, limit: { label: "Mocks a week", value: 3, unit: "mocks", min: 1, max: 14, step: 1 }, recent: who("Isha Rao", "Meera Joshi") },
      { key: "consulting_room", name: "Consulting room", about: "A spoken practice patient. Uses paid minutes.", state: "live", using: 0, limit: { label: "Minutes a student a day", value: 20, unit: "min", min: 5, max: 60, step: 5 }, recent: [] },
    ],
  },
  {
    title: "Clinic",
    items: [
      { key: "attendance", name: "Attendance by code", about: "Students scan the rotating code to mark IN and OUT.", state: "unlocked", using: 112, limit: { label: "Late after", value: 10, unit: "min", min: 0, max: 60, step: 5 }, recent: who("Aarav Shah", "Kabir Mehta", "Diya Patel") },
      { key: "leave", name: "Leave requests", about: "Students ask for leave from a session. You decide.", state: "unlocked", using: 14, limit: { label: "Leaves a term", value: 6, unit: "leaves", min: 0, max: 30, step: 1 }, recent: who("Tanvi Kulkarni", "Rohan Desai") },
      { key: "opd", name: "OPD days and case logs", about: "The OPD timetable and the cases each student logs.", state: "unlocked", using: 63, limit: { label: "Cases to log a month", value: 12, unit: "cases", min: 0, max: 60, step: 1 }, recent: who("Meera Joshi", "Isha Rao") },
    ],
  },
  {
    title: "Community and records",
    items: [
      { key: "doubts", name: "Doubts and private concerns", about: "Students ask; the team answers.", state: "unlocked", using: 22, recent: who("Diya Patel", "Kabir Mehta") },
      { key: "wall", name: "Class wall", about: "Posts every student in the cohort can read. Reports come to you.", state: "unlocked", using: 41, limit: { label: "Posts a student a day", value: 5, unit: "posts", min: 1, max: 30, step: 1 }, recent: who("Aarav Shah", "Rohan Desai", "Isha Rao") },
      { key: "certificates", name: "Certificates", about: "Students see and download what you issue.", state: "unlocked", using: 18, recent: who("Meera Joshi") },
      { key: "journal", name: "Journal", about: "A private reflective journal.", state: "off", using: 0, recent: [] },
    ],
  },
];

/* ------------------------------------------------------------------ teaching */

export type KeyQuestion = { id: string; q: string; options: string[]; answer: number; why: string; /** Share of the class who got it right first time. */ rightPct: number; /** The wrong option picked most often. */ trap: number | null; flagged: string | null; reviewed: string | null };
export type TeachSection = { id: string; title: string; kind: "reading" | "checkpoint"; finished: number; avgMinutes: number; /** Checkpoint only: average first-try score. */ score: number | null; questions: KeyQuestion[]; /** The reading text, as the reviewer sees it (opening lines). */ summary: string };
export type TeachModule = { id: string; title: string; students: number; finishedAll: number; sections: TeachSection[]; reviewedOn: string | null };
export type PracticeSet = { id: string; title: string; kind: string; attempts: number; score: number; hardest: string; questions: KeyQuestion[] };

const kq = (id: string, q: string, options: string[], answer: number, why: string, rightPct: number, trap: number | null, flagged: string | null = null, reviewed: string | null = "12 Nov 2026"): KeyQuestion => ({ id, q, options, answer, why, rightPct, trap, flagged, reviewed });

export const MODULES: TeachModule[] = [
  {
    id: "m01",
    title: "Taking a history",
    students: 118,
    finishedAll: 92,
    reviewedOn: "12 Nov 2026",
    sections: [
      { id: "m01.s1", title: "Why the history comes first", kind: "reading", finished: 112, avgMinutes: 7, score: null, questions: [], summary: "A careful history gives most of the diagnosis before any test is ordered. This section sets out the order of a first interview and what each part is for." },
      { id: "m01.s2", title: "The presenting complaint", kind: "reading", finished: 108, avgMinutes: 9, score: null, questions: [], summary: "Write the complaint in the person's own words, with how long it has lasted. Separate what the person says from what the family says." },
      {
        id: "m01.c1",
        title: "Checkpoint 1",
        kind: "checkpoint",
        finished: 101,
        avgMinutes: 5,
        score: 78,
        summary: "",
        questions: [
          kq("m01.c1.q1", "A person says they have felt low for two years, most days, but still go to work. Which detail matters most to ask next?", ["How many hours they sleep", "Whether there were any weeks free of low mood", "What their manager thinks", "Their favourite hobby"], 1, "Two years of low mood on most days points to a long-lasting pattern. Asking about symptom-free gaps tells a persistent pattern from repeated separate episodes.", 64, 0),
          kq("m01.c1.q2", "Whose words go in the presenting complaint?", ["The clinician's summary", "The family's account", "The person's own words", "The referral letter"], 2, "The complaint is recorded as the person says it. Other accounts are written separately and named.", 91, 1),
          kq("m01.c1.q3", "Which is part of the personal history and not the family history?", ["A parent treated for low mood", "Schooling and first job", "A sibling with seizures", "A grandparent's memory loss"], 1, "Personal history is the person's own life story: birth, schooling, work, relationships. Illness in relatives is family history.", 83, 0, "Option one could be read either way if the parent lives with them. Reword.", null),
        ],
      },
      { id: "m01.s3", title: "Past and family history", kind: "reading", finished: 97, avgMinutes: 8, score: null, questions: [], summary: "Earlier episodes, treatment and how well it worked. Then illness in close relatives, drawn as a short family tree." },
    ],
  },
  {
    id: "m02",
    title: "The mental state examination",
    students: 118,
    finishedAll: 61,
    reviewedOn: "3 Nov 2026",
    sections: [
      { id: "m02.s1", title: "Appearance and behaviour", kind: "reading", finished: 99, avgMinutes: 6, score: null, questions: [], summary: "What you can see before a word is said: dress, eye contact, movement, how the person relates to you." },
      { id: "m02.s2", title: "Speech, mood and affect", kind: "reading", finished: 88, avgMinutes: 10, score: null, questions: [], summary: "Mood is what the person reports. Affect is what you observe. They can differ, and the difference is worth writing down." },
      {
        id: "m02.c1",
        title: "Checkpoint 1",
        kind: "checkpoint",
        finished: 74,
        avgMinutes: 6,
        score: 58,
        summary: "",
        questions: [
          kq("m02.c1.q1", "A person says they feel fine but sits still, speaks little and does not smile. How do you record this?", ["Mood low, affect low", "Mood reported as fine, affect flat", "Mood fine, affect fine", "Cannot be recorded"], 1, "Mood is reported, affect is observed. Here they differ, so each is written as it was found.", 47, 0),
          kq("m02.c1.q2", "Which belongs under thought content?", ["Speaking very fast", "A fixed false belief", "Poor eye contact", "Not knowing the date"], 1, "A fixed false belief is what the person thinks, so it is thought content. Fast speech is form of speech; orientation is cognition.", 62, 0),
          kq("m02.c1.q3", "Insight is best described as", ["Being cheerful about the illness", "Understanding that one is unwell and may need help", "Agreeing with every instruction", "Knowing the name of the medicine"], 1, "Insight is the person's own understanding of their condition and need for care. It is graded, not present or absent.", 66, 3, null, null),
        ],
      },
      { id: "m02.s3", title: "Thought, perception, cognition, insight", kind: "reading", finished: 66, avgMinutes: 12, score: null, questions: [], summary: "The second half of the examination, with short examples of how each finding is written." },
    ],
  },
  {
    id: "m03",
    title: "Common presentations",
    students: 118,
    finishedAll: 18,
    reviewedOn: null,
    sections: [
      { id: "m03.s1", title: "Low mood", kind: "reading", finished: 52, avgMinutes: 11, score: null, questions: [], summary: "How low mood presents in the clinic, what to ask about sleep, appetite, interest and safety, and when to ask a senior." },
      { id: "m03.s2", title: "Worry and panic", kind: "reading", finished: 31, avgMinutes: 10, score: null, questions: [], summary: "Telling everyday worry from a pattern that needs care. Physical causes to keep in mind." },
      { id: "m03.c1", title: "Checkpoint 1", kind: "checkpoint", finished: 22, avgMinutes: 7, score: 71, summary: "", questions: [kq("m03.c1.q1", "Which question is most important in a first interview for low mood?", ["Favourite food", "Thoughts of harming oneself", "Shoe size", "Preferred clinic day"], 1, "Safety is always asked about, plainly and kindly, in a first interview for low mood.", 88, 0, null, null)] },
    ],
  },
];

export const PRACTICE_SETS: PracticeSet[] = [
  { id: "p-case-day", title: "Case of the day", kind: "Cases", attempts: 412, score: 69, hardest: "Telling a long-lasting low mood from separate episodes", questions: [kq("p1.q1", "Rohit, 41, has felt low on most days for two years, sleeps badly and has stopped enjoying cricket. He has not missed work. Which fits best?", ["A single short episode", "A long-lasting low mood pattern", "A reaction to one recent event", "No difficulty at all"], 1, "Two years, most days, with function kept: the length is the deciding detail.", 55, 0)] },
  { id: "p-terms", title: "Terms and signs", kind: "Games", attempts: 938, score: 81, hardest: "Mood and affect", questions: [kq("p2.q1", "What does 'flat affect' describe?", ["What the person says they feel", "Little outward show of feeling", "Very fast speech", "Poor memory"], 1, "Affect is what is observed. Flat means little variation in outward expression.", 74, 0)] },
  { id: "p-mock-1", title: "Timed mock 1", kind: "Exam practice", attempts: 64, score: 62, hardest: "Statistics: reading a table", questions: [kq("p3.q1", "In a table of 200 people, 50 improved. What share improved?", ["10%", "25%", "50%", "75%"], 1, "50 out of 200 is one in four.", 71, 2)] },
];

/* ------------------------------------------------------------ wall reports */

export type WallReport = { id: string; post: string; author: string; authorId: string; reportedBy: string; reason: string; when: string; state: "open" | "kept" | "removed" };
export const WALL_REPORTS: WallReport[] = [
  { id: "wr1", post: "Sharing my notes for the mental state examination. Message me on my number for the file.", author: "Rohan Desai", authorId: "u6", reportedBy: "Isha Rao", reason: "Shares a phone number", when: "Today, 10:12 am", state: "open" },
  { id: "wr2", post: "Yesterday's OPD case was so strange, the man from the corner shop near the clinic kept saying...", author: "Vivaan Gupta", authorId: "u8", reportedBy: "Meera Joshi", reason: "Talks about a patient", when: "Yesterday, 6:40 pm", state: "open" },
  { id: "wr3", post: "Anyone else finding checkpoint two unfair?", author: "Kabir Mehta", authorId: "u3", reportedBy: "Anaya Nair", reason: "Rude", when: "18 Nov", state: "kept" },
];

/* ------------------------------------------------------------ failed emails */

export type FailedEmail = { id: string; to: string; name: string; studentId: string | null; subject: string; why: string; fix: string; when: string; tries: number; state: "failed" | "sent" };
export const FAILED_EMAILS: FailedEmail[] = [
  { id: "fe1", to: "aarav.shah@exmaple.com", name: "Aarav Shah", studentId: "u1", subject: "Your VIBHA login link", why: "The address does not exist", fix: "Check the spelling of the email on the student page, then send again.", when: "Today, 9:02 am", tries: 2, state: "failed" },
  { id: "fe2", to: "tanvi@example.com", name: "Tanvi Kulkarni", studentId: "u7", subject: "Certificate of Completion", why: "Their inbox is full", fix: "Try again later, or share the link on WhatsApp.", when: "Yesterday, 4:15 pm", tries: 1, state: "failed" },
  { id: "fe3", to: "neil.f@example.com", name: "Neil Fernandes", studentId: "u24", subject: "Timetable change for Saturday", why: "Today's sending limit was reached", fix: "It goes out tomorrow by itself. Send now to use tomorrow's allowance early.", when: "Yesterday, 11:48 pm", tries: 1, state: "failed" },
];

/* --------------------------------------------------------------- insights */

export type Insight = {
  window: string;
  totals: { active: number; students: number; minutesPerStudent: number; sectionsRead: number; questions: number; firstTryRight: number };
  byDay: { day: string; active: number }[];
  topics: { topic: string; rightPct: number; answers: number }[];
  stuck: { where: string; students: number; href: string }[];
  quiet: { id: string; name: string; days: number }[];
};
export const INSIGHTS: Insight = {
  window: "Last 7 days",
  totals: { active: 96, students: 118, minutesPerStudent: 142, sectionsRead: 611, questions: 4830, firstTryRight: 68 },
  byDay: [
    { day: "Sun", active: 41 },
    { day: "Mon", active: 78 },
    { day: "Tue", active: 83 },
    { day: "Wed", active: 71 },
    { day: "Thu", active: 88 },
    { day: "Fri", active: 64 },
    { day: "Sat", active: 52 },
  ],
  topics: [
    { topic: "Mood and affect", rightPct: 47, answers: 388 },
    { topic: "Thought content and form", rightPct: 58, answers: 301 },
    { topic: "Reading a table", rightPct: 61, answers: 212 },
    { topic: "History: personal and family", rightPct: 79, answers: 455 },
    { topic: "Presenting complaint", rightPct: 90, answers: 502 },
  ],
  stuck: [
    { where: "The mental state examination, Checkpoint 1", students: 27, href: "/admin/teaching/section/m02.c1" },
    { where: "Common presentations, Worry and panic", students: 14, href: "/admin/teaching/section/m03.s2" },
  ],
  quiet: [
    { id: "u19", name: "Riya Chawla", days: 12 },
    { id: "u22", name: "Yash Trivedi", days: 9 },
    { id: "u15", name: "Kiara Sethi", days: 8 },
  ],
};

/* ----------------------------------------------------------------- access */

/** The website's per-student section switches (access_blocks) and account scope. */
export const ACCESS_SECTIONS = [
  { id: "lectures", name: "Lectures", about: "Recorded classes and materials" },
  { id: "study", name: "Study modules and notes", about: "Modules, checkpoints, notes, reference" },
  { id: "practice", name: "Practice and games", about: "Cases, games, exam practice" },
  { id: "medicines", name: "Medicines", about: "The medicine library" },
  { id: "clinic", name: "Clinic", about: "Attendance, leave, OPD" },
  { id: "community", name: "Doubts and class wall", about: "Asking and posting" },
] as const;
export type AccessId = (typeof ACCESS_SECTIONS)[number]["id"];
export const ACCESS_COHORTS = [
  { id: "c1", name: "Morning batch", students: 74 },
  { id: "c2", name: "Evening batch", students: 44 },
];
export const ACCESS_PRESETS = [
  { id: "full", name: "Everything", about: "All sections open" },
  { id: "lectures_only", name: "Lectures only", about: "Only the recorded classes" },
  { id: "custom", name: "Pick sections", about: "Choose what is open" },
] as const;
export type AccessPreset = (typeof ACCESS_PRESETS)[number]["id"];

/** Sample progress, attendance and cases for the student page's Record tab. */
export const STUDENT_RECORD = {
  modules: [
    { id: "m01", title: "Taking a history", pct: 100, score: 84 },
    { id: "m02", title: "The mental state examination", pct: 62, score: 58 },
    { id: "m03", title: "Common presentations", pct: 15, score: null as number | null },
  ],
  attendance: { expected: 24, present: 20, late: 3, leave: 2, missed: 2, last: [
    { title: "OPD, morning", when: "Fri 20 Nov", state: "In 8:56 am, out 1:04 pm" },
    { title: "Weekend class", when: "Sat 14 Nov", state: "Late by 12 min" },
    { title: "OPD, evening", when: "Wed 11 Nov", state: "On leave (approved)" },
    { title: "Case discussion", when: "Mon 9 Nov", state: "Missed" },
  ] },
  cases: { logged: 9, target: 12, last: [
    { title: "Low mood, first visit", when: "Fri 20 Nov", note: "History and mental state written. Signed by the lead doctor." },
    { title: "Worry with poor sleep", when: "Tue 17 Nov", note: "Waiting for sign-off." },
    { title: "Follow-up visit", when: "Fri 13 Nov", note: "Signed by the lead doctor." },
  ] },
  weak: ["Mood and affect", "Thought content and form"],
};
