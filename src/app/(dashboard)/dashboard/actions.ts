"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { normalizeIndianMobile } from "@/lib/phone";

/**
 * Save the student's WhatsApp mobile number (first-login capture). Only ever
 * updates their OWN row; the protect_profile_columns trigger lets students
 * change mobile_number but nothing privilege-bearing.
 */
export async function saveMobileNumber(raw: string): Promise<{ error: string | null }> {
  const profile = await requireSession();
  if (!profile) return { error: "Not signed in." };

  const number = normalizeIndianMobile(raw);
  if (!number) return { error: "Enter a valid 10-digit mobile number." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ mobile_number: number })
    .eq("id", profile.id);

  if (error) return { error: "Could not save your number. Try again." };
  revalidatePath("/dashboard");
  return { error: null };
}

/** Dismiss the prompt ("Later"). Re-asks on a later login, never nags every time. */
export async function skipMobileNumber(): Promise<{ error: string | null }> {
  const profile = await requireSession();
  if (!profile) return { error: "Not signed in." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ mobile_prompt_skipped_at: new Date().toISOString() })
    .eq("id", profile.id);

  if (error) return { error: "Could not dismiss. Try again." };
  revalidatePath("/dashboard");
  return { error: null };
}
