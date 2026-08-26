import Link from "next/link";
import { ChevronDown, Pill } from "lucide-react";
import { mechanismIndex } from "@/lib/psychopharm/store";
import { PageHeader } from "@/components/design-system/page-header";
import { Badge } from "@/components/ui/badge";
import { MobileHeader } from "@/components/mobile/mobile-header";
import { MobileListItem } from "@/components/mobile/mobile-list-item";

/**
 * Learning layer (Part 10): browse by mechanism. Drugs that touch the same
 * receptor group sit together so students learn classes by mechanism rather
 * than memorising lists. No dose drills — mechanisms only.
 *
 * Mobile (T32): one receptor group per collapsed card (show → act → reveal);
 * drugs reveal as 48px rows instead of a ~30px pill wall.
 */
export default function LearnPage() {
  const groups = mechanismIndex();
  return (
    <div className="mx-auto max-w-3xl space-y-6 py-6">
      <MobileHeader
        className="lg:hidden"
        inset={false}
        backHref="/tools/psychopharm"
        title="Browse by mechanism"
      />

      <div className="hidden lg:block">
        <Link href="/tools/psychopharm" className="text-caption text-muted-foreground hover:underline">
          ← Search
        </Link>
        <PageHeader
          eyebrow="Learning"
          title="Browse by mechanism"
          description="Everything that touches a receptor group, together. This is how classes organise themselves."
        />
      </div>

      <div className="space-y-4">
        {groups.map((g) => (
          <details key={g.tag} className="group rounded-md border-2 border-border bg-card">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
              <h2 className="text-h2">{g.tag}</h2>
              <div className="flex shrink-0 items-center gap-2">
                <Badge variant="secondary">
                  {g.drugs.length} drug{g.drugs.length === 1 ? "" : "s"}
                </Badge>
                <ChevronDown
                  className="size-5 text-muted-foreground transition-transform duration-fast ease-snappy group-open:rotate-180"
                  aria-hidden
                />
              </div>
            </summary>
            <div className="border-t border-border px-2 py-2">
              {g.drugs.map((d) => (
                <MobileListItem
                  key={d.name}
                  href={`/tools/psychopharm/${d.name.toLowerCase().replace(/\s+/g, "-")}`}
                  leading={<Pill className="size-5" aria-hidden />}
                  title={d.name}
                  subtitle={d.qualifier}
                />
              ))}
            </div>
          </details>
        ))}
      </div>

      <p className="text-caption text-muted-foreground">
        Mechanism tags come from the reviewed sources. Nothing here is a
        dose or a recommendation — just how the drugs are related by receptor.
      </p>
    </div>
  );
}
