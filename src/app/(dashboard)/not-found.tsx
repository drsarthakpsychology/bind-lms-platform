import { NotFoundState } from "@/components/design-system/not-found-state";
import { OpenSearchButton } from "@/components/search/open-search-button";
import { NotFoundV2 } from "@/components/v2me/states";
import { V2Switch } from "@/components/v2me/ui-v2";

/**
 * Inside the app (a module, topic, medicine or doubt that does not exist):
 * the menu and top bar stay, with Home and Search as the ways on.
 */
export default function DashboardNotFound() {
  return <V2Switch next={<NotFoundV2 />} old={<NotFoundState className="min-h-[50vh]" extra={<OpenSearchButton />} />} />;
}
