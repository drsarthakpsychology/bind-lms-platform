/**
 * The admin part of the server contract, copied word for word from the
 * server's src/lib/app-api/contract-practise-admin.ts (branch agent/appapi2,
 * branch agent/adminfull, 16 November, section "Admin"). Do not edit the copied part by hand:
 * copy it again when the server changes. Below it are the older names the
 * screens still use, and the shapes of the website loaders the server passes
 * through as they are.
 *
 * Every field can still arrive missing or null from an older server, so the
 * screens read these through the normalisers in ./safe.ts, never raw.
 */
import type { AppTarget, Page, Scope } from "@/api/contract";

// ---------------------------------------------------------------- copied part


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
  /** The app's mock fields. */
  status: "active" | "paused" | "ended";
  progressPct: number;
  lecturesOnly: boolean;
  cohort: string | null;
};

/** A thing to do on admin Home, as the website's Home lists them. */
export type AdminTodo = { id: string; label: string; count: number; detail: string; target: AppTarget; urgent: boolean };
/** A student who needs a look (the app's mock AdminAttention, plus the flags). */
export type AdminAttention = { id: string; studentId: string; name: string; reason: string; since: string | null; flags: AttentionFlag[] };

/** GET /admin/home */
export type AdminHomeData = {
  v: 1;
  /** "Mon, 16 Nov" in India time. */
  dateLine: string;
  /** Things to do, only those with a count, in the website's order. */
  todo: AdminTodo[];
  totalToDo: number;
  /** Students that need a look, most flags first (at most 20), as table rows. */
  needsLook: AdminStudentRow[];
  /** The same students as the app's mock attention rows (reason in words). */
  attention: AdminAttention[];
  live: { userId: string; name: string; meta: string; where: string | null; lessonId: string | null; since: string | null; watching: boolean }[];
  cohorts: { id: string; name: string; members: number; week: number; behind: number; pct: number }[];
  counts: { students: number; activeThisWeek: number; onNow: number; neverIn: number; needsLook: number; locked: number; openComplaints: number; dbPct: number };
  /** The app's mock line. */
  today: { active: number; total: number; lecturesWatched: number | null; doubtsOpen: number; submissionsToGrade: number };
  canWrite: boolean;
};

/** GET /admin/students?search=&q=&cohort=&flag= (paged, default 50, max 200) */
export type AdminStudentList = Page<AdminStudentRow> & { total: number; cohorts: { id: string; name: string }[] };

/** GET /admin/students/:id */
export type AdminStudent = AdminStudentRow & {
  /** The first version's shape: the same row, and `detail` below. */
  row: AdminStudentRow;
  /** The phone signed in to the app, and the changes used this month. */
  phone: { name: string; platform: string; changesUsed: number; limit: number; nextChangeAt: string | null } | null;
  lectures: { done: number; total: number };
  /** The website's loadStudentDetail answer (visits, lectures and study for 30 days). */
  detail: Record<string, unknown> | null;
  recent: { at: string; what: string }[];
  canWrite: boolean;
};

/** POST /admin/students/:id/lock, /unlock */
export type LockBody = { reason?: string };
export type LockResult = { blocked: boolean };
/** POST /admin/students/:id/login-link : emails a fresh login link (the website's sendLoginLink). */
export type LoginLinkResult = { sent: true };

/**
 * POST /admin/messages. The first version's body (`{ userIds, title, text, alsoEmail? }`)
 * is still accepted and is the same as `{ to: "students", userIds, title, body: text }`.
 */
export type AdminSendBody = {
  to: "everyone" | "cohort" | "course" | "student" | "students";
  /** The cohort, course or student id. */
  toId?: string;
  /** For "students": the picked student ids. */
  userIds?: string[];
  title: string;
  /** Plain text; paragraphs split by blank lines. */
  body: string;
  alsoEmail?: boolean;
};
export type AdminSendResult = { sent: number; created: number; emailed: number; emailFailed: number; batchId: string | null };
/** GET /admin/messages : recent sends with how many opened them, and who can be messaged. */
export type AdminMessages = {
  v: 1;
  batches: { batchId: string; title: string; sentAt: string; total: number; opened: number; type: string }[];
  ready: boolean;
  /** The app's mock list (one row per recent send). */
  items: { id: string; to: string; title: string; preview: string; at: string; unread: boolean }[];
  cohorts: { id: string; name: string; status: string; members: number }[];
  courses: { id: string; title: string; members: number }[];
  students: number;
};

