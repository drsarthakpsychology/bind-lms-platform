import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breathing, Bubbles, Grounding, Muscles, WorrySorter } from "@/components/free/calm-tools";
import { CrisisLine } from "@/components/free/free-shell";
import { CALM_TOOLS, getCalmTool } from "@/lib/free/calm";
import s from "@/components/free/free.module.css";

export function generateStaticParams() {
  return CALM_TOOLS.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const tool = getCalmTool(id);
  if (!tool) return {};
  return {
    title: `${tool.title}: free calm exercise · VIBHA`,
    description: tool.text,
    alternates: { canonical: `/free/calm/${tool.id}` },
  };
}

const TOOL = { breathing: Breathing, grounding: Grounding, muscles: Muscles, worry: WorrySorter, bubbles: Bubbles } as const;

export default async function CalmPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tool = getCalmTool(id);
  if (!tool) notFound();
  const Tool = TOOL[tool.id];
  const others = CALM_TOOLS.filter((t) => t.id !== tool.id);
  return (
    <>
      <section className={s.hero} style={{ paddingBottom: 32 }}>
        <div className={`${s.wrap} ${s.narrow}`}>
          <Link href="/free#calm" className={s.tag} style={{ textDecoration: "none" }}>
            ← Calm exercises
          </Link>
          <h1 className={s.h1} style={{ fontSize: "clamp(1.9rem, 6vw, 3.2rem)" }}>
            {tool.title}
          </h1>
          <p className={s.lede}>{tool.text}</p>
        </div>
      </section>
      <section className={s.section}>
        <div className={`${s.wrap} ${s.narrow}`}>
          <Tool />
          <div className={s.box} style={{ marginTop: 24 }}>
            <h3>Why it works</h3>
            <p>{tool.why}</p>
          </div>
          <p className={s.label} style={{ marginTop: 28 }}>
            More calm exercises
          </p>
          <ul className={s.chips}>
            {others.map((o) => (
              <li key={o.id}>
                <Link href={`/free/calm/${o.id}`} className={s.chip} style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
                  {o.title}
                </Link>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 28 }}>
            <CrisisLine />
          </div>
        </div>
      </section>
    </>
  );
}
