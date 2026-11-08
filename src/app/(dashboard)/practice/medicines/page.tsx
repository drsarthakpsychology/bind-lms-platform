import type { Metadata } from "next";
import { GROUPS, medIndex } from "@/lib/meds";
import { MedicineSearch } from "@/components/meds/medicine-search";

export const metadata: Metadata = { title: "Medicines" };

/** /practice/medicines: Medicines in the menu. Instant search across every medicine profile. */
export default function MedicinesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:py-8">
      <header>
        <p className="text-eyebrow text-link">Medicines</p>
        <h1 className="text-h1">Find a medicine</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Search by name, brand, group or condition.
        </p>
      </header>
      <MedicineSearch rows={medIndex()} groups={GROUPS} />
    </div>
  );
}
