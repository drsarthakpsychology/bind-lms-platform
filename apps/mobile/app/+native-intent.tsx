import { pathFromLink } from "@/nav/targets";

/**
 * Links that open the app from outside (vibha://... and
 * https://vibhapsychology.com/...) arrive here and are turned into app
 * screens. The website's paths are mapped to the app's own.
 */
export function redirectSystemPath({ path }: { path: string; initial: boolean }): string {
  try {
    return pathFromLink(path);
  } catch {
    return "/";
  }
}
