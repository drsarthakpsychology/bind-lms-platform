/** OSCE library: every authored batch, built into stations. */
import { buildStation, type LibStation } from "./types";
import { OSCE_BATCH_01 } from "./batch-01";
import { OSCE_BATCH_02 } from "./batch-02";
import { OSCE_BATCH_03 } from "./batch-03";
import { OSCE_BATCH_04 } from "./batch-04";
import { OSCE_BATCH_05 } from "./batch-05";
import { OSCE_BATCH_06 } from "./batch-06";
import { OSCE_BATCH_07 } from "./batch-07";
import { OSCE_BATCH_08 } from "./batch-08";
import { OSCE_BATCH_09 } from "./batch-09";
import { OSCE_BATCH_10 } from "./batch-10";
import { OSCE_BATCH_11 } from "./batch-11";

export const OSCE_LIBRARY_AUTHORED: LibStation[] = [
  ...OSCE_BATCH_01,
  ...OSCE_BATCH_02,
  ...OSCE_BATCH_03,
  ...OSCE_BATCH_04,
  ...OSCE_BATCH_05,
  ...OSCE_BATCH_06,
  ...OSCE_BATCH_07,
  ...OSCE_BATCH_08,
  ...OSCE_BATCH_09,
  ...OSCE_BATCH_10,
  ...OSCE_BATCH_11,
];

export const OSCE_LIBRARY = OSCE_LIBRARY_AUTHORED.map(buildStation);
