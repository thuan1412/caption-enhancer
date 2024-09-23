import { create } from "zustand";

interface WordModalStoreState {
  parentRef: HTMLElement | null;
  setRef: (ref: HTMLElement | null) => void;
}

export const useWordModalStore = create<WordModalStoreState>((set) => ({
  parentRef: null,
  setRef: (ref) => set({ parentRef: ref }),
}));
