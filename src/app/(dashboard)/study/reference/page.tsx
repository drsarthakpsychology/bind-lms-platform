import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireFeature } from "@/lib/flags";
import { referenceIndex } from "@/lib/reference/data";
import { ReferenceLibrary, type RefKind } from "@/components/reference/reference-library";
import { backLinkClass } from "@/components/design-system/back-link";

export const metadata: Metadata = { title: "Quick Reference A to Z" };

const KINDS = new Set(["disorder", "medicine", "term"]);

/**
 * /study/reference: the Quick Reference A to Z: disorders, medicines and words,
 * each one tap from a short, deep summary. A separate library: nothing here
 * appears inside lessons (owner rule 2026-11-06).
 */
export default async function ReferencePage({ searchParams }: { searchParams: Promise<{ q?: string; kind?: string }> }) {
  await requireFeature("learn");
  const sp = await searchParams;
  const items = referenceIndex();
  const kind = KINDS.has(sp.kind ?? "") ? (sp.kind as RefKind) : "all";
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/study" className={backLinkClass}>
        <ArrowLeft className="size-4" aria-hidden /> Study
      </Link>
      <header className="space-y-1">
        <p className="text-eyebrow text-link">Quick Reference</p>
        <h1 className="text-h1">A to Z</h1>
        <p className="text-sm text-muted-foreground">Disorders, medicines and words.</p>
      </header>
      <ReferenceLibrary items={items} initialQuery={(sp.q ?? "").slice(0, 80)} initialKind={kind} />
    </div>
  );
}
