/** Formulation library: every authored batch, built into Forge cases. */
import { buildFormulation, type LibFormulation } from "./types";
import { FORM_BATCH_01 } from "./batch-01";
import { FORM_BATCH_02 } from "./batch-02";
import { FORM_BATCH_03 } from "./batch-03";
import { FORM_BATCH_04 } from "./batch-04";
import { FORM_BATCH_05 } from "./batch-05";
import { FORM_BATCH_06 } from "./batch-06";
import { FORM_BATCH_07 } from "./batch-07";
import { FORM_BATCH_08 } from "./batch-08";
import { FORM_BATCH_09 } from "./batch-09";
import { FORM_BATCH_10 } from "./batch-10";
import { FORM_BATCH_11 } from "./batch-11";
import { FORM_BATCH_12 } from "./batch-12";

export const FORMULATION_LIBRARY_AUTHORED: LibFormulation[] = [
  ...FORM_BATCH_01,
  ...FORM_BATCH_02,
  ...FORM_BATCH_03,
  ...FORM_BATCH_04,
  ...FORM_BATCH_05,
  ...FORM_BATCH_06,
  ...FORM_BATCH_07,
  ...FORM_BATCH_08,
  ...FORM_BATCH_09,
  ...FORM_BATCH_10,
  ...FORM_BATCH_11,
  ...FORM_BATCH_12,
];

export const FORMULATION_LIBRARY = FORMULATION_LIBRARY_AUTHORED.map(buildFormulation);
