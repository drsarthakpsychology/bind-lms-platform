import { useSyncExternalStore } from "react";

/** A very small state container: get, set, subscribe, and a React hook. */
export type Store<T> = {
  get: () => T;
  set: (next: Partial<T> | ((prev: T) => Partial<T>)) => void;
  subscribe: (fn: () => void) => () => void;
  use: <S>(pick: (state: T) => S) => S;
};

export function createStore<T extends object>(initial: T): Store<T> {
  let state = initial;
  const subs = new Set<() => void>();
  const get = () => state;
  const set: Store<T>["set"] = (next) => {
    const patch = typeof next === "function" ? next(state) : next;
    state = { ...state, ...patch };
    subs.forEach((fn) => fn());
  };
  const subscribe = (fn: () => void) => {
    subs.add(fn);
    return () => {
      subs.delete(fn);
    };
  };
  const use = <S,>(pick: (s: T) => S): S => useSyncExternalStore(subscribe, () => pick(state), () => pick(state));
  return { get, set, subscribe, use };
}
