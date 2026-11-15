import { requireOptionalNativeModule } from "expo";

export type RenderedPage = { uri: string; width: number; height: number };
type Native = { pageCount(path: string): Promise<number>; renderPage(path: string, index: number, width: number): Promise<RenderedPage> };

/** The phone's own PDF renderer (android/ and ios/ in this folder). Missing on the web build. */
const native = requireOptionalNativeModule<Native>("PdfPages");

export const pdfPages = {
  available: () => native !== null,
  pageCount: (path: string) => (native ? native.pageCount(path) : Promise.reject(new Error("No PDF renderer on this platform"))),
  renderPage: (path: string, index: number, width: number) => (native ? native.renderPage(path, index, width) : Promise.reject(new Error("No PDF renderer on this platform"))),
};
