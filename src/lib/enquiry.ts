import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { stripMarkup } from "@/lib/sanitize";
import { policyVersion } from "@/lib/legal-constants";

/**
 * Store one "request an invitation" enquiry (table enquiries, service role:
 * the browser and the app have no insert path). Shared by the website's
 * waitlist form (submitWaitlist) and the app's POST /public/request-invitation.
 * Callers validate, rate limit and check the policy box first.
 */
export type EnquiryInput = { name: string; email: string; phone?: string | null; status: "student" | "early_career" | "practitioner" | "other"; message?: string | null };

export async function saveEnquiry(input: EnquiryInput, source: "landing" | "app"): Promise<{ ok: boolean }> {
  const admin = createAdminClient();
  const { error } = await admin.from("enquiries").insert({
    // stripMarkup at write time (defense-in-depth): React escapes on render,
    // but no future raw-HTML/export path can execute a stored payload.
    name: stripMarkup(input.name),
    email: stripMarkup(input.email),
    phone: input.phone ? stripMarkup(input.phone) : null,
    status: input.status,
    message: input.message ? stripMarkup(input.message) : null,
    source,
    // The acceptance record: what makes the no-refund term defensible if a
    // waitlisted lead later challenges it.
    policy_acceptance_at: new Date().toISOString(),
    policy_version: policyVersion(),
  });
  if (error) {
    console.error("[enquiry] insert failed:", error.message);
    return { ok: false };
  }
  return { ok: true };
}
