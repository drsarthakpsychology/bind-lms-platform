/**
 * Admin routes the server has marked "planned" (docs/app/API_CONTRACT.md,
 * section 2.13, on agent/appapi2) or not listed yet. The app builds against
 * these shapes and the mock server answers them; against the real server a
 * missing route answers 404 and the screen shows "Coming in the next update".
 *
 * Requests for the server side, one line each:
 *   POST /admin/students/:id/login-link      super admin  -> LoginLinkResult   (issueSetupLink)
 *   GET  /admin/inbox                         admin        -> InboxList
 *   GET  /admin/inbox/:id                     admin        -> InboxThread
 *   POST /admin/inbox/:id/reply               super admin  InboxReplyBody -> InboxThread
 *   GET  /admin/review/submissions?status=    admin        -> SubmissionList
 *   POST /admin/review/submissions/:id/grade  super admin  GradeBody -> Submission
 *   GET  /admin/review/signoffs               admin        -> SignOffList
 *   POST /admin/review/signoffs/:id           super admin  SignOffBody -> SignOff
 *   GET  /admin/cohorts                       admin        -> CohortList
 *   GET  /admin/cohorts/:id                   admin        -> CohortDetail
 *   GET  /admin/activity/behind?cohort=       admin        -> BehindList
 *   GET  /admin/people?view=&search=          admin        -> PeopleList
 *   GET  /admin/people/:key                   admin        -> PersonDetail
 *   POST /admin/people/:key/stage             super admin  MoveStageBody -> PersonDetail
 *   POST /admin/people/:key/note              super admin  NoteBody -> PersonDetail
 *   POST /admin/people/:key/invite            super admin  -> LoginLinkResult   (sends the invitation email)
 *   POST /admin/people/:key/paid              super admin  PaidBody -> PersonDetail
 *   POST /admin/people/contact                super admin  BulkContactBody -> BulkContactResult (one email each)
 *   GET  /admin/enquiries                     admin        -> EnquiryList
 *   GET  /admin/forms                         admin        -> FormList
 *   GET  /admin/forms/:id                     admin        -> FormDetail (with respondents)
 *   POST /admin/forms/:id/email               super admin  FormEmailBody -> BulkContactResult
 *   GET  /admin/certificates?status=&search=  admin        -> CertificateList
 *   GET  /admin/certificates/options          admin        -> StudioOptions
 *   POST /admin/certificates                  super admin  StudioIssueInput -> IssueResult
 *   POST /admin/certificates/:id/revoke       super admin  RevokeBody -> CertRow
 *   POST /admin/certificates/:id/resend       super admin  -> ResendResult
 *   POST /admin/certificates/:id/reissue      super admin  -> CertRow (a new id; the old one says "replaced")
 *   GET  /admin/certificates/types            admin        -> CertTypeList (certificate kinds and badges)
 *   GET  /admin/certificates/settings         admin        -> StudioSettings
 *   PUT  /admin/certificates/settings         super admin  Partial<StudioSettings> -> StudioSettings
 *   GET  /admin/students/:id/credentials      admin        -> { items: CertRow[] }
 *   GET  /admin/students/:id/messages         admin        -> { items: StudentMessage[] }
 *   GET  /admin/push-preferences              admin        -> AdminPushPrefs
 *   PUT  /admin/push-preferences              admin        Partial<AdminPushPrefs> -> AdminPushPrefs
 * Push: the server adds `admin` to PushData for the three admin notices
 * (AdminPushData below) so a tap opens the right admin screen.
 */

/* ------------------------------------------------------------- login link */

export type LoginLinkResult = { sent: boolean; emailed?: boolean; /** The link, so an admin can paste it into WhatsApp (the server does not send it yet). */ url?: string | null; expiresAt?: string | null };

/* ------------------------------------------------------------------ inbox */

