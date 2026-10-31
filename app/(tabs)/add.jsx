import { usePathname } from "expo-router";
import { useEffect } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Portal } from "react-native-paper";
import Animated from "react-native-reanimated";
import { useGlobalState } from "../../context";
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
    getTransactionsData,
    totalSummary,
    selectedType,
    setSelectedType,
  } = useGlobalState();

  const typeModal = useAnchoredModalReanimated();

  const transactionTypes = [
    { label: "Thu nhập", value: 0 },
    { label: "Ca phe", value: 1 },
    { label: "Sau rieng", value: 2 },
  ];

  const pathname = usePathname();

  useEffect(() => {
    if (typeModal?.visible) {
      typeModal.close();
    }
  }, [pathname]);
  const animatedStyle = useAddScreenEnterAnimation();

  const handleInputChange = (text, colIndex, inputIndex) => {
    const updatedData = [...columnsData];
    updatedData[colIndex].inputs[inputIndex] = {
      ...updatedData[colIndex].inputs[inputIndex],
      weight: text,
      worker_id: currentWorker ? currentWorker.id : null,
      worker_name: currentWorker ? currentWorker.name : null,
      worker_color: currentWorker ? currentWorker.color : null,
    };

    const sum = updatedData[colIndex].inputs.reduce(
      (acc, item) => acc + (parseFloat(item.weight) || 0),
      0,
    );
    updatedData[colIndex].result = sum.toString();

    setColumnsData(updatedData);
  };

  const currentSelectedLabel =
    transactionTypes.find((t) => t.value === selectedType)?.label ||
    "Chọn loại";

  // Style đồng bộ kích thước chuẩn 48% cho mọi ô
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
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {columnsData?.map((item, index) => (
              <View key={item.id} style={cardStyle}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    color: "#333",
                    marginBottom: 8,
                    textAlign: "center",
                  }}
                >
                  Cụm #{index + 1}
                </Text>

                {item.inputs.map((inputItem, inputIdx) => (
                  <TextInput
                    key={inputIdx}
                    style={{
                      height: 28,
                      borderWidth: 0,
                      borderRadius: 6,
                      paddingBottom: 0,
                      paddingTop: 0,
                      paddingLeft: 10,
                      textAlignVertical: "center",
                      marginBottom: 4,
                      fontSize: 16,
                      backgroundColor: inputItem.worker_color || "#fff",
                      color: "#333333",
                      fontWeight: "600",
                    }}
                    placeholder={`Ô ${inputIdx + 1}`}
                    placeholderTextColor="#aaa"
                    keyboardType="numeric"
                    value={inputItem.weight}
                    onChangeText={(text) =>
                      handleInputChange(text, index, inputIdx)
                    }
                    onFocus={() => {
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
                ))}

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
                    {item.result}
                  </Text>
                </View>
              </View>
            ))}

            {/* ================= Ô TỔNG KẾT CHUNG ================= */}
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

                {/* Nút chọn loại giao dịch */}
                <View style={{ marginBottom: 8 }}>
                  <View ref={typeModal.anchorRef} collapsable={false}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#f8f9fa",
                        padding: 8,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: "#007AFF",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                      onPress={() => typeModal.open()}
                    >
                      <Text
                        style={{
                          color: "#333",
                          fontWeight: "bold",
                          fontSize: 13,
                        }}
                      >
                        {currentSelectedLabel}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View>
                {/* Nút thêm tổ hợp cột */}
                <TouchableOpacity
                  style={{
                    backgroundColor: "#007AFF",
                    padding: 10,
                    borderRadius: 6,
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                  onPress={addColumn}
                >
                  <Text
                    style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}
                  >
                    + Thêm cột
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#007AFF",
                    padding: 10,
                    borderRadius: 6,
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                  onPress={getTransactionsData}
                >
                  <Text
                    style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}
                  >
                    Xem
                  </Text>
                </TouchableOpacity>

                {/* Tổng kết */}
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
                      fontSize: 14,
                      fontWeight: "bold",
                      color: "#137333",
                    }}
                  >
                    {totalSummary}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </Animated.View>

      {/* ================= MODAL CHỌN LOẠI GIAO DỊCH ================= */}
      {typeModal.visible && (
        <Portal>
          <Animated.View
            style={[
              {
                position: "absolute",
                width: typeModal.MAX_RADIUS * 2,
                height: typeModal.MAX_RADIUS * 2,
                borderRadius: typeModal.MAX_RADIUS,
                backgroundColor: "#00000022",
                left: typeModal.SCREEN_WIDTH / 2 - typeModal.MAX_RADIUS,
                top: typeModal.SCREEN_HEIGHT / 2 - typeModal.MAX_RADIUS,
              },
              typeModal.backdropStyle,
            ]}
          >
            <Pressable
              onPress={() => typeModal.close()}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                backgroundColor: "#00000022",
              }}
            />
          </Animated.View>

          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Animated.View
              style={[
                {
                  width: 260,
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  padding: 16,
                  gap: 8,
                },
                typeModal.animatedStyle,
              ]}
            >
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 16,
                  textAlign: "center",
                  marginBottom: 4,
                }}
              >
                Chọn loại giao dịch
              </Text>

              {transactionTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    backgroundColor:
                      selectedType === type.value ? "#e6f4ea" : "transparent",
                  }}
                  onPress={() => {
                    setSelectedType(type.value);
                    typeModal.close();
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      color: selectedType === type.value ? "#137333" : "#333",
                      fontWeight:
                        selectedType === type.value ? "bold" : "normal",
                    }}
                  >
                    {type.label} + {type.value}
                  </Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          </View>
        </Portal>
      )}
    </View>
  );
}
