import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-56" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-40 rounded-lg border-2 border-border" />
        <Skeleton className="h-40 rounded-lg border-2 border-border" />
        <Skeleton className="h-40 rounded-lg border-2 border-border" />
      </div>
    </div>
  );
}
