import type { SupabaseClient } from "@supabase/supabase-js";
import { answerText, type Answers } from "./fields";

/**
 * Link a form submission to a row in public.contacts, matched by email
 * (contacts.email is unique and stored lower case). A match only gains the
 * form's tag and fills blanks; nothing already on the contact is overwritten.
 * A new contact is created with the form slug as its tag.
 */

export type ContactRow = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  tags: string[] | null;
  attributes: Record<string, unknown> | null;
};

export type ContactInput = { email: string; name: string | null; phone: string | null; tag: string; answers: Answers };

export function normalizeEmail(raw: string | null | undefined): string | null {
  const e = String(raw ?? "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? e : null;
}

const flat = (answers: Answers) => Object.fromEntries(Object.entries(answers).map(([k, v]) => [k, answerText(v)]));

export type ContactPlan =
  | { action: "create"; row: { email: string; name: string | null; phone: string | null; tags: string[]; attributes: Record<string, string> } }
  | { action: "link"; id: string; patch: Partial<Pick<ContactRow, "name" | "phone" | "tags" | "attributes">> | null };

/** Decide what to do, given the contact already on file for this email (or none). */
export function planContact(existing: ContactRow | null, input: ContactInput): ContactPlan {
  if (!existing) {
    return { action: "create", row: { email: input.email, name: input.name, phone: input.phone, tags: [input.tag], attributes: flat(input.answers) } };
  }
  const patch: Partial<Pick<ContactRow, "name" | "phone" | "tags" | "attributes">> = {};
  if (!existing.name?.trim() && input.name) patch.name = input.name;
  if (!existing.phone?.trim() && input.phone) patch.phone = input.phone;
  const tags = existing.tags ?? [];
  if (!tags.includes(input.tag)) patch.tags = [...tags, input.tag];
  const attrs = existing.attributes ?? {};
  const add = Object.entries(flat(input.answers)).filter(([k, v]) => v !== "" && !(k in attrs));
  if (add.length) patch.attributes = { ...attrs, ...Object.fromEntries(add) };
  return { action: "link", id: existing.id, patch: Object.keys(patch).length ? patch : null };
}

const COLS = "id, email, name, phone, tags, attributes";

/** Find or create the contact. Returns its id, or null when it can't be saved (the answer is still kept). */
export async function linkContact(admin: SupabaseClient, input: ContactInput): Promise<string | null> {
  const find = async () => {
    const { data } = await admin.from("contacts").select(COLS).eq("email", input.email).maybeSingle();
    return (data as ContactRow | null) ?? null;
  };
  try {
    const existing = await find();
    const plan = planContact(existing, input);
    if (plan.action === "link") {
      if (plan.patch) await admin.from("contacts").update({ ...plan.patch, updated_at: new Date().toISOString() }).eq("id", plan.id);
      return plan.id;
    }
    const { data, error } = await admin.from("contacts").insert(plan.row).select("id").single();
    if (!error && data) return (data as { id: string }).id;
    // Two people sent the same email at once: the other insert won, use it.
    if (error?.code === "23505") {
      const again = await find();
      if (again) {
        const p = planContact(again, input);
        if (p.action === "link" && p.patch) await admin.from("contacts").update({ ...p.patch, updated_at: new Date().toISOString() }).eq("id", p.id);
        return again.id;
      }
    }
    return null;
  } catch {
    return null;
  }
}
