/** Colour-blind mode: a per-device preference kept in localStorage and
 * applied as `data-cvd="on"` on <html> (tokens in globals.css). */
export const CVD_KEY = "vibha:cvd";

/** Runs inline in <head> before first paint so there is no colour flash. */
export const CVD_BOOT_SCRIPT = `try{if(localStorage.getItem("${CVD_KEY}")==="on")document.documentElement.setAttribute("data-cvd","on")}catch(e){}`;

export function readCvd(): boolean {
  try {
    return localStorage.getItem(CVD_KEY) === "on";
  } catch {
    return false;
  }
}

export function writeCvd(on: boolean): void {
  try {
    if (on) localStorage.setItem(CVD_KEY, "on");
    else localStorage.removeItem(CVD_KEY);
  } catch {
    /* private mode: still apply for this page */
  }
  if (on) document.documentElement.setAttribute("data-cvd", "on");
  else document.documentElement.removeAttribute("data-cvd");
}
