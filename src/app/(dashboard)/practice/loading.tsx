import { Skeleton } from "@/components/ui/skeleton";

/**
 * /practice loading state — card-shaped skeletons, never a spinner (B5).
 * Matches the browse grid: a wide recommended card + a 3-column card grid.
 */
export default function PracticeLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Skeleton className="h-7 w-40" />
      <Skeleton className="mt-3 h-8 w-72" />
      <Skeleton className="mt-3 h-4 w-96 max-w-full" />

      {/* recommended card skeleton */}
      <Skeleton className="mt-8 h-28 w-full" />

      {/* weak-spots banner skeleton */}
      <Skeleton className="mt-4 h-12 w-full" />

      {/* card grid skeletons */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }, (_, i) => (
          <Skeleton key={i} className="h-36 w-full" />
        ))}
      </div>
    </div>
  );
}