/** GET /admin/inbox : everything waiting on a reply, oldest first (the website's loadInbox). */
export type AdminInbox = {
  v: 1;
  ready: boolean;
  threads: { id: string; reason: "concern" | "unanswered" | "student-replied"; [k: string]: unknown }[];
  emails: { id: string; fromEmail: string; fromName: string | null; subject: string; body: string; receivedAt: string }[];
  canWrite: boolean;
};
/** POST /admin/doubts/:id/reply and POST /admin/inbox/emails/:id/reply */
export type AdminReplyBody = { text: string };
export type AdminReplyResult = { sent: true };
/** POST /admin/doubts/:id/draft : an AI draft for the reply box (never posted). */
export type AdminDraftResult = { text: string };

/** GET /admin/activity?view=live|behind|cohorts|all */
export type AdminActivity = {
  v: 1;
  /** The first version's shape: kind "admin.activity", data = loadActivity()'s answer plus `live` (filled for view "all"). */
  kind: "admin.activity";
  data: Record<string, unknown> | null;
  view: "live" | "behind" | "cohorts" | "all";
  live: AdminHomeData["live"];
  /** Falling behind: active accounts under the expected lectures, quietest first. */
  behind: AdminStudentRow[];
  cohorts: AdminHomeData["cohorts"];
  /** The website's loadActivity rows (per student minutes, places and lectures over 30 days), test accounts left out. */
  rows: Record<string, unknown>[];
  /** The app's mock feed. */
  items: { id: string; at: string; who: string; what: string; kind: "lecture" | "study" | "doubt" | "submission" | "sign_in" }[];
};

/** GET /admin/submissions?status=pending|graded&course=&assignment= */
export type AdminSubmission = {
  id: string;
  studentId: string;
  studentEmail: string | null;
  /** Their full name (the email's first part when no name is saved). */
  studentName: string;
  assignmentId: string;
  assignmentTitle: string;
  lessonTitle: string;
  courseId: string | null;
  courseTitle: string;
  status: string;
  submittedAt: string;
  late: boolean;
  text: string | null;
  hasAudio: boolean;
  files: { id: string; name: string; format: string | null }[];
  score: number | null;
  feedback: string | null;
  note: string | null;
};
export type AdminSubmissions = Page<AdminSubmission> & { v: 1; pending: number; courses: { id: string; title: string }[]; assignments: { id: string; title: string; courseId: string | null }[]; canWrite: boolean };
/** POST /admin/submissions/:id/grade */
export type GradeBody = { feedback: string; score: number | null };
/** POST /admin/submissions/:id/approve, /grade */
export type ReviewResult = { status: "approved" | "returned" };
/** GET /admin/submissions/:id/files/:fileId and /audio : a 15 minute address. */
export type AdminFileLink = { url: string; expiresInSeconds: number };

/** GET /admin/certificates/studio : what the studio needs to start. */
export type StudioSetup = {
  v: 1;
  canWrite: boolean;
  ready: boolean;
  today: string;
  kinds: { id: string; label: string; [k: string]: unknown }[];
  students: { id: string; name: string; email: string; roll: string | null; cohortIds: string[] }[];
  cohorts: { id: string; name: string; count: number }[];
  courses: { id: string; title: string }[];
  signatures: { id: string; label: string; url: string | null; [k: string]: unknown }[];
  email: { configured: boolean; remaining: number; limit: number };
  /** Who signs by default (Certificates, Settings), so the studio starts with them. */
  signatories: DefaultSignatory[];
};
/** The studio form, the same as the website's StudioIssueInput. */
export type StudioIssueBody = {
  kind: string;
  title: string;
  heading?: string;
  lead?: string;
  connector?: string;
  citation?: string;
  courseId?: string | null;
  courseLabel?: string;
  moduleLabel?: string;
  issuedOn: string;
  expiresOn?: string | null;
  signatories: { name: string; role: string; signatureFrom?: string | null }[];
  recipients: { userId: string; name: string }[];
  cohortId?: string | null;
  email: boolean;
  /** Re-issue: the certificate this one corrects. */
  replaces?: string | null;
};
/**
 * POST /admin/certificates/preview { ...StudioIssueBody, showing? } : the
 * certificate as the student will see it, as drawing operations in a
 * `width` by `height` box (rect, line, path, stroke, image, text), the same
 * layout the website draws and prints. Images are keys into `images` (signed
 * addresses, or null).
 */
