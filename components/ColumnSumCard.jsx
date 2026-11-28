import { useColumnStore, useColumnSumStore } from "@/context";
import { usePathname } from "expo-router";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, Text, TextInput, View } from "react-native";
import CustomKeypadAdvanced from "./CustomKeypadAdvanced";

const EDITABLE_ROWS = [
  { key: "tare", label: "Tru bi" },
  { key: "price", label: "Gia" },
];

const evaluateMultiplyIfNeeded = (rawValue) => {
  const trimmed = String(rawValue ?? "").trim();
  if (!trimmed || !/[xX*]/.test(trimmed)) return null;

  const parts = trimmed.split(/[xX*]/);
  if (parts.some((p) => p === "")) return null;

  const nums = parts.map((p) => Number(p));
  if (nums.some((n) => Number.isNaN(n) || !Number.isFinite(n))) return null;

  return nums.reduce((acc, n) => acc * n, 1);
};

const evaluateThousandIfNeeded = (rawValue) => {
  const trimmed = String(rawValue ?? "")
    .trim()
    .toLowerCase();
  if (!trimmed || !trimmed.includes("k")) return null;

  const kCount = (trimmed.match(/k/g) || []).length;
  if (kCount !== 1) return null;

  const [beforeK, afterK = ""] = trimmed.split("k");
  if (!beforeK || !/^\d+$/.test(beforeK)) return null;
  if (afterK && !/^\d+$/.test(afterK)) return null;

  const baseNum = Number(beforeK);
  if (!Number.isFinite(baseNum)) return null;

  if (!afterK) {
    return baseNum * 1000;
  }

  const decimalValue = Number(`${beforeK}.${afterK}`);
  if (!Number.isFinite(decimalValue)) return null;
  return Math.round(decimalValue * 1000);
};

