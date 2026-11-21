/**
 * VIBHA app API contract: every request and response type of /api/app/v1.
 *
 * PLAIN FILE ON PURPOSE: no imports, no runtime code except a few constants,
 * so the mobile app can copy it as is (apps/mobile copies this file; it must
 * never import from the website). The human-readable version, with the route
 * table and which routes are built, is docs/app/API_CONTRACT.md.
 *
 * The website keeps these types honest in src/lib/app-api/contract-check.ts
 * (compile-time checks against the real types in src/lib).
 */

export const APP_API_VERSION = "v1";
export const APP_API_BASE = "/api/app/v1";
/** Version of the study content JSON (blocks, widgets, figures). Bumped only on a breaking change. */
export const CONTENT_SCHEMA_VERSION = 1;

/** Headers the app sends on every request. */
export const APP_HEADERS = {
  /** `Bearer <accessToken>` on every signed-in route. */
  authorization: "Authorization",
  /** The id the app made for this install (stored in secure storage). Required on signed-in routes. */
  deviceId: "X-App-Device-Id",
  /** App version, e.g. "1.0.3". Used for the minimum-version check. */
  appVersion: "X-App-Version",
  /** "android" | "ios". */
  platform: "X-App-Platform",
} as const;

// ---------------------------------------------------------------------------
// Envelope and errors
// ---------------------------------------------------------------------------

/** Every 2xx answer. */
export type ApiOk<T> = { ok: true; data: T };

/**
 * Every non-2xx answer. `code` is stable and is what the app switches on;
 * `message` is plain English that can be shown to the student.
 */
export type ApiError = { ok: false; error: { code: ApiErrorCode; message: string; details?: Record<string, unknown> } };

export type ApiResponse<T> = ApiOk<T> | ApiError;

export type ApiErrorCode =
  /** 400: the body or query is wrong. `details.fields` may name the bad fields. */
  | "bad_request"
  /** 401: wrong email or password. */
  | "invalid_credentials"
  /** 401: no token, or the token is not valid. Sign in again. */
  | "unauthenticated"
  /** 401: the access token ran out. Call /auth/refresh, then repeat the request. */
  | "token_expired"
  /** 401: "Signed out: opened on another device". Clear tokens and show the sign-in screen with this line. */
  | "device_replaced"
  /** 401: the X-App-Device-Id header is missing or does not look like a device id. */
  | "device_required"
  /** 403: the account is paused. Keep the tokens, show the paused screen; it lifts by itself when unpaused. */
  | "account_blocked"
  /** 403: access has ended. Clear tokens. */
  | "account_expired"
  /** 403: lectures-only account asking for something outside lectures. */
  | "scope"
  /** 403: this section is switched off for this student. */
  | "access_block"
  /** 403: the feature is shown as coming soon. */
  | "feature_locked"
  /** 403: the feature is off. */
  | "feature_off"
  /** 403: anything else the caller may not do (not enrolled, not the owner, not an admin). */
  | "forbidden"
  /** 403: the phone was changed too many times this month. `details.nextChangeAt` says when it frees up. */
  | "device_limit"
  /** 403: video refused (for example the app reported a rooted phone). */
  | "video_refused"
  /** 404 */
  | "not_found"
  /** 409: the request clashes with the stored state (already graded, saves of another account). */
  | "conflict"
  /** 413 */
  | "too_large"
  /** 426: this app version is too old. `details.minVersion`, `details.storeUrl`. */
  | "upgrade_required"
  /** 429: slow down. `details.retryAfterSeconds` when known. */
  | "rate_limited"
  /** 500 */
  | "server_error"
  /** 503: a needed part is not set up on the server yet (for example a database step not run). */
  | "unavailable";

/** Lists that can grow: pass `?limit=` (default 30, max 100) and `?cursor=` from the last answer. */
export type Page<T> = { items: T[]; nextCursor: string | null };

/**
 * Where a row or button leads inside the app. The server turns the website's
 * paths into these so the app never parses web addresses. `web` is the website
 * path it came from (for logging, or a screen the app does not have yet).
 */
export type AppTarget =
  | { screen: "home"; web: string }
  | { screen: "courses"; web: string }
  | { screen: "course"; courseId: string; web: string }
  | { screen: "lecture"; courseId: string; lessonId: string; tab?: "assignment" | "materials"; web: string }
  | { screen: "material"; courseId: string; materialId: string; web: string }
  | { screen: "study"; web: string }
  | { screen: "studyModule"; moduleId: string; web: string }
  | { screen: "studySection"; moduleId: string; sectionId: string; web: string }
  | { screen: "studyCheckpoint"; moduleId: string; n: number; web: string }
  | { screen: "studyNote"; noteId: string; web: string }
  | { screen: "doubts"; web: string }
  | { screen: "doubt"; doubtId: string; web: string }
  | { screen: "notifications"; web: string }
  | { screen: "notification"; notificationId: string; web: string }
  | { screen: "achievements"; web: string }
  | { screen: "certificate"; credentialId: string; web: string }
  | { screen: "progress"; web: string }
  | { screen: "settings"; web: string }
  | { screen: "practice"; tool: string | null; web: string }
  | { screen: "game"; game: string | null; web: string }
  /** No app screen for this path yet. */
  | { screen: "unknown"; web: string };

// ---------------------------------------------------------------------------
// Public: config and request an invitation
// ---------------------------------------------------------------------------

/** GET /config */
export type AppConfig = {
  apiVersion: "v1";
  /** Oldest app version the server still talks to. Below it every route answers 426. */
  minSupportedVersion: string;
  /** Newest released version, for a soft "update available" line. */
  latestVersion: string;
  storeUrl: { android: string; ios: string | null };
  /** One-line notice for every user (maintenance and the like), or null. */
  notice: string | null;
  /** Rules the app enforces on the device. Kept here so they change without a release. */
  security: {
    pinLength: number;
    pinMaxTries: number;
    lockAfterBackgroundSeconds: number;
    blockScreenCapture: boolean;
    refuseVideoOnRootedDevice: boolean;
  };
  device: { onePhoneAtATime: boolean; changesPerMonth: number };
  support: { whatsapp: string; email: string };
  legal: { termsUrl: string; privacyUrl: string; policyVersion: string };
  contentSchemaVersion: number;
  /** Server time (ISO), for clock checks. */
  now: string;
  /** The line the Welcome screen shows ("Cohort Two · by invitation · starts December 2026"), or null to show none. */
  cohortLine?: string | null;
};

/**
 * GET /public/home : the website homepage's key information, in its own
 * words, for the Welcome screen. Public and cached (an hour); the same for
 * everyone. Which cohort is running is never in it. Every list is always an
 * array (never null); `redFlag` is the only field that can be null.
 */
export type HomeHead = { tag: string; title: string; accent: string };
export type HomeTitleText = { title: string; text: string };
export type PublicHome = {
  v: 1;
  brand: { name: string; shortName: string; tagline: string; description: string; parent: string; lead: string };
  hero: {
    /** The three lines of the big title. */
    title: string[];
    lede: string;
    /** Short tags ("Real patients", "MSE in depth"). */
    highlights: string[];
    /** `section` is the key in `sections` that answers it. */
    quickAnswers: { q: string; a: string; section: string }[];
  };
  sections: {
    programme: { head: HomeHead; stats: { n: string; text: string }[]; included: string[]; beyond: HomeTitleText[]; assessment: HomeTitleText[]; certificate: string; manifesto: string };
    patients: { head: HomeHead; steps: HomeTitleText[]; facts: { k: string; v: string }[] };
    different: { head: HomeHead; rows: { college: string; vibha: string }[] };
    disorders: {
      head: HomeHead;
      journey: { disorder: string; patient: string; steps: { k: string; title: string; text: string }[]; foot: string };
      /** Labels for the disorder fields, in order. */
      fields: { key: "looks" | "ask" | "mse" | "ruleOut" | "meds" | "therapy"; label: string }[];
      list: { name: string; module: string; says: string; looks: string; ask: string; mse: string; ruleOut: string; meds: string; therapy: string; redFlag: string | null }[];
      foot: string;
      mixer: { who: string; age: string; plan: { when: string; what: string }[] }[];
      mixerNote: string;
    };
    week: {
      head: HomeHead;
      weekday: { tag: string; title: string; sub: string; steps: string[] };
      weekend: { tag: string; title: string; sub: string; steps: string[] };
      days: { d: string; kind: "patient" | "live"; time: string | null }[];
      timeline: { weeks: string; text: string }[];
    };
    scenarios: { head: HomeHead; list: { when: string; learn: string[] }[] };
    faculty: { head: HomeHead; lead: { initials: string; role: string; name: string; text: string }; faculty: { initials: string; name: string; role: string }[]; leadership: { name: string; role: string }[] };
    fees: { head: HomeHead; dependsOn: string[]; pay: string[]; note: string; joinSteps: HomeTitleText[]; whoFor: HomeTitleText[]; colleges: { gets: string[]; partnering: string[] } };
    curriculum: {
      head: HomeHead;
      disciplines: { name: string; text: string }[];
      modules: { n: string; title: string; text: string }[];
      interview: { title: string; items: string[] }[];
      mse: HomeTitleText[];
      caseSheet: { learn: { title: string; items: string[] }; rows: { k: string; v: string }[] };
      medicines: { group: string; names: string; watch: string }[];
      ruleOut: HomeTitleText[];
      sideOrSymptom: { q: string; a: string }[];
      redFlags: string;
      therapies: { name: string; text: string }[];
      mixExample: { patient: string; plan: { when: string; what: { name: string; why: string }[] }[] };
      defences: HomeTitleText[];
      psychometric: { group: string; tests: string[] }[];
      psychometricNote: string;
    };
    faq: { head: HomeHead; list: { q: string; a: string }[] };
    closing: { title: string[] };
  };
  contact: { person: string; role: string; roleNote: string; phone: string; phoneHref: string; whatsappHref: string; email: string; address: string[] };
  /** `requestInvitation` is the app route; `policies` are website paths (open in the browser). */
  links: { requestInvitation: string; policies: { label: string; path: string }[] };
};

