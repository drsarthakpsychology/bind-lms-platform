import type { Scenario } from "../scenarios";
import { ASSESSMENT } from "./assessment";
import { CRISIS } from "./crisis";
import { EMERGENCY } from "./emergency";
import { LIAISON } from "./liaison";
import { RISK } from "./risk";
import { TREATMENT } from "./treatment";

/** Authored "What would you do?" scenarios, appended after the core set. */
export const SCENARIO_BANK: Scenario[] = [...ASSESSMENT, ...RISK, ...EMERGENCY, ...CRISIS, ...TREATMENT, ...LIAISON];
