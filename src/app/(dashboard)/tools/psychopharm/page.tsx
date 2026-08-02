import { PsychSearch } from "@/components/psychopharm/psych-search";
import { STANDING_NOTICE } from "@/lib/psychopharm/forbidden-phrases";

/**
 * Landing screen for the psychopharm tool. One field, autofocused, nothing
 * else (D1). A student in a two-minute gap types a name and gets an answer.
 */
export default function PsychSearchPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-8 px-4">
      <div className="text-center">
        <p className="text-eyebrow text-muted-foreground">Psychopharmacology reference</p>
        <h1 className="mt-1 text-h1">What is your client on?</h1>
        <p className="mx-auto mt-2 max-w-md text-small text-muted-foreground">
          A person looks something up in a two-minute gap. That&apos;s this tool.
        </p>
      </div>

      <PsychSearch className="w-full max-w-2xl" />

      <p className="max-w-md text-center text-caption text-muted-foreground">
        {STANDING_NOTICE}
      </p>
    </div>
  );
}