/** POST /public/request-invitation */
export type RequestInvitationBody = {
  name: string;
  email: string;
  phone?: string;
  status: "student" | "early_career" | "practitioner" | "other";
  message?: string;
  /** Must be true: the visitor ticked the policy box. */
  policyAccepted: true;
};
export type RequestInvitationResult = { received: true };

/** GET /public/certificates/:certificateId */
export type CertificateVerification = {
  found: boolean;
  certificateId: string;
  /** The same words as the website's verify page. `unknown` when no such id. */
  status: "valid" | "provisional" | "expired" | "revoked" | "not_issued" | "unknown";
  /** "Certificate", "Provisional certificate", "Special recognition" or "Badge". */
  what: string | null;
  recipientName: string | null;
  title: string | null;
  /** The certificate's own paragraph, when it has one. */
  paragraph: string | null;
  issuedAt: string | null;
  expiresAt: string | null;
  revokedAt: string | null;
  /** The id of the certificate that replaced this one. */
  replacedBy: string | null;
  issuer: string;
  verifyUrl: string;
};

// ---------------------------------------------------------------------------
// Auth and devices
// ---------------------------------------------------------------------------

export type Role = "admin" | "view_admin" | "student" | "alumni";
export type Scope = "full" | "lectures_only";

export type DeviceInfo = {
  /** Made once by the app and kept in secure storage. 16 to 80 characters: letters, digits, dot, dash, underscore. */
  id: string;
  /** What the student sees in "Your phone", e.g. "Pixel 8". */
  name: string;
  platform: "android" | "ios";
  appVersion?: string;
  osVersion?: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  /** Seconds until the access token runs out. */
  expiresIn: number;
  /** ISO time the access token runs out. */
  expiresAt: string;
};

/** POST /auth/sign-in */
export type SignInBody = { email: string; password: string; device: DeviceInfo };
export type SignInResult = { tokens: AuthTokens; me: Me; device: DeviceState };

/** POST /auth/refresh */
export type RefreshBody = { refreshToken: string };
export type RefreshResult = { tokens: AuthTokens };

/** POST /auth/sign-out (bearer). Body is empty. */
export type SignOutResult = { signedOut: true };

/** POST /auth/setup/check: is this setup link still good? Does not use it up. */
export type SetupCheckBody = { token: string };
export type SetupCheckResult = { valid: boolean; email: string | null; reason: "used" | "expired" | "unknown" | null };

/** POST /auth/setup/complete: set the first password from a setup link. Then call /auth/sign-in. */
export type SetupCompleteBody = { token: string; password: string };
export type SetupCompleteResult = { email: string };

/** What the server knows about this phone and the phone-change allowance. */
export type DeviceState = {
  /** False until the owner runs the app_devices database step: the one-phone rule is then not enforced. */
  enforced: boolean;
  current: { id: string; name: string; platform: "android" | "ios"; lastSeenAt: string | null; pushEnabled: boolean } | null;
  /** Phone changes used in the last 30 days, and the allowance. Admins: `limit` is null. */
  changesUsed: number;
  limit: number | null;
  /** When the next change frees up (ISO), if the allowance is used up. */
  nextChangeAt: string | null;
};

/** PUT /devices/current: rename the phone, set or clear the push token. */
export type UpdateDeviceBody = {
  name?: string;
  /** Expo push token ("ExponentPushToken[...]"), or null to stop push on this phone. */
  pushToken?: string | null;
  appVersion?: string;
  osVersion?: string;
};

/** POST /admin/devices/allow-change (super admin): lets a student change phone again now. */
export type AllowDeviceChangeBody = { userId: string };
export type AllowDeviceChangeResult = { allowed: true };

// ---------------------------------------------------------------------------
// Me and access
// ---------------------------------------------------------------------------

export type StudentTab = "home" | "learn" | "practise" | "library" | "me" | "lectures" | "doubts";
export type AdminTab = "home" | "students" | "activity" | "messages" | "more";

/** What this account may open. The server enforces all of it; this only saves the app from drawing dead buttons. */
export type Access = {
  /** Tabs in order. Lectures-only: home, lectures, doubts, me. */
  tabs: (StudentTab | AdminTab)[];
  lecturesOnly: boolean;
  /** When set, a lectures-only account that may watch only this one lecture. */
  singleLessonId: string | null;
  /** Section keys the admin switched off for this student (see FEATURES on the website: notes, games, practice, medicines, rankings, doubts, journey, wall, journal, tool:<flag>). */
  blocks: string[];
  /** Feature flags: off = hidden, live = shown as coming soon, unlocked = open. */
  flags: Record<string, "off" | "live" | "unlocked">;
  /** The answer for the main sections, already combining scope, blocks and flags. */
  can: {
    lectures: boolean;
    study: boolean;
    doubts: boolean;
    practice: boolean;
    games: boolean;
    medicines: boolean;
    leaderboard: boolean;
    journey: boolean;
    achievements: boolean;
    notifications: boolean;
  };
};

/** GET /me */
export type Me = {
  id: string;
  email: string | null;
  name: string | null;
  role: Role;
  scope: Scope;
  status: "active" | "blocked";
  rollNumber: string | null;
  mobileNumber: string | null;
  /** True when Home should ask for the WhatsApp number (not given, not skipped). */
  askMobileNumber: boolean;
  /** ISO time access ends, or null. Alumni never end. */
  expiresAt: string | null;
  cohorts: { id: string; name: string }[];
  access: Access;
  /** Text for the moving video watermark. */
  watermark: Watermark;
  unreadNotifications: number;
};

/** PATCH /me */
export type UpdateMeBody = {
  /** 10-digit Indian mobile, or null with `skipMobilePrompt` to choose Later. */
  mobileNumber?: string;
  skipMobilePrompt?: boolean;
};

/** POST /me/deletion-request: ask the school to delete the account. A person checks it; nothing is deleted automatically. */
export type DeletionRequestBody = { reason?: string };
export type DeletionRequestResult = { received: true; /** ISO time the request was logged. */ at: string };

export type Watermark = { name: string; rollNumber: string | null; /** Ready-made line: "Name · VIBHA-000123". */ text: string };

// ---------------------------------------------------------------------------
// Home
// ---------------------------------------------------------------------------

export type ContinueKind = "retest" | "lecture" | "assignment" | "study" | "weak" | "daily" | "lectures";

export type ContinueStep = {
  kind: ContinueKind;
  eyebrow: string;
  title: string;
  meta: string | null;
  cta: string;
  target: AppTarget;
};

export type UpNextRow = { kind: "lecture" | "study" | "weak" | "daily"; title: string; meta: string | null; target: AppTarget };

/** GET /home */
export type Home = {
  /** "Mon, 16 Nov" in India time. */
  dateLine: string;
  welcomeBack: boolean;
  /** The one Continue card. */
  step: ContinueStep;
  /** The thin progress line under it, or null. */
  progress: { pct: number; label: string } | null;
  allDone: boolean;
  /** Today's points goal and streak (null when Study is closed for this account). */
  goal: { points: number; goal: number; streak: number } | null;
  upNext: UpNextRow[];
  strengths: Strengths | null;
  courses: CourseSummary[];
  unreadNotifications: number;
  supportWhatsapp: string;
  /** Today's three quests (the Today line opens them), or null when Study is closed or quests are not set up. */
  quests?: QuestCard | null;
};

