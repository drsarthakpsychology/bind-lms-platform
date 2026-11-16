import type { Metadata } from "next";
import { loadNavAccess } from "@/lib/ui/access";
import { PRACTISE_GROUPS, visibleGroups } from "@/components/navigation/v2-config";
import { Stethoscope } from "lucide-react";
import { IconTile, PageFrame } from "@/components/ds";
import { HubGroups } from "@/components/ds/hub";

export const metadata: Metadata = { title: "Practise" };

/** Practise (new design): cases, games and exam prep, as rows. */
export default async function PractisePage() {
  const nav = await loadNavAccess();
  if (!nav) return null;
  const groups = visibleGroups(PRACTISE_GROUPS, nav.access);
  return (
    <PageFrame title="Practise" area="practise" band art={<IconTile><Stethoscope /></IconTile>}>
      {groups.length ? <HubGroups groups={groups} /> : <p className="type-body text-muted-foreground">Nothing to practise yet. Your cases and games open here when your course starts.</p>}
    </PageFrame>
  );
}
