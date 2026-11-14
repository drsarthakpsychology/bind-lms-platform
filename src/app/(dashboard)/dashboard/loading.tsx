import { LoadingFrame } from "@/components/design-system/slow-state";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Home while it loads: the same shape as Home itself (greeting, the Continue
 * card beside today's goal, then the topics row), so nothing jumps when the
 * real page lands.
 */
export default function Loading() {
  return (
    <LoadingFrame>
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-9 w-64 max-w-full" />
        </div>
        <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          <Skeleton className="h-48 rounded-2xl border-2 border-border lg:h-72" />
          <Skeleton className="h-56 rounded-2xl border-2 border-border lg:h-72" />
        </div>
        <Skeleton className="h-16 rounded-lg border-2 border-dashed border-border" />
      </div>
    </LoadingFrame>
  );
}
