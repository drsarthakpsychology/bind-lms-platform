import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TestRunner } from "@/components/free/test-runner";
import { INSTRUMENTS, getInstrument } from "@/lib/free/tests";
import s from "@/components/free/free.module.css";

export function generateStaticParams() {
  return INSTRUMENTS.map((i) => ({ id: i.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const inst = getInstrument(id);
  if (!inst) return {};
  return {
    title: `Free ${inst.name}: ${inst.short} · VIBHA`,
    description: `${inst.measures}. ${inst.items.length} questions, about ${inst.minutes} minutes. Validated questionnaire, scored instantly and privately.`,
    alternates: { canonical: `/free/tests/${inst.id}` },
  };
}

export default async function TestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inst = getInstrument(id);
  if (!inst) notFound();
  return (
    <>
      <section className={s.hero} style={{ paddingBottom: 32 }}>
        <div className={`${s.wrap} ${s.narrow}`}>
          <Link href="/free" className={s.tag} style={{ textDecoration: "none" }}>
            ← Free self-checks
          </Link>
          <h1 className={s.h1} style={{ fontSize: "clamp(1.9rem, 6vw, 3.2rem)" }}>
            {inst.short}
            <em> · {inst.name}</em>
          </h1>
          <p className={s.privacy}>
            <span aria-hidden>🔒</span> Private: your answers never leave this device.
          </p>
        </div>
      </section>
      <section className={s.section}>
        <div className={`${s.wrap} ${s.narrow}`}>
          <TestRunner id={inst.id} />
        </div>
      </section>
    </>
  );
}
