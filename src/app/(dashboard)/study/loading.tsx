import { LoadingFrame } from "@/components/design-system/slow-state";
import { ChaiLoader } from "@/components/learn/chai-loader";

export default function Loading() {
  return (
    <LoadingFrame>
      <ChaiLoader label="Getting your lesson ready" tip={0} />
    </LoadingFrame>
  );
}
