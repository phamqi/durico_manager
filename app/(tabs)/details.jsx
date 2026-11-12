import { CustomKeypadAdvanced } from "@/components";
import { useDuricoAlert, useGlobalState } from "@/context";
import { useLocalSearchParams, usePathname } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Keyboard, ScrollView, Text, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { InputItemCard } from "../../components";
import { useAnchoredModalReanimated } from "../../hooks/useAnchoreModal";
import { useAddScreenEnterAnimation } from "../../hooks/useAnchoreTab";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const {
    getTransactionsDetails,
    colorArray,
    currentWorker,
    setCurrentWorker,
    totalSummary,
  } = useGlobalState();

  const alert = useDuricoAlert();
  const typeModal = useAnchoredModalReanimated();
  const animatedStyle = useAddScreenEnterAnimation();

  const [columnsData, setColumnsData] = useState([]);
  const [transactionType, setTransactionType] = useState(0);

  const [activeColIndex, setActiveColIndex] = useState(0);
  const [activeInputIndex, setActiveInputIndex] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Shared value cho animation bàn phím
  const translateY = useSharedValue(300);

  const showKeyboard = () => {
    setIsKeyboardVisible(true);
    translateY.value = withTiming(0, { duration: 200 });
  };

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

  // Fetch dữ liệu chi tiết theo id của transaction
  useEffect(() => {
    async function fetchDetails() {
      if (id) {
        const numericId = Number(id);
        const rows = await getTransactionsDetails(numericId);
        const validRows = Array.isArray(rows) ? rows : [];

        if (
          validRows.length > 0 &&
          validRows[0].transaction_types !== undefined
        ) {
          setTransactionType(validRows[0].transaction_types);
        }

        // 1. Nhóm dữ liệu thô từ database theo column_index
        const rawGrouped = validRows.reduce((acc, curr) => {
          if (!acc[curr.column_index]) {
            acc[curr.column_index] = [];
          }
          acc[curr.column_index].push(curr);
          return acc;
        }, {});

        // 2. Tái tạo danh sách cột với đủ 5 ô TextInput cho mỗi cụm
        const formattedColumns = Object.keys(rawGrouped).map((colIndex) => {
          const colRows = rawGrouped[colIndex];

          const inputs = Array.from({ length: 5 }, (_, inputIdx) => {
            const rowIndex = inputIdx + 1;
            const matchedRow = colRows.find((r) => r.row_index === rowIndex);

            if (matchedRow) {
              return {
                id: matchedRow.id,
                weight:
                  matchedRow.weight !== null && matchedRow.weight !== undefined
                    ? String(matchedRow.weight)
                    : "",
                row_index: rowIndex,
                worker_id: matchedRow.worker_id,
                worker_name: matchedRow.worker_name,
                worker_color: matchedRow.worker_color,
              };
            }

            return {
              id: null,
              weight: "",
              row_index: rowIndex,
              worker_id: null,
              worker_name: null,
              worker_color: null,
            };
          });

          const resultSum = inputs.reduce(
            (sum, item) => sum + (parseFloat(item.weight) || 0),
            0,
          );

          return {
            id: Number(colIndex),
            inputs,
            result: String(resultSum),
          };
        });

        setColumnsData(formattedColumns);
      }
    }
    fetchDetails();
  }, [id]);

  const inputRefs = useRef({});

  const focusInput = (colIdx, inputIdx) => {
    setActiveColIndex(colIdx);
    setActiveInputIndex(inputIdx);
    const key = `${colIdx}-${inputIdx}`;
    if (inputRefs.current[key]) {
      inputRefs.current[key].focus();
    }
  };

  const hideKeyboard = () => {
    const key = `${activeColIndex}-${activeInputIndex}`;
    if (inputRefs.current[key]) {
      inputRefs.current[key].blur();
    }
    translateY.value = withTiming(300, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(setIsKeyboardVisible)(false);
      }
    });
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
      (acc, item) => acc + (Number(item.weight) || 0),
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
  const addColumn = () => {
    // Tìm ID lớn nhất hiện tại để tạo ID tiếp theo, nếu mảng trống thì bắt đầu từ 1
    const nextColId =
      columnsData.length > 0
        ? Math.max(...columnsData.map((c) => Number(c.id) || 0)) + 1
        : 1;

    // Tạo sẵn 5 ô input trống cho cụm mới
    const newInputs = Array.from({ length: 5 }, (_, inputIdx) => ({
      id: null,
      weight: "",
      row_index: inputIdx + 1,
      worker_id: null,
      worker_name: null,
      worker_color: null,
    }));

    const newColumn = {
      id: nextColId,
      inputs: newInputs,
      result: "0",
    };

    // Cập nhật state để thêm cột mới vào cuối danh sách
    setColumnsData([...columnsData, newColumn]);
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
        <Text style={{ fontSize: 18, marginBottom: 10 }}>Chi tiết lịch sử</Text>
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
                      const isActive =
                        isKeyboardVisible &&
                        activeColIndex === colIdx &&
                        activeInputIndex === inputIdx;
                      return (
                        <InputItemCard
                          key={key}
                          colIdx={colIdx}
                          inputIdx={inputIdx}
                          inputItem={inputItem}
                          isActive={isActive}
                          inputRefs={inputRefs}
                          onFocusInput={(cIdx, iIdx, itemData) => {
                            Keyboard.dismiss();
                            setActiveColIndex(cIdx);
                            setActiveInputIndex(iIdx);
                            showKeyboard();
                            if (itemData.worker_id) {
                              const foundWorker = colorArray.find(
                                (w) => w.id === itemData.worker_id,
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
                Đang tải dữ liệu chi tiết...
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

      {/* BÀN PHÍM CUSTOM */}
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
            isAdColumn={addColumn}
          />
        </Animated.View>
      )}
    </View>
  );
}