export type Quest = { id: string; label: string; done: boolean; /** "1 of 3", or null. */ progress: string | null; target: AppTarget };
/** Points: `xpEach` per quest done, `xpBonus` once all are done. `spareBonus` is the spare-hint reward the website names. */
export type QuestCard = { done: boolean; xpEach: number; xpBonus: number; spareBonus: number; quests: Quest[] };

// ---------------------------------------------------------------------------
// Courses and lectures
// ---------------------------------------------------------------------------

export type LessonState = "next" | "done" | "started" | "open" | "live" | "later";
export type WeekStatus = "complete" | "in-progress" | "upcoming" | "not-started";

export type CourseSummary = {
  id: string;
  title: string;
  completedCount: number;
  totalLessons: number;
  started: boolean;
  next: { title: string; week: number; kind: "lesson" | "assignment"; number: number | null; midway: boolean; target: AppTarget } | null;
};

/** GET /courses */
export type CourseList = { courses: CourseSummary[] };

export type CourseLesson = {
  id: string;
  title: string;
  /** Lecture number across the course, from 1. */
  number: number;
  state: LessonState;
  /** False for "live" (not open yet) and "later" (a future week). */
  openable: boolean;
  hasVideo: boolean;
  cohorts?: { id: string; name: string }[];
};

export type CourseWeek = {
  num: number;
  status: WeekStatus;
  isCurrent: boolean;
  isFuture: boolean;
  done: number;
  total: number;
  lessons: CourseLesson[];
  materials: { id: string; title: string; meta: string; openable: boolean }[];
  assignments: { id: string; lessonId: string | null; title: string; lessonTitle: string; status: "not_started" | "submitted" | "graded"; isNext: boolean; openable: boolean }[];
};

/** GET /courses/:courseId */
export type CourseDetail = CourseSummary & {
  weeks: CourseWeek[];
  empty: boolean;
  myCohorts: { id: string; name: string }[];
};

export type MaterialKind = "pdf" | "audio" | "image" | "video" | "doc" | "link" | string;

export type Material = {
  id: string;
  title: string;
  kind: MaterialKind;
  /** File extension without the dot, when it is a file. */
  format: string | null;
  sizeBytes: number | null;
  lessonId: string | null;
  /** The course it belongs to, for its page on the website (/courses/<courseId>/materials/<id>). */
  courseId: string | null;
  week: number | null;
  /** For kind "link": the outside address. */
  url: string | null;
  /** For files: GET this path with the bearer token to stream the file. */
  filePath: string | null;
};

export type SubmissionStatus = "pending_review" | "returned" | "approved";

export type SubmissionFile = {
  id: string;
  name: string;
  format: string | null;
  sizeBytes: number | null;
  status: "ready" | "failed" | string;
  /** GET this with the bearer token: it answers a `SubmissionFileLink`. */
  filePath: string;
};

/** GET /submissions/files/:fileId: a short-lived address of the file (15 minutes). */
export type SubmissionFileLink = { url: string; expiresIn: number };

export type Submission = {
  id: string;
  status: SubmissionStatus;
  submittedAt: string | null;
  isLate: boolean;
  text: string | null;
  note: string | null;
  hasAudio: boolean;
  files: SubmissionFile[];
  score: number | null;
  feedback: string | null;
  /** False once graded: the student can no longer change it. */
  editable: boolean;
};

export type Assignment = {
  id: string;
  lessonId: string;
  courseId: string;
  title: string;
  /** Plain text. */
  instructions: string | null;
  submissionType: "text" | "file" | "audio" | string;
  dueAt: string | null;
  /** False: nothing can be handed in after `dueAt`. */
  allowLate: boolean;
  maxFiles: number;
  maxFileMb: number;
  /** Format groups the admin allows ("pdf", "docx", "image"...). Empty means the default set. */
  acceptedFormats: string[];
  submission: Submission | null;
};

/** GET /lectures/:lessonId */
export type LectureDetail = {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  /** Plain text description (the website's "About this lecture"). */
  description: string | null;
  week: number;
  number: number | null;
  hasVideo: boolean;
  /** Seconds, when the server knows the length. */
  durationSeconds: number | null;
  progress: { watchedSeconds: number; completed: boolean };
  /** A lecture that needs its assignment handed in before "Complete and continue". */
  requiresAssignment: boolean;
  assignment: Assignment | null;
  materials: Material[];
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
};

/** POST /lectures/:lessonId/progress (also possible through POST /save, kind "progress"). */
export type ProgressPingBody = { watchedSeconds: number; durationSeconds: number };
export type ProgressPingResult = { saved: true; /** True the first time the lecture crosses the watched line. */ completed: boolean };

/** POST /lectures/:lessonId/complete */
export type CompleteLectureResult = { completed: true; next: { id: string; title: string } | null };

// ---------------------------------------------------------------------------
// The save outbox (same shapes as the website's /api/save)
// ---------------------------------------------------------------------------

export type SaveKind = "progress" | "complete" | "learn" | "history" | "events";

export type SaveItem =
  | { id: string; kind: "progress"; payload: { lessonId: string; watched: number; duration: number } }
  | { id: string; kind: "complete"; payload: { lessonId: string } }
  | { id: string; kind: "learn"; payload: { state: LearnState } }
  | { id: string; kind: "history"; payload: { tool: string; answers: { item: string; correct: boolean | null }[] } }
  | { id: string; kind: "events"; payload: Record<string, unknown> };

/** POST /save: up to 25 items, 256 KB. Keep an item until its status is "ok" or "drop". */
export type SaveBody = { items: SaveItem[] };
export type SaveResult = { results: { id: string; status: "ok" | "retry" | "drop"; data?: { completed?: boolean; clamped?: boolean } }[] };

// ---------------------------------------------------------------------------
// Video
// ---------------------------------------------------------------------------

/** POST /lectures/:lessonId/stream */
export type StreamAccessBody = {
  /** The app's root or jailbreak check. `true` is refused (video_refused) when the server rule is on. */
  deviceCompromised?: boolean;
  /**
   * Default true: the player must send the X-App-Device-Id header on every
   * video request (playlist, key, chunks). Send false only if the player
   * cannot add headers to key or chunk requests.
   */
  bindHeader?: boolean;
};

export type StreamAccess = {
  /** Absolute address of the HLS master playlist (or the MP4), token included. Give it to the player as is. */
  url: string;
  mediaType: "hls" | "mp4";
  /** Headers the player must send on every request for this stream. */
  headers: Record<string, string>;
  /** Seconds the address keeps working. Ask again before it runs out (or when playback fails with 401). */
  expiresIn: number;
  expiresAt: string;
  resumeSeconds: number;
  durationSeconds: number | null;
  watermark: Watermark;
  /** Seconds between progress saves while playing. */
  progressEverySeconds: number;
};

// ---------------------------------------------------------------------------
// Assignments
// ---------------------------------------------------------------------------

/** GET /assignments (paged). Every published assignment the student can see. */
export type AssignmentRow = {
  id: string;
  lessonId: string;
  courseId: string;
  title: string;
  lessonTitle: string;
  week: number;
  dueAt: string | null;
  status: "not_started" | "submitted" | "graded";
  score: number | null;
};

/** POST /assignments/:id/text */
export type SubmitTextBody = { text: string };
/** POST /assignments/:id/uploads: ask for a place to upload one file. */
export type PrepareUploadBody = { fileName: string };
export type PrepareUploadResult = {
  /** Keep this and send it back in SubmitFilesBody. */
  path: string;
  /** PUT the raw file bytes here (not multipart), with `headers`. Works once, for this path. */
  uploadUrl: string;
  /** Header the upload needs. */
  headers: Record<string, string>;
};
/** POST /assignments/:id/files */
export type SubmitFilesBody = { note?: string; files: { path: string; name: string }[] };
/** POST /assignments/:id/audio */
export type SubmitAudioBody = { path: string };
export type SubmitResult = { submission: Submission };
/** DELETE /assignments/:id/submission */
export type UnsubmitResult = { removed: true };

// ---------------------------------------------------------------------------
// Study content: blocks, widgets, figures (structured JSON, never HTML)
// ---------------------------------------------------------------------------

/** Text with a tiny inline markup: **bold**, *italic*, `term`. Nothing else. */
export type Inline = string;

export type ListItem = { text: Inline; children?: ListItem[] };

export type BoxKind = "define" | "word" | "trap" | "mnemonic" | "example" | "sounds" | "analogy" | "note" | "safety";

export type Mcq = { q: Inline; options: Inline[]; answer: number; why?: Inline };
export type Card = { q: Inline; a: Inline };

export type Level = "starting" | "beginner" | "advanced";

