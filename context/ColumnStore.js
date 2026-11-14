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
