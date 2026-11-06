"use server";

import { requireSession } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Record one "Still watching?" check for the signed-in student. Best effort:
 * if the attention_checks table isn't there yet (database step not run), the
 * check still works in the player and nothing is stored.
 */
export async function recordAttentionCheck(input: { lessonId: string; askedAt: string; answered: boolean; position: number }): Promise<void> {
  const me = await requireSession();
  if (!me || me.role !== "student") return;
  if (!UUID_RE.test(input.lessonId)) return;
  const asked = new Date(input.askedAt);
  if (Number.isNaN(asked.getTime()) || Math.abs(Date.now() - asked.getTime()) > 10 * 60 * 1000) return;
  await createAdminClient()
    .from("attention_checks")
    .insert({
      user_id: me.id,
      lesson_id: input.lessonId,
      asked_at: asked.toISOString(),
      answered_at: input.answered ? new Date().toISOString() : null,
      missed: !input.answered,
      position_seconds: Math.max(0, Math.round(Number(input.position) || 0)),
    })
    .then(
      () => undefined,
      () => undefined,
    );
}
