/**
 * Every word on the visitor screens, taken from the website homepage
 * (src/components/home/content.ts and home-page.tsx), in the website's own
 * words. Nothing about which cohort is running: the app must stay true
 * whatever month it is opened in. Edit here, not in the screens.
 */
import type { CastName, IconName } from "./art";

export const HERO = {
  lines: ["Don't just study", "Psychology.", "Practise it."] as const,
  lede: "A clinical training programme where you see real patients, write real treatment plans, and get corrected by psychiatrists. Led by Dr. Sarthak Dave, MBBS, MD (Psychiatry).",
  bubble: "Let's see a patient.",
} as const;

export const STICKERS = ["Real patients", "Psychiatric interview", "MSE in depth", "Treatment plans", "Therapy planning", "Counselling", "Crisis handling", "Certificate"] as const;

export const QUICK_ANSWERS = [
  { q: "Real patients?", a: "Yes. In person, you interview them yourself, supervised." },
  { q: "Need a psychology degree?", a: "No. Students, graduates and professionals can join." },
  { q: "Online or in person?", a: "Both. Patient work is in Ahmedabad." },
  { q: "Who teaches?", a: "Psychiatrists and specialists, led by Dr. Sarthak Dave." },
  { q: "What does it cost?", a: "Depends on your college and group size. Instalments and EMI available." },
] as const;

export const PATIENTS = {
  tag: "Real patients",
  title: "Not observership.",
  accent: "You talk to the patient.",
  sub: "In person, you interview patients yourself, under a psychiatrist's supervision.",
  steps: [
    { title: "Join a group of five", text: "Every in-person student is placed in a group of 5.", heads: ["long", "curly", "beanie", "scarf", "bun"] },
    { title: "2 of you take the patient", text: "Full history, mental status examination, assessment.", heads: ["long", "curly", "patient"] },
    { title: "3 more join the discussion", text: "All 5 talk it through and agree on a treatment plan.", heads: ["long", "curly", "beanie", "scarf", "bun"] },
    { title: "The psychiatrist corrects it", text: "You present the plan. The psychiatrist shows you what to change, and why.", heads: ["doctor", "long", "curly"] },
    { title: "Swap and repeat", text: "The next 2 take the next patient. Everyone gets equal turns.", heads: ["beanie", "scarf", "patient"] },
  ] satisfies { title: string; text: string; heads: CastName[] }[],
} as const;

export const DIFFERENT = {
  tag: "Why VIBHA",
  title: "We don't teach",
  accent: "what your college teaches.",
  sub: "Your degree gives you the theory. We take every topic all the way to the patient: the plan, the therapy, the counselling, the clinical judgement.",
  rows: [
    { college: "Read about depression.", vibha: "Interview a patient with depression." },
    { college: "Memorise the diagnostic criteria.", vibha: "Write the case sheet, the diagnosis and the plan." },
    { college: "Learn the names of therapies.", vibha: "Plan therapy session by session, and mix approaches." },
    { college: "Study side effects in a table.", vibha: "Spot them in a real patient, and know when to call the psychiatrist." },
    { college: "Watch from the back of the room.", vibha: "Take the patient yourself, under supervision." },
    { college: "Get marks for an exam answer.", vibha: "Get a psychiatrist's corrections on your own plan." },
  ],
  manifesto: "Every disorder you learn here ends the same way: with a real treatment plan, a therapy plan, counselling, and a psychiatrist checking your work.",
} as const;

export const JOURNEY = {
  tag: "Every disorder, the whole plan",
  title: "Not just symptoms.",
  accent: "The whole clinical plan.",
  disorder: "Depression",
  patient: "A 32-year-old man. Low mood for three months, since losing his job.",
  steps: [
    { k: "Interview", title: "Take the history", text: "In his own words. Onset, triggers, sleep, work, family, alcohol.", icon: "chat" },
    { k: "MSE", title: "Examine the mind", text: "Affect depressed and restricted. Hopelessness. No suicidal plan. Insight present.", icon: "eye" },
    { k: "Rule out", title: "Check what else it could be", text: "Bipolar episodes? Alcohol? Thyroid? Medicines hiding symptoms?", icon: "alert" },
    { k: "Diagnosis", title: "Name it, provisionally", text: "Single episode depressive disorder, moderate (ICD-11). Written, not guessed.", icon: "clipboard" },
    { k: "Case sheet", title: "Write it up properly", text: "Every finding in its place, in the format psychiatrists read.", icon: "book" },
    { k: "Treatment plan", title: "Plan with the psychiatrist", text: "Medicines reviewed by the psychiatrist. Your role, their role, clearly split.", icon: "pill" },
    { k: "Therapy plan", title: "Plan the sessions", text: "Sessions 1 to 2 motivational interviewing, 3 to 6 behavioural activation and CBT, then relapse prevention.", icon: "puzzle" },
    { k: "Counselling", title: "Talk to him, and his family", text: "Explain the illness simply. Involve family without breaking confidence.", icon: "family" },
    { k: "Follow-up", title: "Review and adjust", text: "Side effects checked. Progress measured. Plan changed when it isn't working.", icon: "loop" },
  ] satisfies { k: string; title: string; text: string; icon: IconName }[],
  foot: "Every disorder in the syllabus is taught this way.",
} as const;

export const GET = {
  tag: "What you get",
  title: "Everything you get",
  accent: "in the programme.",
  stats: [
    { n: "3+", t: "months for the full programme, or a shorter track of a few weeks" },
    { n: "7", t: "disciplines, from psychiatry to counselling" },
    { n: "18", t: "modules, taught in order" },
    { n: "8", t: "specialist faculty, led by a psychiatrist" },
    { n: "400+", t: "internship hours available, starting at 90" },
    { n: "18", t: "therapies, and how to mix them" },
  ],
  certificate: "Issued and signed by Dr. Sarthak Dave, MBBS, MD (Psychiatry). It lists the clinical skills you showed: interviewing, MSE, assessment, documentation and therapy techniques.",
} as const;

