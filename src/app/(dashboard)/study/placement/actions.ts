"use server";

import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { logEvents, savePlacement } from "@/lib/learn/model/server";
import { scorePlacement, type PlacementResult } from "@/lib/learn/model/placement";
import { bankItem, gradeChoice } from "@/lib/learn/model/topics";

const schema = z
  .array(z.object({ item: z.string().min(1).max(20), choice: z.union([z.number().int().min(0).max(10), z.boolean(), z.literal("skip")]) }))
  .max(40);

/**
 * Grade the placement quiz on the server, store it and seed starting
 * abilities. Admins previewing get a result but nothing is saved.
 */
export async function submitPlacement(answers: { item: string; choice: number | boolean | "skip" }[]): Promise<{ result: PlacementResult; saved: boolean }> {
  const parsed = schema.safeParse(answers);
  const list = parsed.success ? parsed.data : [];
  const s = await getSession();
  const userId = s.status === "ok" && (s.profile.role === "student" || s.profile.role === "alumni") ? s.profile.id : null;
  if (!userId) return { result: scorePlacement(list), saved: false };
  const result = await savePlacement(userId, list);
  await logEvents(
    userId,
    list.flatMap((a) => {
      const b = bankItem(a.item);
      if (!b) return [];
      const ok = gradeChoice(b.item, a.choice).ok;
      return [{ type: "game", kind: "placement", ok, score: ok ? 1 : 0, skill: b.skill, item: b.item.id, prompt: b.item.kind === "mcq" ? b.item.prompt : b.item.statement, path: "/study/placement" }];
    }),
  );
  return { result, saved: true };
}
