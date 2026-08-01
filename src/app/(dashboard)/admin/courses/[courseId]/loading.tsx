import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24 rounded-md border-2 border-border" />
        <Skeleton className="h-8 w-64 rounded-md border-2 border-border" />
      </div>
      <Skeleton className="h-52 rounded-lg border-2 border-border" />
      <div className="space-y-3">
        <Skeleton className="h-16 rounded-lg border-2 border-border" />
        <Skeleton className="h-16 rounded-lg border-2 border-border" />
      </div>
    </div>
  );
}
