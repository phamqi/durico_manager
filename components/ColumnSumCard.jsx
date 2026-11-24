import {
  useColumnStore,
  useColumnSumStore,
  useDuricoAlert,
  useGlobalState,
  useTransactionTypeStore,
} from "@/context";
import { usePathname } from "expo-router";
import {
  ChevronDown,
  ChevronUp,
  Delete,
  KeyboardOff,
  RotateCcw,
  ScanText,
  X,
} from "lucide-react-native";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Portal } from "react-native-paper";
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// Chỉ 2 ô cần nhập liệu và điều hướng bằng mũi tên lên/xuống
const EDITABLE_ROWS = [
  { key: "truBi", label: "Tru bi" },
  { key: "gia", label: "Gia" },
];

// Tính biểu thức phép nhân nếu có 'x', trả về null nếu biểu thức chưa hoàn chỉnh (vd: "36x")
const evaluateMultiplyIfNeeded = (rawValue) => {
  const trimmed = String(rawValue ?? "").trim();
  if (!trimmed || !/[xX*]/.test(trimmed)) return null;

  const parts = trimmed.split(/[xX*]/);
  if (parts.some((p) => p === "")) return null;

  const nums = parts.map((p) => Number(p));
  if (nums.some((n) => Number.isNaN(n) || !Number.isFinite(n))) return null;

  return nums.reduce((acc, n) => acc * n, 1);
};

