import type { Res } from "@/components/clinic/result";
import { Empty, LoadError } from "../../_v2/kit";

/** A clinic list that did not load. Before the clinic is switched on (the SQL not run yet) it says so calmly. */
export function ClinicLoadError({ res, what, href }: { res: Res<unknown>; what: string; href?: string }) {
  if (!res.ok && res.code === "unavailable") return <Empty>Not switched on yet. The clinic starts once its database update is run.</Empty>;
  return <LoadError what={what} href={href} />;
}
