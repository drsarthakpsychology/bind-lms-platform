import type { LongQA } from "@/lib/prep/long-types";
import { RESEARCH_METHODS_L01 } from "./research-methods-l01";
import { RESEARCH_METHODS_L02 } from "./research-methods-l02";
import { RESEARCH_METHODS_L03 } from "./research-methods-l03";
import { RESEARCH_METHODS_L04 } from "./research-methods-l04";
import { RESEARCH_METHODS_L05 } from "./research-methods-l05";
import { STATISTICS_L01 } from "./statistics-l01";
import { STATISTICS_L02 } from "./statistics-l02";
import { STATISTICS_L03 } from "./statistics-l03";
import { STATISTICS_L04 } from "./statistics-l04";
import { STATISTICS_L05 } from "./statistics-l05";
import { COGNITIVE_L01 } from "./cognitive-l01";
import { COGNITIVE_L02 } from "./cognitive-l02";
import { COGNITIVE_L03 } from "./cognitive-l03";
import { COGNITIVE_L04 } from "./cognitive-l04";
import { COGNITIVE_L05 } from "./cognitive-l05";
import { PERCEPTION_ATTENTION_L01 } from "./perception-attention-l01";
import { PERCEPTION_ATTENTION_L02 } from "./perception-attention-l02";
import { PERCEPTION_ATTENTION_L03 } from "./perception-attention-l03";
import { PERCEPTION_ATTENTION_L04 } from "./perception-attention-l04";
import { PERCEPTION_ATTENTION_L05 } from "./perception-attention-l05";
import { LEARNING_MOTIVATION_EMOTION_L01 } from "./learning-motivation-emotion-l01";
import { LEARNING_MOTIVATION_EMOTION_L02 } from "./learning-motivation-emotion-l02";
import { LEARNING_MOTIVATION_EMOTION_L03 } from "./learning-motivation-emotion-l03";

/** Every hand-written long answer. Writers add part files and spread them in here. */
export const LONG_QA: LongQA[] = [
  ...RESEARCH_METHODS_L01,
  ...RESEARCH_METHODS_L02,
  ...RESEARCH_METHODS_L03,
  ...RESEARCH_METHODS_L04,
  ...RESEARCH_METHODS_L05,
  ...STATISTICS_L01,
  ...STATISTICS_L02,
  ...STATISTICS_L03,
  ...STATISTICS_L04,
  ...STATISTICS_L05,
  ...COGNITIVE_L01,
  ...COGNITIVE_L02,
  ...COGNITIVE_L03,
  ...COGNITIVE_L04,
  ...COGNITIVE_L05,
  ...PERCEPTION_ATTENTION_L01,
  ...PERCEPTION_ATTENTION_L02,
  ...PERCEPTION_ATTENTION_L03,
  ...PERCEPTION_ATTENTION_L04,
  ...PERCEPTION_ATTENTION_L05,
  ...LEARNING_MOTIVATION_EMOTION_L01,
  ...LEARNING_MOTIVATION_EMOTION_L02,
  ...LEARNING_MOTIVATION_EMOTION_L03,
];
