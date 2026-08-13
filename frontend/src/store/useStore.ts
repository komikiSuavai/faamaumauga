/**
 * src/store/useStore.ts
 * Small global store using Zustand.
 * - count: number state
 * - inc, dec: actions to change the count
 *
 * This file uses TypeScript types and a default export so it matches:
 * import useStore from "../store/useStore";
 */

import create from "zustand";

type State = {
  count: number;
  inc: () => void;
  dec: () => void;
};

const useStore = create<State>((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
  dec: () => set((s) => ({ count: s.count - 1 })),
}));

export default useStore;
