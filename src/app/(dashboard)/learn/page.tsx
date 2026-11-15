import type { Metadata } from "next";
import { loadNavAccess } from "@/lib/ui/access";
import { LEARN_GROUPS, visibleGroups } from "@/components/navigation/v2-config";
import { BookOpen } from "lucide-react";
import { IconTile, PageFrame } from "@/components/ds";
import { HubGroups } from "@/components/ds/hub";

export const metadata: Metadata = { title: "Learn" };

/** Learn (new design): lectures and the study course, as rows. */
export default async function LearnPage() {
  const nav = await loadNavAccess();
  if (!nav) return null;
  return (
    <PageFrame title="Learn" band art={<IconTile><BookOpen /></IconTile>}>
      <HubGroups groups={visibleGroups(LEARN_GROUPS, nav.access)} />
    </PageFrame>
  );
}
