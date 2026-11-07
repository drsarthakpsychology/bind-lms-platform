import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./lifespan-1";
import { exam, part2 } from "./lifespan-2";
import { qa } from "./lifespan-qa";

export const meta: ModuleMeta = {
  id: "lifespan",
  num: 49,
  title: "Lifespan development",
  emoji: "🌱",
  tagline: "From conception to the end of life: the principles, the research designs, the big theories, adolescence, ageing, death and grief",
  when: "Open to all levels",
  outcomes: [
    "Explain the principles of lifespan development, nature-nurture interplay and Bronfenbrenner's systems, and choose the right research design for a question about change",
    "Describe prenatal development, the main teratogens, birth and the newborn's reflexes, senses and motor milestones, with Indian public-health context",
    "Compare Piaget, Vygotsky and information-processing accounts of cognitive development, with the key experiments and their critiques",
    "Apply Erikson, Marcia, attachment theory, temperament research and theories of moral development to real children and adults",
    "Describe language, emotional and social development, adolescence and emerging adulthood",
    "Explain adult development (Levinson, Vaillant), cognitive and biological ageing, successful ageing, and death, dying and grief",
    "Apply developmental ideas in schools, including guidance and counselling in India",
  ],
  writeTask:
    "On paper, from memory: Baltes' lifespan principles; Bronfenbrenner's five systems with an Indian example each; cross-sectional, longitudinal and sequential designs with one problem each; the three prenatal periods; six newborn reflexes; Piaget's four stages with a key achievement each; ZPD and scaffolding; Erikson's eight stages with virtues; Marcia's four statuses; Ainsworth's four attachment patterns; Thomas and Chess's three temperament types; Kohlberg's six stages; Levinson's eras; SOC; Kübler-Ross's five stages with the critique; and the dual process model of grief. Then check and correct in red.",
  activities: [
    act.lesson("ls-1", "Quiz: childhood", "Where normal development ends and disorders begin."),
    act.lesson("ls-2", "Quiz: delirium and dementia", "Normal ageing versus neurocognitive disorder."),
    act.coach("counselling", "Coach: counselling", "Talking with grieving families and anxious parents."),
  ],
};

export const text = part1 + part2 + qa + exam;
