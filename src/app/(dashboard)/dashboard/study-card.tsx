import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { readFlags } from "@/lib/flags";
import { MODULES } from "@/lib/study";
import { studyTime } from "@/lib/study/plan";

/** Home: one clear way into the course, shown only once Study is unlocked. */
export async function StudyCard() {
  if ((await readFlags()).learn !== "unlocked") return null;
  const minutes = MODULES.reduce((a, m) => a + m.minutes, 0);
  return (
    <Link
      href="/study"
      className="btn-sweep flex items-center gap-4 rounded-3xl border-2 border-foreground bg-primary p-5 text-primary-foreground hard-shadow-md transition-transform active:translate-y-0.5"
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl border-2 border-foreground bg-card text-foreground">
        <BookOpen className="size-6" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-black uppercase opacity-80">Study</span>
        <span className="block text-xl font-black leading-tight">Continue your course</span>
        <span className="text-sm font-semibold opacity-80">
          {MODULES.length} modules · {studyTime(minutes)} · we keep your place
        </span>
      </span>
      <ArrowRight className="size-6 shrink-0" aria-hidden />
    </Link>
  );
}
