/** The MSE Lab passage bank beyond the first 34 (m35 onwards), in files of about 50. */
import type { Excerpt } from "./excerpts";
import { BANK_1 } from "./bank-1";
import { BANK_2 } from "./bank-2";
import { BANK_3 } from "./bank-3";
import { BANK_4 } from "./bank-4";
import { BANK_5 } from "./bank-5";
import { BANK_6 } from "./bank-6";

export const BANK: Excerpt[] = [...BANK_1, ...BANK_2, ...BANK_3, ...BANK_4, ...BANK_5, ...BANK_6];