export type Block =
  | { t: "h3"; text: Inline }
  | { t: "p"; text: Inline }
  | { t: "ul"; items: ListItem[] }
  | { t: "ol"; items: ListItem[] }
  | { t: "table"; head: Inline[]; rows: Inline[][] }
  | { t: "box"; kind: BoxKind; title?: Inline; blocks: Block[] }
  | { t: "recall"; items: Card[] }
  | { t: "mcq"; items: Mcq[] }
  | { t: "viva"; items: Card[] }
  /** Shown only in one reading view (the Student / Clinician switch). */
  | { t: "view"; view: "student" | "clinician"; blocks: Block[] }
  /** An interactive piece. `v` is the version of this kind's data shape. */
  | WidgetBlock
  /** A question with a fully developed answer. */
  | { t: "qa"; q: Inline; level?: Level; blocks: Block[] };

export type WidgetKind =
  | "guess" | "decide" | "sort" | "build" | "moodline" | "worked" | "synapse" | "reveal" | "flow" | "curve" | "layers" | "brainmap"
  | "journey" | "neuron" | "pathways" | "receptor" | "conditioning" | "memoryflow" | "stress" | "timeline" | "compare" | "attention"
  | "dissonance" | "conservation" | "experiment" | "release" | "thoughtrecord" | "hypnogram" | "strange" | "illusion" | "nervoussystem"
  | "brainexplorer" | "actionpotential" | "synapse3d" | "genogram" | "hpaloop" | "brainslicer" | "amesroom" | "figure";

export type GuessData = { prompt: Inline; min: number; max: number; step?: number; unit: string; answer: [number, number]; reveal: Inline; clinician?: Inline };
export type DecideData = { scene: Inline; ask: Inline; choices: { label: Inline; verdict: "best" | "ok" | "harm"; outcome: Inline; why: Inline }[] };
export type SortData = { prompt: Inline; buckets: Inline[]; items: { text: Inline; bucket: number; why?: Inline }[] };
export type BuildData = { vignette: Inline; rule: Inline; symptoms: { label: Inline; present: boolean; core?: boolean; why?: Inline }[]; need: number; needCore: boolean; verdict: Inline };
export type MoodlineData = { prompt: Inline; series: number[]; labels?: string[]; options: Inline[]; answer: number; why: Inline };
export type WorkedData = { title: Inline; steps: { q: Inline; a: Inline }[]; yourTurn?: { q: Inline; a: Inline }[] };
export type SynapseData = { drug: "ssri" | "snri" | "maoi" | "none"; caption?: Inline };
export type RevealData = { prompt: Inline; answer: Inline };
export type FlowData = { title?: Inline; layout: "chain" | "cycle" | "tree"; nodes: { id: string; label: Inline; detail?: Inline; parent?: string }[]; edgeLabels?: Record<string, Inline>; caption?: Inline };
export type CurveData = { kind: "normal" | "sdt" | "forgetting" | "inverted-u" | "dose-response" | "half-life"; title?: Inline; caption?: Inline };
export type LayersData = { title?: Inline; shape: "pyramid" | "rings" | "stack" | "iceberg"; layers: { label: Inline; detail: Inline }[]; caption?: Inline };
export type BrainMapData = { title?: Inline; focus?: string[]; notes?: Record<string, Inline>; caption?: Inline };
export type JourneyData = { drug: string; target: string; route?: "oral" | "iv" | "nasal" | "depot"; routes?: ("oral" | "iv" | "nasal" | "depot")[]; notes?: Record<string, Inline>; title?: Inline; caption?: Inline };
export type NeuronData = { title?: Inline; myelinated?: boolean; caption?: Inline };
export type PathwaysData = { system: "dopamine"; title?: Inline; caption?: Inline };
export type ReceptorData = { receptor?: string; title?: Inline; caption?: Inline };
export type ConditioningData = { kind: "classical" | "operant"; title?: Inline; caption?: Inline };
export type MemoryFlowData = { title?: Inline; caption?: Inline };
export type StressData = { title?: Inline; caption?: Inline };
export type TimelineData = { prompt: Inline; events: { label: Inline; when?: string }[]; why?: Inline };
export type CompareData = { title?: Inline; a: { label: Inline; points: Inline[]; summary: Inline }; b: { label: Inline; points: Inline[]; summary: Inline }; caption?: Inline };
export type AttentionData = { title?: Inline; caption?: Inline };
export type DissonanceData = { belief?: Inline; behaviour?: Inline; title?: Inline; caption?: Inline };
export type ConservationData = { kind?: "liquid" | "number"; title?: Inline; caption?: Inline };
export type ExperimentData = { title: Inline; question: Inline; unit: string; conditions: { label: Inline; value: number; note?: Inline }[]; why?: Inline; max?: number };
export type ReleaseData = { transmitter?: string; title?: Inline; caption?: Inline };
export type ThoughtRecordData = { situation: Inline; thought: Inline; emotion: string; traps: { label: Inline; right?: boolean; why: Inline }[]; forEvidence: Inline[]; againstEvidence: Inline[]; balanced: Inline };
export type HypnogramData = { title?: Inline; caption?: Inline };
export type StrangeData = { title?: Inline; caption?: Inline };
export type IllusionData = { kind: "muller-lyer" | "ponzo" | "ebbinghaus" | "figure-ground"; title?: Inline; caption?: Inline };
export type NervousSystemData = { title?: Inline; caption?: Inline; start?: "signal" | "auto" | "map" };
export type BrainExplorerData = { title?: Inline; caption?: Inline; focus?: string[] };
export type ActionPotentialData = { title?: Inline; caption?: Inline; myelinated?: boolean };
export type Synapse3dData = { title?: Inline; caption?: Inline; transmitter?: string };
export type GenogramData = { title?: Inline; caption?: Inline; condition?: string; start?: "example" | "blank" };
export type HpaLoopData = { title?: Inline; caption?: Inline; start?: "day" | "chronic" };
export type BrainSlicerData = { title?: Inline; caption?: Inline; start?: "slice" | "tms" | "ect" };
export type AmesRoomData = { title?: Inline; caption?: Inline };
/** `id` names a figure of the figure library: fetch it with GET /study/figures/:id. */
export type FigureData = { id: string; title?: string; caption?: string; focus?: string[]; quiz?: boolean };

/** Each widget kind with its data type. */
export type WidgetDataByKind = {
  guess: GuessData; decide: DecideData; sort: SortData; build: BuildData; moodline: MoodlineData; worked: WorkedData; synapse: SynapseData;
  reveal: RevealData; flow: FlowData; curve: CurveData; layers: LayersData; brainmap: BrainMapData; journey: JourneyData; neuron: NeuronData;
  pathways: PathwaysData; receptor: ReceptorData; conditioning: ConditioningData; memoryflow: MemoryFlowData; stress: StressData;
  timeline: TimelineData; compare: CompareData; attention: AttentionData; dissonance: DissonanceData; conservation: ConservationData;
  experiment: ExperimentData; release: ReleaseData; thoughtrecord: ThoughtRecordData; hypnogram: HypnogramData; strange: StrangeData;
  illusion: IllusionData; nervoussystem: NervousSystemData; brainexplorer: BrainExplorerData; actionpotential: ActionPotentialData;
  synapse3d: Synapse3dData; genogram: GenogramData; hpaloop: HpaLoopData; brainslicer: BrainSlicerData; amesroom: AmesRoomData; figure: FigureData;
};

export type WidgetBlock = { [K in WidgetKind]: { t: "widget"; kind: K; v: 1; data: WidgetDataByKind[K] } }[WidgetKind];

/** One labelled point of a figure. x and y are inside the viewBox. */
export type FigureLabel = { id: string; name: string; x: number; y: number; about: string };

/** GET /study/figures/:id: a labelled drawing as data. */
export type Figure = {
  v: 1;
  id: string;
  title: string;
  summary: string;
  /** "minX minY width height". */
  viewBox: string;
  labels: FigureLabel[];
  /**
   * The drawing as standalone SVG documents (colours already resolved, no CSS
   * needed), for react-native-svg. Shapes carry data-part="<label id>" and
   * lines data-line="<label id>" so the app can light up the tapped part.
   */
  svg: { light: string; dark: string };
};

// ---------------------------------------------------------------------------
// Study: modules, sections, state, checkpoints, tests, notes
// ---------------------------------------------------------------------------

export type StudyActivity = { id: string; title: string; why: string; kind: "coach" | "lesson" | "detective" | "scenarios" | "terms" | "consult" | "notes"; target: AppTarget };

export type ModuleStatus = {
  readDone: number;
  readTotal: number;
  written: boolean;
  actsDone: number;
  actsTotal: number;
  tested: boolean;
  best: number | null;
  total: number | null;
  pct: number;
  complete: boolean;
  seconds: number;
};

