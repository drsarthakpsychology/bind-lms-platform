import { NotFoundState } from "@/components/design-system/not-found-state";
import { OpenSearchButton } from "@/components/search/open-search-button";

/**
 * Inside the app (a module, topic, medicine or doubt that does not exist):
 * the menu and top bar stay, with Home and Search as the ways on.
 */
export default function DashboardNotFound() {
  return <NotFoundState className="min-h-[50vh]" extra={<OpenSearchButton />} />;
}
