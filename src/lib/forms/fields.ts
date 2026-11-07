/**
 * Link forms: field definitions, tolerant parsing of stored forms, and
 * answer validation. Pure (no server-only) so it is unit-testable and can be
 * shared by the builder, the public form and the server actions.
 *
 * Stored shape (public.link_forms.fields): [{ key, type, label, required, options? }].
 * Answers (public.link_form_submissions.responses): { [key]: string | string[] }.
 * Keys never change once a field exists, so renaming a field keeps its answers.
 */

export const FIELD_TYPES = [
  { type: "text", label: "Short answer" },
  { type: "long_text", label: "Long answer" },
  { type: "email", label: "Email" },
  { type: "phone", label: "Phone" },
  { type: "number", label: "Number" },
  { type: "date", label: "Date" },
  { type: "single_choice", label: "Pick one" },
  { type: "multiple_choice", label: "Pick many" },
  { type: "dropdown", label: "Dropdown" },
  { type: "checkbox", label: "Tick box" },
] as const;

export type FieldType = (typeof FIELD_TYPES)[number]["type"];
export const FIELD_TYPE_LABEL = Object.fromEntries(FIELD_TYPES.map((t) => [t.type, t.label])) as Record<FieldType, string>;
export const CHOICE_TYPES: FieldType[] = ["single_choice", "multiple_choice", "dropdown"];

export type FormField = {
  key: string;
  type: FieldType;
  label: string;
  required: boolean;
  options?: string[];
};

export type AnswerValue = string | string[];
export type Answers = Record<string, AnswerValue>;

export const LIMITS = {
  title: 160,
  description: 2000,
  label: 300,
  fields: 60,
  options: 50,
  option: 200,
  text: 500,
  longText: 5000,
} as const;

/** New keys are lower case; older stored keys may be looser, so saving them back must still pass. */
const KEY_RE = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,79}$/;

/** Older or hand-made type names mapped onto ours. Unknown types read as short answers. */
const TYPE_ALIAS: Record<string, FieldType> = {
  textarea: "long_text",
  long: "long_text",
  paragraph: "long_text",
  tel: "phone",
  mobile: "phone",
  radio: "single_choice",
  choice: "single_choice",
  select: "dropdown",
  checkboxes: "multiple_choice",
  multi: "multiple_choice",
};

export function isFieldType(v: unknown): v is FieldType {
  return typeof v === "string" && FIELD_TYPES.some((t) => t.type === v);
}

/** Turn a label into a key: lower case letters, digits and underscores. */
export function slugKey(label: string): string {
  const base = label
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48)
    .replace(/_+$/g, "");
  if (!base) return "field";
  return /^[a-z]/.test(base) ? base : `f_${base}`.slice(0, 48);
}

/**
 * A new, unused key for a label. `taken` holds every key in the form now and
 * every key ever seen in its answers, so a new field never inherits old data.
 */
export function makeKey(label: string, taken: Iterable<string>): string {
  const used = new Set(taken);
  const base = slugKey(label);
  if (!used.has(base)) return base;
  for (let i = 2; i < 1000; i++) {
    const k = `${base}_${i}`;
    if (!used.has(k)) return k;
  }
  return `${base}_${used.size + 1}`;
}

/** Read stored fields safely. Bad entries are skipped, never thrown on. */
export function normalizeFields(raw: unknown): FormField[] {
  if (!Array.isArray(raw)) return [];
  const out: FormField[] = [];
  const seen = new Set<string>();
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const r = item as Record<string, unknown>;
    const key = typeof r.key === "string" ? r.key.trim() : "";
    if (!key || seen.has(key)) continue;
    const rawType = typeof r.type === "string" ? r.type.trim().toLowerCase() : "text";
    const type: FieldType = isFieldType(rawType) ? rawType : (TYPE_ALIAS[rawType] ?? "text");
    const label = typeof r.label === "string" && r.label.trim() ? r.label.trim() : humanizeKey(key);
    const field: FormField = { key, type, label, required: r.required === true };
    if (CHOICE_TYPES.includes(type)) {
      field.options = Array.isArray(r.options) ? r.options.filter((o): o is string => typeof o === "string" && o.trim() !== "").map((o) => o.trim()) : [];
    }
    seen.add(key);
    out.push(field);
  }
  return out;
}