export type StudyNext =
  | { kind: "read" | "test" | "retest"; moduleId: string; sectionId: string; label: string; due?: string; target: AppTarget }
  | { kind: "checkpoint" | "write"; moduleId: string; label: string; target: AppTarget }
  | { kind: "practise"; moduleId: string; activityId: string; label: string; target: AppTarget }
  | { kind: "done"; label: string; target: AppTarget };

export type ModuleSummary = {
  id: string;
  num: number;
  title: string;
  emoji: string;
  tagline: string;
  when: string;
  minutes: number;
  status: ModuleStatus;
};

/** GET /study/modules */
export type StudyHome = {
  modules: ModuleSummary[];
  next: StudyNext;
  goal: { points: number; goal: number; streak: number };
  courseMinutes: number;
};

export type SectionToc = {
  id: string;
  num: string;
  title: string;
  part: string | null;
  tag: "core" | "extra" | null;
  level: Level | null;
  levelCheck: Level | null;
  isTest: boolean;
  words: number;
  /** Day (YYYY-MM-DD, India) the student finished it, or null. */
  doneOn: string | null;
};

export type CheckpointStatus = "early" | "waiting" | "ready" | "done";
export type CheckpointSummary = { n: number; key: string; title: string; sectionIds: string[]; status: CheckpointStatus; best: number | null; total: number | null };

/** GET /study/modules/:moduleId */
export type ModuleDetail = ModuleSummary & {
  outcomes: string[];
  writeTask: string;
  noteId: string | null;
  activities: (StudyActivity & { doneOn: string | null })[];
  sections: SectionToc[];
  checkpoints: CheckpointSummary[];
  next: StudyNext;
  nextModule: { id: string; num: number; title: string } | null;
  /** Day the next re-test is due, or null. */
  retestDue: string | null;
};

/** A short part of a section (the reader shows one at a time). */
export type SectionChunk = { title: string; words: number; blocks: Block[] };

/**
 * A question of a server-graded test. No answer is sent. `key` is what the
 * app sends back with the pick.
 */
export type TestQuestion = { key: string; q: Inline; options: Inline[] };

/** GET /study/modules/:moduleId/sections/:sectionId */
export type SectionContent = {
  contentSchemaVersion: number;
  moduleId: string;
  moduleNum: number;
  moduleTitle: string;
  section: SectionToc;
  chunks: SectionChunk[];
  /** Say-it-out-loud cards, shown after the reading. */
  recall: Card[];
  viva: Card[];
  /** Practice questions with answers (not a test). Empty for the module test. */
  mcq: Mcq[];
  /** Only for the module test section: questions without answers; submit to POST /study/modules/:id/test. */
  test: { questions: TestQuestion[] } | null;
  prev: { sectionId: string; title: string } | null;
  next: { sectionId: string; title: string } | null;
  /** Checkpoints of this module, to offer one when finishing this section opens it. */
  checkpoints: { n: number; key: string; sectionIds: string[]; later: string[] }[];
};

/** The student's whole learn record (one JSON document). Unknown fields must be sent back untouched. */
export type LearnState = {
  v: 1;
  xp: number;
  streak: { count: number; best: number; lastDay: string | null; freezes: number };
  daily: { day: string | null; xp: number; goalHit: boolean };
  dailyGoal: number;
  lessons: Record<string, { stars: 0 | 1 | 2 | 3; best: number; plays: number }>;
  srs: Record<string, { box: number; due: string }>;
  badges: string[];
  bestCombo: number;
  answered: number;
  correct: number;
  chests: number;
  blitzBest: number;
  coach: { concepts: Record<string, unknown>; confusions: Record<string, number> };
  history: Record<string, number>;
  detectiveBest: number;
  notesRead: Record<string, string>;
  study: StudyProgress;
  lab: Record<string, unknown>;
};

export type StudyProgress = {
  /** "module/section" to the day it was finished. */
  done: Record<string, string>;
  secs: Record<string, number>;
  tests: Record<string, { best: number; total: number; day: string; tries: number; days?: number }>;
  written: Record<string, string>;
  acts: Record<string, Record<string, string>>;
  last: { module: string; section: string } | null;
};

/** GET /study/state */
export type LearnStateResult = { state: LearnState; /** India date today, YYYY-MM-DD: use it for every "day" written into the state. */ today: string };

/** PUT /study/state: send the app's copy; the server merges it with the stored copy and answers the result. */
export type SaveLearnStateBody = { state: LearnState };
export type SaveLearnStateResult = {
  /** The merged, stored state. Replace the app's copy with it. */
  state: LearnState;
  /** True when the server cut down points it did not believe. */
  clamped: boolean;
};

/** GET /study/modules/:moduleId/checkpoints/:n */
export type CheckpointContent = {
  n: number;
  key: string;
  title: string;
  status: CheckpointStatus;
  /** This sitting's questions (never-seen first, then missed; none already right). Answers are not sent. */
  questions: TestQuestion[];
  /** Recall cards for the same sections. */
  recall: Card[];
  /** How many of the checkpoint's questions are right now, out of all. */
  known: { right: number; total: number };
};

/** POST /study/modules/:moduleId/checkpoints/:n/answers and POST /study/modules/:moduleId/test */
export type SubmitPicksBody = { /** question key to the chosen option index. */ picks: Record<string, number> };

export type QuestionReview = { key: string; picked: number | null; answer: number; correct: boolean; why: Inline | null };

export type CheckpointResult = {
  /** This sitting. */
  right: number;
  asked: number;
  /** Across the whole checkpoint after this sitting. */
  known: { right: number; total: number };
  review: QuestionReview[];
  state: LearnState;
};

export type ModuleTestResult = {
  right: number;
  total: number;
  best: number;
  tries: number;
  review: QuestionReview[];
  state: LearnState;
};

/** Bookmarks and personal notes, keyed "moduleId/sectionId". `at` is epoch milliseconds. */
export type Marks = {
  v: 1;
  bookmarks: Record<string, { on: boolean; at: number }>;
  notes: Record<string, { text: string; at: number }>;
};

/** GET /study/marks */
export type MarksResult = { marks: Marks; /** False until the notes database step is run: keep marks on the phone only. */ synced: boolean };
/** PUT /study/marks: send only what changed. */
export type SaveMarksBody = { changes: Marks };
export type SaveMarksResult = { marks: Marks; synced: boolean };

export type RevisionNoteBullet = string | [student: string, clinician: string];
export type RevisionNoteSummary = { id: string; block: number; blockTitle: string; title: string; emoji: string; tagline: string; readOn: string | null };
/** GET /study/notes */
export type RevisionNoteList = { blocks: string[]; notes: RevisionNoteSummary[] };
/** GET /study/notes/:noteId */
export type RevisionNote = RevisionNoteSummary & {
  tldr: RevisionNoteBullet;
  sections: { title: string; tone?: "lime" | "blue" | "ink" | "white"; style?: "list" | "chips" | "steps" | "alert"; points: RevisionNoteBullet[] }[];
  terms: [lay: string, clinical: string][];
  figures: { id: string; focus?: string[]; quiz?: boolean; caption?: string }[];
};

// ---------------------------------------------------------------------------
// Notifications and push
// ---------------------------------------------------------------------------

export type NotificationRow = {
  id: string;
  type: "message" | "nudge" | "achievement" | "certificate" | string;
  title: string;
  /** Plain text, up to 500 characters. */
  body: string;
  createdAt: string;
  readAt: string | null;
  target: AppTarget;
};

/** GET /notifications (paged) */
export type NotificationList = Page<NotificationRow> & { unread: number };

/** GET /notifications/:id (marks it read) */
export type NotificationDetail = NotificationRow & {
  /** "From the VIBHA team", or the batchmate who answered a doubt. */
  from: string;
  /** The message as blocks (paragraphs, lists, links), never HTML. */
  content: MessageBlock[];
  /** Links found in the message, in order. */
  links: { label: string; target: AppTarget | null; url: string | null }[];
};

export type MessageBlock =
  | { t: "p"; spans: MessageSpan[] }
  | { t: "h"; spans: MessageSpan[] }
  | { t: "ul" | "ol"; items: MessageSpan[][] };
export type MessageSpan = { text: string; bold?: boolean; italic?: boolean; link?: { target: AppTarget | null; url: string | null } };

/** POST /notifications/read-all */
export type ReadAllResult = { unread: 0 };

/** GET /notifications/preferences, PUT the same shape (any subset). */
export type NotificationPrefs = {
  /** Master switch for push on this account. */
  push: boolean;
  messages: boolean;
  doubtReplies: boolean;
  achievements: boolean;
  /** A daily study reminder made on the phone (local notification). */
  studyReminder: boolean;
  /** "HH:MM" India time. */
  studyReminderTime: string;
  /** False until the app database step is run: preferences are then kept on the phone only. */
  synced: boolean;
  /** Clinic reminders, each on or off (missing from older servers: all on). */
  reminders?: ReminderPrefs;
};

