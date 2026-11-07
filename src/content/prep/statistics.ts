import type { PrepQuestion } from "@/lib/prep/types";
import { QUESTIONS as part1 } from "./statistics-1";
import { QUESTIONS as part2 } from "./statistics-2";
import { QUESTIONS as part3 } from "./statistics-3";
import { QUESTIONS as part4 } from "./statistics-4";
import { QUESTIONS as part5 } from "./statistics-5";
import { QUESTIONS as part6 } from "./statistics-6";
import { QUESTIONS as part7 } from "./statistics-7";
import { QUESTIONS as part8 } from "./statistics-8";
import { QUESTIONS as part9 } from "./statistics-9";
import { QUESTIONS as part10 } from "./statistics-10";
import { QUESTIONS as qx2p1 } from "./statistics-qx2-1";
import { QUESTIONS as qx2p2 } from "./statistics-qx2-2";
import { QUESTIONS as qx2p3 } from "./statistics-qx2-3";
import { QUESTIONS as qx2p4 } from "./statistics-qx2-4";
import { QUESTIONS as qx2p5 } from "./statistics-qx2-5";

/** Question bank · statistics. Parts live in statistics-<n>.ts. */
/** Ordered from foundations (difficulty 1) to research level (difficulty 4); the sort is stable, so topic order is kept within each level. */
export const QUESTIONS: PrepQuestion[] = [...part1, ...part2, ...part3, ...part4, ...part5, ...part6, ...part7, ...part8, ...part9, ...part10, ...qx2p1, ...qx2p2, ...qx2p3, ...qx2p4, ...qx2p5].sort((a, b) => a.difficulty - b.difficulty);
