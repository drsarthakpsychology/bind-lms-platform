import { ChaiLoader } from "@/components/learn/chai-loader";
import { LoadingFrame } from "@/components/design-system/slow-state";
import { AdminLoading } from "../_v2/v2-context";

export default function Loading() {
  return (
    <AdminLoading
      rows={10}
      old={
        <LoadingFrame>
          <ChaiLoader label="Crunching everyone's activity" tip={4} />
        </LoadingFrame>
      }
    />
  );
}
