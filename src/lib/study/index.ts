import { parseModule, sectionMinutes } from "./parse";
import type { ModuleMeta, Section, StudyModule } from "./types";
import * as m_antidepressants from "@/content/study/antidepressants";
import * as m_antipsychotics from "@/content/study/antipsychotics";
import * as m_anxiety from "@/content/study/anxiety";
import * as m_bipolar from "@/content/study/bipolar";
import * as m_child from "@/content/study/child";
import * as m_depression from "@/content/study/depression";
import * as m_interviewMse from "@/content/study/interview-mse";
import * as m_neurocognitive from "@/content/study/neurocognitive";
import * as m_ocd from "@/content/study/ocd";
import * as m_personality from "@/content/study/personality";
import * as m_psychosis from "@/content/study/psychosis";
import * as m_stabilisers from "@/content/study/stabilisers";
import * as m_substance from "@/content/study/substance";
import * as m_suicide from "@/content/study/suicide";
import * as m_trauma from "@/content/study/trauma";

/**
 * The course, in curriculum order. Add a module by creating its file in
 * src/content/study (meta + text) and listing it here.
 */
const SOURCES: { meta: ModuleMeta; text: string }[] = [m_antidepressants, m_antipsychotics, m_anxiety, m_bipolar, m_child, m_depression, m_interviewMse, m_neurocognitive, m_ocd, m_personality, m_psychosis, m_stabilisers, m_substance, m_suicide, m_trauma];

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
