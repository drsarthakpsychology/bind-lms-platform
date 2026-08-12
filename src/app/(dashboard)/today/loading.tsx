import { Skeleton } from "@/components/ui/skeleton";

/** /today loading — matches the front-door layout (B5: never a spinner). */
export default function TodayLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Skeleton className="h-5 w-16" />
      <Skeleton className="mt-3 h-8 w-72" />
      <Skeleton className="mt-3 h-4 w-96 max-w-full" />

      {/* streak line */}
      <Skeleton className="mt-2 h-4 w-64" />

      {/* weak-spots banner */}
      <Skeleton className="mt-6 h-12 w-full" />

      {/* primary card */}
      <Skeleton className="mt-4 h-40 w-full" />

      {/* quick / deep chips */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>

      <Skeleton className="mt-6 h-4 w-40" />
    </div>
  );
}