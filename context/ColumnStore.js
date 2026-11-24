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
})); // store/useColumnSumStore.js

export const useColumnSumStore = create((set, get) => ({
  sumsByCol: {},

  setColumnSum: (idColumn, sum) =>
    set((state) => ({
      sumsByCol: {
        ...state.sumsByCol,
        [idColumn]: sum,
      },
    })),

  getGrandTotal: () =>
    Object.values(get().sumsByCol).reduce((acc, val) => acc + val, 0),

  resetColumnSum: (idColumn) =>
    set((state) => {
      const next = { ...state.sumsByCol };
      delete next[idColumn];
      return { sumsByCol: next };
    }),

  resetAllSums: () => set({ sumsByCol: {} }),
}));