/** Smart reminders a student can turn off one by one (Settings, app and website). */
export type ReminderPrefs = {
  /** Morning of an OPD day: "OPD today, evening 5 to 8". */
  opdDay: boolean;
  /** 30 minutes before a session they must attend. */
  sessionSoon: boolean;
  /** Scanned in but not out, shortly after the session ends. */
  scanOut: boolean;
  /** The evening after an OPD visit with no case log. */
  caseLog: boolean;
  /** When leaves left drop to 1. */
  leaveLow: boolean;
};

/** The `data` object of every push the server sends. */
export type PushData = { notificationId: string; type: string; target: AppTarget };

// ---------------------------------------------------------------------------
// Doubts
// ---------------------------------------------------------------------------

export type DoubtRow = {
  id: string;
  title: string;
  topic: string | null;
  kind: "doubt" | "complaint";
  status: "open" | "solved" | "hidden";
  cohortId: string | null;
  author: string;
  mine: boolean;
  replies: number;
  /** Who answered last: the VIBHA team ("faculty") or a student; null with no answers. Missing on older servers. */
  lastReplyBy?: "student" | "faculty" | null;
  createdAt: string;
};

/** GET /doubts?cohort=&mine=1 (paged) */
export type DoubtList = Page<DoubtRow> & { cohorts: { id: string; name: string }[]; ready: boolean; /** The class wall is open for you (the website links it from Doubts). Missing on older servers. */ wall?: boolean };

export type DoubtReply = { id: string; author: string; mine: boolean; body: string; votes: number; youVoted: boolean; isSolution: boolean; createdAt: string };

/** GET /doubts/:id */
export type DoubtThread = Omit<DoubtRow, "replies"> & { body: string; replies: DoubtReply[] };

/** POST /doubts */
export type AskDoubtBody = { title: string; body: string; topic?: string; cohortId?: string | null; markAs?: "doubt" | "complaint" };
export type AskDoubtResult = { id: string };
/** POST /doubts/:id/replies */
export type ReplyBody = { body: string };
/** POST /doubts/:id/replies/:replyId/vote */
export type VoteBody = { on: boolean };
/** POST /doubts/:id/solved */
export type SolvedBody = { replyId: string | null };
export type DoubtActionResult = { thread: DoubtThread };

// ---------------------------------------------------------------------------
// Progress, achievements, certificates, settings
// ---------------------------------------------------------------------------

export type TopicScore = {
  id: string;
  title: string;
  kind: "topic" | "subject" | "skill";
  /** Chance of a right answer on a medium question, 0 to 1. */
  p: number;
  n: number;
  studyTarget: AppTarget | null;
  practiceTarget: AppTarget;
};

export type Strengths = { strongest: TopicScore[]; weakest: TopicScore[]; all: TopicScore[]; hasData: boolean };

/** GET /progress */
export type Progress = {
  lectures: { courseId: string; title: string; completed: number; total: number }[];
  study: { modulesDone: number; modulesTotal: number; sectionsDone: number; sectionsTotal: number; seconds: number; xp: number; streak: number; bestStreak: number } | null;
  /** Points per day for the last 14 days, oldest first. */
  days: { day: string; xp: number }[];
  strengths: Strengths | null;
};

export type Credential = {
  credentialId: string;
  type: "badge" | "certificate";
  status: "draft" | "approved" | "issued" | "revoked";
  title: string;
  description: string | null;
  icon: string | null;
  tone: string;
  issuedAt: string | null;
  revokedAt: string | null;
  revokeReason: string | null;
  kind: string | null;
  expiresAt: string | null;
  /** Public page that proves the certificate (certificates only). */
  verifyUrl: string | null;
};

export type BadgeProgress = { id: string; type: "badge" | "certificate"; title: string; description: string | null; icon: string | null; tone: string; earned: boolean; status: string; progress: string };

/** GET /achievements */
export type Achievements = { earned: Credential[]; progress: BadgeProgress[] };

/** GET /journey: My journey, the website's /journey numbers. `levelPct` is 0 to 1; `points` and `rank` are null off the leaderboard. */
export type JourneyStat = { key: "online" | "lectures" | "finished" | "streak" | "points" | "practice"; label: string; value: string; sub?: string };
export type Journey = { level: number; title: string; levelPct: number; points: number | null; rank: number | null; streak: number; stats: JourneyStat[] };

/** GET /achievements/:credentialId/pdf: a short-lived address of the PDF. */
export type CertificatePdfLink = { url: string; expiresIn: number };

/** GET /settings */
export type Settings = {
  account: { email: string | null; name: string | null; roleLabel: string; rollNumber: string | null; mobileNumber: string | null };
  device: DeviceState;
  notifications: NotificationPrefs;
  support: { whatsapp: string; email: string };
  legal: { termsUrl: string; privacyUrl: string };
  app: { minSupportedVersion: string; latestVersion: string };
};

// ---------------------------------------------------------------------------
// Learning map (/study/map) and class wall (/wall)
// ---------------------------------------------------------------------------

/** How well a skill is known. `label` words come with each answer (MapState.label). */
export type MapStateKey = "new" | "learning" | "shaky" | "mastered" | "decaying";
export type MapState = { key: MapStateKey; label: string };
export type MapCell = { skill: string; label: string; state: MapStateKey; hasItems: boolean; /** Chance of a right answer, 0 to 1, once calibrated; else null. */ p: number | null };
export type MapTopic = { id: string; title: string; studyTarget: AppTarget | null; cells: MapCell[] };
export type MapWeak = { skill: string; topic: string; label: string; state: MapStateKey; studyTarget: AppTarget | null };
export type MapMixUp = { a: string; b: string; n: number; topic: string | null; topicTitle: string | null };

/** GET /study/map: the website's /study/map (loadStudentMap). Staff accounts get `learner: false` and an empty map. */
export type StudyMap = {
  learner: boolean;
  /** Reviews due, mixed into the next practice round. */
  due: number;
  calibrated: boolean;
  /** Answers still needed before chances show (0 once calibrated). */
  answersToCalibrate: number;
  states: MapState[];
  /** Column names, in the order of each topic's cells. */
  skills: string[];
  weak: MapWeak[];
  mixUps: MapMixUp[];
  topics: MapTopic[];
};

export type MapQuestion =
  | { id: string; kind: "mcq"; topic: string; label: string; text: string; vignette?: string; options: string[]; answer: number; student: string; clinician: string }
  | { id: string; kind: "tf"; topic: string; label: string; text: string; answer: boolean; student: string; clinician: string };
/** GET /study/map/practice?topic= : a round picked for this student (the website's /study/map/practice). Without a topic it is mixed practice. */
export type MapPractice = { title: string; topic: string | null; round: string; saving: boolean; questions: MapQuestion[] };
/** POST /study/map/practice/answers : one answer, graded on the server and fed to the map. */
export type MapAnswerBody = { item: string; choice: number | boolean | "skip"; ms?: number };
export type MapAnswerResult = { ok: boolean; saved: boolean };

export type WallReactionKey = "heart" | "insight" | "question" | "applause" | "worry";
/** Authors are never sent: posts are "Faculty", "Anonymous" or "Cohort member". `mine` is the reactions you gave. */
export type WallReplyItem = { id: string; content: string; isAnonymous: boolean; isFaculty: boolean; createdAt: string; reactions: Partial<Record<WallReactionKey, number>>; mine: WallReactionKey[] };
export type WallPostItem = WallReplyItem & { isPinned: boolean; replies: WallReplyItem[] };
/** GET /wall: the newest 50 posts, pinned first. */
export type WallFeed = { posts: WallPostItem[] };
/** POST /wall/posts and POST /wall/posts/:postId/replies */
export type WallWriteBody = { content: string; isAnonymous?: boolean };
export type WallWriteResult = { id: string };
/** POST /wall/reactions : the same reaction again takes it back. */
export type WallReactBody = { postId?: string; replyId?: string; reaction: WallReactionKey };
export type WallReactResult = { added: boolean };
/** POST /wall/reports */
export type WallReportBody = { postId?: string; replyId?: string; reason?: string };

// ---------------------------------------------------------------------------
// Practise and Library
// (Current types for these routes: contract-practise-admin.ts. These stay for
// the routes' first version, which still answers with these fields.)
// ---------------------------------------------------------------------------

/**
 * POST /play/:game/:action { args } answers this. `kind` is "<game>.<action>"
 * and `data` is the website action's own answer for that kind (see the table
 * in docs/app/API_CONTRACT.md, section 2.12, for each kind's data type and
 * where it is defined). `v` is the version of that data shape.
 */
export type PlayBody = { args: unknown[] };
export type PlayResult<T = unknown> = { kind: string; v: 1; data: T };

