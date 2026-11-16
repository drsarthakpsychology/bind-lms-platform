import { REQUIREMENT_KINDS, type AchievementRequirement } from "./rules";

/**
 * Words for badge and certificate types (Certificates, Types on the website
 * and the app's GET /admin/certificates/types). Pure.
 */
export type RuleKind = AchievementRequirement["kind"];
type Facet = { id: string; title: string };
type TypeLike = { slug: string; requirements: unknown };

export const RULE_LABEL: Record<RuleKind, string> = {
  module_complete: "Finish a module",
  sections_read: "Read a number of sections",
  xp: "Earn a number of XP",
  watch_seconds: "Watch a number of minutes",
  course_complete: "Finish a course",
  module_tests_passed: "Pass every module test at 80%",
};
export const TYPE_TONES = ["lime", "blue", "ink", "gold", "rose"] as const;
/** Types the studio, the monthly merit and the signature store make for themselves. */
export const MADE_FOR_YOU = /^(custom-|studio-|merit-|signature-)/;

export const isMadeForYou = (a: TypeLike) => MADE_FOR_YOU.test(a.slug);
export const isEditableRule = (a: TypeLike) => (REQUIREMENT_KINDS as readonly string[]).includes(String(((a.requirements ?? {}) as { kind?: string }).kind ?? ""));

export function ruleText(a: TypeLike, modules: Facet[], courses: Facet[]): string {
  const r = (a.requirements ?? {}) as Partial<AchievementRequirement> & { kind?: string; module?: string; course_id?: string; count?: number; min?: number };
  switch (r.kind) {
    case "module_complete":
      return `Finish ${modules.find((m) => m.id === r.module)?.title ?? "a module"}`;
    case "sections_read":
      return `Read ${r.count ?? 1} sections of ${modules.find((m) => m.id === r.module)?.title ?? "a module"}`;
    case "xp":
      return `Earn ${r.min ?? 0} XP`;
    case "watch_seconds":
      return `Watch ${Math.round((r.min ?? 0) / 60)} minutes`;
    case "course_complete":
      return `Finish ${courses.find((c) => c.id === r.course_id)?.title ?? "a course"}`;
    case "module_tests_passed":
      return RULE_LABEL.module_tests_passed;
    default:
      return r.kind ? "Automatic milestone" : "Given by hand";
  }
}
