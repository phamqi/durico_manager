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
    { label: "Cà phê", value: 1 },
    { label: "Sầu riêng", value: 2 },
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
    tare: "",
    price: "",
  });

  const [activeInputIdx, setActiveInputIdx] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const inputRefs = useRef({});
  const tareTimerRef = useRef(null);
  const latesttareRef = useRef("");

  latesttareRef.current = formValues.tare;

  const activeRow = EDITABLE_ROWS[activeInputIdx] ?? EDITABLE_ROWS[0];

  const cleartareTimer = useCallback(() => {
    if (tareTimerRef.current) {
      clearTimeout(tareTimerRef.current);
      tareTimerRef.current = null;
    }
  }, []);

  // Nếu chuỗi tare có chứa 'x' và đủ 2 vế thì tính và thay thế bằng kết quả
  const resolvetareIfMultiply = useCallback(() => {
    cleartareTimer();
    const raw = latesttareRef.current;
    if (!/[xX*]/.test(raw)) return;

    const computed = evaluateMultiplyIfNeeded(raw);
    if (computed !== null) {
      const nextStr = String(computed);
      latesttareRef.current = nextStr;
      setFormValues((prev) => ({
        ...prev,
        tare: nextStr,
      }));
    }
  }, [cleartareTimer]);

  useEffect(() => {
    return () => {
      cleartareTimer();
    };
  }, [cleartareTimer]);

  const showKeyboard = useCallback(() => {
    setIsKeyboardVisible(true);
  }, []);

  const focusInputAt = useCallback(
    (idx) => {
      if (activeRow?.key === "tare") {
        resolvetareIfMultiply();
      }
      const clampedIdx = Math.max(0, Math.min(idx, EDITABLE_ROWS.length - 1));
      const targetKey = EDITABLE_ROWS[clampedIdx]?.key;
      setActiveInputIdx(clampedIdx);
      if (targetKey && inputRefs.current[targetKey]) {
        inputRefs.current[targetKey].focus();
      }
    },
    [activeRow, resolvetareIfMultiply],
  );

  const handleInputFocus = useCallback(
    (idx, rowKey) => {
      if (activeRow?.key === "tare" && rowKey !== "tare") {
        resolvetareIfMultiply();
      }
      setActiveColumn(colIdx);
      Keyboard.dismiss();
      setActiveInputIdx(idx);
      showKeyboard();
    },
    [activeRow, resolvetareIfMultiply, setActiveColumn, showKeyboard],
  );

  const hideKeyboard = useCallback(() => {
    if (activeRow?.key === "tare") {
      resolvetareIfMultiply();
    }
    const currentKey = activeRow?.key;
    if (currentKey && inputRefs.current[currentKey]) {
      inputRefs.current[currentKey].blur();
    }
  }, [activeRow, resolvetareIfMultiply]);

  const updateActiveValue = useCallback(
    (nextVal) => {
      const key = activeRow?.key;
      if (!key) return;
      setFormValues((prev) => ({
        ...prev,
        [key]: nextVal,
      }));

      if (key === "tare") {
        latesttareRef.current = nextVal;
        cleartareTimer();

        // Chỉ đếm ngược 3s khi giá trị nhập có chứa 'x'
        if (/[xX*]/.test(nextVal)) {
          tareTimerRef.current = setTimeout(() => {
            resolvetareIfMultiply();
          }, 3000);
        }
      }
    },
    [activeRow, cleartareTimer, resolvetareIfMultiply],
  );

  const handleKeyPress = useCallback(
    (num) => {
      const key = activeRow?.key;
      if (!key) return;
      const currentVal = formValues[key] || "";

      if (num === "x") {
        if (key !== "tare") return;
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
    cleartareTimer();
    latesttareRef.current = "";
    setFormValues({
      tare: "",
      price: "",
    });
  }, [cleartareTimer]);

  const pathname = usePathname();
  useEffect(() => {
    if (activeRow?.key === "tare") {
      resolvetareIfMultiply();
    }
    setIsKeyboardVisible(false);
  }, [pathname]);

  useEffect(() => {
    if (!isActiveColumn) {
      setIsKeyboardVisible(false);
    }
  }, [isActiveColumn]);

  const parsedtare = useMemo(() => {
    const raw = formValues.tare;
    if (/[xX*]/.test(raw)) {
      const multiplied = evaluateMultiplyIfNeeded(raw);
      return multiplied !== null ? multiplied : 0;
    }
    const num = Number(raw);
    return Number.isNaN(num) ? 0 : num;
  }, [formValues.tare]);

  const netWeight = useMemo(() => {
    const tong = Number(grandTotal) || 0;
    return Math.max(0, tong - parsedtare);
  }, [grandTotal, parsedtare]);

  const finalResult = useMemo(() => {
    const price = Number(formValues.price) || 0;
    return price > 0 ? netWeight * price : netWeight;
  }, [netWeight, formValues.price]);

  const renderReadonlyRow = (label, value) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: "#444",
          paddingLeft: 10,
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

  const renderEditableRow = (row, rowIdx) => {
    const displayValue = formValues[row.key] ?? "";
    const isActive =
      isKeyboardVisible && isActiveColumn && activeInputIdx === rowIdx;

    return (
      <View key={row.key} style={{}}>
        <TextInput
          ref={(el) => {
            inputRefs.current[row.key] = el;
          }}
          onFocus={() => handleInputFocus(rowIdx, row.key)}
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
          currentWorkerId={currentWorker?.id}
          isReset={handleResetForm}
          isKeyboardVisible={isKeyboardVisible}
          setIsKeyboardVisible={setIsKeyboardVisible}
          isMultiplyEnabled={activeRow?.key === "tare"}
        />
      )}
    </View>
  );
};

export default memo(ColumnSumCard);
