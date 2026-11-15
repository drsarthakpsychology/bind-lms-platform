"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ListOrdered } from "lucide-react";
import { ViewToggle } from "@/components/learn/view-toggle";
import { MobileBottomSheet } from "@/components/mobile/mobile-bottom-sheet";
import { BackLink } from "@/components/ds";
import { cn } from "@/lib/utils";
import { CardDeck, TestRunner } from "./interactive";
import { SectionMarks } from "./marks";
import { Toc, useReading, type SectionReaderProps } from "./reader";
import s from "./study.module.css";

const quietButton =
  "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[var(--ds-radius)] border-[1.5px] border-[var(--ds-card-line)] px-5 type-body font-semibold outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:border-foreground focus-visible:ring-2 focus-visible:ring-ring active:bg-[var(--ds-tint)]";
const limeButton =
  "inline-flex min-h-[3.25rem] min-w-0 items-center justify-center gap-2 rounded-[var(--ds-radius)] border-2 border-foreground bg-primary px-5 text-center type-body font-bold text-primary-foreground hard-shadow-sm outline-none transition-[transform,box-shadow] duration-[var(--ds-press)] ease-[var(--ds-ease)] focus-visible:ring-[3px] focus-visible:ring-ring/60 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none";

/**
 * The reading screen in the new design: an editorial page. Reading type on a
 * 65 to 68 character line, no boxes around the text, one toolbar row, the
 * section list in a bottom sheet on phones and a quiet rail on desktop.
 * All state comes from useReading (reader.tsx), the same as the old screen.
 */
