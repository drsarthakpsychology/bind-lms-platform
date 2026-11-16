import type { Metadata } from "next";
import { GROUPS, MEDS, medIndex } from "@/lib/meds";
import { Pill } from "lucide-react";
import { IconTile, PageFrame } from "@/components/ds";
import { MedicineLibrary } from "@/components/play/medicine-library";
import { uiV2 } from "@/lib/ui/v2-server";
import { MedicineSearch } from "@/components/meds/medicine-search";
import { PageHeader } from "@/components/design-system/page-header";

export const metadata: Metadata = { title: "Medicines" };

/** /practice/medicines: Medicines in the menu. Instant search across every medicine profile. */
export default async function MedicinesPage() {
  if (await uiV2()) {
    // The usual dose of each medicine (the one its page opens on), for the list's third column.
    const doses = Object.fromEntries(MEDS.map((m) => [m.id, m.doses[m.defaultDose]?.amount ?? ""]));
    return (
      <PageFrame title="Medicines" kicker="Library" area="library" band art={<IconTile><Pill /></IconTile>}>
        <MedicineLibrary rows={medIndex()} groups={GROUPS} doses={doses} />
      </PageFrame>
    );
  }
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader eyebrow="Medicines" title="Find a medicine" description="Search by name, brand, group or condition." className="pb-0" />
      <MedicineSearch rows={medIndex()} groups={GROUPS} />
    </div>
  );
}
