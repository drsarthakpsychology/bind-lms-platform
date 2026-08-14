import { BookOpen } from "lucide-react";
import { PsychSearch } from "@/components/psychopharm/psych-search";
import { MobileHeader } from "@/components/mobile/mobile-header";
import { MobileCard } from "@/components/mobile/mobile-card";
import { STANDING_NOTICE } from "@/lib/psychopharm/forbidden-phrases";

/**
 * Landing screen for the psychopharm tool. One field, autofocused, nothing
 * else (D1). A student in a two-minute gap types a name and gets an answer.
 * The "browse by mechanism" entry point sits directly under the search field.
 *
 * Mobile: top-aligned (the search field sits in the thumb zone, not mid-screen)
 * with a title header for context; the shell supplies the top bar + tab bar.
 * Desktop keeps the centered hero.
 */
export default function PsychSearchPage() {
  return (
    <div className="flex flex-col">
      <MobileHeader
        className="lg:hidden"
        inset={false}
        title="Psychopharm"
        subtitle="Medication reference"
      />

      <div className="flex flex-col items-center gap-8 px-4 pt-6 lg:min-h-[70vh] lg:justify-center lg:pt-0">
        <div className="text-center">
          <p className="text-eyebrow text-muted-foreground">Psychopharmacology reference</p>
          <h1 className="mt-1 text-h1">What is your client on?</h1>
          <p className="mx-auto mt-2 max-w-md text-small text-muted-foreground">
            A person looks something up in a two-minute gap. That&apos;s this tool.
          </p>
        </div>

        <PsychSearch className="w-full max-w-2xl" />

        <MobileCard
          href="/tools/psychopharm/learn"
          leading={<BookOpen className="size-5" aria-hidden />}
          title="Browse by mechanism"
          description="Drugs that touch the same receptor group, together."
          className="w-full max-w-2xl"
        />

        <p className="max-w-md text-center text-caption text-muted-foreground">
          {STANDING_NOTICE}
        </p>
      </div>
    </div>
  );
}
