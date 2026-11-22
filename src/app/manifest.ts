import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";

/** /manifest.webmanifest: name and the typographic VIBHA icons for "Add to home screen". */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND.name,
    short_name: BRAND.shortName,
    description: "Practical psychology training and supervised internship in Ahmedabad and online.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1d44d8",
    icons: [
      { src: "/brand/vibha-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/vibha-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/brand/vibha-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
