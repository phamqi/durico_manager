import { create } from "zustand";

export const useColumnStore = create((set, get) => ({
  activeColumnIndex: 0,

  setActiveColumn: (colIdx) => {
    const state = get();
    if (state.activeColumnIndex === colIdx) {
      return;
    }
    set({
      activeColumnIndex: colIdx,
    });
  },
}));
export const useTransactionTypeStore = create((set) => ({
  selectedType: 0,
  setSelectedType: (type) => set({ selectedType: type }),
}));
