import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { loadFunnel } from "@/lib/funnel/load";
import { AdminPage, Block, Empty, Facts, Meter, Notice } from "../_v2/kit";

export const metadata: Metadata = { title: "Requests: where people stop" };
export const dynamic = "force-dynamic";

const PAGE_NAMES: Record<string, string> = {
  "/": "Homepage",
  "/psychology-internship": "Internship page",
  "/waitlist": "Request form page",
  "/free": "Free tools",
  "/free/help": "Who should you see",
};

const FAIL_NAMES: Record<string, string> = {
  refused: "The form said something was wrong (for example a mistyped phone number)",
  "no-connection": "Their internet dropped while sending",
  other: "Other",
};

/**
 * /admin/requests: the last 30 days on the public website, from first page
 * to a sent request, and where people stop. Counted privately on our own
 * server: no names, no cookies, nothing from people who ask not to be
 * tracked. Read-only, so view-only admins can see it too.
 */
export default async function RequestsFunnelPage() {
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  const { ready, report, referrers } = await loadFunnel(createAdminClient(), 30);
  const top = report.steps[0]?.visits ?? 0;

  return (
    <AdminPage
      title="Requests: where people stop"
      lead="Last 30 days on the public website, from the first page to a sent request. Private counts only: no names, no cookies."
      back={{ href: "/admin/enquiries", label: "Enquiries" }}
      width="default"
    >
      {!ready ? (
        <Notice>
          Counting is not switched on yet. It starts after the database update 2026_11_22_funnel.sql is run. The
          website works the same until then.
        </Notice>
      ) : top === 0 ? (
        <Empty>No visits counted in the last 30 days yet. Numbers appear here as people visit the website.</Empty>
      ) : null}

      {ready && report.biggestDrop ? (
        <p className="type-body font-semibold">
          Most people stop between &ldquo;{report.biggestDrop.from}&rdquo; and &ldquo;{report.biggestDrop.to}&rdquo;:{" "}
          {report.biggestDrop.lostPct}% do not go on.
        </p>
      ) : null}

      {ready ? (
        <Block title="The path">
          <ol className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
            {report.steps.map((st, i) => (
              <li key={st.key} className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 py-3">
                <span className="min-w-0 type-small font-semibold">
                  {i + 1}. {st.label}
                </span>
                <span className="type-small type-num font-semibold">{st.visits}</span>
                <Meter className="col-span-2" pct={top > 0 ? (st.visits / top) * 100 : 0} />
                {st.keptPct !== null ? (
                  <span className="col-span-2 type-caption text-muted-foreground">
                    {st.keptPct}% of the step before
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
          <p className="type-caption text-muted-foreground">
            A visit is one browser tab session. People with &ldquo;Do Not Track&rdquo; on are not counted, so real
            numbers are a little higher.
          </p>
        </Block>
      ) : null}

      {ready && report.buttons.length > 0 ? (
        <Block title="Buttons pressed">
          <Facts items={report.buttons.map((b) => ({ label: b.label, value: `${b.visits} visits` }))} />
        </Block>
      ) : null}

      {ready && report.pages.length > 0 ? (
        <Block title="Pages seen">
          <Facts items={report.pages.map((p) => ({ label: PAGE_NAMES[p.path] ?? p.path, value: `${p.visits} visits` }))} />
        </Block>
      ) : null}

      {ready && referrers.length > 0 ? (
        <Block title="Where visitors came from">
          <Facts
            items={referrers.map((r) => ({
              label: r.host || "Typed the address, or an app link",
              value: `${r.visits} visits`,
            }))}
          />
        </Block>
      ) : null}

      {ready && report.failed.length > 0 ? (
        <Block title="Requests that did not send">
          <Facts items={report.failed.map((f) => ({ label: FAIL_NAMES[f.reason] ?? f.reason, value: `${f.events} times` }))} />
        </Block>
      ) : null}
    </AdminPage>
  );
}
