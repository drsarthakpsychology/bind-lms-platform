"use server";

import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { rateLimitResult } from "@/lib/rate-limit";
import { stripMarkup } from "@/lib/sanitize";
import { pickIdentity, validateAnswers, type AnswerValue, type Answers } from "@/lib/forms/fields";
import { linkContact, normalizeEmail } from "@/lib/forms/contacts";
import { loadFormBySlug } from "@/lib/forms/load";

export type SubmitResult = { ok: true } | { ok: false; closed?: boolean; error: string; errors?: Record<string, string> };

/** Hidden field: people never see it, bots fill it. Its name can't clash with a question key. */
const HONEYPOT = "_hp";

/**
 * Public form submission. Server only: the browser has no way to write to
 * link_form_submissions (RLS on, no policies). Honeypot guarded and rate
 * limited. The limit per network is high on purpose: a whole class often
 * fills a form at once from one college wifi. A repeat from the same email is
 * limited much more tightly.
 */
export async function submitLinkForm(slug: string, data: FormData): Promise<SubmitResult> {
  if (String(data.get(HONEYPOT) ?? "").trim()) return { ok: true };

  const admin = createAdminClient();
  const form = await loadFormBySlug(admin, slug);
  if (!form) return { ok: false, error: "This form was not found." };
  if (!form.isActive) return { ok: false, closed: true, error: "This form is closed." };

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || "unknown";
  // A counter outage must not lose a classroom's answers: only a real "over the limit" blocks.
  if ((await rateLimitResult(`form-ip:${ip}`, 150)) === "limited") {
    return { ok: false, error: "Too many answers from this network. Please wait a minute and try again." };
  }

  const input: Record<string, AnswerValue | undefined> = {};
  for (const f of form.fields) {
    input[f.key] = f.type === "multiple_choice" ? data.getAll(f.key).map(String) : ((data.get(f.key) as string | null) ?? undefined);
  }
  const checked = validateAnswers(form.fields, input);
  if (!checked.ok) return { ok: false, error: "Please check the answers marked below.", errors: checked.errors };

  const answers: Answers = Object.fromEntries(
    Object.entries(checked.answers).map(([k, v]) => [k, Array.isArray(v) ? v.map(stripMarkup) : stripMarkup(v)]),
  );
  const who = pickIdentity(form.fields, answers);
  const email = normalizeEmail(who.email);

  if (email && (await rateLimitResult(`form-email:${form.id}:${email}`, 5, 10 * 60 * 1000)) === "limited") {
    return { ok: false, error: "We already have several answers from this email. Please try again later." };
  }

  const contactId = email ? await linkContact(admin, { email, name: who.name, phone: who.phone, tag: form.slug, answers }) : null;

  const { error } = await admin.from("link_form_submissions").insert({
    form_id: form.id,
    responses: answers,
    name: who.name,
    email,
    phone: who.phone,
    contact_id: contactId,
  });
  if (error) {
    // Never log answers or contact details: the error code is enough.
    console.error("[link-form] insert failed:", error.code ?? "unknown");
    return { ok: false, error: "Something went wrong. Please try again." };
  }
  return { ok: true };
}
