import type { PrepExam } from "@/lib/prep/types";
import { builder } from "./_qb4";

/**
 * Shared helpers for the psychopharmacology part files (psychopharmacology-x01.ts onwards).
 * Tag honestly: md-psychiatry for MD depth; clinical psychology entrances and NET only where
 * the item is within their syllabus (mechanisms, side effects, basic principles).
 */
export const MD: PrepExam[] = ["md-psychiatry"];
export const MD_MCP: PrepExam[] = ["md-psychiatry", "mcp-entrance"];
export const MD_MCP_NET: PrepExam[] = ["md-psychiatry", "mcp-entrance", "ugc-net"];
export const MD_BROAD: PrepExam[] = ["md-psychiatry", "mcp-entrance", "ugc-net", "ma-semester"];
export const MD_ALL: PrepExam[] = ["md-psychiatry", "mcp-entrance", "ugc-net", "cuet-pg", "ma-semester"];

export const Q = builder("psychopharmacology", "medicine-profiles");
