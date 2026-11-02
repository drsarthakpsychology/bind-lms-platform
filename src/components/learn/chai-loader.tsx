import { Chai } from "./chai";
import s from "./learn.module.css";

const TIPS = [
  "Anhedonia = loss of pleasure. An-hedone: without pleasure.",
  "Lithium + ibuprofen can push lithium levels up.",
  "Delirium fluctuates. Dementia creeps.",
  "Mood is what they tell you. Affect is what you see.",
  "Akathisia: can't sit still, often from antipsychotics.",
  "Asking about suicide does not put the idea in someone's head.",
];

/** Branded loading screen: Chai bobbing, plus a quick study tip. */
export function ChaiLoader({ label = "Loading", tip = 0 }: { label?: string; tip?: number }) {
  return (
    <div role="status" aria-live="polite" className={`flex min-h-[60dvh] flex-col items-center justify-center gap-4 px-6 text-center ${s.texture}`}>
      <span className={s.loader}>
        <Chai mood="think" size={110} />
      </span>
      <p className="text-lg font-black">
        {label}
        <span className={s.dots} aria-hidden>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </p>
      <p className="max-w-sm rounded-2xl border-2 border-foreground bg-card px-4 py-2 text-sm font-semibold">
        <span className="text-eyebrow text-link">Quick tip</span>
        <br />
        {TIPS[tip % TIPS.length]}
      </p>
    </div>
  );
}
