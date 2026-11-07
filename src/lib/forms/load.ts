import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { normalizeFields, type FormField } from "./fields";
import type { SubmissionRow } from "./csv";

/**
 * Reads for link forms. Always through the service-role client: RLS is on
 * with no policies, so the browser can never read these tables directly.
 */

export type FormRecord = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  fields: FormField[];
  isActive: boolean;
  createdAt: string;
};

export type FormSummary = FormRecord & { responses: number; lastResponseAt: string | null };

const FORM_COLS = "id, title, slug, description, fields, is_active, created_at";
const PAGE = 1000;

function toRecord(r: Record<string, unknown>): FormRecord {
  return {
    id: r.id as string,
    title: (r.title as string) ?? "Untitled form",
    slug: r.slug as string,
    description: (r.description as string | null) ?? null,
    fields: normalizeFields(r.fields),
    isActive: r.is_active === true,
    createdAt: r.created_at as string,
  };
}

/** Pages through a query 1000 rows at a time (the API caps a single read). */
async function all<T>(run: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>, cap = 50_000): Promise<T[]> {
  const out: T[] = [];
  for (let from = 0; from < cap; from += PAGE) {
    const { data, error } = await run(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    out.push(...(data ?? []));
    if (!data || data.length < PAGE) break;
  }
  return out;
}

export async function loadForms(admin: SupabaseClient): Promise<FormSummary[]> {
  const { data, error } = await admin.from("link_forms").select(FORM_COLS).order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  const subs = await all<{ form_id: string; created_at: string }>((a, b) =>
    admin.from("link_form_submissions").select("form_id, created_at").order("created_at", { ascending: false }).range(a, b),
  );
  const stats = new Map<string, { n: number; last: string | null }>();
  for (const s of subs) {
    const st = stats.get(s.form_id) ?? { n: 0, last: null };
    st.n++;
    if (!st.last || s.created_at > st.last) st.last = s.created_at;
    stats.set(s.form_id, st);
  }
  return (data ?? []).map((r) => {
    const f = toRecord(r);
    const st = stats.get(f.id);
    return { ...f, responses: st?.n ?? 0, lastResponseAt: st?.last ?? null };
  });
}

export async function loadForm(admin: SupabaseClient, id: string): Promise<FormRecord | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data } = await admin.from("link_forms").select(FORM_COLS).eq("id", id).maybeSingle();
  return data ? toRecord(data) : null;
}

export async function loadFormBySlug(admin: SupabaseClient, slug: string): Promise<FormRecord | null> {
  if (!/^[a-z0-9-]{3,80}$/i.test(slug)) return null;
  const { data } = await admin.from("link_forms").select(FORM_COLS).eq("slug", slug).maybeSingle();
  return data ? toRecord(data) : null;
}

export async function loadSubmissions(admin: SupabaseClient, formId: string): Promise<SubmissionRow[]> {
  return all<SubmissionRow>((a, b) =>
    admin
      .from("link_form_submissions")
      .select("id, created_at, name, email, phone, contact_id, responses")
      .eq("form_id", formId)
      .order("created_at", { ascending: false })
      .order("id", { ascending: true })
      .range(a, b),
  );
}

/** Every key ever used in this form's answers (so new questions never reuse one). */
export async function usedAnswerKeys(admin: SupabaseClient, formId: string): Promise<string[]> {
  const rows = await all<{ responses: Record<string, unknown> | null }>((a, b) =>
    admin.from("link_form_submissions").select("responses").eq("form_id", formId).order("id").range(a, b),
  );
  const keys = new Set<string>();
  for (const r of rows) for (const k of Object.keys(r.responses ?? {})) keys.add(k);
  return [...keys];
}

export async function countSubmissions(admin: SupabaseClient, formId: string): Promise<number> {
  const { count } = await admin.from("link_form_submissions").select("id", { count: "exact", head: true }).eq("form_id", formId);
  return count ?? 0;
}
