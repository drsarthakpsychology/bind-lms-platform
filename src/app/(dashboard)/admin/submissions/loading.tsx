import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-8 w-48 rounded-md border-2 border-border" />
        <Skeleton className="h-4 w-72 rounded-md border-2 border-border" />
      </div>
      <Skeleton className="h-10 w-56 rounded-md border-2 border-border" />
      <div className="space-y-3">
        <Skeleton className="h-28 rounded-lg border-2 border-border" />
        <Skeleton className="h-28 rounded-lg border-2 border-border" />
        <Skeleton className="h-28 rounded-lg border-2 border-border" />
      </div>
    </div>
  );
}
