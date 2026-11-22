/**
 * Quick Notes: the typed shapes (audit-m/notes.md, section 4B). One library
 * for the website and the app. Every note shares a base, then adds the fields
 * its type needs. Short strings only: the tests hold every line to 140
 * characters, at most 7 bullets in a block and at most 8 rows in a table.
 *
 * What a student sees is built from these by ./view.ts (one plain view shape
 * that the website and the phone both draw), so the two never drift.
 */

export type NoteType = "criteria" | "summary" | "differential" | "distinction" | "theory" | "therapy" | "pharm" | "assessment" | "term" | "exam";

export type Topic = "mood" | "anxiety" | "psychosis" | "trauma" | "child" | "personality" | "substance" | "eating" | "older" | "body" | "medicines" | "therapy" | "assessment" | "theory" | "basics" | "law";

/** Where a note comes from. Not shown, except the fixed footer on criteria notes. */
export type Source = {
  /** Named sources the facts were checked against. */
  basis: ("DSM-5-TR" | "ICD-11" | "NICE" | "Maudsley" | "Kaplan" | "Stahl" | "WHO" | "MHCA 2017" | "Textbook" | "Scale manual")[];
  checkedBy: string;
  checkedOn: string;
  /** "pending" until a clinician has spot-checked the note. */
  clinician: "pending" | "done";
};

export type Practice = "quiz" | "scenarios" | "detective" | "terms" | "mse" | "medicines";

export type Links = {
  /** The study module this note belongs to (the reverse of the module's own note link). */
  moduleId?: string;
  /** The older one-page summary on the same topic: its quiz and patient scenarios are this note's practice. */
  summaryId?: string;
  /** Other Quick Notes (ids). */
  related?: string[];
  /** Medicine pages (ids from src/lib/meds). */
  medicines?: string[];
  /** Extra practice tools to offer. Quiz and scenarios come from the summary. */
  practice?: Practice[];
};

export type Base = {
  id: string;
  type: NoteType;
  title: string;
  aka?: string[];
  topic: Topic;
  /** The say-it-out-loud line. */
  oneLine: string;
  links: Links;
  source: Source;
  keywords?: string[];
  /** Old Quick reference card slugs this note replaces (their addresses open this note). */
  replaces?: string[];
};

export type Table = { head: string[]; rows: string[][] };

// 1. Diagnostic criteria quick reference
export type Criteria = Base & {
  type: "criteria";
  facts: { threshold?: string; duration?: string; onset?: string; settings?: string; impairment?: string; minAge?: string };
  /** Core features, paraphrased and grouped. */
  core: string[];
  groups?: { name: string; count?: string; examples: string[] }[];
  presentations?: { name: string; when: string }[];
  specifiers?: string[];
  severity?: string[];
  exclusions: string[];
  differentials: { name: string; tell: string; noteId?: string }[];
  firstLine?: string[];
  /** What people get wrong. */
  pitfalls?: string[];
  /** Points for the Indian clinic: words people use, local tools, law. */
  india?: string[];
};

// 2. Disorder summary (no thresholds typed here)
export type Summary = Base & { type: "summary"; picture: string[]; howItSounds: string[]; mseClues?: string[]; ruleOutFirst: string[]; treatment: string[]; redFlags: string[]; criteriaNotes: string[] };

// 3. Differential diagnosis
export type Differential = Base & {
  type: "differential";
  presenting: string;
  askFirst: string[];
  rows: { diagnosis: string; pointsTo: string; pointsAway: string; noteId?: string }[];
  dontMiss: string[];
  india?: string[];
};

// 4. Key distinction (A versus B, or up to four)
export type Distinction = Base & {
  type: "distinction";
  items: string[];
  rows: { feature: string; cells: string[] }[];
  quickTell: string;
  extra?: { title: string; points: string[] }[];
};

// 5. Theory
export type Theory = Base & {
  type: "theory";
  who: string;
  when?: string;
  coreIdea: string;
  tables?: { title: string; table: Table }[];
  keyTerms: { term: string; means: string }[];
  inTheClinic: string[];
  limits: string[];
};

// 6. Therapy framework
export type Therapy = Base & {
  type: "therapy";
  usedFor: string[];
  /** One line: how problems are kept going, and how the therapy breaks the loop. */
  model: string;
  steps: string[];
  techniques: { name: string; what: string }[];
  table?: { title: string; table: Table };
  session?: string;
  notFor?: string[];
  /** What the therapist says. */
  soundsLike: string[];
  india?: string[];
};

// 7. Psychopharmacology reference point
export type PharmPoint = Base & {
  type: "pharm";
  facts?: { label: string; value: string }[];
  tables: { title: string; table: Table }[];
  monitoring?: string[];
  interactions?: string[];
  emergencies?: { name: string; signs: string; firstStep: string }[];
  points?: { title: string; points: string[] }[];
};

// 8. Assessment concept or tool
export type Assessment = Base & {
  type: "assessment";
  measures: string;
  whoFills?: "self" | "clinician" | "informant" | "mixed";
  facts?: { label: string; value: string }[];
  tables?: { title: string; table: Table }[];
  sections?: { title: string; points: string[]; steps?: boolean }[];
  useWhen: string[];
  cautions: string[];
};

// 10. Exam points
export type ExamPoints = Base & { type: "exam"; points: { fact: string; trap?: string }[]; mnemonics?: { name: string; stands: string[] }[] };

/** Every typed note. Terms (type 9) stay in the existing word list and join the library index. */
export type QuickNote = Criteria | Summary | Differential | Distinction | Theory | Therapy | PharmPoint | Assessment | ExamPoints;

export const TYPE_LABEL: Record<NoteType, string> = {
  criteria: "Criteria",
  summary: "Summary",
  differential: "Differential",
  distinction: "Key distinction",
  theory: "Theory",
  therapy: "Therapy",
  pharm: "Medicines",
  assessment: "Assessment",
  term: "Word",
  exam: "Exam points",
};

export const TOPIC_LABEL: Record<Topic, string> = {
  mood: "Mood",
  anxiety: "Anxiety and OCD",
  psychosis: "Psychosis",
  trauma: "Trauma and grief",
  child: "Child and development",
  personality: "Personality",
  substance: "Substance use",
  eating: "Eating",
  older: "Older adults",
  body: "Body and mind",
  medicines: "Medicines",
  therapy: "Therapy",
  assessment: "Assessment",
  theory: "Theories",
  basics: "Basics",
  law: "Law and ethics",
};

/** The one fixed line every criteria note ends with (owner approved sources on criteria notes). */
export const CRITERIA_SOURCE_LINE = "Study summary in our own words, based on DSM-5-TR (American Psychiatric Association, 2022). For diagnosis, use the manual.";
export const FOR_LEARNING_LINE = "For learning. Real treatment is decided by the treating clinician.";

/** Typed note ids start with their type's word, so an old summary id can never clash with one. */
export const ID_PREFIX: Partial<Record<NoteType, string>> = { criteria: "criteria-", differential: "diff-", distinction: "compare-", theory: "theory-", therapy: "therapy-", pharm: "pharm-", assessment: "assess-", exam: "exam-" };
export const QUICK_ID = /^(criteria|diff|compare|theory|therapy|pharm|assess|exam)-[a-z0-9-]+$/;