export type StudioPreview = { v: 1; width: number; height: number; ops: Record<string, unknown>[]; images: Record<string, string | null>; problems: string[] };
export type StudioIssueResult = { issued: { credentialId: string; userId: string; name: string }[]; skipped: Record<string, unknown>[]; batchId: string | null; delivery: Record<string, unknown> | null };
/**
 * GET /admin/certificates/issued?q=&type=&status=&cohort=&student=&limit&cursor
 * Certificates, Issued: every certificate AND every badge in one list, newest
 * first (the website's Issued page). `type` is certificate, badge, completion,
 * provisional, recognition or custom; `status` valid, provisional, expired,
 * revoked or draft.
 */
export type IssuedStatusId = "valid" | "provisional" | "expired" | "revoked" | "draft";
export type IssuedCertificate = {
  credentialId: string;
  userId: string | null;
  type: "certificate" | "badge";
  /** completion, provisional, recognition, custom, or "badge". */
  kind: string;
  /** "Course completion", "Badge" ... */
  typeLabel: string;
  name: string;
  title: string;
  /** The status the list shows. */
  status: IssuedStatusId;
  /** In words: "Valid", "Provisional until 31 Dec 2026", "Revoked on 2 Nov 2026". */
  statusLine: string;
  /** The stored status (draft, approved, issued, revoked). */
  recordStatus: string;
  issuedAt: string | null;
  /** "15 Nov 2026" or "Not issued". */
  issuedDay: string;
  expiresAt: string | null;
  revokedAt: string | null;
  revokeReason: string | null;
  email: string | null;
  roll: string | null;
  /** Certificate email: queued, sent, failed ... or null. */
  emailStatus: string | null;
  cohortIds: string[];
  /** Made in the studio, so "Correct and reissue" works (POST /admin/certificates/issue with replaces). */
  canCorrect: boolean;
  /** A draft course certificate: POST /admin/certificates/:id/issue-draft. */
  isDraft: boolean;
  /** A PDF exists: GET /admin/certificates/:id/pdf. */
  hasPdf: boolean;
  /** The public verify page. */
  verifyUrl: string;
};
export type IssuedCertificates = Page<IssuedCertificate> & {
  v: 1;
  /** How many match the filters. */
  total: number;
  /** How many of each type, before the type filter (for the chips). */
  counts: Record<"certificate" | "badge" | "completion" | "provisional" | "recognition" | "custom", number>;
  types: { id: string; label: string }[];
  statuses: { id: IssuedStatusId; label: string }[];
  cohorts: { id: string; name: string }[];
  /** Certificate emails waiting for tomorrow's allowance. */
  waiting: number;
  emailOn: boolean;
  canWrite: boolean;
  /** When ?student= names a person: their name for the heading. */
  person: { id: string; name: string } | null;
};
/** POST /admin/certificates/:id/issue-draft : a course certificate draft is issued (its rule is checked again). */
export type IssueDraftResult = { issued: true };
/** POST /admin/certificates/send-waiting : waiting certificate emails, up to today's allowance. */
export type SendWaitingResult = { sent: number; failed: number; left: number };

/** GET /admin/badges : the badges that can be given by hand. */
export type AdminBadge = { id: string; title: string; description: string | null; icon: string | null; tone: string; enabled: boolean; issuedCount: number; automatic: boolean };
export type AdminBadges = { v: 1; badges: AdminBadge[]; canWrite: boolean; maxRecipients: number };
/** POST /admin/badges/:id/award { userIds } : already-holders are skipped. */
export type AwardBadgeBody = { userIds: string[] };
export type AwardBadgeResult = { awarded: { userId: string; name: string; credentialId: string }[]; skipped: { name: string; reason: string }[] };
/** POST /admin/badges/award-all : every badge earned so far, given now. */
export type AwardAllResult = { awarded: number; skipped: number };

/* Forms: email the people who filled a form ------------------------------ */

