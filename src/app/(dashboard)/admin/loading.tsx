import { Skeleton } from "@/components/ui/skeleton";
import { LoadingFrame } from "@/components/design-system/slow-state";

export default function Loading() {
  return (
    <LoadingFrame>
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-56" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg border-2 border-border" />
          ))}
        </div>
        <Skeleton className="h-10 w-52 rounded-lg border-2 border-border" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg border-2 border-border" />
          ))}
        </div>
      </div>
    </LoadingFrame>
  );
}