/** GET /library/medicines */
export type MedicineRow = { id: string; name: string; cls: string; group: string; brands: string[]; uses: string[]; line: string; dose: string };
export type MedicineList = { v: 1; groups: string[]; rows: MedicineRow[] };

/**
 * GET /library/medicines/:medId. `med`, `mechanism`, `visuals` and `halfLife`
 * are the website's own objects (types `Med` in src/lib/meds/types.ts,
 * `mechanismOf`, `medVisuals` and `halfLifeOf` in src/lib/meds); copy those
 * types into the app with this file.
 */
export type MedicinePage = {
  v: 1;
  med: Record<string, unknown> & { id: string; name: string; cls: string; group: string };
  related: { id: string; name: string; cls: string }[];
  mechanism: Record<string, unknown> | null;
  visuals: Record<string, unknown>[] | null;
  halfLife: Record<string, unknown> | null;
  study: { moduleId: string; title: string; target: AppTarget } | null;
};

// ---------------------------------------------------------------------------
// Admin (admin and view admin read; only the super admin writes)
// (Current types for these routes: contract-practise-admin.ts.)
// ---------------------------------------------------------------------------

export type AttentionFlag = "login" | "no-mobile" | "quiet" | "never-seen" | "behind" | "email-failing" | "no-details";

/** One row of the Students table (the website's roster row). */
export type AdminStudentRow = {
  id: string;
  name: string;
  email: string;
  rollNumber: string | null;
  mobileNumber: string | null;
  scope: Scope;
  blocked: boolean;
  expiresAt: string | null;
  /** "locked" | "expired" | "active" | the invite states of src/lib/people/account-status.ts */
  account: string;
  presence: "now" | "today" | "week" | "quiet" | "never";
  lastSeen: string | null;
  cohorts: { id: string; name: string }[];
  minutes7: number;
  activeDays30: number;
  lecturesDone: number;
  lecturesAvailable: number;
  xp: number;
  flags: AttentionFlag[];
};

/** GET /admin/home */
export type AdminHome = {
  v: 1;
  counts: { students: number; activeThisWeek: number; onNow: number; needsLook: number; locked: number; openComplaints: number };
  /** Students that need a look, most flags first (at most 20). */
  needsLook: AdminStudentRow[];
  live: { userId: string; name: string | null; where: string; lessonId: string | null; since: string; watching: boolean }[];
};

/** GET /admin/students?search=&cohort=&flag= (paged) */
export type AdminStudentList = Page<AdminStudentRow> & { total: number; cohorts: { id: string; name: string }[] };

/**
 * GET /admin/students/:id. `detail` is the website's loadStudentDetail answer
 * (src/lib/analytics/activity.ts): visits, lectures and study for 30 days.
 */
export type AdminStudentProfile = { row: AdminStudentRow | null; detail: Record<string, unknown> | null };

/** POST /admin/students/:id/lock */
export type LockBody = { reason?: string };
export type LockResult = { blocked: boolean };

/** POST /admin/messages: a bell notice (and push) to students, optional email. */
export type SendMessageBody = { userIds: string[]; title: string; /** Plain text; paragraphs split by blank lines. */ text: string; alsoEmail?: boolean };
export type SendMessageResult = { created: number; emailed: number; emailFailed: number; batchId: string | null };
/** GET /admin/messages: recent sends with how many opened them. */
export type MessageBatches = { batches: { batchId: string; title: string; sentAt: string; total: number; opened: number; type: string }[]; ready: boolean };

/** POST /admin/doubts/:id/hide */
export type HideBody = { hidden: boolean };

/* =====================================================================
 * Clinic: schedule, QR attendance, leave, OPD cases (docs/app/API_CONTRACT_CLINIC.md)
 * Dates are "YYYY-MM-DD" and times "HH:MM", clinic local time (India, UTC+05:30).
 * Instants (scan times, decisions) are ISO strings.
 * ===================================================================== */

export type ClinicKind = "opd_morning" | "opd_evening" | "class" | "online_class" | "early_class" | "other";
export type ClinicBatch = "morning" | "evening";
export type ClinicDirection = "in" | "out";

/** One student's place in a session. */
export type ClinicMyStatus =
  | "upcoming" // not started (or open and not scanned yet)
  | "in" // scanned in, not out yet
  | "present" // scanned in and out
  | "late" // scanned in after start + late minutes
  | "no_scan_out" // scanned in, session over, never scanned out (flagged, not invented)
  | "on_leave" // approved leave
  | "absent" // required, over, no scan, no leave
  | "cancelled"
  | "not_required"; // OPD day the student is not assigned to

export type ClinicSession = {
  id: string;
  cohortIds: string[];
  date: string;
  start: string;
  end: string;
  kind: ClinicKind;
  title: string;
  place: string | null;
  onlineLink: string | null;
  compulsory: boolean;
  status: "scheduled" | "cancelled";
  origin: "timetable" | "one_off";
  note: string | null;
  /** "2026-11-18 08:00" when the admin moved it. */
  movedFrom: string | null;
  /** OPD sessions only. */
  batch: ClinicBatch | null;
};

/** A session as one student sees it. */
export type ClinicMySession = ClinicSession & {
  /** Required for this student: compulsory classes, and OPD days they are assigned to. */
  required: boolean;
  /** OPD session on one of this student's published OPD days. */
  assigned: boolean;
  /** Scanning is accepted now (30 minutes before start to 60 minutes after end). */
  open: boolean;
  my: { status: ClinicMyStatus; inAt: string | null; outAt: string | null; late: boolean; minutes: number | null; leaveId: string | null; earlyLeaveAt: string | null };
};

export type ClinicDay = { date: string; note: string | null; sessions: ClinicMySession[] };

/** GET /clinic/today */
export type ClinicToday = {
  v: 1;
  date: string;
  cohortId: string | null;
  note: string | null;
  sessions: ClinicMySession[];
  /** Today is one of my OPD days. */
  opd: { batch: ClinicBatch; start: string | null; end: string | null; sessionId: string | null; assignmentId: string } | null;
  leavesLeft: number | null;
  /** Past OPD days with no case log yet. */
  logsDue: number;
};

/** GET /clinic/week?start=YYYY-MM-DD (start defaults to this Monday; 7 days). */
export type ClinicWeek = { v: 1; from: string; to: string; cohortId: string | null; days: ClinicDay[] };

/** POST /clinic/scan. Send `token` (from the QR) or `code` (6 characters). */
export type ClinicScanBody = { token?: string; code?: string; direction?: ClinicDirection };
export type ClinicScanResult = { sessionId: string; title: string; direction: ClinicDirection; at: string; late: boolean; minutes: number | null };

/** GET /clinic/attendance */
export type ClinicAttendanceSummary = {
  required: number;
  attended: number;
  late: number;
  onLeave: number;
  absent: number;
  noScanOut: number;
  /** Required sessions attended / (required - onLeave), 0 to 100; null when nothing is due yet. `attended` also counts sessions joined that were not required. */
  percent: number | null;
  minutes: number;
};
export type ClinicMyAttendance = { v: 1; cohortId: string | null; summary: ClinicAttendanceSummary; sessions: ClinicMySession[] };

export type ClinicLeaveStatus = "pending" | "approved" | "rejected" | "cancelled";
export type ClinicLeaveRequest = {
  id: string;
  userId: string;
  cohortId: string;
  kind: "leave" | "early" | "missed";
  sessions: { id: string; date: string; start: string; title: string }[];
  leaveAt: string | null;
  reason: string | null;
  status: ClinicLeaveStatus;
  overLimit: boolean;
  /** Sessions this request uses as leaves (early leave uses none). */
  cost: number;
  decidedAt: string | null;
  decisionNote: string | null;
  createdAt: string;
};
export type ClinicLeaveBalance = { allowance: number; used: number; pending: number; left: number };

/** GET /clinic/leave */
export type ClinicMyLeave = { v: 1; cohortId: string | null; balance: ClinicLeaveBalance; requests: ClinicLeaveRequest[] };
/** POST /clinic/leave */
export type ClinicLeaveBody = { sessionIds: string[]; reason: string };
/** POST /clinic/leave/early */
export type ClinicEarlyLeaveBody = { sessionId: string; leaveAt: string; reason: string };

export type ClinicQuota = { base: number; extras: { count: number; note: string | null; at: string }[]; total: number; done: number; pending: number };
export type ClinicVisit = {
  assignmentId: string;
  date: string;
  batch: ClinicBatch;
  start: string | null;
  end: string | null;
  sessionId: string | null;
  /** done: case log sent; due: past and no log yet; upcoming; missed: no scan and no leave (counts as a leave). */
  state: "upcoming" | "today" | "due" | "done" | "absent" | "missed" | "on_leave";
  log: { cases: number; absent: boolean; note: string | null } | null;
};

