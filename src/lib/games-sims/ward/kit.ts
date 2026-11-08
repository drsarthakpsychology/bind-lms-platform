/** Compact authoring helpers for Ward Week campaigns (no runtime imports from campaigns.ts). */
import type { PrepExam } from "@/lib/prep/types";
import type { ItemTags, Level } from "../item-tags";
import type { Quality, Vars, WardOption } from "./engine";

export const o = (id: string, q: Quality, text: string, why: string, fx: Partial<Vars> = {}, set: string[] = []): WardOption => ({ id, q, text, why, fx, set });

const EXAMS: PrepExam[] = ["mcp-entrance", "md-psychiatry", "ma-semester"];

/** Tags for a whole campaign: a full case on the ladder unless set lower. */
export const tags = (topic: string, learn: string, objective: string, level: Level = 5, exams: PrepExam[] = EXAMS): ItemTags => ({ topic, level, objective, exams, learn });