export const DISCIPLINES = {
  tag: "Curriculum",
  title: "Seven disciplines.",
  accent: "All practical.",
  sub: "Taught in order. Counselling skills run through every one.",
  items: [
    { name: "Clinical psychology", text: "Disorders, interview, MSE, diagnosis, formulation, treatment plans, forensic work" },
    { name: "Psychotherapies", text: "18 therapies, how each works, and how to mix them for one patient" },
    { name: "Psychopharmacology", text: "Common medicine names, side effects, side effect or symptom?, red flags, when to refer" },
    { name: "Child psychology", text: "Development, assessing children, ADHD, autism, learning difficulties, working with parents" },
    { name: "Neuropsychology", text: "Brain and behaviour, attention and memory, dementia and delirium, reading a report" },
    { name: "Hypnotherapy", text: "Induction, trance states, suggestibility, where it helps, and where it doesn't" },
    { name: "Counselling", text: "Listening, silence, boundaries, risk, closing a session well" },
  ],
} as const;

export const WEEK = {
  tag: "Your week",
  title: "A weekday, a weekend,",
  accent: "and the whole week.",
  sub: "Patient batches on weekdays, live discussions with psychiatrists every weekend.",
  days: [
    { d: "Mon", live: false },
    { d: "Tue", live: false },
    { d: "Wed", live: false },
    { d: "Thu", live: false },
    { d: "Fri", live: false },
    { d: "Sat", live: true },
    { d: "Sun", live: true },
  ],
  weekday: { tag: "Weekday, in person", title: "Patient batch", sub: "Morning or evening", steps: ["Arrive at the clinic", "See a patient with your group", "Plan the treatment together", "Get the psychiatrist's corrections", "Write the case sheet", "Add it to your case log"] },
  weekend: { tag: "Weekend, everyone", title: "Live discussion", sub: "Online or in person, from 8 am", steps: ["Join the psychiatrist, live", "One patient, or one disorder, in depth", "“What would you do?”", "The psychiatrist's answer, from years of practice", "Ask as many questions as you want", "Your assignment for the week"] },
} as const;

export const FACULTY = {
  tag: "Faculty",
  title: "Taught by people",
  accent: "who practise it.",
  sub: "Led by Dr. Sarthak Dave, with psychiatrists, a child psychiatrist, a hypnotherapist and a mindfulness teacher.",
  lead: { initials: "SD", role: "Co-Founder & Lead Faculty", name: "Dr. Sarthak Dave, MBBS, MD (Psychiatry)", text: "Practising psychiatrist, Ahmedabad. Leads the clinical teaching and supervises patient interaction." },
  people: [
    { initials: "RS", name: "Dr. Ravi Soni", role: "Psychiatrist" },
    { initials: "MD", name: "Dr. Minoli Doshi", role: "Psychiatrist" },
    { initials: "TP", name: "Dr. Tejas Patel", role: "Psychiatrist" },
    { initials: "SS", name: "Dr. Sarandha Srivastava", role: "Psychiatrist" },
    { initials: "AJ", name: "Dr. Aakriti Jha", role: "Child Psychiatrist" },
    { initials: "IP", name: "Dr. Ishan Pandya", role: "Psychodermatologist & Hypnotherapist" },
    { initials: "SS", name: "Shrujal Shah", role: "Mindfulness" },
  ],
  note: "Every case discussion is led by the clinician who took the case.",
  runBy: [
    { name: "Dr. Vishwa V. Dave", role: "Co-Founder, CEO & CFO" },
    { name: "Kavya Bothra", role: "Chief Operating Officer" },
  ],
} as const;

export const JOIN = {
  tag: "Fees & joining",
  title: "What it costs.",
  accent: "How to join.",
  sub: "No hidden steps. One call gets you your exact fee and a seat.",
  who: [
    { title: "Psychology students", text: "BA, MA, MSc. Get the clinical practice your syllabus leaves out.", who: "long" },
    { title: "Graduates", text: "Finished your degree but never sat with a patient? Start here.", who: "curly" },
    { title: "Working professionals", text: "From any field. No psychology background needed.", who: "beanie" },
    { title: "Doctors and counsellors", text: "Add therapy planning and counselling to what you already know.", who: "doctor3" },
  ] satisfies { title: string; text: string; who: CastName }[],
  whoLabel: "No degree, age or experience requirement",
  dependsOn: ["Your university", "Our collaboration with it", "How many students join together"],
  pay: ["Instalments", "EMI, if your bank supports it", "Group discounts"],
  steps: [
    { title: "Reach out", text: "Request an invitation here, or call or WhatsApp +91 78770 49920." },
    { title: "Talk to Kavya", text: "He answers your questions and tells you your exact fee." },
    { title: "Confirm your seat", text: "Choose online or in person and your internship hours, then pay." },
  ],
} as const;

export const CLOSING = {
  a: "Theory ends here.",
  b: "Practice begins.",
  phone: "+91 78770 49920",
  phoneHref: "tel:+917877049920",
  whatsappHref: "https://wa.me/917877049920",
  address: "M-2, Mahakant Complex, Opposite V.S. Hospital, Ellisbridge, Paldi, Ahmedabad, Gujarat 380006",
} as const;

/** The chapters, in order: their short names label the progress line. */
export const CHAPTERS = ["Start", "Patients", "Why VIBHA", "The plan", "What you get", "Curriculum", "Your week", "Faculty", "Joining"] as const;