/** GET /clinic/opd */
export type ClinicMyOpd = {
  v: 1;
  cohortId: string | null;
  batch: ClinicBatch | null;
  /** The student picks once; after that only the admin changes it. */
  canChooseBatch: boolean;
  casesPerVisit: number;
  quota: ClinicQuota;
  visits: ClinicVisit[];
};
/** PUT /clinic/opd/batch */
export type ClinicBatchBody = { batch: ClinicBatch };
/** POST /clinic/opd/logs */
export type ClinicCaseLogBody = { assignmentId: string; cases: number; absent?: boolean; note?: string };

/* ----------------------------- admin ----------------------------- */

export type ClinicCohortRef = { id: string; name: string };

/** GET /clinic/admin/overview?cohort= */
export type ClinicAdminOverview = {
  v: 1;
  cohorts: ClinicCohortRef[];
  cohortId: string | null;
  today: string;
  sessions: (ClinicSession & { counts: { expected: number; in: number; out: number; late: number; onLeave: number } })[];
  pendingLeave: number;
  logsDue: number;
  canWrite: boolean;
};

export type ClinicSlot = {
  id: string;
  cohortIds: string[];
  weekday: number;
  start: string;
  end: string;
  kind: ClinicKind;
  title: string;
  place: string | null;
  onlineLink: string | null;
  compulsory: boolean;
  validFrom: string | null;
  validTo: string | null;
  active: boolean;
};
/** POST /clinic/admin/timetable and PUT /clinic/admin/timetable/:id */
export type ClinicSlotBody = Omit<ClinicSlot, "id" | "active" | "place" | "onlineLink" | "validFrom" | "validTo"> & {
  place?: string | null;
  onlineLink?: string | null;
  validFrom?: string | null;
  validTo?: string | null;
  active?: boolean;
};
/** POST /clinic/admin/timetable/apply: make sessions from the timetable for a date range (adds only what is missing). */
export type ClinicApplyBody = { cohortId: string; from: string; to: string };
export type ClinicApplyResult = { created: number; skipped: number };

/** POST /clinic/admin/sessions: a one-off session. */
export type ClinicSessionBody = {
  cohortIds: string[];
  date: string;
  start: string;
  end: string;
  kind: ClinicKind;
  title: string;
  place?: string | null;
  onlineLink?: string | null;
  compulsory?: boolean;
  note?: string | null;
  notify?: boolean;
};
/** PATCH /clinic/admin/sessions/:id: move, edit, cancel or restore, note. */
export type ClinicSessionPatch = Partial<Omit<ClinicSessionBody, "cohortIds">> & { status?: "scheduled" | "cancelled" };

/** PUT /clinic/admin/notes */
export type ClinicDayNoteBody = { cohortId: string; date: string; note: string };

/** GET /clinic/admin/sessions/:id/code: the QR text and the 6-character code for this 30-second window. */
export type ClinicShowCode = { sessionId: string; qr: string; code: string; window: number; validUntil: string; refreshInMs: number };

export type ClinicAttendanceRow = {
  userId: string;
  name: string | null;
  roll: string | null;
  status: ClinicMyStatus;
  inAt: string | null;
  outAt: string | null;
  late: boolean;
  minutes: number | null;
  manual: boolean;
  note: string | null;
  earlyLeaveAt: string | null;
};
/** GET /clinic/admin/sessions/:id/attendance */
export type ClinicLiveAttendance = {
  v: 1;
  session: ClinicSession;
  open: boolean;
  lateMinutes: number;
  rows: ClinicAttendanceRow[];
  counts: { expected: number; in: number; out: number; late: number; onLeave: number; missing: number };
};
/** POST /clinic/admin/sessions/:id/attendance: mark by hand. `at` defaults to now (or session start for "in" after it ended). */
export type ClinicManualMarkBody = { userId: string; direction: ClinicDirection | "clear"; at?: string; note?: string };

/** GET /clinic/admin/leave?cohort=&status= */
export type ClinicLeaveQueue = { v: 1; requests: (ClinicLeaveRequest & { name: string | null; roll: string | null; balance: ClinicLeaveBalance; overLimitNow: boolean })[] };
/** POST /clinic/admin/leave/:id */
export type ClinicLeaveDecisionBody = { decision: "approve" | "reject"; note?: string };

export type ClinicAllowanceRow = { userId: string; name: string | null; roll: string | null; balance: ClinicLeaveBalance; log: { old: number | null; new: number; note: string | null; at: string }[] };
/** GET /clinic/admin/allowances?cohort= */
export type ClinicAllowances = { v: 1; cohortId: string; rows: ClinicAllowanceRow[] };
/** PUT /clinic/admin/allowances: set (or add to) the allowance for the whole cohort (no userIds) or the students listed. */
export type ClinicAllowanceBody = { cohortId: string; userIds?: string[]; set?: number; add?: number; note?: string };
export type ClinicAllowanceResult = { changed: number };

/** seats["1"].morning = seats on Mondays in the morning batch. Weekday 0 is Sunday. */
export type ClinicSeats = Record<string, { morning?: number; evening?: number }>;
/** GET/PUT /clinic/admin/opd/settings?cohort= */
export type ClinicOpdSettings = {
  cohortId: string;
  seats: ClinicSeats;
  casesPerVisit: number;
  startDate: string | null;
  endDate: string | null;
  lateMinutes: number;
  holidays: string[];
  freezeDays: number;
};

export type ClinicQuotaRow = { userId: string; name: string | null; roll: string | null; batch: ClinicBatch | null; quota: ClinicQuota; visitsPlanned: number };
/** GET /clinic/admin/opd/quotas?cohort= */
export type ClinicQuotas = { v: 1; cohortId: string; casesPerVisit: number; rows: ClinicQuotaRow[] };
/** PUT /clinic/admin/opd/quotas: base cases for the whole cohort (no userIds) or the students listed. */
export type ClinicQuotaBody = { cohortId: string; userIds?: string[]; base: number };
/** POST /clinic/admin/opd/extras: "Add cases: N, note 'paid 12 Nov'". */
export type ClinicExtraBody = { cohortId: string; userId: string; count: number; note?: string };
/** PUT /clinic/admin/opd/batch: the admin changes a student's batch. */
export type ClinicAdminBatchBody = { cohortId: string; userId: string; batch: ClinicBatch };

export type ClinicPlanEntry = { assignmentId: string; userId: string; name: string | null; source: "kept" | "new" | "moved" };
export type ClinicPlanDay = { date: string; weekday: number; morning: { seats: number; people: ClinicPlanEntry[] }; evening: { seats: number; people: ClinicPlanEntry[] } };
/** GET /clinic/admin/opd/plan?cohort=&state=draft|published (state defaults to draft when one exists). */
export type ClinicPlan = {
  v: 1;
  cohortId: string;
  state: "draft" | "published";
  hasDraft: boolean;
  from: string | null;
  to: string | null;
  days: ClinicPlanDay[];
  /** Students the seats could not fit (visits still needed). */
  short: { userId: string; name: string | null; visits: number }[];
  /** Students with no batch yet (left out of the plan). */
  noBatch: { userId: string; name: string | null }[];
};
/** POST /clinic/admin/opd/generate: make a draft from today on (keeps published days). */
export type ClinicGenerateBody = { cohortId: string };
/** POST /clinic/admin/opd/move: move one draft (or published) visit. `force` allows a full day. */
export type ClinicMoveBody = { assignmentId: string; date: string; batch: ClinicBatch; force?: boolean };
/** POST /clinic/admin/opd/publish */
export type ClinicPublishBody = { cohortId: string; notify?: boolean };
export type ClinicPublishResult = { published: number; removed: number; notified: number };

export type ClinicTrackerRow = {
  userId: string;
  name: string | null;
  roll: string | null;
  batch: ClinicBatch | null;
  attendance: ClinicAttendanceSummary;
  leave: ClinicLeaveBalance;
  cases: ClinicQuota;
  visits: { planned: number; done: number; absent: number; missed: number; due: number };
};
/** GET /clinic/admin/trackers?cohort= */
export type ClinicTrackers = { v: 1; cohortId: string; rows: ClinicTrackerRow[] };
/** GET /clinic/admin/students/:id?cohort= */
export type ClinicStudentDetail = {
  v: 1;
  cohortId: string;
  row: ClinicTrackerRow;
  sessions: ClinicMySession[];
  leave: ClinicLeaveRequest[];
  visits: ClinicVisit[];
  allowanceLog: { old: number | null; new: number; note: string | null; at: string }[];
};
/** POST /clinic/admin/opd/remind: a notice to everyone with a case log due. */
export type ClinicRemindResult = { notified: number };
