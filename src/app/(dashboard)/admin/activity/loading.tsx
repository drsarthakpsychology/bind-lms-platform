import { ChaiLoader } from "@/components/learn/chai-loader";
import { LoadingFrame } from "@/components/design-system/slow-state";

export default function Loading() {
  return (
    <LoadingFrame>
      <ChaiLoader label="Crunching everyone's activity" tip={4} />
    </LoadingFrame>
  );
}
