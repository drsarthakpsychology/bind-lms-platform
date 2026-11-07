/**
 * Tiles for the second wave of games, so the games hub can list them.
 * `icon` is a lucide-react icon name.
 */
export type Games2Tile = { id: string; title: string; href: string; blurb: string; icon: string };

export const GAMES2_TILES: Games2Tile[] = [
  { id: "mse", title: "MSE Lab", href: "/games/mse", blurb: "Read a short interview. Tag every finding with the exact word.", icon: "ScanEye" },
  { id: "ward", title: "Ward Week", href: "/games/ward", blurb: "Follow one patient through five sessions. Your choices change the ending.", icon: "Hospital" },
  { id: "rx", title: "Rx Detective", href: "/games/rx", blurb: "Medicines, receptors, side effects and dangerous mixes. Three lives.", icon: "Pill" },
  { id: "escape", title: "Team Escape Room", href: "/games/escape", blurb: "Race other teams through linked clues to discharge the patient.", icon: "DoorOpen" },
  { id: "comorbid", title: "Comorbid", href: "/games/comorbid", blurb: "A card duel. Build a diagnosis; block your rival with rule-outs.", icon: "Layers" },
];