export type InboxKind = "email" | "enquiry" | "doubt" | "concern";
export type InboxItem = { id: string; kind: InboxKind; from: string; email: string; subject: string; preview: string; at: string; unread: boolean; studentId: string | null; /** The screen a tap opens. */ href?: string };
export type InboxList = { items: InboxItem[]; unread: number };
export type InboxMessage = { id: string; from: string; mine: boolean; body: string; at: string };
export type InboxThread = { id: string; kind: InboxKind; subject: string; from: string; email: string; phone: string | null; studentId: string | null; messages: InboxMessage[] };
export type InboxReplyBody = { text: string };

/* ----------------------------------------------------------------- review */

export type Submission = {
  id: string;
  studentId: string;
  studentName: string;
  assignment: string;
  course: string;
  submittedAt: string;
  status: "pending" | "graded";
  /** What the website did with it: approved as is, or returned with feedback. */
  reviewed?: "approved" | "returned" | null;
  grade: number | null;
  maxGrade: number;
  feedback: string | null;
  /** The student's text answer, or a file name. */
  answer: string;
  file: string | null;
  files?: { id: string; name: string; format: string | null }[];
  hasAudio?: boolean;
  late?: boolean;
  lesson?: string | null;
};
export type SubmissionList = { items: Submission[]; pending: number; canWrite?: boolean };
/** POST /admin/submissions/:id/grade (the website's Return feedback; the score is optional). */
export type GradeBody = { feedback: string; score: number | null };

export type SignOff = { id: string; studentId: string; studentName: string; activity: string; hours: number; date: string; supervisor: string; competency: string | null; status: "requested" | "signed" | "rejected"; note: string | null };
export type SignOffList = { items: SignOff[] };
export type SignOffBody = { decision: "signed" | "rejected"; note?: string };

/* ---------------------------------------------------------------- cohorts */

export type CohortStatus = "upcoming" | "active" | "ended";
export type CohortRow = { id: string; name: string; status: CohortStatus; course: string | null; members: number; lectures: number; /** Share of lectures finished, all members. */ pct: number; activeWeek: number; behind: number; never: number; starts: string | null; ends: string | null };
export type CohortList = { items: CohortRow[] };
export type CohortMember = { id: string; name: string; rollNumber: string | null; account: string; presence: "now" | "today" | "week" | "quiet" | "never"; lastSeen: string | null; done: number; available: number };
export type CohortDetail = CohortRow & { people: CohortMember[]; messages: { batchId: string; title: string; sentAt: string; total: number; opened: number }[]; hoursWeek: number; sessions: { title: string; at: string }[] };

export type BehindRow = { id: string; name: string; cohortId: string | null; cohortName: string | null; done: number; available: number; lastSeen: string | null; account: string };
export type BehindList = { items: BehindRow[]; cohorts: { id: string; name: string }[] };

/* ----------------------------------------------------------------- people */

export const STAGES = [
  { id: "new", label: "New enquiry" },
  { id: "contacted", label: "Contacted" },
  { id: "call_done", label: "Call done" },
  { id: "fee_shared", label: "Fee shared" },
  { id: "joined", label: "Joined" },
  { id: "no_reply", label: "No reply" },
  { id: "not_interested", label: "Not interested" },
] as const;
export type StageId = (typeof STAGES)[number]["id"];
export const STAGE_LABEL = Object.fromEntries(STAGES.map((s) => [s.id, s.label])) as Record<StageId, string>;

export type PersonRow = {
  key: string;
  name: string;
  email: string;
  phone: string | null;
  stage: StageId;
  followUpAt: string | null;
  enquiredAt: string | null;
  source: string | null;
  /** Has a student account and has signed in. */
  isStudent: boolean;
  lastTouch: string | null;
  /** The invitation (login) email went out. */
  invitedAt: string | null;
  paid: boolean;
  /** From the server's People list (GET /admin/people). */
  college?: string | null;
  cohorts?: { id: string; name: string }[];
  message?: string | null;
  whatsappUrl?: string | null;
  paidAt?: string | null;
  paidAmount?: number | null;
  studentId?: string | null;
};

