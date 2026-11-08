import type { Metadata } from "next";
import Link from "next/link";
import { ActivityFrame } from "@/components/study/activity-frame";
import { ActivityTip } from "@/components/help/activity-tip";
import { isFeatureEnabled, requireFeature } from "@/lib/flags";
import { Detective } from "@/components/learn/detective";
import { randomClinicStart } from "@/lib/practice/clinic";
import { TwoMinuteClinic } from "../two-minute-clinic/clinic";
import { loadLearnState, saveLearnState } from "../../study/actions";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Clinic detective" };

/**
 * Clinic detective: diagnostic reasoning from a presentation, in two modes.
 * - Clues (default): name the disorder or medicine from clues, one at a time.
 * - Two-minute clinic (when its switch `two_minute_clinic` is on): one
 *   clinical line, type a differential and the next question, then compare
 *   with the expert. It used to be its own Practice tile; it lives here now so
 *   Practice has one place for "reason from the presentation".
 */
export default async function DetectivePage({ searchParams }: { searchParams: Promise<{ mode?: string; from?: string }> }) {
  await requireFeature("learn");
  const [{ mode, from }, clinicOn] = await Promise.all([searchParams, isFeatureEnabled("two_minute_clinic")]);
  const clinic = clinicOn && mode === "clinic";
  const keep = from ? `&from=${encodeURIComponent(from)}` : "";

  const tabs = clinicOn ? (
    <nav aria-label="Mode" className="flex gap-2 px-4 pt-3 pb-1 lg:px-6">
      {[
        { key: "clues", label: "Clues", href: `/practice/detective?mode=clues${keep}`, on: !clinic },
        { key: "clinic", label: "Two-minute clinic", href: `/practice/detective?mode=clinic${keep}`, on: clinic },
      ].map((t) => (
        <Link
          key={t.key}
          href={t.href}
          aria-current={t.on ? "page" : undefined}
          className={cn(
            "inline-flex min-h-11 items-center rounded-full border-2 border-foreground px-4 text-sm font-semibold",
            t.on ? "bg-foreground text-background" : "bg-card",
          )}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  ) : null;

  if (clinic) {
    // A fresh starting line on each visit (the page is rendered per request).
    const start = randomClinicStart();
    return (
      <ActivityFrame fallback="/practice" title="Two-minute clinic">
        {tabs}
        <ActivityTip id="two-minute-clinic" label="How it works" steps={["Read the line, then start the clock.", "Type your top diagnoses and the one question you would ask next."]} />
        <div className="p-4 lg:p-6">
          <TwoMinuteClinic start={start} />
        </div>
      </ActivityFrame>
    );
  }

  const serverState = await loadLearnState();
  return (
    <ActivityFrame
      fallback="/practice"
      title="Clinic detective"
    >
      {tabs}
      <ActivityTip id="clinic-detective" label="How it works" steps={["Guess, or open another clue.", "Fewer clues, more points. Wrong guesses cost points."]} />
      <Detective serverState={serverState} save={saveLearnState} />
    </ActivityFrame>
  );
}
