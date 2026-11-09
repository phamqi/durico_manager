import { CustomKeypadAdvanced } from "@/components";
import { DEFAULT_WORKER_COLOR } from "@/constants";
import { useDuricoAlert, useGlobalState } from "@/context";
import { usePathname } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useAnchoredModalReanimated } from "../../hooks/useAnchoreModal";
import { useAddScreenEnterAnimation } from "../../hooks/useAnchoreTab";

export default function AddScreen() {
  const {
    columnsData,
    setColumnsData,
    addColumn,
    colorArray,
    currentWorker,
    setCurrentWorker,
    totalSummary,
  } = useGlobalState();
  const alert = useDuricoAlert();
  const typeModal = useAnchoredModalReanimated();
  const animatedStyle = useAddScreenEnterAnimation();

  const [activeColIndex, setActiveColIndex] = useState(0);
  const [activeInputIndex, setActiveInputIndex] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Shared value cho animation bàn phím (bắt đầu ở 300 tức là nằm ẩn bên dưới)
  const translateY = useSharedValue(300);

  // Hàm mở bàn phím mượt mà
  const showKeyboard = () => {
    setIsKeyboardVisible(true);
    translateY.value = withTiming(0, { duration: 200 });
  };

  // Hàm ẩn bàn phím mượt mà rồi mới unmount component
  const hideKeyboard = () => {
    translateY.value = withTiming(300, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(setIsKeyboardVisible)(false);
      }
    });
  };

  // Style animation chạy trên UI thread (cực kỳ mượt, không giật lag)
  const animatedKeyboardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const pathname = usePathname();

  useEffect(() => {
    if (typeModal?.visible) {
      typeModal.close();
    }
    if (isKeyboardVisible == true) {
      hideKeyboard();
    }
  }, [pathname]);

  // Tạo một Ref để lưu trữ danh sách các ô TextInput nhằm điều khiển focus thủ công
  const inputRefs = useRef({});

  useEffect(() => {
    if (!columnsData || columnsData.length === 0) {
      if (typeof addColumn === "function") {
        addColumn();
      }
    }
  }, [columnsData]);

  // Hàm hỗ trợ focus vào ô TextInput tương ứng khi dùng nút < và >
  const focusInput = (colIdx, inputIdx) => {
    setActiveColIndex(colIdx);
    setActiveInputIndex(inputIdx);
    const key = `${colIdx}-${inputIdx}`;
    if (inputRefs.current[key]) {
      inputRefs.current[key].focus();
    }
  };

  const updateWeightValue = (newValue) => {
    if (!columnsData || columnsData.length === 0) return;
    const updatedData = [...columnsData];

    if (!updatedData[activeColIndex]) {
      setActiveColIndex(0);
      return;
    }

    if (!updatedData[activeColIndex].inputs[activeInputIndex]) {
      setActiveInputIndex(0);
    }

    updatedData[activeColIndex].inputs[activeInputIndex] = {
      ...updatedData[activeColIndex].inputs[activeInputIndex],
      weight: newValue,
      worker_id: currentWorker ? currentWorker.id : null,
      worker_name: currentWorker ? currentWorker.name : null,
      worker_color: currentWorker ? currentWorker.color : null,
    };

    const sum = updatedData[activeColIndex].inputs.reduce(
      (acc, item) => acc + (parseFloat(item.weight) || 0),
      0,
    );
    updatedData[activeColIndex].result = sum.toString();
    setColumnsData(updatedData);
  };

  const handleKeyPress = (num) => {
    if (!columnsData || !columnsData[activeColIndex]) return;
    const currentVal =
      columnsData[activeColIndex].inputs[activeInputIndex]?.weight || "";
    updateWeightValue(currentVal + num);
  };

  const handleDelete = () => {
    if (!columnsData || !columnsData[activeColIndex]) return;
    const currentVal =
      columnsData[activeColIndex].inputs[activeInputIndex]?.weight || "";
    if (currentVal.length > 0) {
      updateWeightValue(currentVal.slice(0, -1));
    }
  };

  const handlePrevInput = () => {
    if (activeInputIndex > 0) {
      focusInput(activeColIndex, activeInputIndex - 1);
    } else if (activeColIndex > 0) {
      const prevColIndex = activeColIndex - 1;
      const lastInputIdx = columnsData[prevColIndex].inputs.length - 1;
      focusInput(prevColIndex, lastInputIdx);
    }
  };

  const handleNextInput = () => {
    if (!columnsData || !columnsData[activeColIndex]) return;
    const currentInputs = columnsData[activeColIndex].inputs || [];
    if (activeInputIndex < currentInputs.length - 1) {
      focusInput(activeColIndex, activeInputIndex + 1);
    } else if (activeColIndex < columnsData.length - 1) {
      focusInput(activeColIndex + 1, 0);
    }
  };

  const cardStyle = {
    width: "48%",
    height: 248,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e1e4e8",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 10,
  };

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={[
          {
            flex: 1,
            backgroundColor: "#fff",
            paddingTop: 50,
            paddingHorizontal: 20,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          },
          animatedStyle,
        ]}
      >
        <Text style={{ fontSize: 18, marginBottom: 10 }}>Thêm lịch sử</Text>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: "#f8f9fa",
            padding: 10,
            paddingTop: 20,
            borderRadius: 8,
          }}
          contentContainerStyle={{ paddingBottom: 260 }}
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {columnsData && columnsData.length > 0 ? (
              columnsData.map((item, colIdx) => (
                <View key={item.id || colIdx} style={cardStyle}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      color: "#333",
                      marginBottom: 8,
                      textAlign: "center",
                    }}
                  >
                    Cụm #{colIdx + 1}
                  </Text>

                  {item.inputs &&
                    item.inputs.map((inputItem, inputIdx) => {
                      const key = `${colIdx}-${inputIdx}`;
                      return (
                        <TextInput
                          key={inputIdx}
                          ref={(el) => (inputRefs.current[key] = el)}
                          style={{
                            height: 28,
                            borderWidth: 0,
                            borderColor: "transparent",
                            borderRadius: 6,
                            paddingBottom: 0,
                            paddingTop: 0,
                            paddingLeft: 10,
                            textAlignVertical: "center",
                            marginBottom: 4,
                            fontSize: 16,
                            backgroundColor:
                              inputItem.worker_color === DEFAULT_WORKER_COLOR
                                ? "#fff"
                                : inputItem.worker_color || "#fff",
                            color: "#333333",
                            fontWeight: "600",
                          }}
                          placeholder={`Ô ${inputIdx + 1}`}
                          placeholderTextColor="#aaa"
                          keyboardType="numeric"
                          value={inputItem.weight || ""}
                          showSoftInputOnFocus={false}
                          onFocus={() => {
                            setActiveColIndex(colIdx);
                            setActiveInputIndex(inputIdx);
                            showKeyboard(); // Gọi hàm hiển thị bàn phím mượt mà
                            if (inputItem.worker_id) {
                              const foundWorker = colorArray.find(
                                (w) => w.id === inputItem.worker_id,
                              );
                              if (foundWorker) {
                                setCurrentWorker(foundWorker);
                              }
                            }
                          }}
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
                      {item.result || "0"}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={{ textAlign: "center", width: "100%", padding: 20 }}>
                Đang tải dữ liệu cột...
              </Text>
            )}

            {/* Ô TỔNG KẾT CHUNG */}
            <View style={[cardStyle, { justifyContent: "space-between" }]}>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    color: "#333",
                    marginBottom: 8,
                    textAlign: "center",
                  }}
                >
                  Tổng kết chung
                </Text>
              </View>

              <View>
                <View
                  style={{
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
                      fontSize: 13,
                      color: "#137333",
                      fontWeight: "600",
                    }}
                  >
                    Tổng:
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "#137333",
                    }}
                  >
                    {totalSummary || "0"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </Animated.View>

      {/* BÀN PHÍM CUSTOM DÙNG REANIMATED (MƯỢT VÀ KHÔNG CHẶN CHẠM) */}
      {isKeyboardVisible && (
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
          <CustomKeypadAdvanced
            onKeyPress={handleKeyPress}
            onDelete={handleDelete}
            onPrevInput={handlePrevInput}
            onNextInput={handleNextInput}
            onHideKeyboard={hideKeyboard}
            currentWorkerId={currentWorker?.id}
          />
        </Animated.View>
      )}
    </View>
  );
}
