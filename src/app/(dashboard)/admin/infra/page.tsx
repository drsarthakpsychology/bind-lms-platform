import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { PROVIDERS, getKey, isEnabled } from "@/lib/ai/router";
import { InfraMetrics } from "./infra-metrics";
import { cn } from "@/lib/utils";
import { daysAgoIso } from "@/lib/analytics/timeline";

export const dynamic = "force-dynamic";

const when = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";

/**
 * /admin/infra — storage, AI usage and a detailed per-provider view
 * (2026-11 redesign): is a key set, does it train on data, calls and
 * failures in 7 days, average speed, last success / failure. No key values
 * are ever shown — only whether one is set.
 */
export default async function InfraPage() {
  if (!(await requireAdmin())) redirect("/dashboard");
  const admin = createAdminClient();
  const since = daysAgoIso(7);
  const [{ data }, health, usage] = await Promise.all([
    admin.rpc("infra_metrics"),
    admin.from("provider_health").select("provider, consecutive_failures, last_success_at, last_failure_at, avg_latency_ms"),
    admin.from("ai_usage_log").select("provider, status, latency_ms, used_fallback").gte("created_at", since).limit(50000),
  ]);

  const metrics = (data ?? {}) as {
    db_size_bytes?: number;
    top_tables?: Array<{ name: string; size: number }>;
    ai_usage_7d?: Array<{ provider: string; calls: number; tokens: number }>;
    provider_health?: Array<{ provider: string; consecutive_failures: number }>;
  };
  const hp = new Map((health.data ?? []).map((h) => [String(h.provider), h]));
  const use = new Map<string, { calls: number; errors: number; ms: number; n: number; fallback: number }>();
  for (const u of usage.data ?? []) {
    const k = String(u.provider);
    const a = use.get(k) ?? { calls: 0, errors: 0, ms: 0, n: 0, fallback: 0 };
    a.calls++;
    if (u.status && u.status !== "ok" && u.status !== "success") a.errors++;
    if (u.latency_ms) { a.ms += Number(u.latency_ms); a.n++; }
    if (u.used_fallback) a.fallback++;
    use.set(k, a);
  }
  const aiOn = isEnabled();

  return (
    <div className="space-y-8">
      <PageHeader title="Usage & AI providers" description="Storage and AI use. Anything past 70% is flagged before it becomes a problem." />
      <InfraMetrics metrics={metrics} />

      <section className="space-y-3">
        <h2 className="text-h3 font-bold">AI providers in detail</h2>
        <p className="text-small text-muted-foreground">
          AI is {aiOn ? "switched on" : "switched off (AI_ENABLED=false)"}. Providers are tried in order; the ones that don&apos;t train on data are used first for student work.
        </p>
        <div className="overflow-hidden rounded-2xl border-2 border-foreground bg-card">
          <ul className="divide-y-2 divide-foreground/10">
            {PROVIDERS.map((p) => {
              const h = hp.get(p.id);
              const u = use.get(p.id);
              const keySet = Boolean(getKey(p));
              const failing = (h?.consecutive_failures ?? 0) > 0;
              const tone = !keySet ? "bg-foreground/20" : failing ? ((h?.consecutive_failures ?? 0) >= 3 ? "bg-destructive" : "bg-status-pending-fg") : "bg-status-success-fg";
              return (
                <li key={p.id} className="grid gap-2 px-4 py-3 sm:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,1fr))] sm:items-center">
                  <span className="flex items-center gap-2">
                    <span className={cn("size-2.5 shrink-0 rounded-full", tone)} aria-hidden />
                    <span className="min-w-0">
                      <span className="block font-bold">{p.id}</span>
                      <span className="block text-caption text-muted-foreground">{keySet ? "Key set" : "No key"} · {p.trainsOnData ? "may train on data" : "doesn't train on data"} · {p.supports.join(", ")}</span>
                    </span>
                  </span>
                  <span className="text-sm"><span className="text-caption text-muted-foreground sm:hidden">Calls 7d: </span><b>{u?.calls ?? 0}</b> calls<span className="block text-caption text-muted-foreground">{u?.errors ?? 0} failed · {u?.fallback ?? 0} fallbacks</span></span>
                  <span className="text-sm"><span className="text-caption text-muted-foreground">Avg speed</span><span className="block font-bold">{u?.n ? `${Math.round(u.ms / u.n)} ms` : h?.avg_latency_ms ? `${Math.round(Number(h.avg_latency_ms))} ms` : "—"}</span></span>
                  <span className="text-sm"><span className="text-caption text-muted-foreground">Last success</span><span className="block">{when(h?.last_success_at as string | null)}</span></span>
                  <span className="text-sm"><span className="text-caption text-muted-foreground">Last failure</span><span className={cn("block", failing && "font-bold text-status-alert-fg")}>{when(h?.last_failure_at as string | null)}{failing ? ` · ${h?.consecutive_failures} in a row` : ""}</span></span>
                </li>
              );
            })}
          </ul>
        </div>
        <p className="text-caption text-muted-foreground">Limits per provider (requests a minute / a day) are set in the code. Keys live in Vercel → Settings → Environment Variables; they are never shown here.</p>
      </section>
    </div>
  );
}
