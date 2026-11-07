import type { FigureDef } from "../types";
import { CLASSICS } from "./classics";
import { CURVES } from "./curves";
import { EEG } from "./eeg";
import { PHARM } from "./pharm";
import { STUDIES } from "./studies";

/** Clinical and psychology charts and schematics. Add files and spread them in. */
export const CHARTS: FigureDef[] = [...PHARM, ...EEG, ...CURVES, ...STUDIES, ...CLASSICS];
