import { z } from "zod";
import { TYPE_TONES } from "@/lib/achievements/type-words";

const rule = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("module_complete"), module: z.string().min(1).max(80) }),
  z.object({ kind: z.literal("sections_read"), module: z.string().min(1).max(80), count: z.number().int().min(1).max(500) }),
  z.object({ kind: z.literal("xp"), min: z.number().int().min(1).max(10_000_000) }),
  z.object({ kind: z.literal("watch_seconds"), min: z.number().int().min(60).max(100_000_000) }),
  z.object({ kind: z.literal("course_complete"), course_id: z.string().uuid() }),
  z.object({ kind: z.literal("module_tests_passed") }),
]);

/** A badge or certificate type, as the website's saveAchievement takes it. */
export const typeSchema = z.object({
  type: z.enum(["badge", "certificate"]),
  title: z.string().max(120),
  description: z.string().max(600).optional(),
  tone: z.enum(TYPE_TONES).optional(),
  icon: z.string().max(40).nullable().optional(),
  moduleId: z.string().max(80).nullable().optional(),
  courseId: z.string().uuid().nullable().optional(),
  rule,
});
export type TypeBody = z.infer<typeof typeSchema>;

export const saveInput = (b: TypeBody, id: string | null) => ({
  id,
  type: b.type,
  title: b.title,
  description: b.description ?? "",
  module_id: b.moduleId ?? (b.rule.kind === "module_complete" || b.rule.kind === "sections_read" ? b.rule.module : null),
  course_id: b.courseId ?? (b.rule.kind === "course_complete" ? b.rule.course_id : null),
  icon: b.icon ?? null,
  tone: b.tone ?? "lime",
  requirements: b.rule,
});
