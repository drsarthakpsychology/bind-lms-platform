import { LoadingFrame } from "@/components/design-system/slow-state";
import { ChaiLoader } from "@/components/learn/chai-loader";

export default function Loading() {
  return (
    <LoadingFrame>
      <ChaiLoader label="Adding up your progress" tip={2} />
    </LoadingFrame>
  );
}
