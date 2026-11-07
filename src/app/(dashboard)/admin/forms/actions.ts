"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { stripMarkup } from "@/lib/sanitize";
import { LIMITS, validateFieldDefs } from "@/lib/forms/fields";
import { countSubmissions, loadForm } from "@/lib/forms/load";

/**
 * Form writes. Super Admin only: every action re-checks the caller itself,
 * because a Server Action can be called directly, not only from its page.
 * Answers (link_form_submissions) are never deleted or changed here.
 */

type Result = { error: string | null; id?: string };
const NO = { error: "Only a Super Admin can change forms." };

const newSlug = () => randomBytes(5).toString("hex");

function refresh(id?: string) {
  revalidatePath("/admin/forms");
  if (id) revalidatePath(`/admin/forms/${id}`);
}

export type FormDraft = { title: string; description: string; fields: unknown; isActive: boolean };

function cleanDraft(d: FormDraft) {
  const title = stripMarkup(String(d.title ?? "")).trim();
  const description = stripMarkup(String(d.description ?? "")).trim();
  if (!title) return { error: "Give the form a title." } as const;
  if (title.length > LIMITS.title) return { error: "The title is too long." } as const;
  if (description.length > LIMITS.description) return { error: "The description is too long." } as const;
  const v = validateFieldDefs(d.fields);
  if (!v.ok) return { error: v.error } as const;
  const fields = v.fields.map((f) => ({ ...f, label: stripMarkup(f.label), ...(f.options ? { options: f.options.map(stripMarkup) } : {}) }));
  return { title, description: description || null, fields, is_active: d.isActive === true } as const;
}

/** Create a new form. Returns its id. */
export async function createForm(d: FormDraft): Promise<Result> {
  const me = await requireSuperAdmin();
  if (!me) return NO;
  const row = cleanDraft(d);
  if ("error" in row) return { error: row.error ?? "Please check the form." };
  const admin = createAdminClient();
  for (let i = 0; i < 3; i++) {
    const { data, error } = await admin.from("link_forms").insert({ ...row, slug: newSlug(), created_by: me.id }).select("id").single();
    if (!error && data) {
      refresh();
      return { error: null, id: data.id as string };
    }
    if (error?.code !== "23505") break;
  }
  return { error: "Could not save the form. Please try again." };
}

/**
 * Save changes to a form. Question keys are kept as sent: the builder never
 * changes the key of an existing question, so old answers stay attached.
 */
export async function updateForm(id: string, d: FormDraft): Promise<Result> {
  if (!(await requireSuperAdmin())) return NO;
  const row = cleanDraft(d);
  if ("error" in row) return { error: row.error ?? "Please check the form." };
  const admin = createAdminClient();
  if (!(await loadForm(admin, id))) return { error: "That form no longer exists." };
  const { error } = await admin.from("link_forms").update(row).eq("id", id);
  if (error) return { error: "Could not save the form. Please try again." };
  refresh(id);
  return { error: null, id };
}

/** Open or close a form. A closed form keeps its link and answers; it just stops taking new ones. */
export async function setFormOpen(id: string, open: boolean): Promise<Result> {
  if (!(await requireSuperAdmin())) return NO;
  const admin = createAdminClient();
  const { error } = await admin.from("link_forms").update({ is_active: open }).eq("id", id);
  if (error) return { error: "Could not change the form." };
  refresh(id);
  return { error: null, id };
}

/** Copy a form's questions into a new, closed form with its own link. Answers are not copied. */
export async function duplicateForm(id: string): Promise<Result> {
  const me = await requireSuperAdmin();
  if (!me) return NO;
  const admin = createAdminClient();
  const src = await loadForm(admin, id);
  if (!src) return { error: "That form no longer exists." };
  const title = `Copy of ${src.title}`.slice(0, LIMITS.title);
  for (let i = 0; i < 3; i++) {
    const { data, error } = await admin
      .from("link_forms")
      .insert({ title, description: src.description, fields: src.fields, is_active: false, slug: newSlug(), created_by: me.id })
      .select("id")
      .single();
    if (!error && data) {
      refresh();
      return { error: null, id: data.id as string };
    }
    if (error?.code !== "23505") break;
  }
  return { error: "Could not copy the form." };
}

/**
 * Remove a form. A form with answers is never deleted (deleting would also
 * delete its answers): it is closed instead, and only after the caller
 * confirms. A form with no answers is deleted for real.
 */
export async function removeForm(id: string, confirmed: boolean): Promise<{ error: string | null; outcome?: "deleted" | "archived" | "needs_confirm"; responses?: number }> {
  if (!(await requireSuperAdmin())) return NO;
  const admin = createAdminClient();
  const form = await loadForm(admin, id);
  if (!form) return { error: "That form no longer exists." };
  const n = await countSubmissions(admin, id);
  if (n > 0) {
    if (!confirmed) return { error: null, outcome: "needs_confirm", responses: n };
    const { error } = await admin.from("link_forms").update({ is_active: false }).eq("id", id);
    if (error) return { error: "Could not close the form." };
    refresh(id);
    return { error: null, outcome: "archived", responses: n };
  }
  // Close first so no answer can arrive, then delete only if still empty.
  await admin.from("link_forms").update({ is_active: false }).eq("id", id);
  const again = await countSubmissions(admin, id);
  if (again > 0) {
    await admin.from("link_forms").update({ is_active: form.isActive }).eq("id", id);
    return { error: null, outcome: "needs_confirm", responses: again };
  }
  const { error } = await admin.from("link_forms").delete().eq("id", id);
  if (error) return { error: "Could not delete the form." };
  refresh();
  return { error: null, outcome: "deleted" };
}
