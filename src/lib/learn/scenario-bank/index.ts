import type { Scenario } from "../scenarios";
import { ASSESSMENT } from "./assessment";
import { CRISIS } from "./crisis";
import { EMERGENCY } from "./emergency";
import { RISK } from "./risk";

/** Authored "What would you do?" scenarios, appended after the core set. */
export const SCENARIO_BANK: Scenario[] = [...ASSESSMENT, ...RISK, ...EMERGENCY, ...CRISIS];
