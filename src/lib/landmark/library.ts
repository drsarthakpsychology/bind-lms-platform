/**
 * LANDMARK LIBRARY: verified cases only (legal judgments, history of
 * psychiatry, famous patients, classic studies). Every fact here is a
 * matter of public record; nothing is invented. Written in the programme's
 * own words, with what was believed then, what holds now, and where the
 * case is contested or broke ethics.
 */

import type { LandmarkCase } from "./cases";
import { LANDMARK_LEGAL } from "./library-legal";
import { LANDMARK_LEGAL_B } from "./library-legal-b";
import { LANDMARK_HISTORY } from "./library-history";
import { LANDMARK_STUDIES } from "./library-studies";
import { LANDMARK_PATIENTS } from "./library-patients";

export const LANDMARK_LIBRARY: LandmarkCase[] = [...LANDMARK_LEGAL, ...LANDMARK_LEGAL_B, ...LANDMARK_HISTORY, ...LANDMARK_STUDIES, ...LANDMARK_PATIENTS];
