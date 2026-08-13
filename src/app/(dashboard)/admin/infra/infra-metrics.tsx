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
        <div className="flex items-center gap-3 rounded-md border-2 border-red-500 bg-red-50 p-4" role="alert">
          <CircleAlert className="size-5 shrink-0 text-red-600" aria-hidden />
          <div>
            <p className="font-semibold text-red-800">At {dbPct}% of the free DB limit</p>
            <p className="text-small text-red-700">
              Below 70% is green. You&apos;re past the line — free up space or plan an upgrade before the cohort starts.
            </p>
          </div>
        </div>
      ) : null}

      {/* DB size */}
      <div className="rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
        <div className="flex items-center gap-2">
          <Database className="size-4 text-link" aria-hidden />
          <h2 className="text-base font-semibold">Supabase database</h2>
          <span className={cn("ml-auto rounded-full px-2 py-0.5 text-caption font-semibold", dbPct >= WARN_AT * 100 ? "bg-red-100 text-red-700" : dbPct >= 50 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700")}>
            {dbPct}% of 500 MB
          </span>
        </div>
        <p className="mt-2 text-numeric text-h3">
          {fmtBytes(metrics.db_size_bytes ?? 0)}
          <span className="text-small text-muted-foreground"> / 500 MB</span>
        </p>
        <div className="mt-3 h-3 overflow-hidden rounded-full border border-border bg-background">
          <div
            className={cn("h-full rounded-full", dbPct >= WARN_AT * 100 ? "bg-red-500" : dbPct >= 50 ? "bg-amber-400" : "bg-primary")}
            style={{ width: `${Math.min(100, dbPct)}%` }}
          />
        </div>
      </div>

      {/* Largest tables */}
      <div className="rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
        <div className="flex items-center gap-2">
          <HardDrive className="size-4 text-link" aria-hidden />
          <h2 className="text-base font-semibold">Largest tables</h2>
        </div>
        {(metrics.top_tables ?? []).length === 0 ? (
          <p className="mt-2 text-small text-muted-foreground">No table data.</p>
        ) : (
          <ul className="mt-3 space-y-1.5">
            {(metrics.top_tables ?? []).map((t) => (
              <li key={t.name} className="flex items-center justify-between border-b border-border/60 pb-1.5 text-small">
                <span className="font-mono text-caption">{t.name}</span>
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
    </div>
  );
}