/** "year_of_study" -> "Year of study" (for answers whose field was removed). */
export function humanizeKey(key: string): string {
  const s = key.replace(/[_-]+/g, " ").trim();
  return s ? s[0].toUpperCase() + s.slice(1) : key;
}

/** Check a form definition from the builder. Returns the cleaned fields or the first problem. */
export function validateFieldDefs(raw: unknown): { ok: true; fields: FormField[] } | { ok: false; error: string } {
  if (!Array.isArray(raw)) return { ok: false, error: "The questions could not be read." };
  if (raw.length === 0) return { ok: false, error: "Add at least one question." };
  if (raw.length > LIMITS.fields) return { ok: false, error: `A form can have up to ${LIMITS.fields} questions.` };
  const fields: FormField[] = [];
  const keys = new Set<string>();
  for (let i = 0; i < raw.length; i++) {
    const r = (raw[i] ?? {}) as Record<string, unknown>;
    const n = i + 1;
    const key = typeof r.key === "string" ? r.key.trim() : "";
    if (!KEY_RE.test(key)) return { ok: false, error: `Question ${n} has a bad internal name.` };
    if (keys.has(key)) return { ok: false, error: `Question ${n} repeats another question.` };
    if (!isFieldType(r.type)) return { ok: false, error: `Question ${n} has an unknown type.` };
    const label = typeof r.label === "string" ? r.label.trim() : "";
    if (!label) return { ok: false, error: `Question ${n} needs a question.` };
    if (label.length > LIMITS.label) return { ok: false, error: `Question ${n} is too long.` };
    const field: FormField = { key, type: r.type, label, required: r.required === true };
    if (CHOICE_TYPES.includes(r.type)) {
      const opts = Array.isArray(r.options) ? r.options.map((o) => (typeof o === "string" ? o.trim() : "")).filter(Boolean) : [];
      if (opts.length < 2) return { ok: false, error: `Question ${n} needs at least two choices.` };
      if (opts.length > LIMITS.options) return { ok: false, error: `Question ${n} has too many choices.` };
      if (opts.some((o) => o.length > LIMITS.option)) return { ok: false, error: `A choice in question ${n} is too long.` };
      if (new Set(opts.map((o) => o.toLowerCase())).size !== opts.length) return { ok: false, error: `Question ${n} has the same choice twice.` };
      field.options = opts;
    }
    keys.add(key);
    fields.push(field);
  }
  return { ok: true, fields };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function phoneOk(v: string): boolean {
  if (!/^[+\d][\d\s()./-]*$/.test(v)) return false;
  const digits = v.replace(/\D/g, "").length;
  return digits >= 7 && digits <= 15;
}

/**
 * Validate one submission against the form. `input` maps key to what the
 * browser sent (a string, or a list for "pick many"). Only known keys are
 * kept; values are trimmed and capped. Returns per-question messages.
 */
export function validateAnswers(
  fields: FormField[],
  input: Record<string, AnswerValue | undefined>,
): { ok: true; answers: Answers } | { ok: false; errors: Record<string, string> } {
  const answers: Answers = {};
  const errors: Record<string, string> = {};
  for (const f of fields) {
    const raw = input[f.key];
    if (f.type === "multiple_choice") {
      const list = (Array.isArray(raw) ? raw : raw ? [raw] : []).map((v) => String(v).trim()).filter(Boolean);
      const allowed = new Set(f.options ?? []);
      const picked = [...new Set(list)].filter((v) => allowed.has(v));
      if (picked.length !== new Set(list).size) errors[f.key] = "Pick from the list.";
      else if (f.required && picked.length === 0) errors[f.key] = "Pick at least one.";
      else if (picked.length) answers[f.key] = (f.options ?? []).filter((o) => picked.includes(o));
      continue;
    }
    const value = String(Array.isArray(raw) ? (raw[0] ?? "") : (raw ?? "")).trim();
    if (f.type === "checkbox") {
      const on = value === "yes" || value === "on" || value === "true" || value === "Yes";
      if (f.required && !on) errors[f.key] = "Please tick this box.";
      else answers[f.key] = on ? "Yes" : "No";
      continue;
    }
    if (!value) {
      if (f.required) errors[f.key] = "Please fill this in.";
      continue;
    }
    const max = f.type === "long_text" ? LIMITS.longText : LIMITS.text;
    if (value.length > max) {
      errors[f.key] = "That is too long.";
      continue;
    }
    switch (f.type) {
      case "email":
        if (!EMAIL_RE.test(value) || value.length > 200) errors[f.key] = "Enter a valid email.";
        else answers[f.key] = value.toLowerCase();
        break;
      case "phone":
        if (!phoneOk(value)) errors[f.key] = "Enter a valid phone number.";
        else answers[f.key] = value;
        break;
      case "number":
        if (!/^-?\d+(\.\d+)?$/.test(value)) errors[f.key] = "Enter a number.";
        else answers[f.key] = value;
        break;
      case "date": {
        const d = new Date(`${value}T00:00:00Z`);
        if (!DATE_RE.test(value) || Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== value) errors[f.key] = "Enter a date.";
        else answers[f.key] = value;
        break;
      }
      case "single_choice":
      case "dropdown":
        if (!(f.options ?? []).includes(value)) errors[f.key] = "Pick from the list.";
        else answers[f.key] = value;
        break;
      default:
        answers[f.key] = value;
    }
  }
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, answers };
}

