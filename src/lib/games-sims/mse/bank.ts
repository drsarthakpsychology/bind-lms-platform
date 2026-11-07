/** The MSE Lab passage bank beyond the first 34 (m35 onwards), in files of about 50. */
import type { Excerpt } from "./excerpts";
import { BANK_1 } from "./bank-1";
import { BANK_2 } from "./bank-2";

export const BANK: Excerpt[] = [...BANK_1, ...BANK_2];
