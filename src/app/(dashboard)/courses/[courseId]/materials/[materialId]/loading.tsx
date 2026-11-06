import { LoadingFrame } from "@/components/design-system/slow-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <LoadingFrame>
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-72" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
    </LoadingFrame>
  );
}