const NOT_A_PERSON = /(course|college|school|institute|university|parent|father|mother|guardian|company|organi[sz]ation|department|class)/i;

/**
 * The name, email and phone to copy into the submission's own columns: the
 * first email question, the first phone question, and the first short answer
 * that asks for a person's name.
 */
export function pickIdentity(fields: FormField[], answers: Answers): { name: string | null; email: string | null; phone: string | null } {
  const first = (pred: (f: FormField) => boolean) => {
    for (const f of fields) {
      const v = answers[f.key];
      if (pred(f) && typeof v === "string" && v.trim()) return v.trim();
    }
    return null;
  };
  return {
    email: first((f) => f.type === "email"),
    phone: first((f) => f.type === "phone"),
    name: first((f) => f.type === "text" && (/name/i.test(f.label) || /name/i.test(f.key)) && !NOT_A_PERSON.test(f.label)),
  };
}

/** Which questions feed the name, email and phone columns (so a table need not show them twice). */
export function identityKeys(fields: FormField[]): string[] {
  const email = fields.find((f) => f.type === "email");
  const phone = fields.find((f) => f.type === "phone");
  const name = fields.find((f) => f.type === "text" && (/name/i.test(f.label) || /name/i.test(f.key)) && !NOT_A_PERSON.test(f.label));
  return [name, email, phone].filter((f): f is FormField => Boolean(f)).map((f) => f.key);
}

/** One answer as plain text for tables and CSV. */
export function answerText(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.map((x) => answerText(x)).filter(Boolean).join(", ");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

export type Column = { key: string; label: string; removed: boolean };

/**
 * The answer columns to show: today's questions in order, then any key found
 * in old answers that no longer has a question (marked removed), so editing a
 * form never hides what people already sent.
 */
export function answerColumns(fields: FormField[], responses: Iterable<Record<string, unknown> | null | undefined>): Column[] {
  const cols: Column[] = fields.map((f) => ({ key: f.key, label: f.label, removed: false }));
  const known = new Set(cols.map((c) => c.key));
  for (const r of responses) {
    if (!r || typeof r !== "object") continue;
    for (const k of Object.keys(r)) {
      if (known.has(k)) continue;
      known.add(k);
      cols.push({ key: k, label: humanizeKey(k), removed: true });
    }
  }
  return cols;
}

/** A blank question for the builder. */
export function blankField(type: FieldType, taken: Iterable<string>, label = ""): FormField {
  const f: FormField = { key: makeKey(label || FIELD_TYPE_LABEL[type], taken), type, label, required: false };
  if (CHOICE_TYPES.includes(type)) f.options = ["Option 1", "Option 2"];
  return f;
}
