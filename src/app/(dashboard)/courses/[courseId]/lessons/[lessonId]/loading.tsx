import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24 rounded-md border-2 border-border" />
        <Skeleton className="h-4 w-12 rounded-md border-2 border-border" />
      </div>
      <Skeleton className="h-9 w-72 rounded-md border-2 border-border" />
      <div className="rounded-lg border-2 border-foreground bg-card p-3 hard-shadow-sm">
        <Skeleton className="aspect-video w-full rounded-md border-2 border-border" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-36 rounded-md border-2 border-border" />
        <Skeleton className="h-9 w-48 rounded-md border-2 border-border" />
      </div>
    </div>
  );
}
