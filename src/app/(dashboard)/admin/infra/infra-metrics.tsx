"use client";

import * as React from "react";
import { CircleAlert, Database, HardDrive, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfraMetricsData {
  db_size_bytes?: number;
  top_tables?: Array<{ name: string; size: number }>;
  ai_usage_7d?: Array<{ provider: string; calls: number; tokens: number }>;
  provider_health?: Array<{ provider: string; consecutive_failures: number }>;
}

const SUPABASE_DB_LIMIT_BYTES = 500 * 1024 * 1024; // 500 MB free
const WARN_AT = 0.7;

function fmtBytes(n: number): string {
  if (n >= 1024 * 1024 * 1024) return `${(n / 1024 ** 3).toFixed(2)} GB`;
  if (n >= 1024 * 1024) return `${(n / 1024 ** 2).toFixed(1)} MB`;
  if (n >= 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${n} B`;
}

function pct(n: number, limit: number): number {
  if (!limit) return 0;
  return Math.round((n / limit) * 100);
}

export function InfraMetrics({ metrics }: { metrics: InfraMetricsData }) {
  const dbPct = pct(metrics.db_size_bytes ?? 0, SUPABASE_DB_LIMIT_BYTES);
  const over70 = dbPct >= WARN_AT * 100;

  return (
    <div className="space-y-6">
      {over70 ? (
        <div className="flex items-center gap-3 rounded-md border-2 border-status-alert-fg/40 bg-status-alert-bg p-4" role="alert">
          <CircleAlert className="size-5 shrink-0 text-status-alert-fg" aria-hidden />
          <div>
            <p className="font-semibold text-status-alert-fg">At {dbPct}% of the free DB limit</p>
            <p className="text-small text-status-alert-fg">
              Below 70% is green. You&apos;re past the line — free up space or plan an upgrade before the cohort starts.
            </p>
          </div>
        </div>
      ) : null}

      {/* DB size */}
      <div className="rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
        <div className="flex items-center gap-2">
          <Database className="size-4 text-link" aria-hidden />
          <h2 className="text-base font-semibold">Database storage</h2>
          <span className={cn("ml-auto rounded-full px-2 py-0.5 text-caption font-semibold", dbPct >= WARN_AT * 100 ? "bg-status-alert-bg text-status-alert-fg" : dbPct >= 50 ? "bg-status-pending-bg text-status-pending-fg" : "bg-status-success-bg text-status-success-fg")}>
            {dbPct}% of 500 MB
          </span>
        </div>
        <p className="mt-2 text-numeric text-h3">
          {fmtBytes(metrics.db_size_bytes ?? 0)}
          <span className="text-small text-muted-foreground"> / 500 MB</span>
        </p>
        <div className="mt-3 h-3 overflow-hidden rounded-full border border-border bg-background">
          <div
            className={cn("h-full rounded-full", dbPct >= WARN_AT * 100 ? "bg-status-alert-fg" : dbPct >= 50 ? "bg-status-pending-fg" : "bg-status-success-fg")}
            style={{ width: `${Math.min(100, dbPct)}%` }}
          />
        </div>
      </div>

      {/* Largest tables */}
      <div className="rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
        <div className="flex items-center gap-2">
          <HardDrive className="size-4 text-link" aria-hidden />
          <h2 className="text-base font-semibold">Where the space goes</h2>
        </div>
        {(metrics.top_tables ?? []).length === 0 ? (
          <p className="mt-2 text-small text-muted-foreground">No data yet.</p>
        ) : (
          <ul className="mt-3 space-y-1.5">
            {(metrics.top_tables ?? []).map((t) => (
              <li key={t.name} className="flex items-center justify-between border-b border-border/60 pb-1.5 text-small">
                <span className="text-caption">{t.name}</span>
                <span className="text-numeric text-caption">{fmtBytes(t.size)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* AI usage */}
      <div className="rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
        <div className="flex items-center gap-2">
          <Zap className="size-4 text-link" aria-hidden />
          <h2 className="text-base font-semibold">AI usage (7 days)</h2>
        </div>
        {(metrics.ai_usage_7d ?? []).length === 0 ? (
          <p className="mt-2 text-small text-muted-foreground">
            No AI calls logged yet. This populates once keys are configured and sessions run.
          </p>
        ) : (
          <ul className="mt-3 space-y-1.5">
            {(metrics.ai_usage_7d ?? []).map((p) => (
              <li key={p.provider} className="flex items-center justify-between text-small">
                <span className="font-medium">{p.provider}</span>
                <span className="text-caption text-muted-foreground">
                  {p.calls} calls · {p.tokens.toLocaleString()} tokens
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Provider health — the other half of the free-tier picture. A provider
          that's been failing repeatedly is a silent outage in waiting. */}
      <div className="rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
        <div className="flex items-center gap-2">
          <CircleAlert className="size-4 text-link" aria-hidden />
          <h2 className="text-base font-semibold">Provider health</h2>
        </div>
        {(metrics.provider_health ?? []).length === 0 ? (
          <p className="mt-2 text-small text-muted-foreground">
            No provider health rows yet — the router writes these as it routes live calls.
          </p>
        ) : (
          <ul className="mt-3 space-y-1.5">
            {(metrics.provider_health ?? []).map((h) => {
              const healthy = h.consecutive_failures === 0;
              return (
                <li key={h.provider} className="flex items-center justify-between border-b border-border/60 pb-1.5 text-small">
                  <span className="flex items-center gap-2 font-medium">
                    <span
                      aria-hidden
                      className={cn(
                        "size-2 rounded-full",
                        healthy ? "bg-status-success-fg" : h.consecutive_failures >= 3 ? "bg-destructive" : "bg-status-pending-fg",
                      )}
                    />
                    {h.provider}
                  </span>
                  <span className="text-caption text-muted-foreground">
                    {healthy ? "Healthy" : `${h.consecutive_failures} consecutive failures`}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