/** GET /admin/forms */
export type AdminFormRow = { id: string; title: string; open: boolean; answers: number; lastAnswerAt: string | null; url: string };
export type AdminForms = { v: 1; forms: AdminFormRow[]; total: number; open: number; canWrite: boolean };
/** What every email screen needs: today's allowance and the merge fields. */
export type EmailAllowance = { configured: boolean; limit: number; left: number };
export type MergeField = { key: string; label: string };
export type EmailedMark = { lastSentAt: string | null; sent: number; waiting: number; failed: number };
/** GET /admin/forms/:id?q=&emailed=yes|no&limit&cursor : the answers, newest first. */
export type AdminFormAnswer = {
  id: string;
  at: string;
  /** "15 Nov 2026, 4:05 pm" in India time. */
  when: string;
  name: string;
  email: string;
  phone: string;
  /** The answers in the form's question order (identity questions left out). */
  answers: { key: string; label: string; text: string }[];
  /** Emails sent from this form to this address, or null when never. */
  emailed: EmailedMark | null;
};
export type AdminFormAnswers = Page<AdminFormAnswer> & {
  v: 1;
  form: { id: string; title: string; open: boolean; url: string };
  total: number;
  /** Emails from this form waiting for tomorrow's allowance. */
  waiting: number;
  allowance: EmailAllowance;
  mergeFields: MergeField[];
  limits: { subject: number; body: number; recipients: number };
  canWrite: boolean;
};
/** POST /admin/forms/:id/email : everyone ("all"), a picked few, or one. Addresses come from the saved answers, never from the app. */
export type FormEmailBody = { submissionIds: string[] | "all"; subject: string; body: string };
/** The shared sender's report: who got it now, who waits, who had no address. Names, not addresses. */
export type PersonalEmailReport = { sent: string[]; queued: string[]; failed: { name: string; reason: string }[]; noEmail: string[]; duplicates: number; remainingToday: number; queueFailed: boolean };
/** POST /admin/forms/:id/email/preview { submissionId, subject, body } : what that person will get. */
export type FormEmailPreviewBody = { submissionId: string; subject: string; body: string };
export type EmailPreview = { to: string; subject: string; text: string; unknownFields: string[] };
/** POST /admin/forms/:id/email/send-waiting */
export type FormSendWaitingResult = SendWaitingResult;

/** POST /admin/certificates/:id/revoke */
export type RevokeBody = { reason: string };
/** POST /admin/certificates/:id/resend */
export type ResendBody = { email: boolean };
export type ResendResult = { notified: boolean; delivery: Record<string, unknown> | null };


/* People: Pipeline and Enquiries ----------------------------------------- */

/** A person is named in addresses by `key` (their email, base64url), never by the email itself. */
export type PeopleView = "all" | "not_paid" | "invited" | "not_converted" | "quiet" | "joined";
export type AdminPerson = {
  key: string;
  name: string;
  email: string;
  phone: string | null;
  college: string | null;
  stage: string;
  stageLabel: string;
  /** "website", "instagram", "Added as a student" ... */
  source: string;
  isStudent: boolean;
  isEnquiry: boolean;
  /** Has an account and has set it up or signed in. */
  joined: boolean;
  studentId: string | null;
  cohorts: { id: string; name: string }[];
  /** Enquiry, else invite, ISO; null when neither is known. */
  firstSeenAt: string | null;
  lastContactAt: string | null;
  /** week, month, older, never */
  lastContact: "week" | "month" | "older" | "never";
  lastSeenAt: string | null;
  followUpAt: string | null;
  inviteSentAt: string | null;
  paidAt: string | null;
  paidAmount: number | null;
  /** The latest enquiry message. */
  message: string | null;
  /** wa.me link, or null when the number is unusable. */
  whatsapp: string | null;
};
/**
 * GET /admin/people?view=&quiet=7|14|30&q=&stage=&cohort=&source=&from=YYYY-MM-DD&to=&last=week|month|older|never&enquiries=1&limit&cursor
 * The website's Pipeline (and, with enquiries=1, Enquiries: people who enquired).
 */
