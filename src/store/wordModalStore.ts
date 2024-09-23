import { create } from "zustand";

// Define the store's state
interface WordModalStoreState {
  isShow: boolean;
  modalPos: { left: number; top: number };
  word: string;
  showModal: (offset: { left: number; top: number }, word: string) => void;
  hideModal: () => void;
  containerPos: DOMRect;
  setContainerPos: (pos: DOMRect) => void;
}

// Create the store
export const useWordModalStore = create<WordModalStoreState>((set) => ({
  isShow: false,
  modalPos: { left: 0, top: 0 },
  word: "",
  showModal: (offset, word) =>
    set({ isShow: true, modalPos: offset, word: word }),
  hideModal: () => set({ isShow: false }),
  containerPos: DOMRect.fromRect({ x: 0, y: 0, width: 0, height: 0 }),
  setContainerPos: (domRect) => set({ containerPos: domRect }),
}));
