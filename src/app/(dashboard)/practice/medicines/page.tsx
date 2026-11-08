import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GROUPS, medIndex } from "@/lib/meds";
import { MedicineSearch } from "@/components/meds/medicine-search";

export const metadata: Metadata = { title: "Medicines" };

/** Practice → Medicines: instant search across every medicine profile. */
export default function MedicinesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link href="/practice" className="inline-flex items-center gap-1 rounded-full border-2 border-foreground bg-card px-3 py-1.5 text-sm font-semibold">
        <ArrowLeft className="size-4" aria-hidden /> Practice
      </Link>
      <header>
        <p className="text-eyebrow text-link">Practice · Medicines</p>
        <h1 className="text-h1">Find a medicine</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Search by name, brand, group or condition. Each medicine shows what changes from dose to dose, in student or clinician words.
        </p>
      </header>
      <MedicineSearch rows={medIndex()} groups={GROUPS} />
    </div>
  );
}
