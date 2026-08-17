"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { stripMarkup } from "@/lib/sanitize";
import { policyVersion } from "@/lib/legal-constants";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional().or(z.literal("")),
  status: z.enum(["student", "early_career", "practitioner", "other"]),
  message: z.string().max(2000).optional().or(z.literal("")),
  // Required, unticked acceptance — the checkbox in the form submits "true".
  // The server refuses anything else (a forged/missing field fails the parse).
  policyAccepted: z.literal("true"),
  // Hidden honeypot field — bots fill it, humans never see it.
  honeypot: z.string().max(200).optional(),
});

export interface WaitlistResult {
  ok: boolean;
  error?: string;
}

/**
 * Public waitlist submission. Runs server-side only: rate-limited by IP,
 * zod-validated, honeypot-guarded, and inserted via the service-role client —
 * the browser has no insert path to `enquiries` (RLS has no anon insert policy).
 */
export async function submitWaitlist(input: FormData): Promise<WaitlistResult> {
  const parsed = schema.safeParse(Object.fromEntries(input.entries()));
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again." };
  }

  // Honeypot filled → a bot. Pretend success, insert nothing.
  if (parsed.data.honeypot) return { ok: true };

  // Rate limit by visitor IP (fixed window, 5/hour is generous for humans).
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const allowed = await rateLimit(`waitlist:${ip}`, 5);
  if (!allowed) {
    return { ok: false, error: "Too many attempts. Please wait and try again." };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("enquiries").insert({
    // stripMarkup at write time (defense-in-depth): React escapes on render,
    // but no future raw-HTML/export path can execute a stored payload.
    name: stripMarkup(parsed.data.name),
    email: stripMarkup(parsed.data.email),
    phone: parsed.data.phone ? stripMarkup(parsed.data.phone) : null,
    status: parsed.data.status,
    message: parsed.data.message ? stripMarkup(parsed.data.message) : null,
    source: "landing",
    // The acceptance record — what makes the no-refund term defensible if a
    // waitlisted lead later challenges it.
    policy_acceptance_at: new Date().toISOString(),
    policy_version: policyVersion(),
  });
  if (error) {
    console.error("[waitlist] insert failed:", error.message);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
  return { ok: true };
}