const CustomKeypadAdvanced = ({
  onKeyPress,
  onDelete,
  onPrevInput,
  onNextInput,
  onHideKeyboard,
  isKeyboardVisible,
  setIsKeyboardVisible,
  isReset,
  isMultiplyEnabled = false,
}) => {
  const alert = useDuricoAlert();
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [typeBtnLayout, setTypeBtnLayout] = useState(null);
  const typeBtnRef = useRef(null);

  const popupScale = useRef(new Animated.Value(0.1)).current;
  const popupOpacity = useRef(new Animated.Value(0)).current;
  const btnScaleX = useRef(new Animated.Value(1)).current;
  const btnScaleY = useRef(new Animated.Value(1)).current;
  const btnOpacity = useRef(new Animated.Value(1)).current;

  const transactionTypes = [
    { label: "Thu nhập", value: 0 },
    { label: "Ca phe", value: 1 },
    { label: "Sau rieng", value: 2 },
  ];

  const selectedType = useTransactionTypeStore((state) => state.selectedType);
  const setSelectedType = useTransactionTypeStore(
    (state) => state.setSelectedType,
  );
  const currentSelectedLabel =
    transactionTypes.find((t) => t.value === selectedType)?.label ||
    "Chọn loại";

  const translateY = useSharedValue(300);

  const handleHideKeypad = () => {
    translateY.value = withTiming(300, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(setIsKeyboardVisible)(false);
      }
    });
    onHideKeyboard();
  };

  const handleOpenTypeModal = () => {
    if (typeBtnRef.current) {
      typeBtnRef.current.measureInWindow((x, y, width, height) => {
        setTypeBtnLayout({ x, y, width, height });

        popupScale.setValue(0.1);
        popupOpacity.setValue(0);
        btnScaleX.setValue(1);
        btnScaleY.setValue(1);
        btnOpacity.setValue(1);

        setShowTypeModal(true);

        requestAnimationFrame(() => {
          Animated.sequence([
            Animated.parallel([
              Animated.timing(btnScaleX, {
                toValue: 1.5,
                duration: 250,
                useNativeDriver: true,
              }),
              Animated.timing(btnScaleY, {
                toValue: 1.1,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(btnOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
              }),
            ]),
            Animated.parallel([
              Animated.spring(popupScale, {
                toValue: 1,
                friction: 6,
                tension: 80,
                useNativeDriver: true,
              }),
              Animated.timing(popupOpacity, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
              }),
            ]),
          ]).start();
        });
      });
    }
  };

  const handleCloseTypeModal = () => {
    Animated.parallel([
      Animated.timing(popupScale, {
        toValue: 0.15,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(popupOpacity, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(btnScaleX, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(btnScaleY, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(btnOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowTypeModal(false);
    });
  };

  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  const handleResetPress = () => {
    if (!isConfirmingReset) {
      setIsConfirmingReset(true);
      alert.toast("Chạm lần nữa để làm mới");
      setTimeout(() => {
        setIsConfirmingReset(false);
      }, 3000);
    } else {
      isReset();
      setIsConfirmingReset(false);
    }
  };

  const animatedKeyboardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    if (isKeyboardVisible) {
      translateY.value = withTiming(0, { duration: 200 });
    }
  }, [isKeyboardVisible]);

  return (
    <Portal>
      <Animated.View
        style={[
          {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 999,
          },
          animatedKeyboardStyle,
        ]}
        pointerEvents="box-none"
      >
        <View
          style={{
            backgroundColor: "#DFE3E6",
            position: "absolute",
            bottom: 59,
            left: 0,
            right: 0,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            overflow: "hidden",
            height: 270,
          }}
        >
          {/* THANH CÔNG CỤ TRÊN CÙNG */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "#DFE3E6",
              paddingHorizontal: 40,
              paddingVertical: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "500", color: "#333" }}>
              {currentSelectedLabel}
            </Text>
            <TouchableOpacity
              style={{ backgroundColor: "transparent", borderRadius: 6 }}
              onPress={handleResetPress}
            >
              <RotateCcw
                size={24}
                style={{
                  color: "#FF3B30",
                  opacity: isConfirmingReset ? 1 : 0.7,
                }}
              />
            </TouchableOpacity>
          </View>

          {/* KHU VỰC BÀN PHÍM */}
          <View style={{ flexDirection: "row", height: 230, padding: 6 }}>
            {/* KHỐI TRÁI: Bàn phím số (3 cột) */}
            <View
              style={{
                flex: 3,
                justifyContent: "space-between",
                marginRight: 6,
              }}
            >
              <View style={{ flexDirection: "row", flex: 1 }}>
                {["1", "2", "3"].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={{
                      flex: 1,
                      backgroundColor: "#FFF",
                      margin: 3,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 6,
                      elevation: 1,
                    }}
                    onPress={() => onKeyPress(num)}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ flexDirection: "row", flex: 1 }}>
                {["4", "5", "6"].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={{
                      flex: 1,
                      backgroundColor: "#FFF",
                      margin: 3,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 6,
                      elevation: 1,
                    }}
                    onPress={() => onKeyPress(num)}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ flexDirection: "row", flex: 1 }}>
                {["7", "8", "9"].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={{
                      flex: 1,
                      backgroundColor: "#FFF",
                      margin: 3,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 6,
                      elevation: 1,
                    }}
                    onPress={() => onKeyPress(num)}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ flexDirection: "row", flex: 1 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: "#FFF",
                    margin: 3,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 6,
                  }}
                  onPress={onPrevInput}
                >
                  <ChevronUp />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: "#FFF",
                    margin: 3,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 6,
                    elevation: 1,
                  }}
                  onPress={() => onKeyPress("0")}
                >
                  <Text
                    style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}
                  >
                    0
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: "#FFF",
                    margin: 3,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 6,
                  }}
                  onPress={onNextInput}
                >
                  <ChevronDown />
                </TouchableOpacity>
              </View>
            </View>

            {/* KHỐI PHẢI */}
            <View style={{ flex: 1, justifyContent: "space-between" }}>
              <Animated.View
                style={{
                  flex: 1,
                  margin: 3,
                  transform: [{ scaleX: btnScaleX }, { scaleY: btnScaleY }],
                  opacity: btnOpacity,
                }}
              >
                <TouchableOpacity
                  ref={typeBtnRef}
                  collapsable={false}
                  style={{
                    flex: 1,
                    backgroundColor: "#FFF",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 6,
                    width: "100%",
                  }}
                  onPress={handleOpenTypeModal}
                >
                  <ScanText />
                </TouchableOpacity>
              </Animated.View>

              {/* Nút X dùng để nhập dấu nhân cho Trừ bì */}
              <TouchableOpacity
                disabled={!isMultiplyEnabled}
                style={{
                  flex: 1,
                  backgroundColor: "#BBDEFB",
                  margin: 3,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 6,
                  opacity: isMultiplyEnabled ? 1 : 0.45,
                }}
                onPress={() => onKeyPress("x")}
              >
                <X size={24} color="#333" />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#FFCDD2",
                  margin: 3,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 6,
                }}
                onPress={onDelete}
              >
                <Delete />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#CFD8DC",
                  margin: 3,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 6,
                }}
                onPress={handleHideKeypad}
              >
                <KeyboardOff />
              </TouchableOpacity>
            </View>
          </View>

          <Modal visible={showTypeModal} transparent animationType="none">
            <Pressable style={{ flex: 1 }} onPress={handleCloseTypeModal}>
              {typeBtnLayout && (
                <Animated.View
                  style={{
                    position: "absolute",
                    top: typeBtnLayout.y,
                    left: typeBtnLayout.x + typeBtnLayout.width - 180,
                    width: 180,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderRadius: 12,
                    padding: 10,
                    transform: [
                      {
                        translateX: popupScale.interpolate({
                          inputRange: [0.15, 1],
                          outputRange: [-20, 0],
                        }),
                      },
                      {
                        translateY: popupScale.interpolate({
                          inputRange: [0.15, 1],
                          outputRange: [35, 0],
                        }),
                      },
                      { scale: popupScale },
                    ],
                    opacity: popupOpacity,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: 13,
                      textAlign: "center",
                      marginBottom: 4,
                      color: "#444",
                    }}
                  >
                    Chọn giao dịch
                  </Text>
                  {transactionTypes.map((type) => (
                    <View
                      key={type.value}
                      style={{ backgroundColor: "transparent" }}
                    >
                      <TouchableOpacity
                        style={{
                          padding: 10,
                          borderRadius: 6,
                          backgroundColor: "transparent",
                        }}
                        onPress={() => {
                          setSelectedType(type.value);
                          handleCloseTypeModal();
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            color:
                              selectedType === type.value ? "#137333" : "#333",
                            fontWeight:
                              selectedType === type.value ? "bold" : "normal",
                          }}
                        >
                          {type.label}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </Animated.View>
              )}
            </Pressable>
          </Modal>
        </View>
      </Animated.View>
    </Portal>
  );
};

const ColumnSumCard = () => {
  const { currentWorker } = useGlobalState();
  const colIdx = "sum";
  const sumsByCol = useColumnSumStore((state) => state.sumsByCol);
  const isActiveColumn = useColumnStore(
    (state) => state.activeColumnIndex === colIdx,
  );
  const setActiveColumn = useColumnStore((state) => state.setActiveColumn);
  const grandTotal = useMemo(
    () =>
      Object.values(sumsByCol).reduce(
        (acc, val) => acc + (Number(val) || 0),
        0,
      ),
    [sumsByCol],
  );

  const [formValues, setFormValues] = useState({
    truBi: "",
    gia: "",
  });

  const [activeInputIdx, setActiveInputIdx] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const inputRefs = useRef({});
  const truBiTimerRef = useRef(null);
  const latestTruBiRef = useRef("");

  latestTruBiRef.current = formValues.truBi;

  const activeRow = EDITABLE_ROWS[activeInputIdx] ?? EDITABLE_ROWS[0];

  const clearTruBiTimer = useCallback(() => {
    if (truBiTimerRef.current) {
      clearTimeout(truBiTimerRef.current);
      truBiTimerRef.current = null;
    }
  }, []);

  // Nếu chuỗi truBi có chứa 'x' và đủ 2 vế thì tính và thay thế bằng kết quả
  const resolveTruBiIfMultiply = useCallback(() => {
    clearTruBiTimer();
    const raw = latestTruBiRef.current;
    if (!/[xX*]/.test(raw)) return;

    const computed = evaluateMultiplyIfNeeded(raw);
    if (computed !== null) {
      const nextStr = String(computed);
      latestTruBiRef.current = nextStr;
      setFormValues((prev) => ({
        ...prev,
        truBi: nextStr,
      }));
    }
  }, [clearTruBiTimer]);

  useEffect(() => {
    return () => {
      clearTruBiTimer();
    };
  }, [clearTruBiTimer]);

  const focusInputAt = useCallback(
    (idx) => {
      if (activeRow?.key === "truBi") {
        resolveTruBiIfMultiply();
      }
      const clampedIdx = Math.max(0, Math.min(idx, EDITABLE_ROWS.length - 1));
      const targetKey = EDITABLE_ROWS[clampedIdx]?.key;
      setActiveInputIdx(clampedIdx);
      setIsKeyboardVisible(true);
      Keyboard.dismiss();
      if (targetKey && inputRefs.current[targetKey]) {
        inputRefs.current[targetKey].focus();
      }
    },
    [activeRow, resolveTruBiIfMultiply],
  );

  const handleFocusRow = useCallback(
    (rowKey) => {
      if (activeRow?.key === "truBi" && rowKey !== "truBi") {
        resolveTruBiIfMultiply();
      }
      const idx = EDITABLE_ROWS.findIndex((r) => r.key === rowKey);
      if (idx !== -1) {
        setActiveInputIdx(idx);
      }
      Keyboard.dismiss();
      setActiveColumn(colIdx);
      setIsKeyboardVisible(true);
    },
    [activeRow, resolveTruBiIfMultiply],
  );

  const hideKeyboard = useCallback(() => {
    if (activeRow?.key === "truBi") {
      resolveTruBiIfMultiply();
    }
    setIsKeyboardVisible(false);
    const currentKey = activeRow?.key;
    if (currentKey && inputRefs.current[currentKey]) {
      inputRefs.current[currentKey].blur();
    }
  }, [activeRow, resolveTruBiIfMultiply]);

  const updateActiveValue = useCallback(
    (nextVal) => {
      const key = activeRow?.key;
      if (!key) return;
      setFormValues((prev) => ({
        ...prev,
        [key]: nextVal,
      }));

      if (key === "truBi") {
        latestTruBiRef.current = nextVal;
        clearTruBiTimer();

        // Chỉ đếm ngược 3s khi giá trị nhập có chứa 'x'
        if (/[xX*]/.test(nextVal)) {
          truBiTimerRef.current = setTimeout(() => {
            resolveTruBiIfMultiply();
          }, 3000);
        }
      }
    },
    [activeRow, clearTruBiTimer, resolveTruBiIfMultiply],
  );

  const handleKeyPress = useCallback(
    (num) => {
      const key = activeRow?.key;
      if (!key) return;
      const currentVal = formValues[key] || "";

      if (num === "x") {
        if (key !== "truBi") return;
        // Chỉ cho phép nhập 'x' sau khi đã có số và không nhập 2 dấu 'x' liền nhau
        if (!currentVal || /[xX*]$/.test(currentVal)) return;
        updateActiveValue(`${currentVal}x`);
        return;
      }

      if (num === "." && currentVal.includes(".")) return;
      updateActiveValue(`${currentVal}${num}`);
    },
    [activeRow, formValues, updateActiveValue],
  );

  const handleDelete = useCallback(() => {
    const key = activeRow?.key;
    if (!key) return;
    const currentVal = formValues[key] || "";
    if (currentVal.length > 0) {
      updateActiveValue(currentVal.slice(0, -1));
    }
  }, [activeRow, formValues, updateActiveValue]);

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

  const handleResetForm = useCallback(() => {
    clearTruBiTimer();
    latestTruBiRef.current = "";
    setFormValues({
      truBi: "",
      gia: "",
    });
  }, [clearTruBiTimer]);

  const pathname = usePathname();
  useEffect(() => {
    if (activeRow?.key === "truBi") {
      resolveTruBiIfMultiply();
    }
    setIsKeyboardVisible(false);
  }, [pathname]);

  // Giá trị trừ bì số học: ưu tiên kết quả phép nhân nếu hợp lệ, nếu không thì parse số trực tiếp
  const parsedTruBi = useMemo(() => {
    const raw = formValues.truBi;
    if (/[xX*]/.test(raw)) {
      const multiplied = evaluateMultiplyIfNeeded(raw);
      return multiplied !== null ? multiplied : 0;
    }
    const num = Number(raw);
    return Number.isNaN(num) ? 0 : num;
  }, [formValues.truBi]);

  // Con = Tong - Tru bi (chỉ hiển thị, không nhập liệu)
  const conValue = useMemo(() => {
    const tong = Number(grandTotal) || 0;
    return Math.max(0, tong - parsedTruBi);
  }, [grandTotal, parsedTruBi]);

  const finalResult = useMemo(() => {
    const gia = Number(formValues.gia) || 0;
    return gia > 0 ? conValue * gia : conValue;
  }, [conValue, formValues.gia]);

  const renderReadonlyRow = (label, value) => (
    <View
      style={{
        marginBottom: 6,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 15,
          fontWeight: "600",
          color: "#444",
        }}
      >
        {label}
      </Text>
      <View
        style={{
          height: 30,
          borderRadius: 10,
          paddingHorizontal: 10,
          justifyContent: "center",
          backgroundColor: "#f3f4f6",
          borderWidth: 1,
          borderColor: "#e5e7eb",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: "#333333",
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );

  const renderEditableRow = (row) => {
    const isActive =
      isKeyboardVisible && activeRow?.key && isActiveColumn === row.key;
    const displayValue = formValues[row.key] ?? "";

    return (
      <View
        key={row.key}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            color: "#444",
          }}
        >
          {row.label}
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleFocusRow(row.key)}
        >
          <TextInput
            ref={(el) => {
              inputRefs.current[row.key] = el;
            }}
            editable={false}
            pointerEvents="none"
            style={{
              height: 28,
              borderWidth: 2,
              borderColor: "transparent",
              paddingBottom: 0,
              paddingTop: 0,
              paddingLeft: 10,
              marginBottom: 4,
              borderWidth: 0,
              borderColor: isActive ? "#333" : "#transparent",
              borderRadius: 10,
              fontWeight: "600",
              color: "#333333",
              height: 28,
              textAlignVertical: "center",
              fontSize: 16,
            }}
            placeholder={`Nhập ${row.label.toLowerCase()}`}
            placeholderTextColor="#aaa"
            value={displayValue}
            showSoftInputOnFocus={false}
            contextMenuHidden={true}
            selectTextOnFocus={false}
            caretHidden={true}
          />
        </TouchableOpacity>
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
        {/* 1. Tong */}
        {renderReadonlyRow("Tong", grandTotal)}

        {/* 2. Tru bi (nhập liệu) */}
        {renderEditableRow(EDITABLE_ROWS[0])}

        {/* 3. Con = Tong - Tru bi (chỉ hiển thị) */}
        {renderReadonlyRow("Con", conValue)}

        {/* 4. Gia (nhập liệu) */}
        {renderEditableRow(EDITABLE_ROWS[1])}

        {/* Kết quả */}
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
          currentWorkerId={currentWorker?.id}
          isReset={handleResetForm}
          isKeyboardVisible={isKeyboardVisible}
          setIsKeyboardVisible={setIsKeyboardVisible}
          isMultiplyEnabled={activeRow?.key === "truBi"}
        />
      )}
    </View>
  );
};

export default memo(ColumnSumCard);
