import { creditPlay, istToday } from "./engine";
import { getLearnState, setLearnState } from "./store";

/** After a server-paid game: today's goal and streak move on (no XP counted twice). */
export function creditServerPlay(serverXp: number) {
  const s = getLearnState();
  if (s) setLearnState(creditPlay(s, serverXp, istToday()));
}
