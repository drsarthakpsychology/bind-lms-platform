import { Skeleton } from "@/components/ui/skeleton";

/**
 * Drug-detail loading state — page-shaped skeletons, never a spinner (B5).
 * Mirrors the drug page: back/compare row, header, then content blocks.
 */
export default function DrugLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 py-6">
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>

      {/* dose ladder + band content skeletons */}
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  );
}
