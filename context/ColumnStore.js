import { create } from "zustand";

export const useColumnStore = create((set, get) => ({
  prevKeyMode: "add",
  keyMode: "add",
  setKeyMode: (nextMode) =>
    set((state) =>
      state.keyMode === nextMode
        ? state
        : { prevKeyMode: state.keyMode, keyMode: nextMode },
    ),
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

  resetColumnSum: (idColumn) =>
    set((state) => {
      const next = { ...state.sumsByCol };
      delete next[idColumn];
      return { sumsByCol: next };
    }),

  resetAllSums: () => set({ sumsByCol: {} }),
  formSum: { tare: "", price: "" },
  setFormSumField: (key, value) =>
    set((state) => ({
      formSum: { ...state.formSum, [key]: value },
    })),
  resetFormSum: () =>
    set({
      formSum: { tare: "", price: "" },
    }),
}));
export const useWorkerStore = create((set) => ({
  currentWorker: null,
  setCurrentWorker: (worker) => set({ currentWorker: worker }),
  colorArray: [],
  setColorArray: (colorArray) => set({ colorArray: colorArray ?? [] }),
}));
