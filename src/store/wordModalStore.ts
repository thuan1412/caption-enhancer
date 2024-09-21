import { create } from "zustand";

// Define the store's state
interface WordModalStoreState {
  isShow: boolean;
  modalPos: { left: number; top: number };
  word: string;
  showModal: (offset: { left: number; top: number }, word: string) => void;
  hideModal: () => void;
  containerPos: { left: number; top: number };
  setContainerPos: (pos: { left: number; top: number }) => void;
  setModalPos: (pos: { left: number; top: number }) => void;
}

// Create the store
export const useWordModalStore = create<WordModalStoreState>((set) => ({
  isShow: false,
  modalPos: { left: 0, top: 0 },
  word: "",
  showModal: (offset, word) =>
    set({ isShow: true, modalPos: offset, word: word }),
  hideModal: () => set({ isShow: false }),
  containerPos: { left: 0, top: 0 },
  setContainerPos: (pos) => set({ containerPos: pos }),
}));