export type AdminPeople = Page<AdminPerson> & {
  v: 1;
  total: number;
  view: PeopleView;
  /** How many each quick view holds under the other filters. */
  counts: Record<PeopleView, number>;
  views: { id: PeopleView; label: string }[];
  quietDays: number;
  quietChoices: number[];
  stages: { id: string; label: string }[];
  lastContactChoices: { id: "week" | "month" | "older" | "never"; label: string }[];
  cohorts: { id: string; name: string }[];
  sources: string[];
  /** False until 2026_11_15_people_payment.sql is in: Mark paid answers 503 until then. */
  paymentReady: boolean;
  /** Follow-ups due by this time tomorrow (over everyone). */
  followUpsDue: number;
  /** Pipeline emails waiting for tomorrow's allowance. */
  waiting: number;
  allowance: EmailAllowance;
  mergeFields: MergeField[];
  canWrite: boolean;
};
/** POST /admin/people/:key/paid */
export type MarkPaidBody = { paid: boolean; amount?: number | null; note?: string | null };
export type MarkPaidResult = { paid: boolean };
/** POST /admin/people/:key/invite { name? } : the login link (makes the account first for an enquiry). */
export type InviteBody = { name?: string };
export type InviteResult = { sent: boolean; reason: string | null };
/** POST /admin/people/:key/stage { stage } */
export type StageBody = { stage: string };
/** POST /admin/people/:key/activity { kind, text } : note, call, whatsapp, email, meeting. */
export type ActivityBody = { kind: "note" | "call" | "whatsapp" | "email" | "meeting"; text: string };
/** POST /admin/people/:key/follow-up { date } : YYYY-MM-DD, or "" to clear. */
export type FollowUpBody = { date: string };
export type PersonSaved = { saved: true };
/** POST /admin/people/email { keys, subject, body } : only people in the pipeline are emailed. */
export type PeopleEmailBody = { keys: string[]; subject: string; body: string };
/** POST /admin/people/whatsapp { keys, text } : logs the contact and gives each person's link with {first_name} filled. */
export type PeopleWhatsAppBody = { keys: string[]; text: string };
export type PeopleWhatsAppResult = { links: { key: string; name: string; url: string | null }[] };
/** POST /admin/people/email/send-waiting */
export type PeopleSendWaitingResult = SendWaitingResult;

/* Admin, round two: cohorts, settings, types, no-account certificates, system, sign-offs, push ---- */

export type CohortStatus = "upcoming" | "active" | "ended";
/** GET /admin/cohorts : every cohort with its numbers (the website's Cohorts page). */
export type AdminCohortRow = {
  id: string;
  name: string;
  status: CohortStatus;
  /** The course it is for, or null. */
  course: string | null;
  members: number;
  /** Lectures shared with it. */
  lectures: number;
  /** Share of their lectures finished, all members. */
  pct: number;
  activeWeek: number;
  behind: number;
  /** Members who have not signed in yet. */
  never: number;
  /** Share of members who filled in their details. */
  detailsPct: number;
  /** yyyy-mm-dd */
  starts: string | null;
  ends: string | null;
};
export type AdminCohorts = { v: 1; items: AdminCohortRow[]; /** Students in no cohort. */ unassigned: number; /** False before the cohort tables exist. */ ready: boolean; canWrite: boolean };
export type AdminCohortMember = {
  id: string;
  name: string;
  email: string;
  rollNumber: string | null;
  account: string;
  accountLabel: string;
  presence: "now" | "today" | "week" | "quiet" | "never";
  lastSeen: string | null;
  done: number;
  available: number;
  minutes7: number;
  scope: "full" | "lectures_only";
  detailsDone: boolean;
};
/** GET /admin/cohorts/:id : one cohort (the website's cohort workspace). `people` in the Members order; the Progress order is least finished first. */
export type AdminCohortDetail = AdminCohortRow & {
  v: 1;
  people: AdminCohortMember[];
  /** Bell messages that reached this cohort's members, newest first. */
  messages: { batchId: string; title: string; sentAt: string; total: number; opened: number }[];
  /** Hours on VIBHA in the last 7 days, all members. */
  hoursWeek: number;
  /** Planned sessions (none sent yet: the website keeps them in its calendar). */
  sessions: { title: string; at: string }[];
  canWrite: boolean;
};

/** A saved signature image (a short-lived address to draw it). */
export type SignatureImage = { id: string; label: string; url: string | null };
export type DefaultSignatory = { name: string; role: string; signatureFrom: string | null };
/** GET /admin/certificates/settings : who signs by default, the signature images, and email. */
export type CertificateSettings = {
  v: 1;
  /** Up to three; the owner's default list until one is saved. */
  signatories: DefaultSignatory[];
  signatures: SignatureImage[];
  email: { configured: boolean; limit: number; sentToday: number; waiting: number };
  canWrite: boolean;
};
/** PUT /admin/certificates/settings (super admin) : the default signatories. Answers CertificateSettings. */
export type CertificateSettingsBody = { signatories: { name: string; role: string; signatureFrom?: string | null }[] };
/** POST /admin/certificates/signatures (super admin) : a PNG or JPEG data URL, up to 2 MB. Answers CertificateSettings. */
export type SignatureUploadBody = { label: string; dataUrl: string };

