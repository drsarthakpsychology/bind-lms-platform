import { LoadingFrame } from "@/components/design-system/slow-state";
import { ChaiLoader } from "@/components/learn/chai-loader";

export default function Loading() {
  return (
    <LoadingFrame>
      <ChaiLoader label="Chai is picking your questions" tip={1} />
    </LoadingFrame>
  );
}
