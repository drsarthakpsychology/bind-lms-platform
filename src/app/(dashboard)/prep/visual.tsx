"use client";

import * as React from "react";
import { isRenderableVisual } from "@/lib/prep/visual";
import type { WidgetData } from "@/lib/study/types";

/**
 * The Study widgets load only when a diagram is shown, so the question runner
 * stays small. The 3D scenes inside them load lazily again, on their own.
 */
const Widget = React.lazy(() => import("@/components/study/widgets").then((m) => ({ default: m.Widget })));

/** A diagram that fails to draw is left out; the rest of the page carries on. */
class SkipOnError extends React.Component<{ children: React.ReactNode }, { broken: boolean }> {
  state = { broken: false };
  static getDerivedStateFromError() {
    return { broken: true };
  }
  componentDidCatch() {}
  render() {
    return this.state.broken ? null : this.props.children;
  }
}

/** One diagram from an explanation or a model answer, with its caption. Unknown or broken ones render nothing. */
export function PrepVisualView({ visual }: { visual: unknown }) {
  if (!isRenderableVisual(visual)) return null;
  return (
    <SkipOnError>
      <figure className="min-w-0 space-y-2 text-foreground" data-visual={visual.kind}>
        <React.Suspense fallback={<div className="h-40 rounded-md border-2 border-dashed border-foreground/30 bg-card" aria-hidden />}>
          <Widget kind={visual.kind} data={visual.data as WidgetData} />
        </React.Suspense>
        {visual.caption ? <figcaption className="text-sm text-muted-foreground [overflow-wrap:anywhere]">{visual.caption}</figcaption> : null}
      </figure>
    </SkipOnError>
  );
}