/** The quick views of the pipeline (the website's People views on agent/admincert). */
export const PEOPLE_VIEWS = [
  { id: "all", label: "Everyone" },
  { id: "not_paid", label: "Not paid yet" },
  { id: "invited", label: "Invited, not joined" },
  { id: "not_converted", label: "Enquired, not converted" },
  { id: "quiet", label: "Went quiet" },
  { id: "joined", label: "Joined" },
] as const;
export type PeopleView = (typeof PEOPLE_VIEWS)[number]["id"];
export type NoteBody = { text: string };
export type PaidBody = { paid: boolean };
export type BulkContactBody = { keys: string[]; subject: string; text: string };
export type BulkContactResult = { sent: number; failed: number; /** Over today's allowance: goes out with Send waiting emails. */ queued?: number; noEmail?: number };
export type PeopleList = {
  items: PersonRow[];
  /** How many each quick view holds (from the server); counted here when missing. */
  counts?: Partial<Record<PeopleView, number>>;
  total?: number;
  paymentReady?: boolean;
  followUpsDue?: number;
  waiting?: number;
  allowance?: { configured: boolean; limit: number; left: number };
  mergeFields?: { key: string; label: string }[];
  canWrite?: boolean;
};
export type PersonEvent = { title: string; body: string | null; at: string; tone: "ok" | "info" | "warn" | "quiet" };
export type PersonDetail = PersonRow & { facts: { label: string; value: string }[]; timeline: PersonEvent[]; studentId: string | null };
export type MoveStageBody = { stage: StageId; followUpAt?: string | null; note?: string };

export type Enquiry = { id: string; personKey: string; name: string; email: string; phone: string | null; message: string; at: string; answered: boolean; source: string | null };
export type EnquiryList = { items: Enquiry[] };

/* ----------------------------------------------------------- certificates */

export const CERT_KINDS = ["completion", "provisional", "recognition", "custom"] as const;
export type CertKind = (typeof CERT_KINDS)[number];
/** The website's KIND_DEFAULTS (src/lib/certificates/kinds.ts). */
export const KIND_DEFAULTS: Record<CertKind, { label: string; heading: string; lead: string; connector: string; titleHint: string; needsExpiry: boolean; about: string }> = {
  completion: { label: "Completion", heading: "Certificate of Completion", lead: "This is to certify that", connector: "has successfully completed", titleHint: "Foundations of Clinical Psychology", needsExpiry: false, about: "For finishing a course or module." },
  provisional: { label: "Provisional", heading: "Provisional Certificate", lead: "This is to certify that", connector: "has provisionally completed", titleHint: "Foundations of Clinical Psychology", needsExpiry: true, about: "Until the final one is ready. Runs out on a date you pick." },
  recognition: { label: "Special recognition", heading: "Special Recognition", lead: "This recognises", connector: "for", titleHint: "Outstanding contribution to the cohort", needsExpiry: false, about: "For something a student did well." },
  custom: { label: "Custom", heading: "Certificate", lead: "This is presented to", connector: "for", titleHint: "Certificate title", needsExpiry: false, about: "Your own wording." },
};

export type CertStatus = "valid" | "provisional" | "expired" | "revoked" | "not_issued" | "draft";
export type CertRow = { credentialId: string; title: string; kind: CertKind | "badge"; replacedBy?: string | null; recipient: string; recipientId: string; issuedAt: string; expiresAt: string | null; status: CertStatus; emailStatus: "sent" | "queued" | "failed" | "not_sent"; revokedAt: string | null; revokeReason: string | null;
  /** From the server's Issued list (GET /admin/certificates/issued). */
  statusLine?: string | null;
  typeLabel?: string | null;
  verifyUrl?: string | null;
  canCorrect?: boolean;
  isDraft?: boolean;
  hasPdf?: boolean;
  email?: string | null;
  roll?: string | null;
};
export type CertificateList = {
  items: CertRow[];
  ready: boolean;
  total?: number;
  nextCursor?: string | null;
  /** Certificate emails waiting for tomorrow's allowance. */
  waiting?: number;
  emailOn?: boolean;
  canWrite?: boolean;
  counts?: { certificate: number; badge: number };
  cohorts?: { id: string; name: string }[];
};

