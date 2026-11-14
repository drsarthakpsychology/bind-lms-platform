"use client";

import * as React from "react";
import { ROUTE_STAGES } from "@/components/study/animations";
import type { Route } from "@/lib/meds/mechanisms";
import { cn } from "@/lib/utils";
import { JourneyArt } from "@/components/sketch/journey-art";
import { Choice, Figure, Say } from "@/components/sketch/ink";

const ROUTE_NAME: Record<Route, string> = { oral: "Tablet", iv: "Into a vein", nasal: "Nasal spray", depot: "Depot injection" };

export function JourneySketch({ medName, target, routes, notes }: { medName: string; target: string; routes: Route[]; notes?: Record<string, string> }) {
  const [route, setRoute] = React.useState<Route>(routes[0] ?? "oral");
  const [i, setI] = React.useState(0);
  const stages = ROUTE_STAGES[route].map((s) => ({ ...s, text: notes?.[s.id] ?? (s.id === "target" ? `At last it reaches its target: ${target}. There it acts on receptors, and this is where the effect (and many side effects) begins.` : s.text) }));
  const cur = stages[Math.min(i, stages.length - 1)];
  return (
    <Figure title={`${medName} through the body`}>
      {routes.length > 1 ? (
        <Choice
          label="Route"
          value={route}
          onChange={(r) => {
            setRoute(r);
            setI(0);
          }}
          options={routes.map((r) => ({ id: r, name: ROUTE_NAME[r] }))}
        />
      ) : null}
      <JourneyArt stops={stages.map((s) => s.id)} i={i} route={route} label={`${medName}: ${cur.name}`} />
      <ol className="flex flex-wrap gap-1.5" aria-label="Stages">
        {stages.map((s, k) => (
          <li key={s.id}>
            <button
              type="button"
              aria-pressed={k === i}
              onClick={() => setI(k)}
              className={cn("inline-flex min-h-10 items-center gap-1.5 rounded-md border-2 px-2.5 text-sm font-semibold", k === i ? "border-foreground bg-primary text-primary-foreground" : "border-foreground/30 bg-card hover:border-foreground")}
            >
              <span className="tabular-nums opacity-70">{k + 1}</span> {s.name}
            </button>
          </li>
        ))}
      </ol>
      <Say live>
        <p>
          <span className="font-semibold">
            {i + 1}. {cur.name}:{" "}
          </span>
          {cur.text}
        </p>
      </Say>
    </Figure>
  );
}