const ColumnSumCard = () => {
  const colIdx = "sum";
  const sumsByCol = useColumnSumStore((state) => state.sumsByCol);
  const formSum = useColumnSumStore((state) => state.formSum);
  const setFormSumField = useColumnSumStore((state) => state.setFormSumField);
  const resetFormSum = useColumnSumStore((state) => state.resetFormSum);

  const isActiveColumn = useColumnStore(
    (state) => state.activeColumnIndex === colIdx,
  );
  const setActiveColumn = useColumnStore((state) => state.setActiveColumn);
  const setKeyMode = useColumnStore((state) => state.setKeyMode);

  const grandTotal = useMemo(
    () =>
      Object.values(sumsByCol).reduce(
        (acc, val) => acc + (Number(val) || 0),
        0,
      ),
    [sumsByCol],
  );

  const [activeInputIdx, setActiveInputIdx] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const inputRefs = useRef({});

  const tareTimerRef = useRef(null);
  const latestTareRef = useRef("");
  latestTareRef.current = formSum.tare;

  const priceTimerRef = useRef(null);
  const latestPriceRef = useRef("");
  latestPriceRef.current = formSum.price;

  const activeRow = EDITABLE_ROWS[activeInputIdx] ?? EDITABLE_ROWS[0];

  useEffect(() => {
    if (!isKeyboardVisible || !isActiveColumn) return;
    setKeyMode(activeRow?.key === "tare" ? "multiply" : "thousand");
  }, [isKeyboardVisible, isActiveColumn, activeRow?.key, setKeyMode]);

  const clearTareTimer = useCallback(() => {
    if (tareTimerRef.current) {
      clearTimeout(tareTimerRef.current);
      tareTimerRef.current = null;
    }
  }, []);

  const clearPriceTimer = useCallback(() => {
    if (priceTimerRef.current) {
      clearTimeout(priceTimerRef.current);
      priceTimerRef.current = null;
    }
  }, []);

  const resolveTareIfMultiply = useCallback(() => {
    clearTareTimer();
    const raw = latestTareRef.current;
    if (!/[xX*]/.test(raw)) return;

    const computed = evaluateMultiplyIfNeeded(raw);
    if (computed !== null) {
      const nextStr = String(computed);
      latestTareRef.current = nextStr;
      setFormSumField("tare", nextStr);
    }
  }, [clearTareTimer, setFormSumField]);

  const resolvePriceIfThousand = useCallback(() => {
    clearPriceTimer();
    const raw = latestPriceRef.current;
    if (!/k/i.test(raw)) return;

    const computed = evaluateThousandIfNeeded(raw);
    if (computed !== null) {
      const nextStr = String(computed);
      latestPriceRef.current = nextStr;
      setFormSumField("price", nextStr);
    }
  }, [clearPriceTimer, setFormSumField]);

  const flushPendingConversions = useCallback(() => {
    resolveTareIfMultiply();
    resolvePriceIfThousand();
  }, [resolvePriceIfThousand, resolveTareIfMultiply]);

  const updateActiveValue = useCallback(
    (nextVal) => {
      const key = activeRow?.key;
      if (!key) return;

      setFormSumField(key, nextVal);

      if (key === "tare") {
        latestTareRef.current = nextVal;
        clearTareTimer();

        if (/[xX*]/.test(nextVal)) {
          tareTimerRef.current = setTimeout(() => {
            resolveTareIfMultiply();
          }, 3000);
        }
      } else if (key === "price") {
        latestPriceRef.current = nextVal;
        clearPriceTimer();

        if (/k/i.test(nextVal)) {
          priceTimerRef.current = setTimeout(() => {
            resolvePriceIfThousand();
          }, 3000);
        }
      }
    },
    [
      activeRow,
      clearPriceTimer,
      clearTareTimer,
      resolvePriceIfThousand,
      resolveTareIfMultiply,
      setFormSumField,
    ],
  );

  const handleKeyPress = useCallback(
    (num) => {
      const key = activeRow?.key;
      if (!key) return;
      const currentVal = useColumnSumStore.getState().formSum[key] || "";

      if (num === "x") {
        if (key !== "tare") return;
        if (!currentVal || /[xX*]$/.test(currentVal)) return;
        updateActiveValue(`${currentVal}x`);
        return;
      }

      if (num === "k") {
        if (key !== "price") return;
        if (!currentVal || /k/i.test(currentVal)) return;
        updateActiveValue(`${currentVal}k`);
        return;
      }

      if (num === "." && currentVal.includes(".")) return;
      updateActiveValue(`${currentVal}${num}`);
    },
    [activeRow, updateActiveValue],
  );

  const handleDelete = useCallback(() => {
    const key = activeRow?.key;
    if (!key) return;
    const currentVal = useColumnSumStore.getState().formSum[key] || "";
    if (currentVal.length > 0) {
      updateActiveValue(currentVal.slice(0, -1));
    }
  }, [activeRow, updateActiveValue]);

  const handleResetForm = useCallback(() => {
    clearTareTimer();
    clearPriceTimer();
    latestTareRef.current = "";
    latestPriceRef.current = "";
    resetFormSum();
  }, [clearPriceTimer, clearTareTimer, resetFormSum]);

  useEffect(() => {
    return () => {
      clearTareTimer();
      clearPriceTimer();
    };
  }, [clearPriceTimer, clearTareTimer]);

  const showKeyboard = useCallback(() => {
    setIsKeyboardVisible(true);
  }, []);

  const focusInputAt = useCallback(
    (idx) => {
      flushPendingConversions();
      const clampedIdx = Math.max(0, Math.min(idx, EDITABLE_ROWS.length - 1));
      const targetKey = EDITABLE_ROWS[clampedIdx]?.key;
      setActiveInputIdx(clampedIdx);
      if (targetKey && inputRefs.current[targetKey]) {
        inputRefs.current[targetKey].focus();
      }
    },
    [flushPendingConversions],
  );

  const handleInputFocus = useCallback(
    (idx) => {
      flushPendingConversions();
      setActiveColumn(colIdx);
      Keyboard.dismiss();
      setActiveInputIdx(idx);
      showKeyboard();
    },
    [flushPendingConversions, setActiveColumn, showKeyboard],
  );

  const hideKeyboard = useCallback(() => {
    flushPendingConversions();
    const currentKey = activeRow?.key;
    if (currentKey && inputRefs.current[currentKey]) {
      inputRefs.current[currentKey].blur();
    }
  }, [activeRow, flushPendingConversions]);

  const handlePrevInput = useCallback(() => {
    if (activeInputIdx > 0) {
      focusInputAt(activeInputIdx - 1);
    }
  }, [activeInputIdx, focusInputAt]);

  const handleNextInput = useCallback(() => {
    if (activeInputIdx < EDITABLE_ROWS.length - 1) {
      focusInputAt(activeInputIdx + 1);
    }
  }, [activeInputIdx, focusInputAt]);

  const pathname = usePathname();
  useEffect(() => {
    flushPendingConversions();
    setIsKeyboardVisible(false);
  }, [pathname, flushPendingConversions]);

  useEffect(() => {
    if (!isActiveColumn) {
      flushPendingConversions();
      setIsKeyboardVisible(false);
    }
  }, [flushPendingConversions, isActiveColumn]);

  const parsedTare = useMemo(() => {
    const raw = formSum.tare;
    if (/[xX*]/.test(raw)) {
      const multiplied = evaluateMultiplyIfNeeded(raw);
      return multiplied !== null ? multiplied : 0;
    }
    const num = Number(raw);
    return Number.isNaN(num) ? 0 : num;
  }, [formSum.tare]);

  const parsedPrice = useMemo(() => {
    const raw = formSum.price;
    if (/k/i.test(raw)) {
      const converted = evaluateThousandIfNeeded(raw);
      return converted !== null ? converted : 0;
    }
    const num = Number(raw);
    return Number.isNaN(num) ? 0 : num;
  }, [formSum.price]);

  const netWeight = useMemo(() => {
    const tong = Number(grandTotal) || 0;
    return Math.max(0, tong - parsedTare);
  }, [grandTotal, parsedTare]);

  const finalResult = useMemo(() => {
    return parsedPrice > 0 ? netWeight * parsedPrice : netWeight;
  }, [netWeight, parsedPrice]);

  const renderEditableRow = (row, rowIdx) => {
    const displayValue = formSum[row.key] ?? "";
    const isActive =
      isKeyboardVisible && isActiveColumn && activeInputIdx === rowIdx;

    return (
      <View key={row.key} style={{}}>
        <TextInput
          ref={(el) => {
            inputRefs.current[row.key] = el;
          }}
          onFocus={() => handleInputFocus(rowIdx)}
          style={{
            height: 28,
            borderWidth: 2,
            borderColor: isActive ? "#333" : "transparent",
            borderRadius: 10,
            paddingBottom: 0,
            paddingTop: 0,
            paddingRight: 10,
            marginBottom: 4,
            fontSize: 16,
            backgroundColor: "#fff",
            color: "#333333",
            fontWeight: "500",
          }}
          placeholder={`Nhập ${row.label.toLowerCase()}`}
          placeholderTextColor="#aaa"
          value={displayValue}
          showSoftInputOnFocus={false}
          contextMenuHidden={true}
          selectTextOnFocus={false}
          caretHidden={true}
        />
      </View>
    );
  };

  return (
    <View style={{ width: "48%", marginBottom: 10 }}>
      <View
        style={{
          width: "100%",
          height: 248,
          backgroundColor: "#fff",
          borderRadius: 18,
          padding: 12,
          borderWidth: 1,
          borderColor: "#e1e4e8",
          elevation: 2,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          marginBottom: 10,
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#333",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Tong
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#333",
            marginBottom: 8,
            textAlign: "left",
            paddingLeft: 10,
          }}
        >
          {grandTotal}
        </Text>

        {renderEditableRow(EDITABLE_ROWS[0], 0)}
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#333",
            marginBottom: 8,
            textAlign: "left",
            paddingLeft: 10,
          }}
        >
          {netWeight}
        </Text>
        {renderEditableRow(EDITABLE_ROWS[1], 1)}
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#333",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          {finalResult}
        </Text>

        <View
          style={{
            marginTop: 4,
            padding: 6,
            backgroundColor: "#e6f4ea",
            borderRadius: 6,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: "#137333",
            }}
          >
            {finalResult}
          </Text>
        </View>
      </View>

      {isKeyboardVisible && isActiveColumn && (
        <CustomKeypadAdvanced
          onKeyPress={handleKeyPress}
          onDelete={handleDelete}
          onPrevInput={handlePrevInput}
          onNextInput={handleNextInput}
          onHideKeyboard={hideKeyboard}
          isReset={handleResetForm}
          isKeyboardVisible={isKeyboardVisible}
          setIsKeyboardVisible={setIsKeyboardVisible}
        />
      )}
    </View>
  );
};

export default memo(ColumnSumCard);
