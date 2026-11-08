import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertTriangle, ArrowLeft, ArrowRight, BookOpen, Clock, Lightbulb, MessageCircle } from "lucide-react";
import { requireFeature } from "@/lib/flags";
import { referenceLabel, resolveReference, type MedicineRef, type TermRef } from "@/lib/reference/data";
import { REFERENCE_BASE } from "@/lib/reference/href";
import type { DisorderRef } from "@/lib/reference/disorders";
import { KindTag } from "@/components/reference/reference-library";
import { backLinkClass } from "@/components/design-system/back-link";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const e = resolveReference(decodeURIComponent(slug));
  return { title: e ? `${e.label} · Quick Reference` : "Quick Reference" };
}

/** *word* → bold (the glossary marks the key idea this way). */
function Rich({ text }: { text: string }) {
  const parts = text.split(/\*([^*]+)\*/g);
  return <>{parts.map((p, i) => (i % 2 ? <strong key={i} className="font-semibold">{p}</strong> : p))}</>;
}

function Block({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-lg border-2 border-foreground bg-card p-4 sm:p-5">
      <h2 className="mb-2 flex items-center gap-2 text-h3 font-bold">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 text-sm leading-relaxed">
      {items.map((x, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-2 size-1.5 shrink-0 rounded-[1px] bg-foreground" aria-hidden />
          <span>
            <Rich text={x} />
          </span>
        </li>
      ))}
    </ul>
  );
}

function Disorder({ d }: { d: DisorderRef }) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2 rounded-md border-2 border-foreground bg-accent px-4 py-3 text-sm">
        <Clock className="size-4 shrink-0" aria-hidden />
        <span className="font-bold">How long:</span>
        <span>{d.duration}</span>
      </div>
      <Block title="Core features">
        <List items={d.features} />
      </Block>
      <Block title="Key criteria">
        <List items={d.criteria} />
      </Block>
      <Block title="Look-alikes" icon={<AlertTriangle className="size-5 text-link" aria-hidden />}>
        <ul className="divide-y-2 divide-foreground/10 text-sm">
          {d.lookAlikes.map((l) => (
            <li key={l.name} className="py-2 first:pt-0 last:pb-0">
              {l.slug ? (
                <Link href={`${REFERENCE_BASE}/${l.slug}`} className="inline-flex min-h-11 items-center gap-1 font-bold text-link underline underline-offset-2">
                  {l.name}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              ) : (
                <span className="font-bold">{l.name}</span>
              )}
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">How to tell: </span>
                {l.tell}
              </p>
            </li>
          ))}
        </ul>
      </Block>
      <Block title="First-line treatment">
        <List items={d.firstLine} />
        <p className="mt-3 text-caption text-muted-foreground">For learning. Real treatment is decided by the treating clinician.</p>
      </Block>
      {d.noteId ? <MoreLink href={`/study/notes/${d.noteId}`} label="Read the full summary in Notes" /> : null}
    </>
  );
}

function Medicine({ m }: { m: MedicineRef }) {
  return (
    <>
      {m.mechanism ? (
        <Block title="How it works">
          <p className="text-sm leading-relaxed">{m.mechanism}</p>
        </Block>
      ) : null}
      {m.uses.length ? (
        <Block title="Main uses">
          <List items={m.uses} />
        </Block>
      ) : null}
      {m.sideEffects.length ? (
        <Block title="Key side effects">
          <List items={m.sideEffects} />
        </Block>
      ) : null}
      {m.monitoring.length ? (
        <Block title="Monitoring">
          <List items={m.monitoring} />
        </Block>
      ) : null}
      <p className="text-caption text-muted-foreground">For learning, not a prescription. Doses, interactions and the full sources are on the medicine page.</p>
      <MoreLink href={m.fullHref} label="Open the full medicine page" />
    </>
  );
}

