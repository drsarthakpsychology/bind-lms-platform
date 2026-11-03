"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { checkDetails, type Details } from "@/lib/profile-details/fields";

type Errors = Partial<Record<keyof Details, string>>;

/**
 * Step 1 ("Check my details"): validate only, nothing is saved yet, so the
 * student sees exactly what will be stored before they submit.
 */
export async function checkMyDetails(raw: Partial<Details>): Promise<{ errors: Errors | null; value: Details | null }> {
  const r = checkDetails(raw);
  return r.ok ? { errors: null, value: r.value } : { errors: r.errors, value: null };
}

/**
 * Step 2 ("Yes, submit"): validate again on the server and save once, with the
 * confirmation time. Also copies the name and mobile onto the account so the
 * admin lists show them.
 */
export async function submitMyDetails(raw: Partial<Details>, confirmed: boolean): Promise<{ error: string | null; errors?: Errors }> {
  const profile = await requireSession();
  if (!profile) return { error: "Please sign in again." };
  if (!confirmed) return { error: "Tick the box to confirm your details are correct." };
  const r = checkDetails(raw);
  if (!r.ok) return { error: "Some details need fixing.", errors: r.errors };
  const supabase = await createClient();
  const now = new Date().toISOString();
  const { error } = await supabase.from("student_details").upsert({ user_id: profile.id, ...r.value, confirmed_at: now, updated_at: now }, { onConflict: "user_id" });
  if (error) return { error: "Couldn't save. Check your internet and try again." };
  // Name and mobile onto the account row (students may change these two).
  const indian = /^[6-9][0-9]{9}$/.test(r.value.phone);
  await supabase
    .from("profiles")
    .update({ name: r.value.full_name, ...(indian ? { mobile_number: r.value.phone } : {}) })
    .eq("id", profile.id);
  revalidatePath("/", "layout");
  return { error: null };
}
