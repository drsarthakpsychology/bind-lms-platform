"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { DOMAIN_UNITS, MSE_DOMAIN_ORDER } from "@/lib/mse/ladder";
import { MSE_VOCAB } from "@/lib/practice/mse";
import { SEED_MSE_STIMULI } from "@/lib/practice/mse";
import { buildMseAttemptPayload, scoreMseLevel2Attempt } from "@/lib/practice/mse-attempt";

/**
 * MSE Level 2 — Domain by domain. One of the 11 domains at a time, in the
 * documented order, with the controlled vocabulary. The student tags the
 * stimulus against the expert coding (green/amber). They cannot skip ahead:
 * the domain only advances once tagged.
 */
export function DomainLevel({ onComplete }: { onComplete?: () => void }) {
  const [domainIdx, setDomainIdx] = React.useState(0);
  const [stimulusIdx, setStimulusIdx] = React.useState(0);
  const [picked, setPicked] = React.useState<string[]>([]);
  const [revealed, setRevealed] = React.useState(false);
  // The attempt window for the current stimulus starts when the level opens
  // (or when the previous stimulus's Next resets it).
  const [startedAt, setStartedAt] = React.useState(() => new Date());

  // Focus management: after check/reveal, focus the "Next" button
  const nextButtonRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (revealed && nextButtonRef.current) {
      nextButtonRef.current.focus();
    }
  }, [revealed]);

  const domain = MSE_DOMAIN_ORDER[domainIdx];
  const unit = DOMAIN_UNITS.find((u) => u.domain === domain);
  const vocab = MSE_VOCAB[domain];
  // Stimuli for this domain (expert-tagged). Fall back to any remaining.
  const domainStimuli = SEED_MSE_STIMULI.filter((s) => s.domain === domain);
  const stimulus = domainStimuli[stimulusIdx] ?? SEED_MSE_STIMULI[stimulusIdx % SEED_MSE_STIMULI.length];

  function toggleTag(tag: string) {
    if (revealed) return;
    setPicked((p) => (p.includes(tag) ? p.filter((t) => t !== tag) : [...p, tag]));
    haptic("tap");
  }

  function check() {
    setRevealed(true);
    haptic("success");
  }

  /** Persist the just-scored stimulus attempt (a check, not a test — silent on failure). */
  async function persistStimulus() {
    const completedAt = new Date();
    const payload = buildMseAttemptPayload(
      stimulus,
      "2",
      {
        domain,
        score: scoreMseLevel2Attempt(picked, stimulus.expertTags, stimulus.amberTags ?? []),
        picked,
        expert: stimulus.expertTags,
        amber: stimulus.amberTags ?? [],
      },
      startedAt,
      completedAt,
    );
    await fetch("/api/practice/mse/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {}); // silent; a check, not a test
    setStartedAt(new Date());
  }

  function next() {
    setPicked([]);
    setRevealed(false);
    if (stimulusIdx + 1 < domainStimuli.length) {
      setStimulusIdx((i) => i + 1);
    } else {
      setStimulusIdx(0);
      setDomainIdx((d) => d + 1);
    }
  }

  const done = domainIdx >= MSE_DOMAIN_ORDER.length;

  return (
    <div className="space-y-4 rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
      <div className="flex items-center justify-between text-small text-muted-foreground">
        <span>
          Level 2 · Domain {domainIdx + 1}/{MSE_DOMAIN_ORDER.length}
        </span>
        <span>{done ? "all domains" : unit?.domain}</span>
      </div>

      {done ? (
        <div className="space-y-3">
          <p className="text-small text-green-700" role="status">
            All 11 domains tagged. You now hold the discipline: one domain at a
            time, controlled vocabulary, in order.
          </p>
          {onComplete ? (
            <button
              type="button"
              onClick={() => { haptic("success"); onComplete(); }}
              className="rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
            >
              Mark Level 2 complete — unlock the confusable pairs
            </button>
          ) : null}
        </div>
      ) : (
        <>
          <div className="rounded-md border border-border bg-background p-4">
            {unit ? (
              <>
                <p className="text-caption font-semibold text-muted-foreground">Probe</p>
                <p className="mt-1 text-small">{unit.probe}</p>
                <p className="mt-2 text-caption text-muted-foreground">
                  Looking for: {unit.whatYoureLookingFor}
                </p>
              </>
            ) : null}
          </div>

          <div className="rounded-md border border-border bg-background p-4">
            <p className="text-small leading-relaxed">{stimulus.content}</p>
          </div>

          <div>
            <p className="text-small text-muted-foreground">
              Tag the observations with the controlled vocabulary for{" "}
              <span className="font-semibold">{unit?.domain}</span>.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {vocab.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  aria-pressed={picked.includes(tag)}
                  className={cn(
                    "rounded-md border-2 border-border px-3 py-1.5 text-caption transition-transform active:translate-y-px",
                    picked.includes(tag) && !revealed && "bg-primary text-primary-foreground",
                    revealed && (stimulus.expertTags.includes(tag) || (stimulus.amberTags ?? []).includes(tag)) && "bg-green-100 text-green-800",
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {!revealed ? (
            <button
              type="button"
              onClick={check}
              disabled={picked.length === 0}
              className="rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px disabled:opacity-50"
            >
              Check
            </button>
          ) : (
            <div className="space-y-2 rounded-md border border-border bg-background p-3">
              <p className="text-small">
                <span className="font-semibold text-green-700">Expert: </span>
                {stimulus.expertTags.join(", ")}
              </p>
              {stimulus.amberTags?.length ? (
                <p className="text-small text-amber-700">
                  <span className="font-semibold">Defensible: </span>
                  {stimulus.amberTags.join(", ")}
                </p>
              ) : null}
              <button
                ref={nextButtonRef}
                type="button"
                onClick={() => {
                  void persistStimulus();
                  next();
                }}
                className="mt-1 rounded-md border-2 border-border bg-primary px-4 py-1.5 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
              >
                Next in {unit?.domain}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