function Term({ t }: { t: TermRef }) {
  return (
    <>
      {t.clinical ? (
        <Block title="Clinically">
          <p className="text-sm leading-relaxed">{t.clinical}</p>
        </Block>
      ) : null}
      {t.why ? (
        <Block title="Why clinicians use this word">
          <p className="text-sm leading-relaxed">
            <Rich text={t.why} />
          </p>
        </Block>
      ) : null}
      {t.mixup ? (
        <Block title="Often mixed up with" icon={<AlertTriangle className="size-5 text-link" aria-hidden />}>
          <p className="text-sm leading-relaxed">
            <Rich text={t.mixup} />
          </p>
        </Block>
      ) : null}
      {t.hook ? (
        <Block title="Memory hook" icon={<Lightbulb className="size-5 text-link" aria-hidden />}>
          <p className="text-sm leading-relaxed">{t.hook}</p>
        </Block>
      ) : null}
      {t.sayings.length ? (
        <Block title="Patients may say" icon={<MessageCircle className="size-5 text-link" aria-hidden />}>
          <ul className="flex flex-wrap gap-2">
            {t.sayings.map((s) => (
              <li key={s} className="rounded-md border-2 border-foreground/20 bg-muted px-3 py-1.5 text-sm">“{s}”</li>
            ))}
          </ul>
        </Block>
      ) : null}
      {t.related.length ? (
        <Block title="Related">
          <ul className="flex flex-wrap gap-2">
            {t.related.map((s) => (
              <li key={s}>
                <Link href={`${REFERENCE_BASE}/${s}`} className="inline-flex min-h-11 items-center rounded-md border-2 border-foreground bg-card px-3 text-sm font-semibold hover:bg-accent">
                  {referenceLabel(s) ?? s}
                </Link>
              </li>
            ))}
          </ul>
        </Block>
      ) : null}
    </>
  );
}

function MoreLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="flex min-h-12 items-center justify-between gap-3 rounded-md border-2 border-foreground bg-primary px-4 font-bold text-primary-foreground hard-shadow-sm transition-transform duration-fast ease-snappy hover:-translate-y-0.5">
      <span className="inline-flex items-center gap-2">
        <BookOpen className="size-5" aria-hidden />
        {label}
      </span>
      <ArrowRight className="size-5" aria-hidden />
    </Link>
  );
}

/** /study/reference/[slug]: one entry. Aliases (e.g. "ocd") redirect to the main page. */
export default async function ReferenceEntryPage({ params }: Params) {
  await requireFeature("learn");
  const { slug: raw } = await params;
  const slug = decodeURIComponent(raw);
  const e = resolveReference(slug);
  if (!e) redirect(`${REFERENCE_BASE}?q=${encodeURIComponent(slug.replace(/-/g, " "))}`);
  if (e.slug !== slug) redirect(`${REFERENCE_BASE}/${e.slug}`);

  const sub =
    e.kind === "disorder" ? [e.data.chapter, ...(e.data.aka ?? [])].join(" · ") : e.kind === "medicine" ? e.data.cls : (e.data.area ?? "");
  const lead = e.kind === "disorder" ? e.data.core : e.kind === "medicine" ? (e.data.plain ?? e.data.cls) : e.data.means;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link href={REFERENCE_BASE} className={backLinkClass}>
        <ArrowLeft className="size-4" aria-hidden /> Quick Reference
      </Link>
      <header className="space-y-2">
        <KindTag kind={e.kind} />
        <h1 className="text-h1 break-words">{e.label}</h1>
        {sub ? <p className="text-sm text-muted-foreground">{sub}</p> : null}
      </header>
      <section aria-label="In one line" className="rounded-lg border-2 border-foreground bg-card p-4 text-base leading-relaxed hard-shadow-sm sm:p-5">
        <Rich text={lead} />
      </section>
      {e.kind === "disorder" ? <Disorder d={e.data} /> : e.kind === "medicine" ? <Medicine m={e.data} /> : <Term t={e.data} />}
    </div>
  );
}