/** POST /admin/certificates/anyone/preview and /anyone : a certificate for someone without an account (a volunteer, a guest speaker). */
export type AnyoneCertificateBody = {
  name: string;
  email: string;
  phone?: string | null;
  title: string;
  /** A few lines about what they did (up to 600 characters). */
  paragraph: string;
  heading?: string;
  lead?: string;
  /** yyyy-mm-dd, today when missing. */
  issuedOn?: string;
  /** A saved signature image's id. */
  signatureFrom?: string | null;
  /** Email it with the PDF (issue only). */
  emailIt?: boolean;
};
/** The PDF, as the website's preview makes it (nothing saved or sent). */
export type AnyonePreview = { pdfBase64: string; fileName: string };
export type AnyoneIssueResult = { credentialId: string; verifyUrl: string; /** The student the email belongs to, when it is one. */ linkedStudent: string | null; /** Why the email did not go, when it did not. */ emailNote: string | null };

/** GET /admin/certificates/types : badge and certificate types with their rules (Certificates, Types). */
export type RuleKind = "module_complete" | "sections_read" | "xp" | "watch_seconds" | "course_complete" | "module_tests_passed";
export type TypeRule =
  | { kind: "module_complete"; module: string }
  | { kind: "sections_read"; module: string; count: number }
  | { kind: "xp"; min: number }
  | { kind: "watch_seconds"; min: number }
  | { kind: "course_complete"; course_id: string }
  | { kind: "module_tests_passed" };
export type AdminCertType = {
  id: string;
  type: "badge" | "certificate";
  title: string;
  description: string | null;
  tone: string;
  icon: string | null;
  enabled: boolean;
  issued: number;
  /** The rule in words. */
  ruleText: string;
  /** The rule, when it is one the form can edit; null for hand-given and milestone types. */
  rule: TypeRule | null;
  moduleId: string | null;
  courseId: string | null;
  /** Made by the studio, the monthly merit or the signature store: not edited here. */
  madeForYou: boolean;
  signatureLabel: string | null;
  hasSignature: boolean;
};
export type AdminCertTypes = {
  v: 1;
  items: AdminCertType[];
  rules: { id: RuleKind; label: string }[];
  tones: string[];
  modules: { id: string; title: string }[];
  courses: { id: string; title: string }[];
  canWrite: boolean;
};
/** POST /admin/certificates/types (new) and PUT /admin/certificates/types/:id (super admin). Answers `{ id }`. */
export type CertTypeBody = { type: "badge" | "certificate"; title: string; description?: string; tone?: string; icon?: string | null; moduleId?: string | null; courseId?: string | null; rule: TypeRule };
/** POST /admin/certificates/types/:id/enabled { enabled } */
export type CertTypeEnabledBody = { enabled: boolean };
/** GET /admin/certificates/types/:id/eligible (super admin) : students who meet a course certificate's rule and have none yet. */
export type CertEligible = { items: { id: string; name: string; reason: string }[] };
/** POST /admin/certificates/types/:id/drafts { userIds } (super admin) : drafts to issue from Issued. */
export type CertDraftsBody = { userIds: string[] };
export type CertDraftsResult = { made: { userId: string; credentialId: string }[]; failed: { userId: string; reason: string }[] };

/** GET /admin/system : support keys (views only: never the key itself) and how full things are. */
export type SupportKeyView = { id: string; label: string; last4: string; createdAt: string; createdByEmail: string | null; revokedAt: string | null; revokedByEmail: string | null; lastUsedAt: string | null };
export type AdminSystem = {
  v: 1;
  ready: boolean;
  canWrite: boolean;
  /** The older single shared key still works. */
  legacyKeyOn: boolean;
  maxLive: number;
  keys: SupportKeyView[];
  /** The last sign-ins with a key. */
  uses: { email: string; at: string }[];
  usage: { label: string; value: string; pct: number | null }[];
};
/** POST /admin/system/support-keys { label } and /:id/rotate : the full key, shown ONCE. */
export type NewSupportKey = { plain: string; last4: string };

