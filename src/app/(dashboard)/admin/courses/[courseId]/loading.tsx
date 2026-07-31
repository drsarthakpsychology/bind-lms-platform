export default function Loading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-7 w-56 rounded-lg bg-secondary" />
      <div className="h-40 rounded-xl bg-secondary" />
      <div className="space-y-2">
        <div className="h-16 rounded-xl bg-secondary" />
        <div className="h-16 rounded-xl bg-secondary" />
        <div className="h-16 rounded-xl bg-secondary" />
      </div>
    </div>
  );
}
