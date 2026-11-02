import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireFeature } from "@/lib/flags";
import { moduleById, sectionById } from "@/lib/study";
import { readingSections, sectionHref } from "@/lib/study/plan";
import { sectionMinutes } from "@/lib/study/parse";
import { Blocks } from "@/components/study/blocks";
import { SectionReader, type TocItem } from "@/components/study/reader";
import { loadLearnState, saveLearnState } from "../../actions";

export async function generateMetadata({ params }: { params: Promise<{ module: string; section: string }> }): Promise<Metadata> {
  const { module, section } = await params;
  const m = moduleById(module);
  const s = m && sectionById(m, section);
  return { title: s ? `${s.isTest ? "Test" : s.num} ${s.title}` : "Study" };
}

/** /study/[module]/[section]: one section of a module, read in order. */
export default async function SectionPage({ params }: { params: Promise<{ module: string; section: string }> }) {
  await requireFeature("learn");
  const { module, section } = await params;
  const m = moduleById(module);
  const s = m && sectionById(m, section);
  if (!m || !s) notFound();

  const toc: TocItem[] = m.sections.map((x) => ({ id: x.id, num: x.num, title: x.title, part: x.part, isTest: x.isTest, href: sectionHref(m, x), minutes: sectionMinutes(x) }));
  const reading = readingSections(m);
  const i = m.sections.indexOf(s);
  const prev = m.sections[i - 1];
  const nextReading = reading[reading.indexOf(s) + 1];
  const next = nextReading
    ? { href: sectionHref(m, nextReading), label: `${nextReading.num} ${nextReading.title}` }
    : { href: `/study/${m.id}#steps`, label: "Back to the module: write it out, practise, then the test" };

  const serverState = await loadLearnState();
  return (
    <SectionReader
      moduleId={m.id}
      moduleNum={m.num}
      moduleTitle={m.title}
      section={{ id: s.id, num: s.num, title: s.title, part: s.part, tag: s.tag, isTest: s.isTest, minutes: sectionMinutes(s) }}
      toc={toc}
      prevHref={prev ? sectionHref(m, prev) : undefined}
      next={next}
      serverState={serverState}
      save={saveLearnState}
    >
      <Blocks blocks={s.blocks} test={s.isTest ? { moduleId: m.id } : undefined} />
    </SectionReader>
  );
}
