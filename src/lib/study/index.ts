import { parseModule, sectionMinutes } from "./parse";
import type { ModuleMeta, Section, StudyModule } from "./types";
import * as interviewMse from "@/content/study/interview-mse";

/**
 * The course, in curriculum order. Add a module by creating its file in
 * src/content/study (meta + text) and listing it here.
 */
const SOURCES: { meta: ModuleMeta; text: string }[] = [interviewMse];

function build(src: { meta: ModuleMeta; text: string }): StudyModule {
  const sections = parseModule(src.text);
  return { ...src.meta, sections, minutes: sections.reduce((a, s) => a + sectionMinutes(s), 0) };
}

export const MODULES: StudyModule[] = SOURCES.map(build).sort((a, b) => a.num - b.num);

export function moduleById(id: string): StudyModule | undefined {
  return MODULES.find((m) => m.id === id);
}

export function sectionById(m: StudyModule, id: string): Section | undefined {
  return m.sections.find((s) => s.id === id);
}

export const COURSE_MINUTES = MODULES.reduce((a, m) => a + m.minutes, 0);

export type { StudyModule, Section } from "./types";

/** The module without its text, for client components (status, lists, links). */
export function liteModule(m: StudyModule): StudyModule {
  return { ...m, sections: m.sections.map((s) => ({ ...s, blocks: [] })) };
}
