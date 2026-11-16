import { EmptyLine } from "@/components/ds";

/** A clinic screen whose data did not come: the server's reason in one line. */
export function ClinicNotReady({ error }: { error: string }) {
  return <EmptyLine title={error || "This isn't set up yet."} />;
}
