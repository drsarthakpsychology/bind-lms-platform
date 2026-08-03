import Link from "next/link";
import { mechanismIndex } from "@/lib/psychopharm/store";
import { PageHeader } from "@/components/design-system/page-header";
import { Badge } from "@/components/ui/badge";

/**
 * Learning layer (Part 10): browse by mechanism. Drugs that touch the same
 * receptor group sit together so students learn classes by mechanism rather
 * than memorising lists. No dose drills — mechanisms only.
 */
export default function LearnPage() {
  const groups = mechanismIndex();
  return (
    <div className="mx-auto max-w-4xl space-y-8 py-6">
      <Link href="/tools/psychopharm" className="text-caption text-muted-foreground hover:underline">
        ← Search
      </Link>

      <PageHeader
        eyebrow="Learning"
        title="Browse by mechanism"
        description="Everything that touches a receptor group, together. This is how classes organise themselves."
      />

      <div className="space-y-6">
        {groups.map((g) => (
          <section key={g.tag} className="rounded-md border-2 border-border bg-card p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-h2">{g.tag}</h2>
              <Badge variant="secondary">{g.drugs.length} drug{g.drugs.length === 1 ? "" : "s"}</Badge>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {g.drugs.map((d) => (
                <Link
                  key={d.name}
                  href={`/tools/psychopharm/${d.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="rounded-full border-2 border-border px-3 py-1 text-sm hover:bg-accent"
                >
                  {d.name}
                  {d.qualifier ? (
                    <span className="ml-1 text-caption text-muted-foreground">({d.qualifier})</span>
                  ) : null}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="text-caption text-muted-foreground">
        Mechanism tags come from the reviewed knowledge base. Nothing here is a
        dose or a recommendation — just how the drugs are related by receptor.
      </p>
    </div>
  );
}