export function SectionReaderV2(props: SectionReaderProps) {
  const { moduleId, moduleNum, moduleTitle, section, toc, prevHref, next, chunks, viva, mcq, owner = "", gradeTest } = props;
  const { st, wide, tocOpen, setTocOpen, done, step, partRefs, topRef, index, readCount, readTotal, atEnd, hasCheck, go, finish, shownParts } = useReading(props);
  const reading = !section.isTest && !section.levelCheck;

  const finishButton = (
    <button type="button" onClick={finish} className={cn(limeButton, "w-full justify-between text-left")}>
      <span className="flex min-w-0 flex-col">
        <span className="type-caption opacity-80">{done ? "Next" : "Finish this section"}</span>
        <span className="[overflow-wrap:anywhere]">{next.label}</span>
      </span>
      <ArrowRight className="size-5 shrink-0" aria-hidden />
    </button>
  );

  return (
    <div data-ds="page" className="ds-page mx-auto w-full min-w-0 max-w-6xl px-1 sm:px-0 md:grid md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
      <aside className="hidden md:block" aria-label="Module contents">
        <div className="sticky top-[calc(var(--top-h)+1.5rem)] flex max-h-[calc(100dvh-var(--top-h)-3rem)] flex-col gap-2">
          <BackLink href={`/study/${moduleId}`}>Module {moduleNum}</BackLink>
          <p className="type-small text-muted-foreground type-num">
            {readCount} of {readTotal} read
          </p>
          <div className="-ml-2 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-2">
            <Toc items={toc} moduleId={moduleId} current={section.id} done={st.study.done} />
          </div>
        </div>
      </aside>

      <article className="min-w-0 pb-28 md:pb-0">
        <div ref={topRef} className="scroll-mt-shell" />
        {/* Phones: the way back and the section list, one quiet row. */}
        <div className="mb-2 flex min-w-0 items-center justify-between gap-3 md:hidden">
          <BackLink href={`/study/${moduleId}`}>Module {moduleNum}</BackLink>
          <button
            type="button"
            onClick={() => setTocOpen(true)}
            aria-haspopup="dialog"
            className="-mr-2 inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg px-2 type-small font-semibold outline-none transition-colors hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ListOrdered className="size-4 shrink-0" aria-hidden />
            <span className="type-num">
              Section {index + 1} of {toc.length}
            </span>
          </button>
        </div>
        {!wide ? (
          <MobileBottomSheet open={tocOpen} onOpenChange={setTocOpen} title={`Module ${moduleNum}: ${readCount} of ${readTotal} read`}>
            <Toc items={toc} moduleId={moduleId} current={section.id} done={st.study.done} onPick={() => setTocOpen(false)} />
          </MobileBottomSheet>
        ) : null}

        <header className="mb-8 flex max-w-[68ch] min-w-0 flex-col gap-3">
          <p className="type-small text-muted-foreground [overflow-wrap:anywhere]">
            {moduleTitle}
            {section.part ? ` · ${section.part.replace(/^Part [IVX]+ · /, "")}` : ""}
          </p>
          <h1 className="type-h1 [overflow-wrap:anywhere]">
            {section.isTest ? null : <span className="mr-2 text-muted-foreground type-num">{section.num}</span>}
            {section.title}
          </h1>
          {section.tag || done ? (
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 type-small text-muted-foreground">
              {section.tag === "core" ? <span className="font-semibold text-foreground">Core, must know</span> : null}
              {section.tag === "extra" ? <span>Extra, read once</span> : null}
              {done ? (
                <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                  <span aria-hidden className="grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  Done
                </span>
              ) : null}
            </p>
          ) : null}
          {reading && chunks.length > 1 ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-1 gap-1" aria-hidden>
                {chunks.map((_, k) => (
                  <span key={k} className={cn("h-1 flex-1 rounded-full transition-colors duration-[var(--ds-state)]", k <= step ? "bg-foreground" : "bg-[var(--ds-hairline)]")} />
                ))}
              </div>
              <span className="shrink-0 type-caption text-muted-foreground type-num">{atEnd ? "All parts read" : `Part ${step + 1} of ${chunks.length}`}</span>
            </div>
          ) : null}
          {/* One toolbar row: explanation style, bookmark, my note. */}
          {!section.isTest ? (
            <SectionMarks key={section.id} owner={owner} moduleId={moduleId} sectionId={section.id} sectionLabel={`${section.num} ${section.title}`} lead={section.views ? <ViewToggle className="flex w-full border-[1.5px] border-[var(--ds-card-line)] bg-transparent sm:inline-flex sm:w-auto" /> : undefined} />
          ) : section.views ? (
            <div>
              <ViewToggle className="border-[1.5px] border-[var(--ds-card-line)] bg-transparent" />
            </div>
          ) : null}
        </header>

        {section.levelCheck ? (
          <div className="flex max-w-[68ch] flex-col gap-8">
            {chunks.map((c, k) => (
              <div key={k}>{c.node}</div>
            ))}
            <TestRunner items={mcq} moduleId={`${moduleId}@${section.levelCheck}`} historyTool="study-check" label="Check yourself" intro={[]} />
            {finishButton}
          </div>
        ) : (
          <div className="flex max-w-[68ch] flex-col gap-10">
            {shownParts.map((k) => (
              <div
                key={k}
                ref={(el) => {
                  partRefs.current[k] = el;
                }}
                className={cn("scroll-mt-shell", k > 0 && wide && !section.isTest && "border-t border-[var(--ds-hairline)] pt-10", s.reveal)}
              >
                {chunks[k].node}
              </div>
            ))}

            {section.isTest ? <TestRunner items={mcq} moduleId={moduleId} grade={gradeTest} /> : null}

            {/* Desktop: continue to the next part */}
            {wide && !section.isTest && !atEnd ? (
              <button type="button" onClick={() => go(step + 1)} className={cn(quietButton, "group justify-between py-3 text-left")}>
                <span className="flex min-w-0 flex-col">
                  <span className="type-caption text-muted-foreground type-num">{step + 1 < chunks.length ? `Continue · part ${step + 2} of ${chunks.length}` : "Continue"}</span>
                  <span className="[overflow-wrap:anywhere]">{step + 1 < chunks.length ? chunks[step + 1].title : hasCheck ? "Check yourself" : "Finish the section"}</span>
                </span>
                <ArrowRight className="size-5 shrink-0 transition-transform duration-[var(--ds-state)] group-hover:translate-x-1" aria-hidden />
              </button>
            ) : null}

            {/* End of the section: self-check, then finish */}
            {!section.isTest && atEnd ? (
              <div className={cn("flex flex-col gap-6", s.reveal)}>
                {viva.length ? <CardDeck items={viva} kind="viva" /> : null}
                {finishButton}
                <div className="flex flex-wrap items-center gap-x-6">
                  {!wide ? (
                    <button type="button" onClick={() => go(0)} className="inline-flex min-h-11 items-center type-small font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                      Read this section again
                    </button>
                  ) : null}
                  {prevHref ? (
                    <Link href={prevHref} className="inline-flex min-h-11 items-center gap-1 type-small font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                      <ArrowLeft className="size-4" aria-hidden /> Previous section
                    </Link>
                  ) : null}
                </div>
              </div>
            ) : null}

            {section.isTest ? (
              <Link href={`/study/${moduleId}`} className={quietButton}>
                Back to the module
              </Link>
            ) : null}
          </div>
        )}

        {/* Phone: Back and Next, pinned low while reading. Next is the wide lime one. */}
        {!wide && reading && !atEnd ? (
          <nav
            className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--ds-hairline)] bg-background/95 px-5 pt-3 backdrop-blur-sm md:hidden"
            style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
            aria-label="Parts of this section"
          >
            <div className="mx-auto flex max-w-xl items-stretch gap-3">
              <button
                type="button"
                onClick={() => go(step - 1)}
                disabled={step === 0}
                aria-label={step === 0 ? "Back (this is the first part)" : `Back to part ${step}`}
                className="inline-flex size-[3.25rem] shrink-0 items-center justify-center rounded-[var(--ds-radius)] border-[1.5px] border-[var(--ds-card-line)] outline-none focus-visible:ring-2 focus-visible:ring-ring active:bg-[var(--ds-tint)] disabled:text-muted-foreground disabled:opacity-50"
              >
                <ArrowLeft className="size-5" aria-hidden />
              </button>
              <button type="button" onClick={() => go(step + 1)} className={cn(limeButton, "flex-1")}>
                <span className="min-w-0 [overflow-wrap:anywhere]">{step + 1 < chunks.length ? `Next · part ${step + 2}` : hasCheck ? "Check yourself" : "Finish"}</span>
                <ArrowRight className="size-5 shrink-0" aria-hidden />
              </button>
            </div>
          </nav>
        ) : null}
      </article>
    </div>
  );
}
