/** All prescription checks, gathered from the hand-written sets. */
import { REVIEWS_A } from "./reviews-a";
import { REVIEWS_B } from "./reviews-b";
import { REVIEWS_C } from "./reviews-c";
export type { Review } from "./review-kit";

export const REVIEWS = [...REVIEWS_A, ...REVIEWS_B, ...REVIEWS_C];
