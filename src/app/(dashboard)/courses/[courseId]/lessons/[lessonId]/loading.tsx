export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse">
      <div className="h-4 w-24 rounded bg-secondary" />
      <div className="mt-2 h-7 w-64 rounded-lg bg-secondary" />
      <div className="mt-4 aspect-video w-full rounded-xl bg-secondary" />
    </div>
  );
}
