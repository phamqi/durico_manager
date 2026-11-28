import { CustomKeypadAdvanced } from "@/components";
import { DEFAULT_WORKER_COLOR } from "@/constants";
import {
  columnDataRef,
  useColumnStore,
  useColumnSumStore,
  useWorkerStore,
} from "@/context";
import { usePathname } from "expo-router";
import { RotateCcw, X } from "lucide-react-native";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const MENU_CLOSED_WIDTH = 28;
const MENU_CLOSED_HEIGHT = 16;
const MENU_OPEN_WIDTH = 66;
const MENU_OPEN_HEIGHT = 30;

const BTN_CLOSED_SIZE = 0;
const BTN_OPEN_SIZE = 23;
const BTN_GAP = 7;

const ColumnCard = ({
  colId,
  colIdx,
  handleAddColumn,
  handleResetColumn,
  onRemoveColumn,
}) => {
  const colorArray = useWorkerStore.getState().colorArray;
  const setCurrentWorker = useWorkerStore((state) => state.setCurrentWorker);

  const isActiveColumn = useColumnStore(
    (state) => state.activeColumnIndex === colIdx,
  );

  const setColumnSum = useColumnSumStore((state) => state.setColumnSum);
  const resetColumnSum = useColumnSumStore((state) => state.resetColumnSum);
  const setActiveColumn = useColumnStore((state) => state.setActiveColumn);
  const setKeyMode = useColumnStore((state) => state.setKeyMode);

  const createEmptyInputs = (count = 5) =>
    Array.from({ length: count }, () => ({
      weight: "",
      worker_id: null,
      worker_name: null,
      worker_color: null,
    }));

  const [columnData, setColumnData] = useState({
    id: colId,
    inputs: createEmptyInputs(5),
    result: 0,
  });

  const [activeInputIndex, setActiveInputIndex] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const translateY = useSharedValue(300);
  const inputRefs = useRef({});

  const showKeyboard = useCallback(() => {
    setIsKeyboardVisible(true);
    translateY.value = withTiming(0, { duration: 200 });
  }, [translateY]);

  const animatedKeyboardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const focusInput = useCallback(
    (inputIdx) => {
      setActiveInputIndex(inputIdx);
      setKeyMode("add");
      const key = `${colIdx}-${inputIdx}`;
      if (inputRefs.current[key]) {
        inputRefs.current[key].focus();
      }
    },
    [colIdx, setKeyMode],
  );

  const handleInputFocus = useCallback(
    (inputIdx, inputItem) => {
      setActiveColumn(colIdx);
      setKeyMode("add");
      Keyboard.dismiss();
      setActiveInputIndex(inputIdx);
      showKeyboard();
      if (inputItem.worker_id && colorArray) {
        const foundWorker = colorArray.find(
          (w) => w.id === inputItem.worker_id,
        );
        if (foundWorker) {
          setCurrentWorker(foundWorker);
        }
      }
    },
    [
      colIdx,
      colorArray,
      setActiveColumn,
      setCurrentWorker,
      setKeyMode,
      showKeyboard,
    ],
  );

  const hideKeyboard = () => {
    const key = `${colIdx}-${activeInputIndex}`;
    if (inputRefs.current[key]) {
      inputRefs.current[key].blur();
    }
  };

  const updateWeightValue = (newValue) => {
    const currentWorker = useWorkerStore.getState().currentWorker;
    const updatedInputs = columnData.inputs.map((item, idx) =>
      idx === activeInputIndex
        ? {
            ...item,
            weight: newValue,
            worker_id: currentWorker ? currentWorker.id : null,
            worker_name: currentWorker ? currentWorker.name : null,
            worker_color: currentWorker ? currentWorker.color : null,
          }
        : item,
    );

    const sum = updatedInputs.reduce(
      (acc, item) => acc + (Number(item.weight) || 0),
      0,
    );

    setColumnData((prevData) => ({
      ...prevData,
      inputs: updatedInputs,
      result: sum.toString(),
    }));
    setColumnSum(colId, sum);
  };

  const handleKeyPress = (num) => {
    const keyStr = String(num);
    const currentVal = columnData.inputs[activeInputIndex]?.weight || "";
    if (currentVal === "" && keyStr === "0") {
      return;
    }
    updateWeightValue(currentVal + keyStr);
  };

  const handleDelete = () => {
    const currentVal = columnData.inputs[activeInputIndex]?.weight || "";
    if (currentVal.length > 0) {
      updateWeightValue(currentVal.slice(0, -1));
    }
  };

  const handlePrevInput = () => {
    if (activeInputIndex > 0) {
      focusInput(activeInputIndex - 1);
    }
  };

  const handleNextInput = () => {
    if (activeInputIndex < columnData.inputs.length - 1) {
      focusInput(activeInputIndex + 1);
    }
  };

  const addColumn = () => {
    handleAddColumn();
  };

  const resetColumn = () => {
    handleResetColumn();
    resetColumnSum(colId);
    setColumnData({
      id: Date.now(),
      inputs: createEmptyInputs(5),
      result: 0,
    });
  };

  const handleRefreshCurrentColumn = () => {
    setMenuOpen(false);
    resetColumnSum(colId);
    setColumnData({
      id: colId,
      inputs: createEmptyInputs(5),
      result: 0,
    });
  };

  const handleCloseCurrentColumn = () => {
    setMenuOpen(false);
    setIsKeyboardVisible(false);
    resetColumnSum(colId);
    onRemoveColumn(colId);
  };

  const pathname = usePathname();
  useEffect(() => {
    setIsKeyboardVisible(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    columnDataRef[colIdx] = () => columnData;
    return () => {
      delete columnDataRef[colIdx];
    };
  }, [columnData, colIdx]);

  const openProgress = useSharedValue(0);

  useEffect(() => {
    openProgress.value = withTiming(menuOpen ? 1 : 0, {
      duration: 240,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    });
  }, [menuOpen, openProgress]);

  const containerAnimStyle = useAnimatedStyle(() => ({
    width: interpolate(
      openProgress.value,
      [0, 1],
      [MENU_CLOSED_WIDTH, MENU_OPEN_WIDTH],
    ),
    height: interpolate(
      openProgress.value,
      [0, 1],
      [MENU_CLOSED_HEIGHT, MENU_OPEN_HEIGHT],
    ),
  }));

  const dotsAnimStyle = useAnimatedStyle(() => ({
    opacity: interpolate(openProgress.value, [0, 0.45], [1, 0]),
    width: interpolate(openProgress.value, [0, 1], [20, 0]),
    transform: [{ scale: interpolate(openProgress.value, [0, 1], [1, 0.3]) }],
  }));

  const firstButtonAnimStyle = useAnimatedStyle(() => {
    const size = interpolate(
      openProgress.value,
      [0, 1],
      [BTN_CLOSED_SIZE, BTN_OPEN_SIZE],
    );
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      opacity: openProgress.value,
      transform: [{ scale: interpolate(openProgress.value, [0, 1], [0.4, 1]) }],
    };
  });

  const actionButtonAnimStyle = useAnimatedStyle(() => {
    const size = interpolate(
      openProgress.value,
      [0, 1],
      [BTN_CLOSED_SIZE, BTN_OPEN_SIZE],
    );
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      marginLeft: interpolate(openProgress.value, [0, 1], [0, BTN_GAP]),
      opacity: openProgress.value,
      transform: [{ scale: interpolate(openProgress.value, [0, 1], [0.4, 1]) }],
    };
  });
  console.log("ColumnCard rerender", colIdx);

  return (
    <Animated.View
      layout={LinearTransition.duration(260)}
      style={{ width: "48%" }}
    >
      <View
        style={{
          width: "100%",
          marginBottom: 10,
          height: 248,
        }}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#fff",
            borderRadius: 18,
            padding: 9,
            borderWidth: 1,
            borderColor: "#e1e4e8",
            elevation: 2,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            overflow: "hidden",
          }}
        >
          {menuOpen && (
            <Pressable
              onPress={() => setMenuOpen(false)}
              style={[
                StyleSheet.absoluteFillObject,
                {
                  backgroundColor: "rgba(255,255,255, 0.6)",
                  zIndex: 15,
                },
              ]}
            />
          )}
          <View
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              zIndex: 20,
            }}
          >
            <Animated.View
              style={[
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#DFE3E6",
                  borderRadius: 14,
                  overflow: "hidden",
                  paddingHorizontal: 4,
                },
                containerAnimStyle,
              ]}
            >
              <Animated.View
                pointerEvents={menuOpen ? "none" : "auto"}
                style={[
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  },
                  dotsAnimStyle,
                ]}
              >
                <TouchableOpacity
                  onPress={() => setMenuOpen(true)}
                  hitSlop={10}
                  activeOpacity={0.7}
                  style={{
                    width: "100%",
                    height: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 2.5,
                      backgroundColor: "#fa6f7d",
                    }}
                  ></View>
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 2.5,
                      backgroundColor: "#72bfff",
                    }}
                  ></View>
                </TouchableOpacity>
              </Animated.View>
              <Animated.View
                pointerEvents={menuOpen ? "auto" : "none"}
                style={[
                  {
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#fa6f7d",
                    overflow: "hidden",
                  },
                  firstButtonAnimStyle,
                ]}
              >
                <TouchableOpacity
                  onPress={handleCloseCurrentColumn}
                  hitSlop={{ top: 6, bottom: 6, left: 15, right: 0 }}
                  activeOpacity={0.75}
                  style={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <X size={16} color="#333" strokeWidth={3.5} />
                </TouchableOpacity>
              </Animated.View>

              <Animated.View
                pointerEvents={menuOpen ? "auto" : "none"}
                style={[
                  {
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#72bfff",
                    overflow: "hidden",
                  },
                  actionButtonAnimStyle,
                ]}
              >
                <TouchableOpacity
                  onPress={handleRefreshCurrentColumn}
                  hitSlop={{ top: 6, bottom: 6, left: 0, right: 15 }}
                  activeOpacity={0.75}
                  style={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <RotateCcw size={16} color="#333" strokeWidth={3.5} />
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </View>

          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: "#333",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Cụm {colIdx + 1}
          </Text>

          {columnData.inputs &&
            columnData.inputs.map((inputItem, inputIdx) => {
              const isActive =
                isKeyboardVisible &&
                activeInputIndex === inputIdx &&
                isActiveColumn;
              const key = `${colIdx}-${inputIdx}`;

              return (
                <TextInput
                  key={key}
                  ref={(el) => (inputRefs.current[key] = el)}
                  style={{
                    height: 28,
                    borderWidth: 2,
                    borderColor: isActive ? "#333" : "transparent",
                    borderRadius: 10,
                    paddingBottom: 0,
                    paddingTop: 0,
                    paddingLeft: 10,
                    textAlignVertical: "center",
                    marginBottom: 4,
                    fontSize: 16,
                    backgroundColor: inputItem.weight
                      ? inputItem.worker_color === DEFAULT_WORKER_COLOR
                        ? "#fff"
                        : inputItem.worker_color
                      : "#fff",
                    color: "#333333",
                    fontWeight: "600",
                  }}
                  placeholder={`Ô ${inputIdx + 1}`}
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                  value={inputItem.weight || ""}
                  showSoftInputOnFocus={false}
                  contextMenuHidden={true}
                  selectTextOnFocus={false}
                  caretHidden={true}
                  onFocus={() => handleInputFocus(inputIdx, inputItem)}
                />
              );
            })}

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
                fontSize: 14,
                color: "#137333",
                fontWeight: "600",
              }}
            >
              Kết quả:
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#137333",
              }}
            >
              {columnData.result || "0"}
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
            isAdColumn={addColumn}
            isReset={resetColumn}
            isKeyboardVisible={isKeyboardVisible}
            setIsKeyboardVisible={setIsKeyboardVisible}
          />
        )}
      </View>
    </Animated.View>
  );
};

export default memo(ColumnCard);
