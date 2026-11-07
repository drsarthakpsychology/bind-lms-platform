/**
 * OSCE LIBRARY: hand-written stations (the 500 plan). Each station is
 * authored compactly and expanded by `buildStation` into the OsceStation
 * shape: the candidate task, the role player's brief, a weighted marking
 * checklist, a global rating and the model performance points.
 */

import type { OsceStation } from "@/lib/practice/osce";
import type { Exam, Level } from "@/lib/sim/library/types";

export interface LibStation {
  id: string;
  title: string;
  task: string;
  lv: Level;
  topic: string;
  mod: string;
  ex: Exam[];
  obj: string;
  role: NonNullable<OsceStation["role"]>;
  brief: string;
  /** checklist items with weight 1 to 3 */
  ck: Array<[string, number]>;
  model: string[];
  /** what the global rating judges, e.g. "risk assessment" */
  gr: string;
  /** minutes, default 7 */
  min?: number;
}

export function buildStation(a: LibStation): OsceStation {
  return {
    id: a.id,
    title: a.title,
    task: a.task,
    duration_seconds: (a.min ?? 7) * 60,
    checklist: a.ck.map(([item, weight]) => ({ item, weight })),
    global_rating: { label: `Global ${a.gr} competence`, max: 5 },
    role: a.role,
    role_brief: a.brief,
    model_points: a.model,
    tags: { topic: a.topic, difficulty: a.lv, objective: a.obj, exams: a.ex, module: a.mod },
  };
}
