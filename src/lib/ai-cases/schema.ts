/**
 * The JSON the generator must return. Parsed strictly with zod; anything
 * else is rejected before the criteria check even runs.
 */
import { z } from "zod";

const text = (min: number, max: number) => z.string().trim().min(min).max(max);

export const draftSchema = z
  .object({
    place: text(3, 80),
    clues: z.array(text(15, 320)).length(6),
    investigations: z
      .array(
        z
          .object({
            kind: z.enum(["mse", "collateral", "scale", "lab"]),
            label: text(3, 40),
            result: text(10, 320),
          })
          .strict(),
      )
      .min(3)
      .max(5),
    differentials: z
      .array(z.object({ dx: text(2, 40), whyNot: text(20, 300) }).strict())
      .min(2)
      .max(5),
    pointer: text(10, 160),
    overview: text(120, 1200),
    duration: z
      .object({
        value: z.number().min(0).max(100),
        unit: z.enum(["days", "weeks", "months", "years"]),
      })
      .strict()
      .optional(),
  })
  .strict();

export type Draft = z.infer<typeof draftSchema>;
