/** jsQR 1.4.0 (Apache-2.0, see LICENSE), minified ESM build. Only used as the camera fallback where the browser has no BarcodeDetector. */
export interface JsQrCode {
  data: string;
}
declare function jsQR(data: Uint8ClampedArray, width: number, height: number, options?: { inversionAttempts?: "dontInvert" | "onlyInvert" | "attemptBoth" | "invertFirst" }): JsQrCode | null;
export default jsQR;
