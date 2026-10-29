import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { useGlobalState } from "../../context";
import { useAddScreenEnterAnimation } from "../../hooks/useAnchoreTab";

export default function AddScreen() {
  const {
    columnsData,
    setColumnsData,
    addColumn,
    colorArray,
    currentWorker,
    setCurrentWorker,
  } = useGlobalState();

  const [itemHeight, setItemHeight] = useState(null);

  useEffect(() => {
    console.log("colorArray in add.jsx", colorArray);
  }, []);

  const animatedStyle = useAddScreenEnterAnimation();

  const handleInputChange = (text, colIndex, inputIndex) => {
    const updatedData = [...columnsData];
    updatedData[colIndex].inputs[inputIndex] = {
      ...updatedData[colIndex].inputs[inputIndex],
      value: text,
      workerId: currentWorker ? currentWorker.id : null,
      color: currentWorker ? currentWorker.color : null,
    };

    const sum = updatedData[colIndex].inputs.reduce(
      (acc, item) => acc + (parseFloat(item.value) || 0),
      0,
    );
    updatedData[colIndex].result = sum.toString();

    setColumnsData(updatedData);
  };

  const totalSummary = columnsData.reduce(
    (acc, col) => acc + (parseFloat(col.result) || 0),
    0,
  );

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
          <TouchableOpacity
            style={{
              backgroundColor: "#007AFF",
              padding: 12,
              borderRadius: 8,
              alignItems: "center",
              marginBottom: 15,
            }}
            onPress={addColumn}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
              + Thêm tổ hợp cột
            </Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {columnsData.map((item, index) => (
              <View
                key={item.id}
                onLayout={(event) => {
                  if (index === 0) {
                    const { height } = event.nativeEvent.layout;
                    setItemHeight(height);
                  }
                }}
                style={{
                  width: "48%",
                  flexBasis: "48%",
                  maxWidth: "48%",
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
                  Cụm #{index + 1}
                </Text>

                {item.inputs.map((inputItem, inputIdx) => (
                  <TextInput
                    key={inputIdx}
                    style={{
                      height: 28,
                      borderWidth: 0,
                      borderColor: "#d0d7de",
                      borderRadius: 6,
                      paddingBottom: 0,
                      paddingTop: 0,
                      paddingLeft: 10,
                      textAlignVertical: "center",
                      marginBottom: 4,
                      fontSize: 16,
                      backgroundColor: inputItem.color || "#fff",
                      color: "#333333",
                      fontWeight: "600",
                    }}
                    placeholder={`Ô ${inputIdx + 1}`}
                    placeholderTextColor="#aaa"
                    keyboardType="numeric"
                    value={inputItem.value}
                    onChangeText={(text) =>
                      handleInputChange(text, index, inputIdx)
                    }
                    onFocus={() => {
                      if (inputItem.workerId) {
                        const foundWorker = colorArray.find(
                          (w) => w.id === inputItem.workerId,
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

            <View
              style={{
                width: "48%",
                flexBasis: "48%",
                maxWidth: "48%",
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
                justifyContent: "space-between",
                height: itemHeight ? itemHeight : undefined, // Gán chiều cao tự động
              }}
            >
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
              {/* <TouchableOpacity
                style={{
                  backgroundColor: "#007AFF",
                  padding: 12,
                  borderRadius: 8,
                  alignItems: "center",
                  marginBottom: 15,
                }}
                onPress={addColumn}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                >
                  + Thêm tổ hợp cột
                </Text>
              </TouchableOpacity> */}
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
                  style={{ fontSize: 14, color: "#137333", fontWeight: "600" }}
                >
                  Tổng:
                </Text>
                <Text
                  style={{ fontSize: 16, fontWeight: "bold", color: "#137333" }}
                >
                  {totalSummary}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}
