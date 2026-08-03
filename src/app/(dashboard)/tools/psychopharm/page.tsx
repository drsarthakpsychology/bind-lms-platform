import Link from "next/link";
import { BookOpen } from "lucide-react";
import { PsychSearch } from "@/components/psychopharm/psych-search";
import { STANDING_NOTICE } from "@/lib/psychopharm/forbidden-phrases";

/**
 * Landing screen for the psychopharm tool. One field, autofocused, nothing
 * else (D1). A student in a two-minute gap types a name and gets an answer.
 * The "browse by mechanism" entry point sits directly under the search field.
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

      <Link
        href="/tools/psychopharm/learn"
        className="group flex w-full max-w-2xl items-center gap-3 rounded-md border-2 border-foreground bg-card p-4 text-left hard-shadow-sm transition-[transform,box-shadow] active:translate-y-px active:hard-shadow-none"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md border-2 border-border bg-secondary text-primary">
          <BookOpen className="size-5" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block text-eyebrow text-muted-foreground">Learning</span>
          <span className="block text-base font-semibold">Browse by mechanism</span>
          <span className="block text-small text-muted-foreground">
            Drugs that touch the same receptor group, together.
          </span>
        </span>
      </Link>

      <p className="max-w-md text-center text-caption text-muted-foreground">
        {STANDING_NOTICE}
      </p>
    </div>
  );
}