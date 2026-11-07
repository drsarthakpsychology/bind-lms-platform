import { parseModule, sectionMinutes } from "./parse";
import type { ModuleMeta, Section, StudyModule } from "./types";
import * as m_antidepressants from "@/content/study/antidepressants";
import * as m_antipsychotics from "@/content/study/antipsychotics";
import * as m_anxiety from "@/content/study/anxiety";
import * as m_applied from "@/content/study/applied";
import * as m_assessment from "@/content/study/assessment";
import * as m_bipolar from "@/content/study/bipolar";
import * as m_brain from "@/content/study/brain";
import * as m_caseSheet from "@/content/study/case-sheet";
import * as m_child from "@/content/study/child";
import * as m_defences from "@/content/study/defences";
import * as m_depression from "@/content/study/depression";
import * as m_ethicsLaw from "@/content/study/ethics-law";
import * as m_interviewMse from "@/content/study/interview-mse";
import * as m_lifespan from "@/content/study/lifespan";
import * as m_learningMemory from "@/content/study/learning-memory";
import * as m_examPrep from "@/content/study/exam-prep";
import * as m_foundations from "@/content/study/foundations";
import * as m_frontiers from "@/content/study/frontiers";
import * as m_medicineProfiles from "@/content/study/medicine-profiles";
import * as m_moreDisorders from "@/content/study/more-disorders";
import * as m_motivationEmotion from "@/content/study/motivation-emotion";
import * as m_netPaper1 from "@/content/study/net-paper1";
import * as m_mseDeep from "@/content/study/mse-deep";
import * as m_neurocognitive from "@/content/study/neurocognitive";
import * as m_ocd from "@/content/study/ocd";
import * as m_personality from "@/content/study/personality";
import * as m_personalityTheories from "@/content/study/personality-theories";
import * as m_psychodynamics from "@/content/study/psychodynamics";
import * as m_psychosis from "@/content/study/psychosis";
import * as m_researchMethods from "@/content/study/research-methods";
import * as m_social from "@/content/study/social";
import * as m_sensationPerception from "@/content/study/sensation-perception";
import * as m_stabilisers from "@/content/study/stabilisers";
import * as m_statistics from "@/content/study/statistics";
import * as m_substance from "@/content/study/substance";
import * as m_suicide from "@/content/study/suicide";
import * as m_therapies from "@/content/study/therapies";
import * as m_thinkingLanguage from "@/content/study/thinking-language";
import * as m_trauma from "@/content/study/trauma";

/**
 * The course, in curriculum order (sorted by module number). Add a module by
 * creating its file in src/content/study (meta + text) and importing it here.
 */
const SOURCES: { meta: ModuleMeta; text: string }[] = [m_antidepressants, m_antipsychotics, m_anxiety, m_applied, m_assessment, m_bipolar, m_brain, m_caseSheet, m_child, m_defences, m_depression, m_ethicsLaw, m_examPrep, m_foundations, m_frontiers, m_interviewMse, m_learningMemory, m_lifespan, m_medicineProfiles, m_moreDisorders, m_motivationEmotion, m_mseDeep, m_netPaper1, m_neurocognitive, m_ocd, m_personality, m_personalityTheories, m_psychodynamics, m_psychosis, m_researchMethods, m_sensationPerception, m_social, m_stabilisers, m_statistics, m_substance, m_suicide, m_therapies, m_thinkingLanguage, m_trauma];

function build(src: { meta: ModuleMeta; text: string }): StudyModule {
  const sections = parseModule(src.text);
  // Honest study time: careful reading with recall checks, plus the written
  // practice (about 45 minutes) and about 15 minutes per activity.
  const reading = sections.reduce((a, s) => a + sectionMinutes(s), 0);
  return { ...src.meta, sections, minutes: reading + 45 + src.meta.activities.length * 15 };
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
