import type { Metadata } from "next";
import { GROUPS, medIndex } from "@/lib/meds";
import { MedicineSearch } from "@/components/meds/medicine-search";
import { PageHeader } from "@/components/design-system/page-header";

export const metadata: Metadata = { title: "Medicines" };

/** /practice/medicines: Medicines in the menu. Instant search across every medicine profile. */
export default function MedicinesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader eyebrow="Medicines" title="Find a medicine" description="Search by name, brand, group or condition." className="pb-0" />
      <MedicineSearch rows={medIndex()} groups={GROUPS} />
    </div>
  );
}