/** GET /admin/students/:id/messages : what was sent to one student and what came back, newest first. */
export type StudentMessage = {
  id: string;
  /** email: an email to them; reply: their email reply; bell: a notification in VIBHA. */
  from: "email" | "reply" | "bell";
  title: string;
  at: string;
  opened: boolean;
  /** "Sent", "Opened", "Failed", "Not opened", "Reply". */
  state: string;
  failed: boolean;
};
export type StudentMessages = { v: 1; items: StudentMessage[] };

/** GET /admin/review/signoffs : supervision entries students asked to be signed. */
export type SignOff = { id: string; studentId: string; studentName: string; studentEmail: string; activity: string; hours: number; date: string; supervisor: string | null; competency: string | null; status: "requested" | "signed" | "rejected" };
export type SignOffList = { v: 1; items: SignOff[]; canWrite: boolean };
/** POST /admin/review/signoffs/:id (super admin) */
export type SignOffBody = { decision: "signed" | "rejected" };
export type SignOffResult = { id: string; status: "signed" | "rejected" };

/** GET and PUT /admin/push-preferences : this admin's own phone notices. */
export type AdminPushPrefs = { newDoubt: boolean; newEnquiry: boolean; fallingBehind: boolean };

/** GET /admin/people/:key : one person's record with the whole history, newest first. */
export type AdminPersonEvent = { at: string; kind: string; title: string; body: string | null; tone: "ok" | "info" | "warn" | "quiet" };
export type AdminPersonDetail = AdminPerson & { v: 1; facts: { label: string; value: string }[]; timeline: AdminPersonEvent[]; paymentReady: boolean; canWrite: boolean };


// ------------------------------------------------------------- older names

/** POST /play/:game/:action answers this; GET /admin/activity keeps its kind and data. */
export type PlayResult<T = unknown> = { kind: string; v: 1; data: T };
export type AdminHome = AdminHomeData;
export type AdminStudentProfile = AdminStudent;
export type SendMessageBody = AdminSendBody;
export type SendMessageResult = AdminSendResult;
export type MessageBatches = AdminMessages;
/** POST /admin/doubts/:id/hide */
export type HideBody = { hidden: boolean };
export type LiveRow = AdminHomeData["live"][number];
export type HomeCohort = AdminHomeData["cohorts"][number];

/* ------------------------------------------------------------------------ */
/* Shapes of the website loaders the contract passes through as-is.         */
/* Typed here from their source so the screens can read them.               */
/* ------------------------------------------------------------------------ */

/** `detail` of GET /admin/students/:id: loadStudentDetail (src/lib/analytics/activity.ts). */
export type StudentDetail = {
  profile: { id: string; name: string | null; email: string | null; status: string; created_at: string; mobile_number: string | null; display: string };
  /** Thirty days, oldest first, India days. */
  daily: { day: string; min: number }[];
  lectures: { id: string; title: string; week: number | null; watchedMin: number; done: boolean; at: string | null }[];
  recent: { at: string; what: string; min: number }[];
  learn: { xp: number; level: { title: string }; streak: number; best: number; accuracy: number | null; answered: number; badges: number; mastery: number; confusions: string[]; lessons: number } | null;
  sims: { id: string; status: string; started_at: string; ended_at: string | null }[];
  totals: { min30: number; activeDays: number };
};

/** One row of loadActivity (src/lib/analytics/activity.ts). */
export type StudentActivity = {
  id: string;
  name: string;
  email: string;
  status: string;
  min7: number;
  min30: number;
  activeDays30: number;
  lastSeen: string | null;
  lecturesDone: number;
  lecturesStarted: number;
  watchMin: number;
  xp: number;
  level: string;
  streak: number;
  accuracy: number | null;
  mastery: number;
  practice: number;
  score: number;
};

/** `data` of GET /admin/activity (kind "admin.activity"): loadActivity() plus `live`. */
export type ActivityData = {
  rows: StudentActivity[];
  /** Weekday (Monday first) by India hour, minutes. */
  heat: number[][];
  pages: { label: string; min: number }[];
  totals: { students: number; active7: number; activeNow: number; hours30: number; lecturesDone: number };
  live: LiveRow[];
};
