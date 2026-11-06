import { LoadingFrame } from "@/components/design-system/slow-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <LoadingFrame>
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-64" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg border-2 border-border" />
        ))}
      </div>
    </div>
    </LoadingFrame>
  );
}
