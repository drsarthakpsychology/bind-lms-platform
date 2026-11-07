import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bookmark, Clock, MessagesSquare, Sparkles, type LucideIcon } from "lucide-react";
import { requireFeature } from "@/lib/flags";
import { PREP_EXAMS, PREP_TITLE } from "@/lib/prep/catalog";
import { loadHome } from "@/lib/prep/path";
import { cn } from "@/lib/utils";
import { ListRow, PrepFrame, PrepHero, card, pctText } from "./ui";
import { prepViewer } from "./viewer";

export const metadata: Metadata = { title: PREP_TITLE, description: `A question bank with answers and explanations for ${PREP_EXAMS.join(", ")}.` };

/**
 * /prep: the question bank. One next step (pick up where you left off, or
 * Smart practice), four tools, then every subject. Nothing is locked: any
 * subject, topic or set, any time. NET Paper 1 (the general paper) is last
 * and optional.
 */
export default async function PrepPage() {
  await requireFeature("learn");
  const me = await prepViewer();
  const home = await loadHome(me.id);
  const core = home.subjects.filter((s) => !s.optional);
  const optional = home.subjects.filter((s) => s.optional);

  return (
    <PrepFrame>
      <PrepHero />

      {!me.learner ? <p className="rounded-md border-2 border-dashed border-foreground/50 p-3 text-sm text-muted-foreground">Staff preview: answers are not saved.</p> : null}

      {home.resume ? (
        <Link href={home.resume.href} className="group block rounded-md border-2 border-foreground bg-primary p-4 text-primary-foreground hard-shadow-md transition-transform duration-150 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 sm:p-5">
          <span className="text-eyebrow">Continue</span>
          <span className="mt-1 block text-xl font-bold leading-tight [overflow-wrap:anywhere] sm:text-2xl">{home.resume.topicTitle}</span>
          <span className="mt-1 block text-sm opacity-85 [overflow-wrap:anywhere]">
            {home.resume.subjectTitle} · Set {home.resume.set + 1} of {home.resume.sets} · Question {home.resume.index + 1}
          </span>
          <span className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-md border-2 border-foreground bg-foreground px-4 text-sm font-bold text-background">
            Pick up where you left off <ArrowRight className="size-4" aria-hidden />
          </span>
        </Link>
      ) : (
        <Link href="/prep/smart" className="group block rounded-md border-2 border-foreground bg-primary p-4 text-primary-foreground hard-shadow-md transition-transform duration-150 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 sm:p-5">
          <span className="text-eyebrow">Start here</span>
          <span className="mt-1 block text-xl font-bold leading-tight sm:text-2xl">10 questions to get going</span>
          <span className="mt-1 block text-sm opacity-85">Or pick any subject below.</span>
          <span className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-md border-2 border-foreground bg-foreground px-4 text-sm font-bold text-background">
            Start <ArrowRight className="size-4" aria-hidden />
          </span>
        </Link>
      )}

      <nav aria-label="Practice tools" className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2">
        <Tool href="/prep/smart" icon={Sparkles} title="Smart practice" text="10 from your weak topics and missed questions" />
        <Tool href="/prep/mock" icon={Clock} title="Mock tests" text="Timed papers with marking" />
        <Tool href="/prep/interview" icon={MessagesSquare} title="Mock interview" text="Practise for the panel" />
        <Tool href={home.saved || !home.wrong ? "/prep/saved" : "/prep/wrong"} icon={Bookmark} title="Saved and wrong" text={home.canSave ? `${home.saved} saved · ${home.wrong} wrong` : `${home.wrong} to look at again`} />
      </nav>

      <section aria-labelledby="subjects" className="space-y-3">
        <h2 id="subjects" className="text-h2">
          Subjects
        </h2>
        {core.length ? (
          <ul className="space-y-2">
            {core.map((s) => (
              <li key={s.subject}>
                <ListRow href={`/prep/${s.subject}`} title={s.title} sub={`${s.stats.total} questions`} side={pctText(s.stats)} stats={s.stats} />
              </li>
            ))}
          </ul>
        ) : (
          <p className={cn(card, "text-muted-foreground")}>Questions are being added.</p>
        )}
        {optional.length ? (
          <ul className="space-y-2 border-t-2 border-dashed border-foreground/40 pt-3">
            {optional.map((s) => (
              <li key={s.subject}>
                <ListRow href={`/prep/${s.subject}`} title="UGC NET Paper 1: general paper" tag="Optional" sub={`${s.stats.total} questions on teaching, research and reasoning`} side={pctText(s.stats)} stats={s.stats} />
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </PrepFrame>
  );
}

function Tool({ href, icon: Icon, title, text }: { href: string; icon: LucideIcon; title: string; text: string }) {
  return (
    <Link
      href={href}
      className="flex min-h-16 items-start gap-3 rounded-md border-2 border-foreground bg-card p-3 transition-transform duration-150 hover:-translate-y-0.5 hover:hard-shadow-sm active:translate-y-px motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-md border-2 border-foreground bg-secondary" aria-hidden>
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-bold leading-tight">{title}</span>
        <span className="mt-0.5 block text-sm text-muted-foreground [overflow-wrap:anywhere]">{text}</span>
      </span>
    </Link>
  );
}