export type StudioSignatory = { name: string; role: string; signatureFrom?: string | null };
export type StudioRecipient = { userId: string; name: string };
/** The website's StudioIssueInput (src/lib/certificates/issue-input.ts). */
export type StudioIssueInput = {
  kind: CertKind;
  title: string;
  heading?: string;
  lead?: string;
  connector?: string;
  citation?: string;
  courseId?: string | null;
  courseLabel?: string;
  moduleLabel?: string;
  /** yyyy-mm-dd */
  issuedOn: string;
  /** yyyy-mm-dd; required for provisional. */
  expiresOn?: string | null;
  signatories: StudioSignatory[];
  recipients: StudioRecipient[];
  cohortId?: string | null;
  email: boolean;
  /** A correction: the certificate this one replaces (the old one is revoked and points here). */
  replaces?: string | null;
};
export type StudioOptions = { signatories: StudioSignatory[]; signatures: { id: string; label: string }[]; emailReady: boolean; emailLeft?: number | null; ready?: boolean; today?: string | null; courses?: { id: string; title: string }[] };
export type IssueResult = { issued: number; emailed: number; queued: number; ids: string[]; skipped?: number };
/** GET /admin/badges, as the screens show it. */
export type BadgeRow = { id: string; title: string; about: string; enabled: boolean; issued: number; automatic: boolean };
export type BadgeList = { items: BadgeRow[]; canWrite: boolean; maxRecipients: number };
export type RevokeBody = { reason: string };
export type CertType = { id: string; name: string; kind: CertKind | "badge"; about: string; issued: number; auto: boolean };
export type CertTypeList = { items: CertType[] };
export type StudioSettings = { signatories: StudioSignatory[]; emailOnIssue: boolean; replyTo: string | null; emailReady: boolean };

/* ------------------------------------------------------------------ forms */

export type FormRow = { id: string; title: string; responses: number; open: boolean; updatedAt: string; url?: string | null };
export type FormList = { items: FormRow[] };
export type FormResponse = { id: string; name: string; email: string; phone?: string | null; at: string; when?: string | null; answers: { q: string; a: string }[]; emailed: boolean; emailWaiting?: number; studentId: string | null };
export type FormDetail = FormRow & {
  questions: string[];
  respondents: FormResponse[];
  nextCursor?: string | null;
  /** Emails from this form waiting for tomorrow's allowance. */
  waiting?: number;
  allowance?: { configured: boolean; limit: number; left: number };
  /** {first_name}, {name}, {email}, {form} */
  mergeFields?: { key: string; label: string }[];
  canWrite?: boolean;
};
export type EmailPreview = { to: string; subject: string; text: string; unknownFields: string[] };
/** Email the respondents one by one: `ids` picks some, "all" everyone who answered. */
export type FormEmailBody = { ids: string[] | "all"; subject: string; text: string };
export type ResendResult = { sent: boolean };

/* ------------------------------------------------------- student extras */

export type StudentMessage = { id: string; title: string; at: string; opened: boolean; from: string };

/* ------------------------------------------------------------------ push */

export type AdminPushKind = "new_doubt" | "new_enquiry" | "falling_behind";
/** Extra field on PushData for admin notices. */
export type AdminPushData = { admin: AdminPushKind; id?: string | null };
export type AdminPushPrefs = { newDoubt: boolean; newEnquiry: boolean; fallingBehind: boolean };

/* ----------------------------------------------------------------- system */

/** A named support key, as the website's System page lists it (never the key itself). */
export type SupportKeyView = { id: string; label: string; last4: string; createdAt: string; createdByEmail: string | null; revokedAt: string | null; revokedByEmail: string | null; lastUsedAt: string | null };
/** GET /admin/system (planned): support keys and a few usage lines. */
export type SystemData = { ready: boolean; canWrite: boolean; legacyKeyOn: boolean; maxLive: number; keys: SupportKeyView[]; usage: { label: string; value: string; pct: number | null }[] };
/** POST /admin/system/support-keys and /:id/rotate answer the full key ONCE. */
export type NewSupportKey = { plain: string; last4: string };
